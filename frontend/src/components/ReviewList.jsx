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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.map((review) => (
        <div key={review._id} className="bg-gray-100 p-4 rounded shadow">
          <h2 className="font-bold">{review.productName}</h2>
          <p className="italic">"{review.reviewContent}"</p>
          <p className="font-semibold">Rating: {review.rating} / 5</p>
          <p className="text-sm text-gray-500">By {review.userName} on {new Date(review.createdAt).toLocaleString()}</p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setEditingReview(review)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(review._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
