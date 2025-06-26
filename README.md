# Movie Sentiment Analyzer

A simple web application that analyzes the sentiment of movie reviews using a rule-based approach.

## Features

- **Home Page**: Enter a movie review and get instant sentiment analysis
- **Results Page**: View whether the review is Positive, Negative, or Neutral with explanations
- **Database Storage**: Reviews and their sentiment results are stored with timestamps

## How It Works

The application uses a basic rule-based sentiment analysis:
1. Maintains lists of positive and negative words
2. Counts positive and negative words in the review
3. Determines sentiment based on which type has more words
4. Provides explanations for the analysis results

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up PostgreSQL database**:
   - Create a database named `moviesentiment`
   - Copy `.env.example` to `.env.local` and configure your database URL

3. **Initialize the database**:
   ```bash
   npm run init-db
   ```

4. **Run the application**:
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoint

- **POST** `/api/analyze-sentiment`
  - Body: `{ "reviewText": "Your movie review here" }`
  - Returns: Sentiment analysis with positive/negative word counts and explanation

That's it! The application is intentionally simple and focused on the core requirements.
