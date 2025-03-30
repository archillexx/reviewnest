import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ReviewList = ({ reviews, setReviews, setEditingReview }) => {
  const { user } = useAuth();

  const handleDelete = async (reviewId) => {
    try {
      await axiosInstance.delete(`/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      alert('Failed to delete review.');
    }
  };

  return (
    <div>
      <div className="mb-8">
      </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review) => (
        <div key={review._id} className="bg-gray-300 p-4 rounded-xl shadow">
          <h2 className="font-bold">{review.productName}</h2>
          <p className="italic">"{review.reviewContent}"</p>
          <p className="font-semibold">Rating: {review.rating} / 5</p>
          <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleString()}</p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setEditingReview(review)}
              className="w-full bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition duration-300"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(review._id)}
              className="w-full bg-red-900 text-white py-3 rounded-xl hover:bg-red-400 transition duration-300"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default ReviewList;
