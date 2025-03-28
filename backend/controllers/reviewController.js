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

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.user.id });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateReview = async (req, res) => {
    const { productName, reviewContent, rating } = req.body;
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        review.productName = productName || review.productName;
        review.reviewContent = reviewContent || review.reviewContent;
        review.rating = rating || review.rating;

        const updatedReview = await review.save();
        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        await review.remove();
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getReviews, addReview, updateReview, deleteReview };