const pool = require('../config/database');

class GalleryImage {
  /**
   * Create a new gallery image record
   * @param {string} title - Image title
   * @param {string} description - Image description
   * @param {string} cloudinaryPublicId - Cloudinary public ID
   * @param {string} imageUrl - Image URL
   * @returns {Promise<Object>} Created image record
   */
  static async create(title, description, cloudinaryPublicId, imageUrl) {
    const query = `
      INSERT INTO gallery_images (title, description, cloudinary_public_id, image_url)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, description, cloudinary_public_id, image_url, created_at, updated_at
    `;

    const values = [title, description || null, cloudinaryPublicId, imageUrl];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get all gallery images ordered by creation date
   * @returns {Promise<Array>} Array of image records
   */
  static async getAll() {
    const query = 'SELECT * FROM gallery_images ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Get a single gallery image by ID
   * @param {number} id - Image ID
   * @returns {Promise<Object|null>} Image record or null if not found
   */
  static async getById(id) {
    const query = 'SELECT * FROM gallery_images WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Update gallery image metadata
   * @param {number} id - Image ID
   * @param {string} title - New title (optional)
   * @param {string} description - New description (optional)
   * @returns {Promise<Object|null>} Updated image record or null if not found
   */
  static async update(id, title, description) {
    const query = `
      UPDATE gallery_images
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, title, description, cloudinary_public_id, image_url, created_at, updated_at
    `;

    const values = [title || null, description || null, id];
    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Delete a gallery image by ID
   * @param {number} id - Image ID
   * @returns {Promise<number|null>} Deleted image ID or null if not found
   */
  static async delete(id) {
    const query = 'DELETE FROM gallery_images WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0].id : null;
  }

  /**
   * Get Cloudinary public ID for an image
   * @param {number} id - Image ID
   * @returns {Promise<string|null>} Cloudinary public ID or null if not found
   */
  static async getCloudinaryPublicId(id) {
    const query = 'SELECT cloudinary_public_id FROM gallery_images WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0].cloudinary_public_id : null;
  }
}

module.exports = GalleryImage;
