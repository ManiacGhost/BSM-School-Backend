const pool = require('../config/database');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

const uploadImage = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Upload to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'bsm-school/gallery',
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
        }

        try {
          // Insert into database
          const query = `
            INSERT INTO gallery_images (title, description, cloudinary_public_id, image_url)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, description, cloudinary_public_id, image_url, created_at, updated_at
          `;

          const values = [
            title,
            description || null,
            result.public_id,
            result.secure_url,
          ];

          const dbResult = await pool.query(query, values);

          return res.status(201).json({
            message: 'Image uploaded successfully',
            data: dbResult.rows[0],
          });
        } catch (dbError) {
          // Rollback: Delete from Cloudinary if DB insert fails
          await cloudinary.uploader.destroy(result.public_id);
          return res.status(500).json({ error: 'Failed to save image metadata to database' });
        }
      }
    );

    stream.end(req.file.buffer);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getImages = async (req, res) => {
  try {
    const query = 'SELECT * FROM gallery_images ORDER BY created_at DESC';
    const result = await pool.query(query);

    return res.status(200).json({
      message: 'Images retrieved successfully',
      data: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Failed to retrieve images' });
  }
};

const getImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM gallery_images WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    return res.status(200).json({
      message: 'Image retrieved successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Failed to retrieve image' });
  }
};

const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

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

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    return res.status(200).json({
      message: 'Image updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({ error: 'Failed to update image' });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Get image details first
    const selectQuery = 'SELECT cloudinary_public_id FROM gallery_images WHERE id = $1';
    const selectResult = await pool.query(selectQuery, [id]);

    if (selectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const cloudinaryPublicId = selectResult.rows[0].cloudinary_public_id;

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(cloudinaryPublicId);

    // Delete from database
    const deleteQuery = 'DELETE FROM gallery_images WHERE id = $1 RETURNING id';
    const deleteResult = await pool.query(deleteQuery, [id]);

    return res.status(200).json({
      message: 'Image deleted successfully',
      data: { id: deleteResult.rows[0].id },
    });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Failed to delete image' });
  }
};

module.exports = {
  uploadImage,
  getImages,
  getImageById,
  updateImage,
  deleteImage,
};
