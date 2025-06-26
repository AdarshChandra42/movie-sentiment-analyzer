// Simple Gemini-powered sentiment analysis for movie reviews
import { GoogleGenAI } from '@google/genai';

export interface SentimentResult {
  rating: number; // 1-5 scale (1 = very negative, 5 = very positive)
  explanation: string;
}

export class SentimentAnalyzer {
  private static genAI: GoogleGenAI | null = null;

  /**
   * Initialize Gemini client
   */
  private static initializeGemini(): GoogleGenAI {
    if (!this.genAI) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
      }
      this.genAI = new GoogleGenAI({ apiKey });
    }
    return this.genAI;
  }

  /**
   * Analyze movie review sentiment using Gemini
   */
  static async analyzeSentiment(reviewText: string): Promise<SentimentResult> {
    const genAI = this.initializeGemini();
    const prompt = `Please analyze this movie review and give it a rating from 1-5:\n- 1 = Very negative/terrible\n- 2 = Negative/bad  \n- 3 = Neutral/mixed\n- 4 = Positive/good\n- 5 = Very positive/excellent\n\nReview: "${reviewText}"\n\nRespond in JSON format:\n{\n  "rating": number,\n  "explanation": "brief explanation of why you gave this rating"\n}`;

    try {
      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      });
      const content = response.text;
      if (!content) {
        throw new Error('No response received from Gemini');
      }
      // Extract JSON from response (Gemini might include extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in Gemini response');
      }
      const parsedResult = JSON.parse(jsonMatch[0]);
      // Validate rating is between 1-5
      if (parsedResult.rating < 1 || parsedResult.rating > 5) {
        throw new Error('Invalid rating received from Gemini');
      }
      return {
        rating: parsedResult.rating,
        explanation: parsedResult.explanation || 'No explanation provided',
      };
    } catch (error) {
      console.error('Gemini sentiment analysis failed:', error);
      throw new Error(`Sentiment analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}