// routes/clientQueryRoutes.js
const express = require('express');
const router = express.Router();
const Query = require('../models/Query');
const { protect, clientOnly } = require('../middlewares/authmiddleware');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config();

const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// POST /api/client-query/new
router.post(
  '/new',
  protect,
  clientOnly,
  upload.array('attachments'),
  async (req, res) => {
    try {
      const {
        title,
        regulatoryArea,
        priority,
        deadline,
        context,
        questions,
      } = req.body;

      const attachments = [];

      if (Array.isArray(req.files) && req.files.length > 0) {
        for (const file of req.files) {
          const result = await streamUpload(file.buffer);
          attachments.push(result.secure_url);
        }
      }
      let parsedQuestions;
        try {
        parsedQuestions = typeof questions === 'string' ? JSON.parse(questions) : [];
        } catch (err) {
        parsedQuestions = [questions]; 
        }
       
        console.log('Parsed Questions:', parsedQuestions);
        console.log('Attachments:', attachments);


      const newQuery = await Query.create({
        title,
        regulatoryArea,
        priority,
        deadline,
        context,
        questions: parsedQuestions,
        attachments,
        client: req.user._id,
      });

      res.status(201).json({ message: 'Query submitted successfully', query: newQuery });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  }
);

// GET /api/client-query/my-queries
router.get('/my-queries', protect, clientOnly, async (req, res) => {
  try {
    const queries = await Query.find({ client: req.user._id }).sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch queries' });
  }
});

module.exports = router;
