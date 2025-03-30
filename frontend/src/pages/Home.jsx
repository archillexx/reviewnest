import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import PublicReviewList from '../components/PublicReviewList';

const Home = () => {
  
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
    <div className=" justify-center container mx-auto p-6">
      <h1 className="text-center text-3xl font-bold mb-4">Product Reviews</h1>
      
      <PublicReviewList reviews={reviews} setReviews={setReviews} />
    </div>
  );
};

export default Home;
