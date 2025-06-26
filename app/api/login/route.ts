import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByUsername, validateUserCredentials, testConnection } from '../../../lib/database';

interface LoginRequest {
  username: string;
  password: string;
  action: 'login' | 'signup';
}

interface LoginResponse {
  success: boolean;
  data?: {
    user_id: number;
    username: string;
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    console.log('Login API called');
    
    // Test database connection first
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('Database connection failed in login API');
      return NextResponse.json({ 
        success: false, 
        error: 'Database connection failed. Please check your environment configuration.' 
      }, { status: 500 });
    }

    const body: LoginRequest = await request.json();
    console.log('Request body:', { username: body.username, action: body.action });
    const { username, password, action } = body;

    // Validate input
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      console.log('Invalid username provided');
      return NextResponse.json({ 
        success: false, 
        error: 'Username is required and must be a non-empty string' 
      }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.trim().length === 0) {
      console.log('Invalid password provided');
      return NextResponse.json({ 
        success: false, 
        error: 'Password is required and must be a non-empty string' 
      }, { status: 400 });
    }

    if (!action || (action !== 'login' && action !== 'signup')) {
      console.log('Invalid action provided');
      return NextResponse.json({ 
        success: false, 
        error: 'Action must be either "login" or "signup"' 
      }, { status: 400 });
    }

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    console.log('Processing', action, 'for username:', trimmedUsername);

    if (action === 'signup') {
      // Check if user already exists
      const existingUser = await getUserByUsername(trimmedUsername);
      if (existingUser) {
        console.log('User already exists');
        return NextResponse.json({ 
          success: false, 
          error: 'Username already exists. Please choose a different username.' 
        }, { status: 400 });
      }

      // Create new user
      console.log('Creating new user');
      const user = await createUser(trimmedUsername, trimmedPassword);
      
      if (!user) {
        console.error('Failed to create user');
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to create user' 
        }, { status: 500 });
      }

      console.log('Signup successful for user:', user);
      return NextResponse.json({
        success: true,
        data: {
          user_id: user.user_id,
          username: user.username
        }
      });

    } else { // action === 'login'
      // Validate credentials
      const user = await validateUserCredentials(trimmedUsername, trimmedPassword);
      
      if (!user) {
        console.log('Invalid credentials');
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid username or password' 
        }, { status: 401 });
      }

      console.log('Login successful for user:', user);
      return NextResponse.json({
        success: true,
        data: {
          user_id: user.user_id,
          username: user.username
        }
      });
    }
    
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid JSON in request body' 
      }, { status: 400 });
    }
    
    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('POSTGRES_URL')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database configuration error. Please set up your environment variables.' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    message: 'User Login API',
    version: '1.0.0',
    endpoint: {
      POST: {
        description: 'Login or signup with username and password',
        usage: 'POST { username: string, password: string, action: "login" | "signup" }',
        returns: 'User information'
      }
    }
  });
} 