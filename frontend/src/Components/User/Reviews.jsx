// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';

// export const Reviews = ({ bookId }) => {
//   const [reviews, setReviews] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [userReview, setUserReview] = useState(null);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchReviews();
//     fetchSummary();
//   }, []);

//   const fetchReviews = async () => {
//     try {
//       const res = await axios.get(`http://localhost:3000/api/reviews/${bookId}`, { headers });
//       const data = res.data.data || [];
//       setReviews(data);

//       const myReview = data.find(r => r.userid?._id === userid);
//       setUserReview(myReview || null);
//       setRating(myReview?.rating || 0);
//       setComment(myReview?.comment || '');
//     } catch (err) {
//       console.error("Error fetching reviews:", err);
//     }
//   };

//   const fetchSummary = async () => {
//     try {
//       const res = await axios.get(`http://localhost:3000/api/reviews/summary/${bookId}`, { headers });
//       setSummary(res.data.data);
//     } catch (err) {
//       console.error("Error fetching summary:", err);
//     }
//   };

//   const handleReviewSubmit = async () => {
//     if (!rating || !comment.trim()) return;
//     setLoading(true);

//     try {
//       await axios.post(
//         `http://localhost:3000/api/reviews/rate-book/${bookId}`,
//         { rating, comment },
//         { headers }
//       );
//       setIsEditing(false);
//       await fetchReviews();
//       await fetchSummary();
//       setComment('');
//       setRating(0);
//     } catch (err) {
//       console.error("Submit error:", err);
//     }

//     setLoading(false);
//   };

//   const handleReviewUpdate = async () => {
//     if (!userReview) return;
//     setLoading(true);
//     try {
//       await axios.put(
//         `http://localhost:3000/api/reviews/update-review/${userReview._id}`,
//         { rating, comment },
//         { headers }
//       );
//       setIsEditing(false);
//       await fetchReviews();
//       await fetchSummary();
//     } catch (err) {
//       console.error("Update error:", err);
//     }
//     setLoading(false);
//   };

//   const handleReviewDelete = async () => {
//     if (!userReview) return;
//     try {
//       await axios.delete(
//         `http://localhost:3000/api/reviews/delete-review/${userReview._id}`,
//         { headers }
//       );
//       setUserReview(null);
//       setRating(0);
//       setComment('');
//       await fetchReviews();
//       await fetchSummary();
//     } catch (err) {
//       console.error("Delete error:", err);
//     }
//   };

//   return (
//     <div className="mt-12 max-w-3xl mx-auto">
//       {/* Summary Section */}
//       {summary && (
//         <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
//           <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//             <div className="text-center">
//               <div className="text-5xl font-bold text-gray-900">{summary.average.toFixed(1)}</div>
//               <div className="flex justify-center mt-1">
//                 {[...Array(5)].map((_, i) => (
//                   <Star key={i} filled={i < Math.round(summary.average)} />
//                 ))}
//               </div>
//               <p className="text-sm text-gray-500 mt-1">{summary.total} review{summary.total !== 1 && 's'}</p>
//             </div>

//             <div className="flex-1 w-full">
//               {[5, 4, 3, 2, 1].map(star => (
//                 <div key={star} className="flex items-center mb-2">
//                   <span className="text-sm font-medium text-gray-700 w-8">{star}★</span>
//                   <div className="flex-1 bg-gray-100 h-2.5 mx-2 rounded-full overflow-hidden">
//                     <div
//                       className="bg-amber-400 h-full rounded-full"
//                       style={{
//                         width: summary.total ? `${(summary.breakdown[star] / summary.total) * 100}%` : '0%'
//                       }}
//                     />
//                   </div>
//                   <span className="text-sm text-gray-500 w-8 text-right">{summary.breakdown[star] || 0}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Review Form */}
//       <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
//         <h3 className="text-xl font-semibold text-gray-900 mb-4">
//           {userReview ? (isEditing ? 'Edit Your Review' : 'Your Review') : 'Write a Review'}
//         </h3>

//         <div className="flex gap-1 mb-4">
//           {[1, 2, 3, 4, 5].map(star => (
//             <button
//               key={star}
//               onClick={() => setRating(star)}
//               className={`text-3xl ${star <= rating ? 'text-amber-400' : 'text-gray-300'} hover:scale-110 transition-transform`}
//             >
//               ★
//             </button>
//           ))}
//         </div>

//         <textarea
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           placeholder="Share your thoughts about this book..."
//           className="w-full p-4 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-colors"
//           rows={5}
//           disabled={!isEditing && userReview}
//         />

//         <div className="flex gap-3 mt-4">
//           {userReview ? (
//             isEditing ? (
//               <>
//                 <button
//                   onClick={handleReviewUpdate}
//                   disabled={loading}
//                   className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
//                 >
//                   {loading ? 'Updating...' : 'Update Review'}
//                 </button>
//                 <button
//                   onClick={() => setIsEditing(false)}
//                   className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
//                 >
//                   Cancel
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
//                 >
//                   Edit Review
//                 </button>
//                 <button
//                   onClick={handleReviewDelete}
//                   className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
//                 >
//                   Delete Review
//                 </button>
//               </>
//             )
//           ) : (
//             <button
//               onClick={handleReviewSubmit}
//               disabled={loading || !rating || !comment.trim()}
//               className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
//             >
//               {loading ? 'Submitting...' : 'Submit Review'}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Reviews List */}
//       <div className="space-y-6">
//         <h3 className="text-xl font-semibold text-gray-900 mb-2">
//           Customer Reviews ({reviews.length})
//         </h3>

//         {reviews.length === 0 ? (
//           <div className="text-center py-8">
//             <p className="text-gray-500">No reviews yet. Be the first to review!</p>
//           </div>
//         ) : (
//           reviews.map(review => (
//             <div key={review._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//               <div className="flex items-start gap-4">
//                 <img
//                   src={review.userid?.avatar || "https://www.gravatar.com/avatar/default?s=200"}
//                   className="w-12 h-12 rounded-full object-cover border-2 border-amber-100"
//                   alt={review.userid?.fullname || "Anonymous"}
//                 />
//                 <div className="flex-1">
//                   <div className="flex items-center justify-between">
//                     <h4 className="font-medium text-gray-900">
//                       {review.userid?.fullname || "Anonymous"}
//                     </h4>
//                     <span className="text-sm text-gray-500">
//                       {new Date(review.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className="flex gap-1 my-2">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} filled={i < review.rating} />
//                     ))}
//                   </div>
//                   <p className="text-gray-700 mt-1">
//                     {review.comment}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// const Star = ({ filled = false }) => (
//   <span className={`text-lg ${filled ? 'text-amber-400' : 'text-gray-300'}`}>
//     ★
//   </span>
// );