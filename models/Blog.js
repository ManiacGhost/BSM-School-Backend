const pool = require('../config/database');

class Blog {
  /**
   * Create a new blog post
   * @param {Object} blogData - Blog data
   * @returns {Promise<Object>} Created blog record
   */
  static async create(blogData) {
    const {
      title,
      slug,
      categoryId,
      authorId,
      content,
      keywords,
      thumbnailUrl,
      bannerUrl,
      shortDescription,
      readingTime,
      imageAltText,
      imageCaption,
      publishDate,
      visibility,
      seoTitle,
      seoDescription,
      focusKeyword,
      canonicalUrl,
      metaRobots,
      allowComments,
      showOnHomepage,
      isSticky,
      status = 'DRAFT',
    } = blogData;

    const query = `
      INSERT INTO public.blogs_bsm (
        title, slug, category_id, author_id, content, keywords, thumbnail_url, 
        banner_url, short_description, reading_time, image_alt_text, image_caption, 
        publish_date, visibility, seo_title, seo_description, focus_keyword, 
        canonical_url, meta_robots, allow_comments, show_on_homepage, is_sticky, status
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
      )
      RETURNING *
    `;

    const values = [
      title,
      slug,
      categoryId,
      authorId,
      content,
      keywords || null,
      thumbnailUrl || null,
      bannerUrl || null,
      shortDescription || null,
      readingTime || null,
      imageAltText || null,
      imageCaption || null,
      publishDate || null,
      visibility || 'PUBLIC',
      seoTitle || null,
      seoDescription || null,
      focusKeyword || null,
      canonicalUrl || null,
      metaRobots || 'INDEX',
      allowComments !== false,
      showOnHomepage !== false,
      isSticky || false,
      status,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get all blogs with optional filtering
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} Array of blog records
   */
  static async getAll(options = {}) {
    let query = `SELECT * FROM public.blogs_bsm WHERE 1=1`;
    const values = [];
    let paramIndex = 1;

    if (options.status) {
      query += ` AND status = $${paramIndex}`;
      values.push(options.status);
      paramIndex++;
    }

    if (options.visibility) {
      query += ` AND visibility = $${paramIndex}`;
      values.push(options.visibility);
      paramIndex++;
    }

    if (options.categoryId) {
      query += ` AND category_id = $${paramIndex}`;
      values.push(options.categoryId);
      paramIndex++;
    }

    if (options.authorId) {
      query += ` AND author_id = $${paramIndex}`;
      values.push(options.authorId);
      paramIndex++;
    }

    if (options.isPopular) {
      query += ` AND is_popular = $${paramIndex}`;
      values.push(true);
      paramIndex++;
    }

    if (options.isSticky) {
      query += ` AND is_sticky = $${paramIndex}`;
      values.push(true);
      paramIndex++;
    }

    if (options.showOnHomepage) {
      query += ` AND show_on_homepage = $${paramIndex}`;
      values.push(true);
      paramIndex++;
    }

    query += ` ORDER BY`;
    if (options.isSticky) {
      query += ` is_sticky DESC,`;
    }
    query += ` created_at DESC`;

    if (options.limit) {
      query += ` LIMIT $${paramIndex}`;
      values.push(options.limit);
      paramIndex++;

      if (options.offset) {
        query += ` OFFSET $${paramIndex}`;
        values.push(options.offset);
      }
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get a single blog by ID
   * @param {number} id - Blog ID
   * @returns {Promise<Object|null>} Blog record or null if not found
   */
  static async getById(id) {
    const query = 'SELECT * FROM public.blogs_bsm WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Get a blog by slug
   * @param {string} slug - Blog slug
   * @returns {Promise<Object|null>} Blog record or null if not found
   */
  static async getBySlug(slug) {
    const query = 'SELECT * FROM public.blogs_bsm WHERE slug = $1';
    const result = await pool.query(query, [slug]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Update a blog post
   * @param {number} id - Blog ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated blog record or null if not found
   */
  static async update(id, updateData) {
    const allowedFields = [
      'title',
      'slug',
      'category_id',
      'author_id',
      'content',
      'keywords',
      'thumbnail_url',
      'banner_url',
      'is_popular',
      'status',
      'short_description',
      'reading_time',
      'image_alt_text',
      'image_caption',
      'publish_date',
      'visibility',
      'seo_title',
      'seo_description',
      'focus_keyword',
      'canonical_url',
      'meta_robots',
      'allow_comments',
      'show_on_homepage',
      'is_sticky',
    ];

    const updates = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updateData).forEach((key) => {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (allowedFields.includes(dbKey)) {
        updates.push(`${dbKey} = $${paramIndex}`);
        values.push(updateData[key]);
        paramIndex++;
      }
    });

    if (updates.length === 0) {
      return null;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE public.blogs_bsm
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Delete a blog post by ID
   * @param {number} id - Blog ID
   * @returns {Promise<number|null>} Deleted blog ID or null if not found
   */
  static async delete(id) {
    const query = 'DELETE FROM public.blogs_bsm WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0].id : null;
  }

  /**
   * Mark blog as popular
   * @param {number} id - Blog ID
   * @returns {Promise<Object|null>} Updated blog record or null if not found
   */
  static async markAsPopular(id) {
    const query = `
      UPDATE public.blogs_bsm
      SET is_popular = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Unmark blog as popular
   * @param {number} id - Blog ID
   * @returns {Promise<Object|null>} Updated blog record or null if not found
   */
  static async unmarkAsPopular(id) {
    const query = `
      UPDATE public.blogs_bsm
      SET is_popular = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Get total blog count
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} Total count
   */
  static async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) as count FROM public.blogs_bsm WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (filters.status) {
      query += ` AND status = $${paramIndex}`;
      values.push(filters.status);
      paramIndex++;
    }

    if (filters.visibility) {
      query += ` AND visibility = $${paramIndex}`;
      values.push(filters.visibility);
      paramIndex++;
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }
}

module.exports = Blog;
