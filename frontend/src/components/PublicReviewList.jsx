

const PublicReviewList = ({ reviews }) => {
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.map((review) => (
        <div key={review._id} className="bg-gray-100 p-4 rounded shadow">
          <h2 className="font-bold">{review.productName}</h2>
          <p className="italic">"{review.reviewContent}"</p>
          <p className="font-semibold">Rating: {review.rating} / 5</p>
          <p className="text-sm text-gray-500">
            By {review.userId?.name || 'Anonymous'} on {new Date(review.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PublicReviewList;
