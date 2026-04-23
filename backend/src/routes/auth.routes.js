const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.put('/change-password', protect, authController.changePassword);
router.put('/update-profile', protect, authController.updateProfile);

// LIS
router.put('/lis', protect, authController.saveLIS);
router.put('/lis/behavioral', protect, authController.updateBehavioral);

// Advisor ↔ Customer linking
router.get('/advisor/customers', protect, authController.getAdvisorCustomers);
router.put('/assign-customer', protect, authController.assignCustomer);

module.exports = router;
