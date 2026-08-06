import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import Loading from '../components/common/Loading';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [filterStatus]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/reviews/');
      setReviews(response.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation) => {
    const colors = {
      accept: 'bg-green-100 text-green-800',
      minor_revision: 'bg-yellow-100 text-yellow-800',
      major_revision: 'bg-orange-100 text-orange-800',
      reject: 'bg-red-100 text-red-800'
    };
    return colors[recommendation] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <Loading message="Loading reviews..." fullScreen />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fadeInUp">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Reviews</h1>
          <p className="text-gray-600 mt-1">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
          >
            <option value="">All</option>
            <option value="submitted">Submitted</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50 backdrop-blur-sm border-b border-white/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Article</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Reviewer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Recommendation</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {reviews.map((review, index) => (
                <tr 
                  key={review.id} 
                  className="group hover:bg-white/20 hover:scale-[1.002] transition-all duration-300 animate-fadeInUp cursor-default"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                      {review.article_title || `Article #${review.article_id}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {review.reviewer_name || `Reviewer #${review.reviewer_user_id}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRecommendationColor(review.recommendation)}`}>
                      {review.recommendation?.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {review.review_date ? new Date(review.review_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${review.is_submitted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {review.is_submitted ? 'Submitted' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      to={`/admin/reviews/${review.id}`}
                      className="text-primary-600 hover:text-primary-800 font-medium text-sm transition-colors duration-200 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reviews;