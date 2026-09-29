const express = require('express');
const router = express.Router();
const WasteReport = require('../models/WasteReport');

// GET /api/infrastructure (Unified Connected Infrastructure & Underground Systems)
router.get('/', async (req, res) => {
  try {
    const allReports = await WasteReport.find();
    const activeReports = allReports.filter(r => r.status !== 'Resolved');
    const resolvedReports = allReports.filter(r => r.status === 'Resolved');

    // Dynamic calculations tied to database state
    const activePodsCount = Math.max(4, Math.min(24, activeReports.length * 2 + 4));
    const siloOccupancyTonnes = Number((24 + activeReports.length * 3.2).toFixed(1));
    const totalDivertedKg = resolvedReports.reduce((acc, r) => acc + (r.estimatedKg || 45) * ((r.diversionPotential || 75) / 100), 0);

    const infrastructureData = {
      success: true,
      timestamp: new Date(),
      // 1. Underground Transportation
      undergroundTransportation: {
        systemName: 'Cloud City Subterranean Hyper-Loop & Transit Corridors',
        status: 'Optimal',
        lines: [
          {
            id: 'LINE-01',
            name: 'Subterranean Passenger Transit Pod Loop',
            type: 'High-Speed Maglev Electric Pods',
            speed: '120 km/h',
            headwaySec: 90,
            activePods: 32,
            capacityUtilization: '74.2%',
            surfaceCongestionRemovedPct: '78.5%',
            status: 'Operational'
          },
          {
            id: 'LINE-02',
            name: 'Automated Goods Storage & Freight Logistics AS/RS',
            type: 'Subterranean Robotic Cargo Pods',
            speed: '85 km/h',
            throughputParcelsPerHour: 14200,
            activePods: 48,
            surfaceTruckReductionPct: '91.2%',
            status: 'Operational'
          }
        ],
        totalSubterraneanTripsToday: 4892,
        zeroSurfaceTrafficScore: '96%'
      },

      // 2. Underground Waste Management
      undergroundWasteManagement: {
        systemName: 'Automated Pneumatic Waste Tubes & Subterranean Compactor Silos',
        status: 'Active Evacuation',
        conduits: [
          {
            name: 'Sub-Surface Pneumatic Vacuum Duct Grid',
            airSpeed: '75 km/h',
            vacuumPressureKPa: 78.4,
            activeConduits: 18,
            status: 'Nominal'
          },
          {
            name: 'Subterranean Silo Compactor Units',
            totalCapacityTonnes: 120,
            currentOccupancyTonnes: siloOccupancyTonnes,
            compressionRatio: '4:1 High-Density',
            status: 'Active Sorting'
          },
          {
            name: 'Autonomous Waste Pod Haulage Fleet',
            activeUnits: activePodsCount,
            route: 'Subterranean Transit Tube -> Regional Bio-Recycling Complex',
            surfaceGarbageTrucks: 0,
            status: 'Automated Routing'
          }
        ],
        surfacePollutionReduction: {
          odorEliminationPct: '100%',
          surfaceTruckNoiseReductionDb: '-34 dB',
          dieselTruckEmissionsPreventedKg: Math.round(180 + totalDivertedKg * 0.45)
        }
      },

      // 3. Eco-Friendly Smart City
      ecoFriendlyCity: {
        reclaimedSurfaceParksM2: 45000,
        airQualityIndexImprovementPct: '82.4%',
        circularWaterReusePct: '100%',
        sustainableResourceRating: 'A+ Circular Metropolis',
        greenZonesCount: 8,
        activeBioAquifers: 14
      },

      // 4. AI Integration (Deterministic Rule-Based Intelligence)
      aiIntegration: {
        engine: 'Deterministic Rule-Based Civic Optimization Engine',
        dispatchOptimization: {
          activeDispatches: activeReports.length,
          avgRouteCalculationMs: 4.2,
          leastCongestionRoutingTube: 'Tube Corridor 4B (Sub-Surface High-Speed)',
          energyEfficiencyGainPct: '31.8%'
        },
        hotspotPredictor: {
          monitoredZones: 24,
          detectedClusters: activeReports.length > 2 ? 1 : 0,
          recommendation: activeReports.length > 0 ? 'Dynamic Pod Routing Active for Pending Incidents' : 'Nominal Sweep Schedules'
        }
      },

      // 5. Connected Infrastructure Ecosystem
      connectedInfrastructure: {
        ecosystemHealth: '99.4%',
        cloudBackendSync: 'Real-time MongoDB Telemetry',
        layers: [
          {
            level: 1,
            name: 'Surface IoT Telemetry & Citizen Reporting',
            subsystems: 'Smart Optical Bins, Air Telemetry, Citizen Portal',
            status: 'Online',
            latency: '8 ms'
          },
          {
            level: 2,
            name: 'Cloudetech Cloud OS Brain',
            subsystems: 'Node.js Express + MongoDB Atlas + Rule Engine',
            status: 'Online',
            latency: '12 ms'
          },
          {
            level: 3,
            name: 'Underground Transport & Freight Hyper-Loop',
            subsystems: 'Passenger Pods, Cargo AS/RS, Underground Elevators',
            status: 'Online',
            latency: '15 ms'
          },
          {
            level: 4,
            name: 'Subterranean Pneumatic Waste & Compactor Silos',
            subsystems: 'Vacuum Conduits, Auto-Sorting Silos, Waste Pods',
            status: 'Online',
            latency: '10 ms'
          },
          {
            level: 5,
            name: 'Regenerative Nature & Green Biosphere Protection',
            subsystems: 'Bio-Aquifers, Runoff Filtration, Carbon Sink Parks',
            status: 'Online',
            latency: '6 ms'
          }
        ]
      }
    };

    return res.status(200).json(infrastructureData);
  } catch (error) {
    console.error('Error fetching infrastructure data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve infrastructure telemetry.',
      error: error.message
    });
  }
});

module.exports = router;
