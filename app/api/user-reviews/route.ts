import { NextRequest, NextResponse } from 'next/server';
import { getUserReviews, testConnection } from '../../../lib/database';

interface UserReviewsResponse {
  success: boolean;
  data?: any[];
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<UserReviewsResponse>> {
  try {
    // Test database connection first
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('Database connection failed in user-reviews API');
      return NextResponse.json({ 
        success: false, 
        error: 'Database connection failed' 
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Validate input
    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json({ 
        success: false, 
        error: 'Valid userId is required' 
      }, { status: 400 });
    }

    const userIdNumber = Number(userId);
    console.log('Fetching reviews for user ID:', userIdNumber);

    // Get user reviews
    const reviews = await getUserReviews(userIdNumber);

    return NextResponse.json({
      success: true,
      data: reviews
    });
    
  } catch (error) {
    console.error('User reviews error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 