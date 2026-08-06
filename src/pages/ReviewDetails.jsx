import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axiosConfig';
import Loading from '../components/common/Loading';

const ReviewDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReview();
  }, [id]);

  const fetchReview = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/reviews/${id}`);
      setReview(response.data);
    } catch (err) {
      console.error('Error fetching review:', err);
      setError('Failed to load review details.');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation) => {
    const colors = {
      accept: 'bg-green-100 text-green-800',
      minor_revision: 'bg-yellow-100 text-yellow-800',
      major_revision: 'bg-orange-100 text-orange-800',
      reject: 'bg-red-100 text-red-800',
    };
    return colors[recommendation] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <Loading fullScreen message="Loading review details..." />;
  }

  if (error || !review) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error || 'Review not found.'}
        </div>
        <Link to="/admin/reviews" className="text-primary-600 hover:underline mt-4 inline-block">
          Back to Reviews
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/reviews" className="text-primary-600 hover:underline text-sm font-medium">
          &larr; Back to Reviews
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800">Review #{review.id}</h1>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Article</h3>
              <p className="text-gray-800 font-medium">{review.article?.title || `Article #${review.article_id}`}</p>
              <Link to={`/admin/articles/${review.article_id}`} className="text-primary-600 hover:underline text-sm mt-1 inline-block">
                View Article &rarr;
              </Link>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Reviewer</h3>
              <p className="text-gray-800 font-medium">{review.reviewer_user?.full_name || `User #${review.reviewer_user_id}`}</p>
              <p className="text-gray-500 text-sm">{review.reviewer_user?.email || ''}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Recommendation</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRecommendationColor(review.recommendation)}`}>
                {review.recommendation?.replace('_', ' ')}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Confidence</h3>
              <p className="text-gray-800 font-medium">{review.confidence}/5</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Review Date</h3>
              <p className="text-gray-800">{new Date(review.review_date).toLocaleString()}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${review.is_submitted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {review.is_submitted ? 'Submitted' : 'Draft'}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Review Comments</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{review.review_comments || 'No comments provided.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;