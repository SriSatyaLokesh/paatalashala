import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { videoId } = await request.json();
    if (!videoId) {
      return NextResponse.json({ error: 'videoId is required' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src/data/songs.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'songs.json not found' }, { status: 404 });
    }

    const fileData = fs.readFileSync(filePath, 'utf8');
    const songs = JSON.parse(fileData);

    const targetSong = songs.find(s => s.youtubeVideoId === videoId);
    if (!targetSong) {
      return NextResponse.json({ message: 'Song not found, already deleted?' }, { status: 200 });
    }

    // Filter out the unplayable song
    const updatedSongs = songs.filter(s => s.youtubeVideoId !== videoId);

    // Save back to JSON
    fs.writeFileSync(filePath, JSON.stringify(updatedSongs, null, 2), 'utf8');
    console.log(`\x1b[31m[Self-Healing API] Removed unplayable video: "${targetSong.title}" (ID: ${videoId})\x1b[0m`);

    return NextResponse.json({ success: true, message: `Removed song: ${targetSong.title}` });
  } catch (error) {
    console.error('Error in self-healing API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
