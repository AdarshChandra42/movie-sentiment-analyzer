import { createSentiment, getAllReviews, getUserReviews } from '../database';

// Simple Review interface
export interface Review {
  review_id: number;
  user_id: number;
  review_text: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  timestamp: Date;
}

// Review creation interface
export interface CreateReviewData {
  reviewText: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  userId: number;
  rating: number;
}

export class ReviewModel {
  /**
   * Create a new review
   */
  static async create(reviewData: CreateReviewData): Promise<any> {
    const { reviewText, sentiment, userId, rating } = reviewData;
    
    const result = await createSentiment(reviewText, sentiment, userId, rating);
    return result;
  }

  /**
   * Get all reviews (for potential future use)
   */
  static async getAll(): Promise<any[]> {
    return await getAllReviews();
  }

  /**
   * Get reviews for a specific user
   */
  static async getUserReviews(userId: number): Promise<any[]> {
    return await getUserReviews(userId);
  }
} 