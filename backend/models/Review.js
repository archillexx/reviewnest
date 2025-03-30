const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productName: { type: String, required: true },
    reviewContent: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5, validate: {
        validator: function(value) {
          return /^(\d+(.\d{1})?)$/.test(value); // Allows up to 1 decimal place
        },
        message: props => `${props.value} is not a valid rating! Ratings should be between 1-5 with up to 1 decimal place.`
      } },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);