// Simple sentiment analysis utility with rule-based approach

export interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  positiveWords: string[];
  negativeWords: string[];
  neutralWords: string[];
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  negationsDetected: string[];
  explanation: string;
}

// Basic list of positive words
const POSITIVE_WORDS = [
  'amazing', 'excellent', 'fantastic', 'great', 'good', 'wonderful', 
  'outstanding', 'brilliant', 'superb', 'awesome', 'perfect', 'love',
  'beautiful', 'impressive', 'remarkable', 'incredible', 'enjoyable',
  'satisfying', 'helpful', 'nice', 'fine', 'cool', 'best', 'stellar',
  'magnificent', 'marvelous', 'delightful', 'charming', 'pleasant',
  'thrilling', 'exciting', 'captivating', 'engaging', 'entertaining'
];

// Basic list of negative words
const NEGATIVE_WORDS = [
  'bad', 'terrible', 'awful', 'horrible', 'poor', 'worst', 'hate',
  'disappointing', 'frustrating', 'annoying', 'useless', 'worthless',
  'inadequate', 'unacceptable', 'boring', 'dull', 'slow', 'expensive',
  'disgusting', 'pathetic', 'ridiculous', 'mediocre', 'lousy', 'rotten',
  'horrendous', 'atrocious', 'abysmal', 'deplorable', 'inferior', 'lagging'
];

// Neutral words that don't carry strong sentiment
const NEUTRAL_WORDS = [
  'okay', 'ok', 'average', 'normal', 'standard', 'typical', 'ordinary',
  'moderate', 'fair', 'decent', 'reasonable', 'acceptable', 'adequate',
  'so-so', 'mediocre', 'middle', 'regular', 'common', 'usual', 'basic'
];

// Negation words that can flip sentiment
const NEGATION_WORDS = [
  'not', 'no', 'never', 'none', 'nothing', 'nowhere', 'neither', 'nor',
  'isnt', 'without'
];

// Intensifiers that can amplify sentiment
const INTENSIFIERS = [
  'very', 'extremely', 'incredibly', 'really', 'absolutely', 'completely',
  'totally', 'utterly', 'quite', 'rather', 'fairly', 'pretty', 'so',
  'too', 'highly', 'deeply', 'truly', 'genuinely', 'exceptionally'
];

export class SentimentAnalyzer {
  /**
   * Analyze sentiment of given text using simple rule-based approach
   */
  static analyzeSentiment(text: string): SentimentResult {
    // Normalize text and preserve original for phrase detection
    const normalizedText = text.toLowerCase();
    const words = normalizedText
      .replace(/[^\w\s']/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);

    const foundPositiveWords: string[] = [];
    const foundNegativeWords: string[] = [];
    const foundNeutralWords: string[] = [];
    const negationsDetected: string[] = [];

    let positiveScore = 0;
    let negativeScore = 0;
    let neutralScore = 0;

    // Process words with context awareness
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const prevWord = i > 0 ? words[i - 1] : '';
      const nextWord = i < words.length - 1 ? words[i + 1] : '';
      
      // Check for negations in the previous 1-2 words
      const isNegated = this.checkForNegation(words, i);
      
      // Check for intensifiers
      const intensifier = this.getIntensifier(prevWord);
      const multiplier = intensifier ? 1.5 : 1;

      // Analyze current word
      if (POSITIVE_WORDS.includes(word)) {
        if (isNegated) {
          // Negated positive becomes negative
          foundNegativeWords.push(`not ${word}`);
          negativeScore += 1 * multiplier;
          negationsDetected.push(`not ${word}`);
        } else {
          foundPositiveWords.push(word);
          positiveScore += 1 * multiplier;
        }
      } else if (NEGATIVE_WORDS.includes(word)) {
        if (isNegated) {
          // Negated negative becomes positive (double negative)
          foundPositiveWords.push(`not ${word}`);
          positiveScore += 1 * multiplier;
          negationsDetected.push(`not ${word}`);
        } else {
          foundNegativeWords.push(word);
          negativeScore += 1 * multiplier;
        }
      } else if (NEUTRAL_WORDS.includes(word)) {
        foundNeutralWords.push(word);
        if (!isNegated) {
          neutralScore += 0.5; // Neutral words have lower impact
        }
      }
    }

    // Handle special phrases and patterns
    const phraseAnalysis = this.analyzePhrases(normalizedText);
    positiveScore += phraseAnalysis.positiveBonus;
    negativeScore += phraseAnalysis.negativeBonus;

    // Determine final sentiment with enhanced logic
    const { sentiment, explanation } = this.determineSentiment(
      positiveScore,
      negativeScore,
      neutralScore,
      foundPositiveWords.length,
      foundNegativeWords.length,
      foundNeutralWords.length,
      negationsDetected
    );

    return {
      sentiment,
      positiveWords: [...new Set(foundPositiveWords)],
      negativeWords: [...new Set(foundNegativeWords)],
      neutralWords: [...new Set(foundNeutralWords)],
      positiveCount: foundPositiveWords.length,
      negativeCount: foundNegativeWords.length,
      neutralCount: foundNeutralWords.length,
      negationsDetected: [...new Set(negationsDetected)],
      explanation
    };
  }

  /**
   * Check if a word at given index is negated by preceding negation words
   */
  private static checkForNegation(words: string[], currentIndex: number): boolean {
    // Check previous 1-2 words for negation
    for (let i = Math.max(0, currentIndex - 2); i < currentIndex; i++) {
      if (NEGATION_WORDS.includes(words[i])) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if a word is an intensifier and return its strength
   */
  private static getIntensifier(word: string): boolean {
    return INTENSIFIERS.includes(word);
  }

  /**
   * Analyze common phrases and patterns
   */
  private static analyzePhrases(text: string): { positiveBonus: number; negativeBonus: number } {
    let positiveBonus = 0;
    let negativeBonus = 0;

    // Positive phrases
    const positivePatterns = [
      /highly recommend/g,
      /must watch/g,
      /loved it/g,
      /really good/g,
      /very good/g,
      /extremely good/g,
      /well done/g,
      /great job/g,
      /perfectly executed/g,
      /blown away/g
    ];

    // Negative phrases
    const negativePatterns = [
      /waste of time/g,
      /money wasted/g,
      /completely disappointed/g,
      /total disaster/g,
      /avoid at all costs/g,
      /not worth/g,
      /really bad/g,
      /very bad/g,
      /extremely bad/g,
      /poorly done/g
    ];

    // Mixed/conditional phrases
    const conditionalPatterns = [
      { pattern: /not bad/g, score: 0.5 }, // Slightly positive
      { pattern: /not good/g, score: -0.5 }, // Slightly negative
      { pattern: /could be better/g, score: -0.3 },
      { pattern: /it's okay/g, score: 0 }, // Neutral
    ];

    positivePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) positiveBonus += matches.length * 0.5;
    });

    negativePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) negativeBonus += matches.length * 0.5;
    });

    conditionalPatterns.forEach(({ pattern, score }) => {
      const matches = text.match(pattern);
      if (matches) {
        if (score > 0) positiveBonus += matches.length * score;
        else if (score < 0) negativeBonus += matches.length * Math.abs(score);
      }
    });

    return { positiveBonus, negativeBonus };
  }

  /**
   * Sentiment determination logic
   */
  private static determineSentiment(
    positiveScore: number,
    negativeScore: number,
    neutralScore: number,
    positiveCount: number,
    negativeCount: number,
    neutralCount: number,
    negationsDetected: string[]
  ): { sentiment: 'positive' | 'negative' | 'neutral'; explanation: string } {
    
    const scoreDifference = positiveScore - negativeScore;
    const threshold = 0.5; // Minimum difference needed for non-neutral classification

    let sentiment: 'positive' | 'negative' | 'neutral';
    let explanation: string;

    // Enhanced logic considering scores, not just counts
    if (scoreDifference > threshold) {
      sentiment = 'positive';
      const negationText = negationsDetected.length > 0 
        ? ` (including ${negationsDetected.length} negation${negationsDetected.length !== 1 ? 's' : ''}: ${negationsDetected.join(', ')})` 
        : '';
      explanation = `The review shows positive sentiment with a score of ${positiveScore.toFixed(1)} positive vs ${negativeScore.toFixed(1)} negative${negationText}.`;
    } else if (scoreDifference < -threshold) {
      sentiment = 'negative';
      const negationText = negationsDetected.length > 0 
        ? ` (including ${negationsDetected.length} negation${negationsDetected.length !== 1 ? 's' : ''}: ${negationsDetected.join(', ')})` 
        : '';
      explanation = `The review shows negative sentiment with a score of ${negativeScore.toFixed(1)} negative vs ${positiveScore.toFixed(1)} positive${negationText}.`;
    } else {
      sentiment = 'neutral';
      if (neutralCount > 0) {
        explanation = `The review is neutral with balanced sentiment scores (${positiveScore.toFixed(1)} positive, ${negativeScore.toFixed(1)} negative) and ${neutralCount} neutral word${neutralCount !== 1 ? 's' : ''}.`;
      } else if (negationsDetected.length > 0) {
        explanation = `The review is neutral due to negations that balance the sentiment (${negationsDetected.join(', ')}).`;
      } else {
        explanation = `The review shows neutral sentiment with balanced positive (${positiveScore.toFixed(1)}) and negative (${negativeScore.toFixed(1)}) scores.`;
      }
    }

    return { sentiment, explanation };
  }
} 