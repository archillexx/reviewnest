const Review = require('../models/Review');

const addReview = async (req, res) => {
    const { productName, reviewContent, rating } = req.body;
    try {
        const review = await Review.create({ userId: req.user.id, productName, reviewContent, rating });
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getReviews, addReview, updateReview, deleteReview };