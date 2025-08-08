const express = require('express');
const Quote = require('../models/Quote');
const Query = require('../models/Query');
const Deliverable = require('../models/Deliverable');
const { protect, providerOnly } = require('../middlewares/authmiddleware');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const router = express.Router();

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

router.post('/quotes/:queryId', protect, async (req, res) => {
  const { queryId } = req.params;
  const { breakdown } = req.body;

  try {
    const query = await Query.findById(queryId);
    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }

    const total = breakdown.reduce((sum, item) => sum + item.total, 0);

    const quote = await Quote.create({
      query: queryId,
      provider: req.user._id,
      breakdown,
      total,
      status: 'Pending',
    });

    return res.status(201).json(quote);
  } catch (error) {
    console.error('Error submitting quote:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/provider/quotes → Get all quotes submitted by provider
router.get('/quotes', protect, async (req, res) => {
  try {
    const quotes = await Quote.find({ provider: req.user._id })
      .populate('query', 'title status clientName')
      .sort({ submittedAt: -1 });

    res.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/provider/quotes/:quoteId → Get quote details
router.get('/quotes/:quoteId', protect, async (req, res) => {
  const { quoteId } = req.params;

  try {
    const quote = await Quote.findOne({
      _id: quoteId,
      provider: req.user._id,
    }).populate('query');

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.json(quote);
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post(
    '/upload/:queryId',
    protect,
    providerOnly,
    upload.array('files'),
    async (req, res) => {
      try {
        const query = await Query.findById(req.params.queryId);
        if (!query) {
          return res.status(404).json({ message: 'Query not found' });
        }
        console.log("HEADERS RECEIVED:", req.headers);
  
        const fileUrls = [];
  
        if (req.files && req.files.length > 0) {
          for (const file of req.files) {
            const result = await streamUpload(file.buffer);
            fileUrls.push(result.secure_url);
          }
        }
  
        const deliverable = await Deliverable.create({
          query: query._id,
          provider: req.user._id,
          files: fileUrls,
          message: req.body.message || '',
        });
  
        query.status = 'Submitted';
        await query.save();
  
        res.status(201).json({
          message: 'Deliverables uploaded and query marked as completed',
          deliverable,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to upload deliverables', error: error.message });
      }
    }
  );

  router.get('/query/:queryId', protect, async (req, res) => {
    try {
      const deliverables = await Deliverable.find({ query: req.params.queryId })
        .populate('provider', 'name email') // Optional: to get provider details
        .sort({ submittedAt: -1 }); // Optional: latest first
  
      res.status(200).json(deliverables);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch deliverables', error: error.message });
    }
  });
  

module.exports = router;
