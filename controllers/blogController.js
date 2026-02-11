const Blog = require('../models/Blog');

/**
 * Create a new blog post
 */
const createBlog = async (req, res) => {
  try {
    const { title, slug, categoryId, authorId, content } = req.body;

    // Validation
    if (!title || !slug || !categoryId || !authorId || !content) {
      return res.status(400).json({
        error: 'Title, slug, categoryId, authorId, and content are required',
      });
    }

    // Check if slug already exists
    const existingBlog = await Blog.getBySlug(slug);
    if (existingBlog) {
      return res.status(409).json({ error: 'Slug already exists' });
    }

    const blog = await Blog.create(req.body);

    return res.status(201).json({
      message: 'Blog created successfully',
      data: blog,
    });
  } catch (error) {
    console.error('Create blog error:', error);
    return res.status(500).json({ error: 'Failed to create blog' });
  }
};

/**
 * Get all blogs with optional filtering
 */
const getAllBlogs = async (req, res) => {
  try {
    const { status, visibility, categoryId, authorId, isPopular, isSticky, showOnHomepage, limit, offset } = req.query;

    const options = {};
    if (status) options.status = status;
    if (visibility) options.visibility = visibility;
    if (categoryId) options.categoryId = parseInt(categoryId, 10);
    if (authorId) options.authorId = parseInt(authorId, 10);
    if (isPopular === 'true') options.isPopular = true;
    if (isSticky === 'true') options.isSticky = true;
    if (showOnHomepage === 'true') options.showOnHomepage = true;
    if (limit) options.limit = parseInt(limit, 10);
    if (offset) options.offset = parseInt(offset, 10);

    const blogs = await Blog.getAll(options);
    const total = await Blog.getCount({
      status: status || 'PUBLISHED',
      visibility: visibility || 'PUBLIC',
    });

    return res.status(200).json({
      message: 'Blogs retrieved successfully',
      data: blogs,
      total,
    });
  } catch (error) {
    console.error('Get all blogs error:', error);
    return res.status(500).json({ error: 'Failed to retrieve blogs' });
  }
};

/**
 * Get a single blog by ID
 */
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.getById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    return res.status(200).json({
      message: 'Blog retrieved successfully',
      data: blog,
    });
  } catch (error) {
    console.error('Get blog error:', error);
    return res.status(500).json({ error: 'Failed to retrieve blog' });
  }
};

/**
 * Get a blog by slug
 */
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.getBySlug(slug);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    return res.status(200).json({
      message: 'Blog retrieved successfully',
      data: blog,
    });
  } catch (error) {
    console.error('Get blog by slug error:', error);
    return res.status(500).json({ error: 'Failed to retrieve blog' });
  }
};

/**
 * Update a blog post
 */
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if blog exists
    const blog = await Blog.getById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // If slug is being updated, check for duplicates
    if (req.body.slug && req.body.slug !== blog.slug) {
      const existingBlog = await Blog.getBySlug(req.body.slug);
      if (existingBlog) {
        return res.status(409).json({ error: 'Slug already exists' });
      }
    }

    const updatedBlog = await Blog.update(id, req.body);

    return res.status(200).json({
      message: 'Blog updated successfully',
      data: updatedBlog,
    });
  } catch (error) {
    console.error('Update blog error:', error);
    return res.status(500).json({ error: 'Failed to update blog' });
  }
};

/**
 * Delete a blog post
 */
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedId = await Blog.delete(id);
    if (!deletedId) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    return res.status(200).json({
      message: 'Blog deleted successfully',
      data: { id: deletedId },
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    return res.status(500).json({ error: 'Failed to delete blog' });
  }
};

/**
 * Mark blog as popular
 */
const markAsPopular = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.markAsPopular(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    return res.status(200).json({
      message: 'Blog marked as popular',
      data: blog,
    });
  } catch (error) {
    console.error('Mark as popular error:', error);
    return res.status(500).json({ error: 'Failed to mark blog as popular' });
  }
};

/**
 * Unmark blog as popular
 */
const unmarkAsPopular = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.unmarkAsPopular(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    return res.status(200).json({
      message: 'Blog unmarked as popular',
      data: blog,
    });
  } catch (error) {
    console.error('Unmark as popular error:', error);
    return res.status(500).json({ error: 'Failed to unmark blog as popular' });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  markAsPopular,
  unmarkAsPopular,
};
