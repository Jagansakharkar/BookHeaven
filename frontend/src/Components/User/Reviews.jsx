import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export const Reviews = ({ bookid }) => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { userid, token } = useSelector(state => state.auth);

  const headers = {
    userid,
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    fetchReviews();
    fetchSummary();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/reviews/get-ratings/${bookid}`, { headers });
      const data = res.data.data || [];
      setReviews(data);

      const myReview = data.find(r => r.userid?._id === userid);
      setUserReview(myReview || null);
      setRating(myReview?.rating || 0);
      setComment(myReview?.comment || '');
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/reviews/rating-summary/${bookid}`, { headers });
      setSummary(res.data.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  const handleReviewSubmit = async () => {
    if (!rating || !comment.trim()) return;
    setLoading(true);

    try {
      await axios.post(
        `http://localhost:3000/api/reviews/rate-book/${bookid}`,
        { rating, comment },
        { headers }
      );
      setIsEditing(false);
      await fetchReviews();
      await fetchSummary();
      setComment('');
      setRating(0);
    } catch (err) {
      console.error("Submit error:", err);
    }

    setLoading(false);
  };

  const handleReviewUpdate = async () => {
    if (!userReview) return;
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/api/reviews/update-review/${userReview._id}`,
        { rating, comment },
        { headers }
      );
      setIsEditing(false);
      await fetchReviews();
      await fetchSummary();
    } catch (err) {
      console.error("Update error:", err);
    }
    setLoading(false);
  };

  const handleReviewDelete = async () => {
    if (!userReview) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/reviews/delete-review/${userReview._id}`,
        { headers }
      );
      setUserReview(null);
      setRating(0);
      setComment('');
      await fetchReviews();
      await fetchSummary();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="mt-10">
      {/* Summary */}
      {summary && (
        <div className="mb-5 bg-zinc-900 p-5 rounded-lg shadow text-white">
          <h3 className="text-xl font-bold mb-2">⭐ {summary.average.toFixed(1)} / 5</h3>
          <p className="text-sm mb-4 text-zinc-400">{summary.total} verified review{summary.total !== 1 && 's'}</p>
          {[5, 4, 3, 2, 1].map(star => (
            <div key={star} className="flex items-center mb-1 text-sm">
              <span className="w-8">{star}★</span>
              <div className="flex-1 bg-gray-700 h-2 mx-2 rounded">
                <div
                  className="bg-yellow-400 h-2 rounded"
                  style={{
                    width: summary.total ? `${(summary.breakdown[star] / summary.total) * 100}%` : '0%'
                  }}
                />
              </div>
              <span className="text-zinc-300">{summary.breakdown[star] || 0}</span>
            </div>
          ))}
        </div>
      )}

      {/* Review Form */}
      <div className="bg-zinc-900 p-5 rounded-lg shadow text-white mb-8">
        <h3 className="text-lg font-semibold mb-3">
          {userReview ? (isEditing ? 'Edit Your Review' : 'Your Review') : 'Write a Review'}
        </h3>

        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map(star => (
            <Star key={star} filled={star <= rating} onClick={() => setRating(star)} />
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
          className="w-full h-24 p-2 rounded bg-zinc-800 text-white resize-none mb-3 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          disabled={!isEditing && userReview}
        />

        {userReview ? (
          isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={handleReviewUpdate}
                disabled={loading}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
              <button onClick={() => setIsEditing(false)} className="text-zinc-400 underline">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={handleReviewDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          )
        ) : (
          <button
            onClick={handleReviewSubmit}
            disabled={loading || !rating || !comment.trim()}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded transition duration-200"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        )}
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-zinc-400 text-sm">No reviews yet.</p>
        ) : (
          reviews.map(r => (
            <div key={r._id} className="bg-zinc-800 p-4 rounded-lg text-white shadow">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={r.userid?.avatar || "https://via.placeholder.com/40"}
                  className="w-10 h-10 rounded-full border border-gray-700 object-cover"
                  alt="User Avatar"
                />
                <div>
                  <p className="font-medium text-sm">{r.userid?.fullname || "Anonymous"}</p>
                  <p className="text-yellow-400 text-sm">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-300">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Star sub-component
const Star = ({ filled, onClick }) => (
  <span
    className={`cursor-pointer text-2xl ${filled ? 'text-yellow-400' : 'text-gray-500'}`}
    onClick={onClick}
  >
    ★
  </span>
);
