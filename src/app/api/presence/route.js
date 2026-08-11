import { NextResponse } from 'next/server';

// Standard baseline presence count for each place
const BASE_COUNTS = {
  'tractor-anna': 83,
  'saloon': 41,
  'auto': 12,
  'tea-stall': 29,
  'rtc-bus': 55,
  'college-canteen': 64
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const place = searchParams.get('place') || 'truck-wala';
  
  // Generate a slightly changing pseudo-random count based on the current time
  const base = BASE_COUNTS[place] || 15;
  const seconds = Math.floor(Date.now() / 4000); // changes slightly every 4 seconds
  const variance = Math.sin(seconds * 0.5) * 5 + Math.cos(seconds * 0.2) * 2;
  const count = Math.max(1, Math.round(base + variance));
  
  return NextResponse.json({
    place,
    count,
    timestamp: Date.now()
  });
}
