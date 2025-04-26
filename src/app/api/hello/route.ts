import { NextResponse } from 'next/server';

// This is a simple API route that returns a greeting message
// You can modify this file while the server is running with bun --watch or bun --hot
// to see the changes reflected immediately

export async function GET() {
  // Get the current timestamp to demonstrate that the route is being re-evaluated
  const timestamp = new Date().toISOString();
  
  return NextResponse.json({
    message: 'Hello from the API!',
    timestamp,
    environment: process.env.NODE_ENV || 'development',
    note: 'Try changing this message and saving the file to see hot reloading in action!'
  });
}
