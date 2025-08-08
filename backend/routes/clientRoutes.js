// routes/clientQueryRoutes.js
const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');
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

router.get('/query/:id',protect,clientOnly,async(req,res)=>{
    try{
        const query=await Query.findById(req.params.id);
        if(!query){
            return res.status(404).json({message:"Query not found"});
        }
        res.json(query);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"Failed to fetch query"});
    }
})


// GET /api/client-query/:id/quotes -> getting quotes for a specific query
router.get('/:id/quotes', protect, clientOnly, async (req, res) => {
  try {
    const queryId = req.params.id;
    const query = await Query.findById(queryId);
    if (!query || query.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied or query not found' });
    }

    const quotes = await Quote.find({ query: queryId }).populate('provider', 'name email'); 

    res.json(quotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch quotes' });
  }
});

router.patch('/:quoteId/approve', protect, clientOnly, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.quoteId).populate('query');
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    const query = await Query.findById(quote.query._id);

    if (!query) {
      return res.status(404).json({ message: 'Associated query not found' });
    }
    if (query.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to approve this quote' });
    }
    const alreadyApproved = await Quote.findOne({ query: query._id, approved: true });
    if (alreadyApproved) {
      return res.status(400).json({ message: 'Another quote has already been approved for this query' });
    }
    quote.approved = true;
    await quote.save();

    query.status = 'Approved';
    await query.save();

    res.status(200).json({
      message: 'Quote approved successfully',
      approvedQuote: quote,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to approve quote', error: error.message });
  }
});


router.patch('/:quoteId/reject', protect, clientOnly, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.quoteId).populate('query');
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    const query = await Query.findById(quote.query._id);
    if (!query) {
      return res.status(404).json({ message: 'Associated query not found' });
    }

    if (query.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to reject this quote' });
    }

    if (quote.approved === true) {
      return res.status(400).json({ message: 'Cannot reject an already approved quote' });
    }

    quote.approved = false;
    await quote.save();

    res.status(200).json({
      message: 'Quote rejected successfully',
      rejectedQuote: quote,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reject quote', error: error.message });
  }
});



module.exports = router;
