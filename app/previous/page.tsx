'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  user_id: number;
  username: string;
}

interface Review {
  review_id: number;
  review_text: string;
  sentiment: string;
  timestamp: string;
  rating: number;
}

export default function PreviousReviewsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [previousReviews, setPreviousReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);
    fetchUserReviews(userData.user_id);
  }, [router]);

  const fetchUserReviews = async (userId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/user-reviews?userId=${userId}`);
      const result = await response.json();
      
      if (result.success) {
        setPreviousReviews(result.data);
      } else {
        setError('Failed to load previous reviews');
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setError('Error loading previous reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <div className="text-lg font-medium text-gray-700">
          Welcome, <span className="text-blue-600">{user.username}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleBackToHome}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Your{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Previous Reviews
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          View all your movie reviews and their sentiment analysis
        </p>
      </div>

      {/* Reviews Content */}
      <div className="max-w-4xl mx-auto px-8 pb-16">
        <div className="bg-white rounded-xl shadow-lg">
          {loading ? (
            <div className="p-8 text-center">
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600">Loading your reviews...</span>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => fetchUserReviews(user.user_id)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : previousReviews.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No previous reviews found.</p>
              <button
                onClick={handleBackToHome}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Write Your First Review
              </button>
            </div>
          ) : (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {previousReviews.length} Review{previousReviews.length !== 1 ? 's' : ''} Found
                </h2>
              </div>
              <div className="space-y-6">
                {previousReviews.map((review) => (
                  <div key={review.review_id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        review.sentiment === 'Positive' 
                          ? 'bg-green-100 text-green-800'
                          : review.sentiment === 'Negative'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.sentiment}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(review.timestamp).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 