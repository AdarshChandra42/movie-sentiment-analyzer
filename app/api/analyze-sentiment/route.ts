import { NextRequest, NextResponse } from 'next/server';
import { SentimentAnalyzer } from '../../../lib/sentiment-analyzer';
import { ReviewModel } from '../../../lib/models/Review';

// Request body interface
interface AnalyzeSentimentRequest {
  reviewText: string;
  userId?: number;
}

// Response interface
interface AnalyzeSentimentResponse {
  success: boolean;
  data?: {
    reviewText: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    positiveWords: string[];
    negativeWords: string[];
    positiveCount: number;
    negativeCount: number;
    explanation: string;
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeSentimentResponse>> {
  try {
    const body: AnalyzeSentimentRequest = await request.json();
    const { reviewText, userId } = body;

    // Validate input
    if (!reviewText || typeof reviewText !== 'string' || reviewText.trim().length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'reviewText is required and must be a non-empty string' 
      }, { status: 400 });
    }

    if (userId && typeof userId !== 'number') {
      return NextResponse.json({ 
        success: false, 
        error: 'userId must be a number if provided' 
      }, { status: 400 });
    }

    // Analyze sentiment
    const sentimentResult = SentimentAnalyzer.analyzeSentiment(reviewText);

    // Save to database only if user is logged in
    if (userId) {
      try {
        await ReviewModel.create({
          reviewText,
          sentiment: sentimentResult.sentiment === 'positive' ? 'Positive' : 
                    sentimentResult.sentiment === 'negative' ? 'Negative' : 'Neutral',
          userId
        });
      } catch (dbError) {
        console.error('Database error while saving review:', dbError);
        // Continue even if DB save failed
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        reviewText,
        sentiment: sentimentResult.sentiment,
        positiveWords: sentimentResult.positiveWords,
        negativeWords: sentimentResult.negativeWords,
        positiveCount: sentimentResult.positiveCount,
        negativeCount: sentimentResult.negativeCount,
        explanation: sentimentResult.explanation
      }
    });
    
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid JSON in request body' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Handle GET requests to provide information about the API
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    message: 'Movie Review Sentiment Analysis API',
    version: '1.0.0',
    endpoint: {
      POST: {
        description: 'Analyze sentiment of movie review text',
        usage: 'POST { reviewText: string }',
        returns: 'Sentiment result (positive, negative, or neutral)'
      }
    }
  });
} 