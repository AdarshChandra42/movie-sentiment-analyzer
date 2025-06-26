import postgres from 'postgres';

// Database configuration with error handling
if (!process.env.POSTGRES_URL) {
  throw new Error(
    'POSTGRES_URL environment variable is not set. Please add it to your .env.local file.'
  );
}

const sql = postgres(process.env.POSTGRES_URL!);

// Test database connection
export async function testConnection() {
  try {
    await sql`SELECT 1`;
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// User operations
export async function createUser(username: string, password: string) {
  try {
    console.log('Creating user:', username);
    const [user] = await sql`
      INSERT INTO users (username, password)
      VALUES (${username}, ${password})
      RETURNING user_id, username, created_at
    `;
    console.log('User created successfully:', user);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByUsername(username: string) {
  try {
    console.log('Fetching user by username:', username);
    const [user] = await sql`
      SELECT user_id, username, created_at FROM users WHERE username = ${username}
    `;
    console.log('User found:', user ? 'Yes' : 'No');
    return user;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw error;
  }
}

export async function validateUserCredentials(username: string, password: string) {
  try {
    console.log('Validating credentials for username:', username);
    const [user] = await sql`
      SELECT user_id, username, created_at FROM users 
      WHERE username = ${username} AND password = ${password}
    `;
    console.log('Credentials valid:', user ? 'Yes' : 'No');
    return user;
  } catch (error) {
    console.error('Error validating user credentials:', error);
    throw error;
  }
}

// Review operations
export async function createSentiment(
  review_text: string,
  sentiment: 'Positive' | 'Negative' | 'Neutral',
  user_id: number,
  rating: number
) {
  try {
    const [review] = await sql`
      INSERT INTO reviews (review_text, sentiment, user_id, rating)
      VALUES (${review_text}, ${sentiment}, ${user_id}, ${rating})
      RETURNING *
    `;
    return review;
  } catch (error) {
    console.error('Error creating sentiment:', error);
    throw error;
  }
}

export async function getAllReviews() {
  try {
    const reviews = await sql`
      SELECT r.*, u.username 
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      ORDER BY r.timestamp DESC
      LIMIT 100
    `;
    return reviews;
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    throw error;
  }
}

export async function getUserReviews(user_id: number) {
  try {
    const reviews = await sql`
      SELECT * FROM reviews 
      WHERE user_id = ${user_id}
      ORDER BY timestamp DESC
      LIMIT 100
    `;
    return reviews;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
}

// Close database connection
export async function closeDatabase() {
  await sql.end();
}

export default sql;

