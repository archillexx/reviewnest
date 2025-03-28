
const express = require('express');
const { getReviews, addReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getReviews).post(protect, addReview);
router.route('/:id').put(protect, updateReview).delete(protect, deleteReview);

module.exports = router;