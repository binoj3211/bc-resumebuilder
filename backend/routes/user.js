const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, preferences } = req.body;

    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (preferences) updates.preferences = { ...req.user.preferences, ...preferences };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// Save resume data
router.post('/resumes', authenticateToken, async (req, res) => {
  try {
    const { name, data } = req.body;

    if (!name || !data) {
      return res.status(400).json({
        success: false,
        error: 'Resume name and data are required'
      });
    }

    const user = await User.findById(req.user._id);
    
    // Check if resume with same name exists
    const existingResumeIndex = user.resumes.findIndex(resume => resume.name === name);
    
    if (existingResumeIndex !== -1) {
      // Update existing resume
      user.resumes[existingResumeIndex].data = data;
      user.resumes[existingResumeIndex].updatedAt = new Date();
    } else {
      // Add new resume
      user.resumes.push({
        name,
        data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Resume saved successfully',
      resume: user.resumes[existingResumeIndex !== -1 ? existingResumeIndex : user.resumes.length - 1]
    });

  } catch (error) {
    console.error('Save resume error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save resume'
    });
  }
});

// Get all user resumes
router.get('/resumes', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      resumes: user.resumes.map(resume => ({
        id: resume._id,
        name: resume.name,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt
      }))
    });

  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resumes'
    });
  }
});

// Get specific resume
router.get('/resumes/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const resume = user.resumes.id(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    res.json({
      success: true,
      resume
    });

  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resume'
    });
  }
});

// Delete resume
router.delete('/resumes/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const resume = user.resumes.id(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    user.resumes.pull(req.params.id);
    await user.save();

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });

  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete resume'
    });
  }
});

module.exports = router;
