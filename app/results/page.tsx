'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const rating = parseInt(searchParams.get('rating') || '3');
  const review = searchParams.get('review') || '';
  const explanation = searchParams.get('explanation') || '';

  const getRatingData = () => {
    if (rating >= 4) {
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: '😊',
        title: 'Positive Review',
        sentiment: 'positive'
      };
    } else if (rating <= 2) {
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: '😞',
        title: 'Negative Review',
        sentiment: 'negative'
      };
    } else {
      return {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: '😐',
        title: 'Neutral Review',
        sentiment: 'neutral'
      };
    }
  };

  const getStarRating = () => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getRatingDescription = () => {
    switch (rating) {
      case 1: return 'Very Negative';
      case 2: return 'Negative';
      case 3: return 'Neutral/Mixed';
      case 4: return 'Positive';
      case 5: return 'Very Positive';
      default: return 'Unknown';
    }
  };

  const ratingData = getRatingData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Analysis Complete!
          </h1>
          <p className="text-lg text-gray-600">
            Here's your AI-powered sentiment analysis
          </p>
        </div>

        {/* Main Result */}
        <div className={`bg-white rounded-xl shadow-lg p-8 ${ratingData.bgColor} ${ratingData.borderColor} border-2 mb-8`}>
          <div className="text-center">
            <div className="text-6xl mb-4">{ratingData.icon}</div>
            <h2 className={`text-3xl font-bold ${ratingData.color} mb-4`}>
              {ratingData.title}
            </h2>
            <div className="text-4xl mb-4">{getStarRating()}</div>
            <div className={`text-xl font-semibold ${ratingData.color} mb-4`}>
              Rating: {rating}/5 ({getRatingDescription()})
            </div>
            <p className="text-lg text-gray-700 mb-4">
              {explanation}
            </p>
          </div>
        </div>

        {/* Review Display */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Review</h3>
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="text-gray-700">"{review}"</p>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Rating Breakdown
          </h3>
          
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {star} Star{star !== 1 ? 's' : ''} - {
                    star === 1 ? 'Very Negative' :
                    star === 2 ? 'Negative' :
                    star === 3 ? 'Neutral/Mixed' :
                    star === 4 ? 'Positive' :
                    'Very Positive'
                  }
                </span>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${
                    rating === star ? 'bg-blue-500' : 'bg-gray-200'
                  }`}></div>
                  <span className="ml-2 text-sm text-gray-600">
                    {rating === star ? '✓ Your Rating' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700"
          >
            Analyze Another Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
} 