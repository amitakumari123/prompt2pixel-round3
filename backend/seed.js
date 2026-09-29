const mongoose = require('mongoose');
require('dotenv').config();

const WasteReport = require('./models/WasteReport');
const { calculatePriority } = require('./services/priorityEngine');

const sampleReports = [
  {
    reportId: 'EP-1001',
    category: 'Overflowing Bin',
    description: 'Central fruit & vegetable market public bin overflowing onto pedestrian path. Rapid spill accumulating.',
    location: 'Main Market Road',
    status: 'Pending',
    reportedBy: 'Citizen Demo',
    assignedTeam: 'Subterranean Pod Unit 3 (High-Capacity)',
    estimatedKg: 65,
    diversionPotential: 80,
    createdAt: new Date(Date.now() - 45 * 60 * 1000) // 45 mins ago
  },
  {
    reportId: 'EP-1002',
    category: 'Waterway / Nature Pollution',
    description: 'Plastic packaging and chemical detergent bottles floating near duck pond wetland inlet in protected sanctuary.',
    location: 'Central Park Lake Zone',
    status: 'Assigned',
    reportedBy: 'EcoRanger Maya',
    assignedTeam: 'Eco-Hazard Neutralization Unit Alpha',
    estimatedKg: 90,
    diversionPotential: 65,
    createdAt: new Date(Date.now() - 110 * 60 * 1000) // ~2 hrs ago
  },
  {
    reportId: 'EP-1003',
    category: 'Plastic & Dry Recyclable',
    description: 'Large pile of discarded coffee cups, PET beverage bottles, and clean packaging cardboard near east escalators.',
    location: 'Metro Station East Entrance',
    status: 'In Progress',
    reportedBy: 'Transit Guard Marcus',
    assignedTeam: 'Electric Fleet Team Green',
    estimatedKg: 40,
    diversionPotential: 90,
    createdAt: new Date(Date.now() - 180 * 60 * 1000) // 3 hrs ago
  },
  {
    reportId: 'EP-1004',
    category: 'Organic / Food Waste',
    description: 'Commercial restaurant food scrap containers leaked onto pavement near storm drainage grate with strong odor.',
    location: 'Boulevard Sector 4',
    status: 'In Progress',
    reportedBy: 'Citizen Demo',
    assignedTeam: 'Subterranean Pod Unit 3 (High-Capacity)',
    estimatedKg: 55,
    diversionPotential: 75,
    createdAt: new Date(Date.now() - 240 * 60 * 1000) // 4 hrs ago
  },
  {
    reportId: 'EP-1005',
    category: 'Hazardous / E-Waste',
    description: 'Damaged lithium-ion battery scooter packs and cracked circuit boards dumped in municipal flowerbed.',
    location: 'Civic Tech Hub Plaza',
    status: 'Assigned',
    reportedBy: 'Tech Campus Security',
    assignedTeam: 'Eco-Hazard Neutralization Unit Alpha',
    estimatedKg: 30,
    diversionPotential: 35,
    createdAt: new Date(Date.now() - 85 * 60 * 1000) // ~1.5 hrs ago
  },
  {
    reportId: 'EP-1006',
    category: 'Plastic & Dry Recyclable',
    description: 'Riverside picnic litter collected and sorted into clean recyclable stream. Reclaimed for biophilic recycling.',
    location: 'Riverfront Green Corridor',
    status: 'Resolved',
    reportedBy: 'Riverkeeper Volunteer',
    assignedTeam: 'Autonomous Sidewalk Collector 04',
    estimatedKg: 45,
    diversionPotential: 92,
    createdAt: new Date(Date.now() - 600 * 60 * 1000), // 10 hrs ago
    resolvedAt: new Date(Date.now() - 120 * 60 * 1000)
  },
  {
    reportId: 'EP-1007',
    category: 'Construction & Debris',
    description: 'Drywall offcuts and crushed plaster blocks from curb maintenance successfully cleared and processed for aggregate.',
    location: 'Industrial Zone North Gate',
    status: 'Resolved',
    reportedBy: 'Civil Works Team',
    assignedTeam: 'Heavy Electric Compactor Alpha',
    estimatedKg: 120,
    diversionPotential: 70,
    createdAt: new Date(Date.now() - 900 * 60 * 1000), // 15 hrs ago
    resolvedAt: new Date(Date.now() - 300 * 60 * 1000)
  }
];

async function seedDatabase() {
  console.log('--- Seeding EcoPulse Waste Reports ---');
  
  await WasteReport.deleteMany({});
  console.log('Reset existing reports table.');

  for (const item of sampleReports) {
    const engine = calculatePriority({
      category: item.category,
      description: item.description,
      location: item.location
    });

    const report = new WasteReport({
      ...item,
      priority: engine.priority,
      priorityScore: engine.score,
      priorityFactors: engine.factors,
      assignedTeam: item.assignedTeam || engine.assignedTeam,
      estimatedKg: item.estimatedKg || engine.estimatedKg,
      diversionPotential: item.diversionPotential || engine.diversionPotential
    });

    await report.save();
    console.log(`✓ Seeded ${report.reportId} | ${report.category} | ${report.priority} | ${report.status}`);
  }

  console.log(`Successfully seeded ${sampleReports.length} EcoPulse waste reports.`);
}

if (require.main === module) {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecopulse';
  
  mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
    .then(async () => {
      console.log('Connected to MongoDB.');
      await seedDatabase();
      process.exit(0);
    })
    .catch(async () => {
      console.log('Seeding directly into EcoPulse Document Store...');
      await seedDatabase();
      process.exit(0);
    });
}

module.exports = { seedDatabase, sampleReports };
