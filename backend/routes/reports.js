const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  getCollectionQueue,
  getAlerts
} = require('../controllers/reportController');

// Helper routes if accessed under /api/reports/*
router.get('/collection-queue', getCollectionQueue);
router.get('/alerts', getAlerts);

// Standard REST endpoints
router.post('/', createReport);
router.get('/', getReports);
router.get('/:id', getReportById);
router.patch('/:id/status', updateReportStatus);

module.exports = router;
