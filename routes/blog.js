const express = require('express');
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  markAsPopular,
  unmarkAsPopular,
} = require('../controllers/blogController');

// Create a new blog
router.post('/', createBlog);

// Get all blogs (with optional filtering)
router.get('/', getAllBlogs);

// Get blog by slug (must be before /:id)
router.get('/slug/:slug', getBlogBySlug);

// Get blog by ID
router.get('/:id', getBlogById);

// Update blog
router.put('/:id', updateBlog);

// Delete blog
router.delete('/:id', deleteBlog);

// Mark blog as popular
router.patch('/:id/mark-popular', markAsPopular);

// Unmark blog as popular
router.patch('/:id/unmark-popular', unmarkAsPopular);

module.exports = router;
