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

// GET /api/provider/queries → Get all latest queries for provider dashboard
router.get('/queries', protect, providerOnly, async (req, res) => {
  try {
    const { status, priority, search, limit = 20, page = 1 } = req.query;
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { context: { $regex: search, $options: 'i' } },
        { regulatoryArea: { $regex: search, $options: 'i' } }
      ];
    }
    

    const skip = (page - 1) * limit;
    

    const queries = await Query.find(filter)
      .populate('client', 'name email')
      .populate('approvedProvider', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    

    const totalQueries = await Query.countDocuments(filter);
    

    const transformedQueries = queries.map(query => ({
      id: query._id,
      title: query.title,
      description: query.context,
      detailedQuestions: query.questions?.join(' ') || '',
      status: query.status,
      priority: query.priority,
      clientName: query.client?.name || 'Unknown Client',
      clientEmail: query.client?.email,
      submittedDate: query.createdAt.toISOString().split('T')[0],
      lastUpdated: query.updatedAt ? query.updatedAt.toISOString().split('T')[0] : query.createdAt.toISOString().split('T')[0],
      deadline: query.deadline ? query.deadline.toISOString().split('T')[0] : null,
      regulatoryArea: query.regulatoryArea,
      attachments: query.attachments || [],
      approvedProvider: query.approvedProvider
    }));
    
    res.json({
      queries: transformedQueries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalQueries / limit),
        totalQueries,
        hasNextPage: page * limit < totalQueries,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching queries for provider:', error);
    res.status(500).json({ error: 'Server error while fetching queries' });
  }
});



router.get('/queries/:queryId', protect, providerOnly, async (req, res) => {
  try {
    const { queryId } = req.params;
    const query = await Query.findById(queryId)
      .populate('client', 'name email')
      .populate('approvedProvider', 'name email');
    
    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }
    

    const transformedQuery = {
      id: query._id,
      title: query.title,
      description: query.context,
      detailedQuestions: query.questions?.join(' ') || '',
      status: query.status,
      priority: query.priority,
      clientName: query.client?.name || 'Unknown Client',
      clientEmail: query.client?.email,
      submittedDate: query.createdAt.toISOString().split('T')[0],
      lastUpdated: query.updatedAt ? query.updatedAt.toISOString().split('T')[0] : query.createdAt.toISOString().split('T')[0],
      deadline: query.deadline ? query.deadline.toISOString().split('T')[0] : null,
      regulatoryArea: query.regulatoryArea,
      attachments: query.attachments || [],
      approvedProvider: query.approvedProvider
    };
    
    res.json(transformedQuery);
  } catch (error) {
    console.error('Error fetching query details:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid query ID format' });
    }
    res.status(500).json({ error: 'Server error while fetching query details' });
  }
});

router.post('/quotes/:queryId', protect, async (req, res) => {
  const { queryId } = req.params;
  const { breakdown } = req.body;

  try {
    // Check if query exists
    const query = await Query.findById(queryId);
    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }
    if (!breakdown || !Array.isArray(breakdown) || breakdown.length === 0) {
      return res.status(400).json({ error: 'Invalid breakdown data' });
    }
    const total = breakdown.reduce((sum, item) => sum + (item.total || 0), 0);

    // Create quote
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


router.get('/quotes', protect, async (req, res) => {
  try {
    console.log('=== FETCHING QUOTES DEBUG ===');
    console.log('Provider ID:', req.user._id);
    
    const quotes = await Quote.find({ provider: req.user._id })
      .populate('query', 'title status clientName')
      .populate('provider', 'name email')
      .sort({ submittedAt: -1 });

    console.log('Found quotes count:', quotes.length);
    console.log('Quotes:', JSON.stringify(quotes, null, 2));

    res.json({
      quotes,
      count: quotes.length
    });
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
}).populate('query').populate('provider');

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
        .populate('provider', 'name email')
        .sort({ submittedAt: -1 });
  
      res.status(200).json(deliverables);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch deliverables', error: error.message });
    }
  });
  

module.exports = router;
