const express = require('express');
const router = express.Router();
const lira = require('../controllers/lira.controller');
const { protect } = require('../middleware/auth');

// Event ingestion
router.post('/events',       protect, lira.ingestEvent);
router.post('/events/batch', protect, lira.ingestBatch);

// Score retrieval
router.get('/score',         protect, lira.getMyScore);
router.post('/recalculate',  protect, lira.forceRecalculate);

// Bonus signals
router.post('/bonus/share',    protect, lira.bonusShare);
router.post('/bonus/referral', protect, lira.bonusReferral);
router.post('/bonus/chat',     protect, lira.bonusChat);

// Advisor views
router.get('/advisor/clients',                      protect, lira.getAdvisorClients);
router.get('/advisor/clients/:clientId/snapshots',  protect, lira.getClientSnapshots);

module.exports = router;
