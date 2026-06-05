const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

// Protected routes
router.post('/add', auth, projectController.addProject);
router.get('/get', auth, projectController.getUserProjects);

// Public routes
router.get('/all', projectController.getAllProjects);
router.get('/user/:userId', projectController.getProjectsByUserId);

router.get('/:id', auth, projectController.getProjectById);
router.put('/:id', auth, projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;
