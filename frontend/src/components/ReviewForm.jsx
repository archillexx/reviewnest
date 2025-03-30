import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ReviewForm = ({ reviews, setReviews, editingReview, setEditingReview }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ reviewContent: '', rating: '', productName: '' });

  useEffect(() => {
    if (editingReview) {
      setFormData({
        reviewContent: editingReview.reviewContent,
        rating: editingReview.rating,
        productName: editingReview.productName,
      });
    } else {
      setFormData({ reviewContent: '', rating: '', productName: '' });
    }
  }, [editingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReview) {
        const response = await axiosInstance.put(`/api/reviews/${editingReview._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setReviews(reviews.map((review) => (review._id === response.data._id ? response.data : review)));
      } else {
        const response = await axiosInstance.post('/api/reviews', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setReviews([...reviews, response.data]);
      }
      setEditingReview(null);
      setFormData({ reviewContent: '', rating: '', productName: '' });
    } catch (error) {
      
      alert('Failed to save review.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingReview ? 'Edit Review' : 'Create Review'}</h1>
      <input
        type="text"
        placeholder="Product Name"
        value={formData.productName}
        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <textarea
        placeholder="Review Content"
        value={formData.reviewContent}
        onChange={(e) => setFormData({ ...formData, reviewContent: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Rating (1-5)"
        min="1"
        max="5"
        value={formData.rating}
        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingReview ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
