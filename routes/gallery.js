const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
  uploadImage,
  getImages,
  getImageById,
  updateImage,
  deleteImage,
} = require('../controllers/galleryController');

// Upload image
router.post('/upload', upload.single('image'), uploadImage);

// Get all images
router.get('/', getImages);

// Get single image
router.get('/:id', getImageById);

// Update image
router.put('/:id', updateImage);

// Delete image
router.delete('/:id', deleteImage);

module.exports = router;
