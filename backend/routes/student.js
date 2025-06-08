// backend/routes/student.js
const express = require('express');
const router = express.Router();
const { verifyStudent, submitPreferences } = require('../controllers/studentController');

router.post('/verify', verifyStudent);
router.post('/preferences', submitPreferences);

module.exports = router;
