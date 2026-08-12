#!/usr/bin/env python3
import os
import sys
import json
import subprocess
import re

SALOON_PLAYLIST_URL = "https://www.youtube.com/playlist?list=PLrjwF4Uao0nIdfaYx6uhgvLrHBv839DKb"
SONGS_JSON_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../src/data/songs.json"))

SALOON_QUOTES = [
  "పాత జ్ఞాపకాలు... మధురమైన గీతాలు... 💈",
  "సలూన్ అద్దంలో కనిపించే చిన్ననాటి రోజులు... ✨",
  "మెలోడీలతో మైమరచిపోయే ప్రశాంతమైన సమయం... 🎵",
  "సాయంత్రం వేళ... గుసగుసలాడే ఈల పాటలు... 📻",
  "మనసుకి హాయినిచ్చే అమర గానాలు... 🎶"
]

SALOON_AMBIENCES = [
  {
    "id": "saloon-cozy",
    "theme": "vintage",
    "background": "linear-gradient(to bottom, #1e1b4b, #0f172a)",
    "weather": "clear",
    "skyState": "night",
    "particles": "dust",
    "brightness": 0.9,
    "description": "Cozy retro salon vibe"
  },
  {
    "id": "saloon-warm",
    "theme": "retro",
    "background": "linear-gradient(to bottom, #31101e, #0f172a)",
    "weather": "clear",
    "skyState": "dusk",
    "particles": "none",
    "brightness": 0.95,
    "description": "Warm evening salon vibe"
  }
]

def clean_name(val):
    if not val:
        return ""
    val = re.sub(r'\s*[\(\[].*?[\)\]]', '', val)
    val = re.sub(r'\s*-\s*Topic$', '', val)
    val = re.sub(r'\s*Full Song.*', '', val, flags=re.IGNORECASE)
    val = re.sub(r'\s*Video Song.*', '', val, flags=re.IGNORECASE)
    val = re.sub(r'\s*Audio Songs.*', '', val, flags=re.IGNORECASE)
    val = re.sub(r'\s*\|\s*.*', '', val)
    return val.strip()

def run_yt_dlp(args):
    cmd = ["python", "-m", "yt_dlp"] + args
    result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    if result.returncode != 0:
        raise Exception(f"yt-dlp failed: {result.stderr}")
    return result.stdout

def parse_saloon_playlist():
    print(f"Parsing Saloon playlist: {SALOON_PLAYLIST_URL}")
    flat_json = run_yt_dlp(["--dump-single-json", "--flat-playlist", SALOON_PLAYLIST_URL])
    playlist_data = json.loads(flat_json)
    entries = playlist_data.get('entries', [])
    print(f"Found {len(entries)} total entries in Saloon playlist.")
    
    # Exclude the first song as requested
    saloon_entries = entries[1:]
    print(f"Parsing {len(saloon_entries)} songs for Saloon (excluding 1st song)...")

    saloon_songs = []
    for i, entry in enumerate(saloon_entries):
        video_id = entry.get('id')
        video_title = entry.get('title')
        title = clean_name(video_title)

        sequence = i + 1
        quote = SALOON_QUOTES[i % len(SALOON_QUOTES)]
        ambience = SALOON_AMBIENCES[i % len(SALOON_AMBIENCES)]

        song_entry = {
            "id": f"sal-{video_id}-{sequence}",
            "place": "saloon",
            "title": title,
            "movie": "Classic Telugu Movie",
            "year": "Golden Era",
            "artist": "S.A. Rajkumar / Various Artists",
            "musicDirector": "S.A. Rajkumar",
            "youtubeVideoId": video_id,
            "youtubeUrl": f"https://www.youtube.com/watch?v={video_id}",
            "spotifyUrl": f"https://open.spotify.com/search/{title}",
            "sequence": sequence,
            "active": True,
            "quote": quote,
            "ambience": ambience
        }
        saloon_songs.append(song_entry)
        
    return saloon_songs

def main():
    saloon_songs = parse_saloon_playlist()

    existing_other_songs = []
    if os.path.exists(SONGS_JSON_PATH):
        try:
            with open(SONGS_JSON_PATH, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
                existing_other_songs = [s for s in existing_data if s.get('place') != 'saloon']
                print(f"Preserving {len(existing_other_songs)} non-saloon songs (including tractor-anna).")
        except Exception as e:
            print(f"Error reading existing songs.json: {e}")

    all_songs = existing_other_songs + saloon_songs
    try:
        with open(SONGS_JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(all_songs, f, indent=2, ensure_ascii=False)
        print(f"Successfully updated songs.json with {len(saloon_songs)} saloon songs!")
    except Exception as e:
        print(f"Error writing to songs.json: {e}")

if __name__ == "__main__":
    main()


