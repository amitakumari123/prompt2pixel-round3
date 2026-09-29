const WasteReport = require('../models/WasteReport');
const { calculatePriority } = require('../services/priorityEngine');

// Generate unique EP-XXXX report ID
async function generateReportId() {
  let isUnique = false;
  let reportId = '';
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    reportId = `EP-${randomNum}`;
    const existing = await WasteReport.findOne({ reportId });
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }
  return reportId;
}

// POST /api/reports
exports.createReport = async (req, res) => {
  try {
    const { category, description, location, reportedBy, priority: manualPriority, urgencyFlag } = req.body;

    if (!category || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Category, description, and location are required fields.'
      });
    }

    // Run transparent rule-based Priority Engine
    const engineResult = calculatePriority({
      category,
      description,
      location,
      urgencyFlag: Boolean(urgencyFlag)
    });

    const reportId = await generateReportId();

    const newReport = new WasteReport({
      reportId,
      category,
      description,
      location,
      priority: manualPriority || engineResult.priority,
      priorityScore: engineResult.score,
      priorityFactors: engineResult.factors,
      assignedTeam: engineResult.assignedTeam,
      estimatedKg: engineResult.estimatedKg,
      diversionPotential: engineResult.diversionPotential,
      status: 'Pending',
      reportedBy: reportedBy || 'Citizen Demo'
    });

    const savedReport = await newReport.save();

    return res.status(201).json({
      success: true,
      message: 'Waste report registered successfully in EcoPulse database.',
      data: savedReport
    });
  } catch (error) {
    console.error('Error creating waste report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create waste report.',
      error: error.message
    });
  }
};

// GET /api/reports
exports.getReports = async (req, res) => {
  try {
    const { status, category, priority, reportedBy, search } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (priority && priority !== 'All') {
      filter.priority = priority;
    }
    if (reportedBy) {
      filter.reportedBy = new RegExp(reportedBy, 'i');
    }
    if (search) {
      filter.$or = [
        { reportId: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') }
      ];
    }

    const reports = await WasteReport.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch reports.',
      error: error.message
    });
  }
};

// GET /api/reports/:id
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    let report = null;

    if (id.startsWith('EP-')) {
      report = await WasteReport.findOne({ reportId: id });
    } else {
      report = await WasteReport.findById(id).catch(() => null) || await WasteReport.findOne({ reportId: id });
    }

    if (!report) {
      return res.status(404).json({
        success: false,
        message: `Report with ID '${id}' not found.`
      });
    }

    return res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error getting report by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve report.',
      error: error.message
    });
  }
};

// PATCH /api/reports/:id/status
exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Assigned', 'In Progress', 'Resolved'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updateFields = {
      status,
      updatedAt: new Date()
    };

    if (status === 'Resolved') {
      updateFields.resolvedAt = new Date();
    } else {
      updateFields.resolvedAt = null;
    }

    let report = null;
    if (id.startsWith('EP-')) {
      report = await WasteReport.findOneAndUpdate({ reportId: id }, updateFields, { new: true });
    } else {
      report = await WasteReport.findByIdAndUpdate(id, updateFields, { new: true }) ||
               await WasteReport.findOneAndUpdate({ reportId: id }, updateFields, { new: true });
    }

    if (!report) {
      return res.status(404).json({
        success: false,
        message: `Report '${id}' not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Report status updated to '${status}'.`,
      data: report
    });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update report status.',
      error: error.message
    });
  }
};

// GET /api/collection-queue
exports.getCollectionQueue = async (req, res) => {
  try {
    // Unresolved reports
    const reports = await WasteReport.find({
      status: { $in: ['Pending', 'Assigned', 'In Progress'] }
    }).sort({ createdAt: 1 });

    const priorityWeights = {
      Critical: 4,
      High: 3,
      Medium: 2,
      Low: 1
    };

    // Sort by Priority weight descending, then by creation date ascending (FIFO within priority)
    const sortedQueue = reports.sort((a, b) => {
      const weightA = priorityWeights[a.priority] || 1;
      const weightB = priorityWeights[b.priority] || 1;
      if (weightB !== weightA) {
        return weightB - weightA;
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    const enrichedQueue = sortedQueue.map((rep, index) => {
      let etaMins = (index + 1) * 18;
      if (rep.priority === 'Critical') etaMins = Math.min(15, etaMins);
      if (rep.priority === 'High') etaMins = Math.min(45, etaMins);

      let podType = 'Subterranean Vacuum Pod 01';
      if (rep.category.includes('Hazard')) podType = 'Hazard Containment Transport';
      else if (rep.category.includes('Debris')) podType = 'Heavy Electric Compactor Alpha';
      else if (rep.location.includes('Market')) podType = 'High-Capacity Pod Unit 3';

      return {
        ...rep.toJSON(),
        queuePosition: index + 1,
        etaMinutes: etaMins,
        recommendedVehicle: podType,
        dispatchUrgency: rep.priority === 'Critical' ? 'Immediate' : rep.priority === 'High' ? 'High Priority' : 'Standard'
      };
    });

    return res.status(200).json({
      success: true,
      count: enrichedQueue.length,
      data: enrichedQueue
    });
  } catch (error) {
    console.error('Error getting collection queue:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve smart collection queue.',
      error: error.message
    });
  }
};

// GET /api/alerts
exports.getAlerts = async (req, res) => {
  try {
    const activeReports = await WasteReport.find({
      status: { $in: ['Pending', 'Assigned', 'In Progress'] }
    });

    const alerts = [];

    // 1. Hotspot detection (location with >= 2 active reports)
    const locationCounts = {};
    activeReports.forEach(r => {
      const loc = r.location.trim();
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });

    Object.keys(locationCounts).forEach(loc => {
      if (locationCounts[loc] >= 2) {
        alerts.push({
          id: `ALERT-HOTSPOT-${loc.replace(/\s+/g, '-').toUpperCase()}`,
          type: 'warning',
          category: 'Hotspot Cluster Detected',
          title: `Waste Accumulation Hotspot: ${loc}`,
          description: `${locationCounts[loc]} active incidents reported at ${loc}. High likelihood of bin capacity overflow and pedestrian disruption.`,
          location: loc,
          count: locationCounts[loc],
          action: 'Auto-dispatching Subterranean Pod Unit 3 and increasing local sweep frequency.',
          timestamp: new Date()
        });
      }
    });

    // 2. Critical & Chemical Hazards
    const criticals = activeReports.filter(r => r.priority === 'Critical');
    criticals.forEach(crit => {
      alerts.push({
        id: `ALERT-CRIT-${crit.reportId}`,
        type: 'danger',
        category: 'Critical Hazard Alert',
        title: `URGENT: ${crit.category} at ${crit.location}`,
        description: `Immediate civic safety risk flagged: "${crit.description}". Requires certified handling gear.`,
        location: crit.location,
        reportId: crit.reportId,
        action: 'Eco-Hazard Neutralization Unit Alpha alerted. Perimeter containment advised.',
        timestamp: crit.createdAt
      });
    });

    // 3. Nature & Waterway Protection Alerts
    const natureThreats = activeReports.filter(r => 
      r.category.includes('Waterway') || 
      r.category.includes('Nature') || 
      r.location.toLowerCase().includes('lake') || 
      r.location.toLowerCase().includes('park') || 
      r.location.toLowerCase().includes('river')
    );

    natureThreats.forEach(nt => {
      alerts.push({
        id: `ALERT-ECO-${nt.reportId}`,
        type: 'info',
        category: 'Nature Protection Notice',
        title: `Bio-Corridor Incident: ${nt.location}`,
        description: `Waste detected within green zone buffer: "${nt.description}". Water runoff bio-filtration sensors monitored.`,
        location: nt.location,
        reportId: nt.reportId,
        action: 'Eco-Protector drone scanning stormwater runoff channels.',
        timestamp: nt.createdAt
      });
    });

    // Fallback advisory if no active threats
    if (alerts.length === 0) {
      alerts.push({
        id: 'ALERT-ALL-CLEAR',
        type: 'success',
        category: 'All Zones Optimal',
        title: 'Municipal Grid & Nature Reserves Clear',
        description: 'All collection queues operating within nominal parameters. Zero critical biohazards detected across urban sectors.',
        location: 'City-wide',
        action: 'Standard routine monitoring ongoing.',
        timestamp: new Date()
      });
    }

    return res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error('Error getting alerts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve alerts.',
      error: error.message
    });
  }
};
