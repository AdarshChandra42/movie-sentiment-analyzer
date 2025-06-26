'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const sentiment = searchParams.get('sentiment') || 'neutral';
  const review = searchParams.get('review') || '';
  const positiveWords = searchParams.get('positiveWords')?.split(',').filter(w => w) || [];
  const negativeWords = searchParams.get('negativeWords')?.split(',').filter(w => w) || [];
  const positiveCount = parseInt(searchParams.get('positiveCount') || '0');
  const negativeCount = parseInt(searchParams.get('negativeCount') || '0');
  const explanation = searchParams.get('explanation') || '';

  const getSentimentData = () => {
    if (sentiment === 'positive') {
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: '😊',
        title: 'Positive Sentiment'
      };
    } else if (sentiment === 'negative') {
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: '😞',
        title: 'Negative Sentiment'
      };
    } else {
      return {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: '😐',
        title: 'Neutral Sentiment'
      };
    }
  };

  const sentimentData = getSentimentData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Analysis Complete!
          </h1>
          <p className="text-lg text-gray-600">
            Here's the sentiment analysis of your movie review
          </p>
        </div>

        {/* Main Result */}
        <div className={`bg-white rounded-xl shadow-lg p-8 ${sentimentData.bgColor} ${sentimentData.borderColor} border-2 mb-8`}>
          <div className="text-center">
            <div className="text-6xl mb-4">{sentimentData.icon}</div>
            <h2 className={`text-3xl font-bold ${sentimentData.color} mb-4`}>
              {sentimentData.title}
            </h2>
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

        {/* Word Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Detected Words
          </h3>
          
          {positiveWords.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-green-700 mb-2">
                Positive Words ({positiveCount}):
              </div>
              <div className="flex flex-wrap gap-2">
                {positiveWords.map((word, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {negativeWords.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-red-700 mb-2">
                Negative Words ({negativeCount}):
              </div>
              <div className="flex flex-wrap gap-2">
                {negativeWords.map((word, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {positiveWords.length === 0 && negativeWords.length === 0 && (
            <p className="text-gray-500">No sentiment words detected in this review.</p>
          )}
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