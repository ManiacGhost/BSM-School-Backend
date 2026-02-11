const pool = require('../config/database');

class ContactEnquiry {
  /**
   * Create a new contact enquiry record
   * @param {string} firstName - First name
   * @param {string} phoneNumber - Phone number (optional)
   * @param {string} email - Email address
   * @param {string} message - Enquiry message
   * @returns {Promise<Object>} Created enquiry record
   */
  static async create(firstName, phoneNumber, email, message) {
    const query = `
      INSERT INTO contact_enquiries (first_name, phone_number, email, message)
      VALUES ($1, $2, $3, $4)
      RETURNING id, first_name, phone_number, email, message, created_at, is_read
    `;

    const values = [firstName, phoneNumber || null, email, message];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get all contact enquiries ordered by creation date
   * @returns {Promise<Array>} Array of enquiry records
   */
  static async getAll() {
    const query = `
      SELECT * FROM contact_enquiries 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Get a single contact enquiry by ID
   * @param {number} id - Enquiry ID
   * @returns {Promise<Object|null>} Enquiry record or null if not found
   */
  static async getById(id) {
    const query = 'SELECT * FROM contact_enquiries WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Mark an enquiry as read
   * @param {number} id - Enquiry ID
   * @returns {Promise<Object|null>} Updated enquiry record or null if not found
   */
  static async markAsRead(id) {
    const query = `
      UPDATE contact_enquiries
      SET is_read = TRUE
      WHERE id = $1
      RETURNING id, first_name, phone_number, email, message, created_at, is_read
    `;

    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Delete a contact enquiry by ID
   * @param {number} id - Enquiry ID
   * @returns {Promise<number|null>} Deleted enquiry ID or null if not found
   */
  static async delete(id) {
    const query = 'DELETE FROM contact_enquiries WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0].id : null;
  }

  /**
   * Get all unread enquiries
   * @returns {Promise<Array>} Array of unread enquiry records
   */
  static async getUnread() {
    const query = `
      SELECT * FROM contact_enquiries 
      WHERE is_read = FALSE
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Get count of all enquiries
   * @returns {Promise<number>} Total count of enquiries
   */
  static async getCount() {
    const query = 'SELECT COUNT(*) as count FROM contact_enquiries';
    const result = await pool.query(query);
    return parseInt(result.rows[0].count, 10);
  }
}

module.exports = ContactEnquiry;
