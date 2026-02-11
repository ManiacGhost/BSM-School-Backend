const GalleryImage = require('../models/GalleryImage');
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
          // Persist to database using model
          const imageData = await GalleryImage.create(
            title,
            description,
            result.public_id,
            result.secure_url
          );

          return res.status(201).json({
            message: 'Image uploaded successfully',
            data: imageData,
          });
        } catch (dbError) {
          // Rollback: Delete from Cloudinary if DB insert fails
          await cloudinary.uploader.destroy(result.public_id);
          console.error('Database error:', dbError);
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
    const images = await GalleryImage.getAll();

    return res.status(200).json({
      message: 'Images retrieved successfully',
      data: images,
      total: images.length,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Failed to retrieve images' });
  }
};

const getImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await GalleryImage.getById(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    return res.status(200).json({
      message: 'Image retrieved successfully',
      data: image,
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

    const image = await GalleryImage.update(id, title, description);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    return res.status(200).json({
      message: 'Image updated successfully',
      data: image,
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
    const cloudinaryPublicId = await GalleryImage.getCloudinaryPublicId(id);

    if (!cloudinaryPublicId) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(cloudinaryPublicId);

    // Delete from database using model
    const deletedId = await GalleryImage.delete(id);

    return res.status(200).json({
      message: 'Image deleted successfully',
      data: { id: deletedId },
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
