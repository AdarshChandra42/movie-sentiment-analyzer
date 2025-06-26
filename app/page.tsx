'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  user_id: number;
  username: string;
}

export default function HomePage() {
  const [review, setReview] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handlePreviousReviews = () => {
    router.push('/previous');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!review.trim()) return;

    setIsAnalyzing(true);
    
    try {
      const requestBody: any = {
        reviewText: review
      };
      
      // Only include userId if user is logged in
      if (user) {
        requestBody.userId = user.user_id;
      }

      const response = await fetch('/api/analyze-sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (result.success && result.data) {
        // Navigate to results page with analysis results
        const params = new URLSearchParams({
          rating: result.data.rating.toString(),
          review: review,
          explanation: result.data.explanation
        });
        
        router.push(`/results?${params.toString()}`);
      } else {
        alert('Failed to analyze sentiment. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* User Header */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <div className="text-lg font-medium text-gray-700">
          {user ? (
            <>Welcome, <span className="text-blue-600">{user.username}</span></>
          ) : (
            <span className="text-gray-600">Login to store review sentiments</span>
          )}
        </div>
        <div className="flex gap-2">
          {user ? (
            <>
              <button
                onClick={handlePreviousReviews}
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Previous Reviews
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Movie Review{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sentiment Analysis
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Enter your movie review and get an AI-powered rating from 1-5
        </p>
      </div>

      {/* Main Form */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                Movie Review
              </label>
              <textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Enter your movie review here... (e.g., 'This movie was absolutely amazing! The plot was engaging and the acting was superb.')"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] resize-y placeholder:text-gray-400 text-gray-900"
                required
                disabled={isAnalyzing}
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing || !review.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <span>Analyze with AI</span>
              )}
            </button>
          </form>
          
          {/* Rating Scale Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Rating Scale:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div>⭐ 1 = Very Negative</div>
              <div>⭐⭐ 2 = Negative</div>
              <div>⭐⭐⭐ 3 = Neutral/Mixed</div>
              <div>⭐⭐⭐⭐ 4 = Positive</div>
              <div>⭐⭐⭐⭐⭐ 5 = Very Positive</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
