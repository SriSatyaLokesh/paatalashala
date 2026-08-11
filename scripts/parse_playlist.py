#!/usr/bin/env python3
import os
import sys
import json
import subprocess
import re

PLAYLIST_URL = "https://www.youtube.com/playlist?list=PL5qUIUA-senF-1T8-Re2gKOqY_dtDIeV1"
SONGS_JSON_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../src/data/songs.json"))

QUOTES = [
  "చేను చెలకా మనదేరా, రైతు అన్న రాజేరా! 🌾",
  "మా ఊరి బాటలో మనస్సు మురిసేను... 🚜",
  "పచ్చని పొలాలు... వెన్నెల రాత్రులు... ✨",
  "వాన చినుకుల సంగీతం... పొలం గట్టు పై సంతోషం... 🌧️",
  "కొండల నడుమ కోనసీమ అందాలు... ⛰️"
]

AMBIENCES = [
  {
    "id": "sunset-farm",
    "theme": "sunset",
    "background": "url('/images/sunset_farm_background.png')",
    "vehicleSprite": "/images/tractor_anna_sprite.png",
    "weather": "clear",
    "skyState": "dusk",
    "particles": "dust",
    "brightness": 1.0,
    "description": "Sunset farm drive"
  },
  {
    "id": "morning-farm",
    "theme": "morning",
    "background": "url('/images/morning_farm_background.png')",
    "vehicleSprite": "/images/tractor_anna_sprite.png",
    "weather": "misty",
    "skyState": "sunrise",
    "particles": "fog",
    "brightness": 0.9,
    "description": "Early morning farm drive"
  },
  {
    "id": "night-farm",
    "theme": "night",
    "background": "url('/images/night_farm_background.png')",
    "vehicleSprite": "/images/tractor_anna_sprite.png",
    "weather": "clear",
    "skyState": "night",
    "particles": "stars",
    "brightness": 0.6,
    "description": "Starry night farm drive"
  },
  {
    "id": "rainy-farm",
    "theme": "rainy",
    "background": "url('/images/rainy_farm_background.png')",
    "vehicleSprite": "/images/tractor_anna_sprite.png",
    "weather": "rain",
    "skyState": "stormy",
    "particles": "rain",
    "brightness": 0.7,
    "description": "Rainy farm drive"
  },
  {
    "id": "ghats-highway",
    "theme": "morning",
    "background": "url('/images/ghats_highway_background.png')",
    "vehicleSprite": "/images/tractor_anna_sprite.png",
    "weather": "misty",
    "skyState": "sunrise",
    "particles": "fog",
    "brightness": 0.85,
    "description": "Misty Ghats Highway drive"
  }
]

def clean_name(val):
    if not val:
        return ""
    # strip common suffixes and prefixes
    val = re.sub(r'\s*[\(\[].*?[\)\]]', '', val) # remove bracketed info
    val = re.sub(r'\s*-\s*Topic$', '', val) # remove "- Topic"
    return val.strip()

def run_yt_dlp(args):
    cmd = ["python", "-m", "yt_dlp"] + args
    result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    if result.returncode != 0:
        raise Exception(f"yt-dlp failed: {result.stderr}")
    return result.stdout

def main():
    print(f"Parsing playlist: {PLAYLIST_URL}")
    
    # 1. Get flat list of videos
    print("Fetching flat playlist entries...")
    flat_json = run_yt_dlp(["--dump-single-json", "--flat-playlist", PLAYLIST_URL])
    playlist_data = json.loads(flat_json)
    entries = playlist_data.get('entries', [])
    print(f"Found {len(entries)} videos in playlist.")

    new_songs = []
    
    # 2. Query detailed info for each video
    for i, entry in enumerate(entries):
        video_id = entry.get('id')
        video_title = entry.get('title')
        print(f"[{i+1}/{len(entries)}] Fetching details for: {video_title} (ID: {video_id})...")
        
        try:
            # Query specific video details
            video_json = run_yt_dlp(["--dump-json", f"https://www.youtube.com/watch?v={video_id}"])
            details = json.loads(video_json)
            
            # Extract fields with clean fallback logic
            title = clean_name(details.get('track') or details.get('title') or video_title)
            movie = clean_name(details.get('album') or "Telugu Classics")
            
            artist = details.get('artist') or details.get('creator') or details.get('uploader')
            artist = clean_name(artist)
            
            release_year = details.get('release_year')
            year = str(release_year) if release_year else "Classic"
            
            music_director = "Telugu Music"
            # simple heuristics to guess music director
            if "Ilayaraja" in artist or "Ilaiyaraaja" in artist:
                music_director = "Ilaiyaraaja"
            elif "Devi Sri Prasad" in artist or "DSP" in artist:
                music_director = "Devi Sri Prasad"
            elif "Mani Sharma" in artist:
                music_director = "Mani Sharma"
            elif "A.R. Rahman" in artist or "Rahman" in artist:
                music_director = "A.R. Rahman"
                
            sequence = i + 1
            quote = QUOTES[i % len(QUOTES)]
            ambience = AMBIENCES[i % len(AMBIENCES)]
            
            song_entry = {
                "id": f"ta-{video_id}-{sequence}",
                "place": "tractor-anna",
                "title": title,
                "movie": movie,
                "year": year,
                "artist": artist,
                "musicDirector": music_director,
                "youtubeVideoId": video_id,
                "youtubeUrl": f"https://www.youtube.com/watch?v={video_id}&list=PL5qUIUA-senF-1T8-Re2gKOqY_dtDIeV1",
                "spotifyUrl": f"https://open.spotify.com/search/{title}",
                "sequence": sequence,
                "active": True,
                "quote": quote,
                "ambience": ambience
            }
            new_songs.append(song_entry)
            
        except Exception as e:
            print(f"Error parsing details for {video_id}: {e}")
            # Fallback entry in case yt-dlp failed for this video
            sequence = i + 1
            song_entry = {
                "id": f"ta-{video_id}-{sequence}",
                "place": "tractor-anna",
                "title": clean_name(video_title),
                "movie": "Telugu Movie",
                "year": "Classic",
                "artist": "Telugu Artist",
                "musicDirector": "Telugu Music",
                "youtubeVideoId": video_id,
                "youtubeUrl": f"https://www.youtube.com/watch?v={video_id}&list=PL5qUIUA-senF-1T8-Re2gKOqY_dtDIeV1",
                "spotifyUrl": f"https://open.spotify.com/search/{video_title}",
                "sequence": sequence,
                "active": True,
                "quote": QUOTES[i % len(QUOTES)],
                "ambience": AMBIENCES[i % len(AMBIENCES)]
            }
            new_songs.append(song_entry)

    # 3. Read existing songs.json to keep other places (like saloon) intact
    other_songs = []
    if os.path.exists(SONGS_JSON_PATH):
        try:
            with open(SONGS_JSON_PATH, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
                # Keep other places
                other_songs = [s for s in existing_data if s.get('place') != 'tractor-anna']
                print(f"Loaded existing songs.json. Preserved {len(other_songs)} songs from other places.")
        except Exception as e:
            print(f"Error reading existing songs.json: {e}")

    # 4. Merge and write out
    all_songs = new_songs + other_songs
    try:
        with open(SONGS_JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(all_songs, f, indent=2, ensure_ascii=False)
        print(f"Successfully updated songs.json with {len(new_songs)} tractor-anna songs.")
    except Exception as e:
        print(f"Error writing to songs.json: {e}")

if __name__ == "__main__":
    main()
