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

# Exact metadata mapping for all 36 tracks in the playlist.
# For geoblocked/unembeddable original IDs (Topic videos), we map to working alternative IDs.
TRACKS_METADATA = {
  "1hF05xNRJdI": {
    "embedId": "1hF05xNRJdI",
    "title": "Nenugaali Gopuram",
    "movie": "Manasunna Maaraju",
    "year": "2000",
    "artist": "Udit Narayan, Anuradha Paudwal",
    "musicDirector": "Vandemataram Srinivas"
  },
  "LmAX8GBMKgA": {
    "embedId": "LlMv-IFuj-E", # Working alternative (Lyric video)
    "title": "Neela Poori",
    "movie": "Mahatma",
    "year": "2009",
    "artist": "Vijay Antony",
    "musicDirector": "Vijay Antony"
  },
  "ApK1MRXCsjg": {
    "embedId": "ApK1MRXCsjg",
    "title": "Meghamai",
    "movie": "Nuvvu Vasthavani",
    "year": "2000",
    "artist": "Rajesh Krishnan, Sujatha",
    "musicDirector": "S. A. Rajkumar"
  },
  "f1H2g_zpPMg": {
    "embedId": "YPX5O_7j38M", # Working alternative (Official Sony Music embed)
    "title": "O Pilla Shubhanalla",
    "movie": "Sardaar Gabbar Singh",
    "year": "2016",
    "artist": "Vijay Prakash, Shreya Ghoshal",
    "musicDirector": "Devi Sri Prasad"
  },
  "09g_7xDjMGI": {
    "embedId": "35hiSAACQYU", # Working alternative
    "title": "Aunty Koothura",
    "movie": "Bavagaru Bagunnara?",
    "year": "1998",
    "artist": "S. P. Balasubrahmanyam, K. S. Chithra",
    "musicDirector": "Mani Sharma"
  },
  "Vny0D362ZY4": {
    "embedId": "Vny0D362ZY4",
    "title": "Elavachenamma",
    "movie": "Takkari Donga",
    "year": "2002",
    "artist": "Udit Narayan, Kavita Krishnamurthy",
    "musicDirector": "Mani Sharma"
  },
  "wnYY3S-C2sA": {
    "embedId": "wnYY3S-C2sA",
    "title": "Neekosam",
    "movie": "Nenunnanu",
    "year": "2004",
    "artist": "Shreya Ghoshal, K.K.",
    "musicDirector": "M. M. Keeravani"
  },
  "rvKbZ1Qn5lo": {
    "embedId": "nsSttMcsiIc", # Working alternative
    "title": "Nee Chepakallu",
    "movie": "Sardaar Gabbar Singh",
    "year": "2016",
    "artist": "Hariharan, Chitra",
    "musicDirector": "Devi Sri Prasad"
  },
  "GAP_4dC5VXQ": {
    "embedId": "GAP_4dC5VXQ",
    "title": "Taha Thaha",
    "movie": "Amma Donga",
    "year": "1995",
    "artist": "S. P. Balasubrahmanyam, Chitra",
    "musicDirector": "Koti"
  },
  "84VgOjMM4_4": {
    "embedId": "84VgOjMM4_4",
    "title": "Takkari",
    "movie": "Soggadi Pellam",
    "year": "1996",
    "artist": "S. P. Balasubrahmanyam, Chitra",
    "musicDirector": "Koti"
  },
  "Vev_g6tEdvs": {
    "embedId": "a26ha2dLZ1s", # Working alternative
    "title": "Pagalaintha",
    "movie": "Muthu",
    "year": "1995",
    "artist": "S. P. Balasubrahmanyam",
    "musicDirector": "A. R. Rahman"
  },
  "FXMed_2HioA": {
    "embedId": "ZrD-BWlF2Qw", # Working alternative
    "title": "Malle Pollu",
    "movie": "Anubandham",
    "year": "1984",
    "artist": "S. P. Balasubrahmanyam, S. Janaki",
    "musicDirector": "Chakravarthy"
  },
  "BC6rIAGDA4Q": {
    "embedId": "BC6rIAGDA4Q",
    "title": "One One No.1",
    "movie": "Agni Paravatham",
    "year": "1985",
    "artist": "S. P. Balasubrahmanyam, S. Janaki",
    "musicDirector": "Chakravarthy"
  },
  "gd3tWWnAwvw": {
    "embedId": "gd3tWWnAwvw",
    "title": "Rave English Ramba",
    "movie": "Agni Paravatham",
    "year": "1985",
    "artist": "S. P. Balasubrahmanyam, P. Susheela",
    "musicDirector": "Chakravarthy"
  },
  "Dr9Dbef84HI": {
    "embedId": "Dr9Dbef84HI",
    "title": "Priya Priyathama",
    "movie": "Killer",
    "year": "1992",
    "artist": "Mano, Chitra",
    "musicDirector": "Ilaiyaraaja"
  },
  "vyz6NA44qZs": {
    "embedId": "Y2KJ6iwz7KY", # Working alternative
    "title": "Manasu Aagadhu",
    "movie": "Bangaru Bullodu",
    "year": "1993",
    "artist": "S. P. Balasubrahmanyam, K. S. Chithra",
    "musicDirector": "Raj-Koti"
  },
  "b6n_7WESJJc": {
    "embedId": "b6n_7WESJJc",
    "title": "Sindhura Puvva",
    "movie": "Sindhura Puvvu",
    "year": "1988",
    "artist": "S. P. Balasubrahmanyam, Chitra",
    "musicDirector": "Chakravarthy"
  },
  "7ZKJ2e5cBi0": {
    "embedId": "7ZKJ2e5cBi0",
    "title": "Priyatama",
    "movie": "Jagadekaveerudu Athiloka Sundari",
    "year": "1990",
    "artist": "S. P. Balasubrahmanyam, S. Janaki",
    "musicDirector": "Ilaiyaraaja"
  },
  "QSLwcJg0ReA": {
    "embedId": "QSLwcJg0ReA",
    "title": "Nuvu Malletiga",
    "movie": "Presidentu Gari Pellam",
    "year": "1992",
    "artist": "S. P. Balasubrahmanyam",
    "musicDirector": "M. M. Keeravani"
  },
  "PIaVCtgaXJM": {
    "embedId": "PIaVCtgaXJM",
    "title": "Vuliki Padaku",
    "movie": "Major Chandrakanth",
    "year": "1993",
    "artist": "S. P. Balasubrahmanyam",
    "musicDirector": "M. M. Keeravani"
  },
  "72MqLK01cWc": {
    "embedId": "72MqLK01cWc",
    "title": "Gum Gumainchu",
    "movie": "Kodama Simham",
    "year": "1990",
    "artist": "Mano, Chitra",
    "musicDirector": "Raj-Koti"
  },
  "TEC-e9TAlbk": {
    "embedId": "TEC-e9TAlbk",
    "title": "Chukkala Pallaki Lo",
    "movie": "State Rowdy",
    "year": "1989",
    "artist": "S. P. Balasubrahmanyam, P. Susheela",
    "musicDirector": "Bappi Lahiri"
  },
  "_aY4A9meMfU": {
    "embedId": "_aY4A9meMfU",
    "title": "Neetho Sayantram",
    "movie": "Amma Donga",
    "year": "1995",
    "artist": "S. P. Balasubrahmanyam, Chitra, Sailaja",
    "musicDirector": "Koti"
  },
  "RAM_KXG1R9U": {
    "embedId": "RAM_KXG1R9U",
    "title": "Ramma Chilakamma",
    "movie": "Choodalani Undi",
    "year": "1998",
    "artist": "Udit Narayan",
    "musicDirector": "Mani Sharma"
  },
  "unDhaGK6Rio": {
    "embedId": "unDhaGK6Rio",
    "title": "Natho Vasthava",
    "movie": "Mass",
    "year": "2004",
    "artist": "Udit Narayan, Sumangali",
    "musicDirector": "Devi Sri Prasad"
  },
  "bq6fFFwPw6k": {
    "embedId": "bq6fFFwPw6k",
    "title": "Raa Rammani",
    "movie": "Avunu Validdharu Istapaddaru",
    "year": "2002",
    "artist": "S. P. Balasubrahmanyam, Kousalya",
    "musicDirector": "Chakri"
  },
  "LTlzWFsPYI8": {
    "embedId": "LTlzWFsPYI8",
    "title": "Gongoora Thota",
    "movie": "Venky",
    "year": "2004",
    "artist": "Pushpavanam Kuppusamy, Kalpana",
    "musicDirector": "Devi Sri Prasad"
  },
  "m9CRY02m9pE": {
    "embedId": "m9CRY02m9pE",
    "title": "Mastu Mastu",
    "movie": "Upendra",
    "year": "1999",
    "artist": "Mano",
    "musicDirector": "Gurukiran"
  },
  "NuC4oTKhtN4": {
    "embedId": "NuC4oTKhtN4",
    "title": "Pillo Jabillo",
    "movie": "Kodama Simham",
    "year": "1990",
    "artist": "Mano, Chitra",
    "musicDirector": "Raj-Koti"
  },
  "IwAmfFxpuSg": {
    "embedId": "IwAmfFxpuSg",
    "title": "Idemitamma",
    "movie": "Aayudham",
    "year": "2003",
    "artist": "Kumar Sanu, Nishma",
    "musicDirector": "Vandemataram Srinivas"
  },
  "1Cs0oZQwcPY": {
    "embedId": "1Cs0oZQwcPY",
    "title": "Malli Malli",
    "movie": "Rakshasudu",
    "year": "1986",
    "artist": "S. P. Balasubrahmanyam, S. Janaki",
    "musicDirector": "Ilaiyaraaja"
  },
  "T_LFpQ90bug": {
    "embedId": "T_LFpQ90bug",
    "title": "Swathilo Muthyamantha",
    "movie": "Bangaru Bullodu",
    "year": "1993",
    "artist": "S. P. Balasubrahmanyam, Chitra",
    "musicDirector": "Raj-Koti"
  },
  "pxin4HNhTUU": {
    "embedId": "pxin4HNhTUU",
    "title": "Why Raju",
    "movie": "Aayudham",
    "year": "2003",
    "artist": "Udit Narayan, Usha",
    "musicDirector": "Vandemataram Srinivas"
  },
  "sOHWNbtLX4k": {
    "embedId": "sOHWNbtLX4k",
    "title": "Chandamama",
    "movie": "Eeabbai Chala Manchodu",
    "year": "2003",
    "artist": "Kalyan Mallik, Sunitha",
    "musicDirector": "M. M. Keeravani"
  },
  "uPDqEHSDgkI": {
    "embedId": "uPDqEHSDgkI",
    "title": "Elluvochchi",
    "movie": "Gharana Mogudu",
    "year": "1992",
    "artist": "S. P. Balasubrahmanyam, Chitra",
    "musicDirector": "M. M. Keeravani"
  },
  "w0oMtZWepKo": {
    "embedId": "w0oMtZWepKo",
    "title": "Satyabhama",
    "movie": "Satyabhama",
    "year": "2007",
    "artist": "Karthik",
    "musicDirector": "Chakri"
  }
}

def clean_name(val):
    if not val:
        return ""
    val = re.sub(r'\s*[\(\[].*?[\)\]]', '', val)
    val = re.sub(r'\s*-\s*Topic$', '', val)
    return val.strip()

def run_yt_dlp(args):
    cmd = ["python", "-m", "yt_dlp"] + args
    result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    if result.returncode != 0:
        raise Exception(f"yt-dlp failed: {result.stderr}")
    return result.stdout

def main():
    print(f"Parsing playlist: {PLAYLIST_URL}")
    
    print("Fetching flat playlist entries...")
    flat_json = run_yt_dlp(["--dump-single-json", "--flat-playlist", PLAYLIST_URL])
    playlist_data = json.loads(flat_json)
    entries = playlist_data.get('entries', [])
    print(f"Found {len(entries)} videos in playlist.")

    new_songs = []
    
    for i, entry in enumerate(entries):
        video_id = entry.get('id')
        video_title = entry.get('title')
        print(f"[{i+1}/{len(entries)}] Resolving metadata for: {video_title} (ID: {video_id})...")
        
        # Check if we have pre-configured metadata
        if video_id in TRACKS_METADATA:
            meta = TRACKS_METADATA[video_id]
            embed_id = meta["embedId"]
            title = meta["title"]
            movie = meta["movie"]
            year = meta["year"]
            artist = meta["artist"]
            music_director = meta["musicDirector"]
        else:
            # Fallback to scraping/parsing via yt-dlp
            embed_id = video_id
            try:
                video_json = run_yt_dlp(["--dump-json", f"https://www.youtube.com/watch?v={video_id}"])
                details = json.loads(video_json)
                title = clean_name(details.get('track') or details.get('title') or video_title)
                movie = clean_name(details.get('album') or "Telugu Movie")
                artist = clean_name(details.get('artist') or details.get('creator') or details.get('uploader') or "Telugu Artist")
                year = str(details.get('release_year')) if details.get('release_year') else "Classic"
                music_director = "Telugu Music"
            except Exception as e:
                print(f"Fallback warning for {video_id}: {e}")
                title = clean_name(video_title)
                movie = "Telugu Movie"
                artist = "Telugu Artist"
                year = "Classic"
                music_director = "Telugu Music"
                
        sequence = i + 1
        quote = QUOTES[i % len(QUOTES)]
        ambience = AMBIENCES[i % len(AMBIENCES)]
        
        song_entry = {
            "id": f"ta-{embed_id}-{sequence}",
            "place": "tractor-anna",
            "title": title,
            "movie": movie,
            "year": year,
            "artist": artist,
            "musicDirector": music_director,
            "youtubeVideoId": embed_id, # Uses working alternative ID to bypass geoblocks
            "youtubeUrl": f"https://www.youtube.com/watch?v={embed_id}",
            "spotifyUrl": f"https://open.spotify.com/search/{title}",
            "sequence": sequence,
            "active": True,
            "quote": quote,
            "ambience": ambience
        }
        new_songs.append(song_entry)

    # Read existing songs.json to keep other places (like saloon) intact
    other_songs = []
    if os.path.exists(SONGS_JSON_PATH):
        try:
            with open(SONGS_JSON_PATH, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
                other_songs = [s for s in existing_data if s.get('place') != 'tractor-anna']
                print(f"Loaded existing songs.json. Preserved {len(other_songs)} songs from other places.")
        except Exception as e:
            print(f"Error reading existing songs.json: {e}")

    # Merge and write out
    all_songs = new_songs + other_songs
    try:
        with open(SONGS_JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(all_songs, f, indent=2, ensure_ascii=False)
        print(f"Successfully updated songs.json with {len(new_songs)} geoblock-free tractor-anna songs.")
    except Exception as e:
        print(f"Error writing to songs.json: {e}")

if __name__ == "__main__":
    main()
