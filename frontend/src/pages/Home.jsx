import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import PublicReviewList from '../components/PublicReviewList';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get('/api/reviews/all');
        setReviews(response.data);
      } catch (error) {
        console.error('Failed to fetch reviews.');
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Reviews</h1>
      {!user && (
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Login to Post a Review
        </button>
      )}
      <PublicReviewList reviews={reviews} setReviews={setReviews} />
    </div>
  );
};

export default Home;
