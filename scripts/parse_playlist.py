#!/usr/bin/env python3
import os
import sys
import json
import subprocess
import re

SALOON_PLAYLIST_URL = "https://music.youtube.com/playlist?list=PL5HDCGtq1uZuESb3YD8FwuF5NEKy9Glm8"
SONGS_JSON_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../src/data/songs.json"))

TRACTOR_QUOTES = [
  "చేను చెలకా మనదేరా, రైతు అన్న రాజేరా!",
  "మా ఊరి బాటలో మనస్సు మురిసేను...",
  "పచ్చని పొలాలు... వెన్నెల రాత్రులు...",
  "వాన చినుకుల సంగీతం... పొలం గట్టు పై సంతోషం..."
]

TRACTOR_AMBIENCES = [
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
    "description": "Monsoon farm drive"
  }
]

SALOON_QUOTES = [
  "పాత జ్ఞాపకాలు... మధురమైన గీతాలు...",
  "సలూన్ అద్దంలో కనిపించే చిన్ననాటి రోజులు...",
  "మెలోడీలతో మైమరచిపోయే ప్రశాంతమైన సమయం...",
  "సాయంత్రం వేళ... గుసగుసలాడే ఈల పాటలు...",
  "మనసుకి హాయినిచ్చే అమర గానాలు..."
]

SALOON_AMBIENCES = [
  {
    "id": "saloon-cozy",
    "theme": "vintage",
    "background": "url('/images/saloon_background.jpg')",
    "weather": "clear",
    "skyState": "night",
    "particles": "dust",
    "brightness": 0.9,
    "description": "Authentic South Indian Salon"
  }
]

KNOWN_MDS = {
    "ilayaraja": "Ilaiyaraaja",
    "ilaiyaraaja": "Ilaiyaraaja",
    "koti": "Koti",
    "raj koti": "Raj-Koti",
    "m.m. keeravani": "M.M. Keeravani",
    "mm keeravani": "M.M. Keeravani",
    "keeravani": "M.M. Keeravani",
    "chakri": "Chakri",
    "vijay antony": "Vijay Antony",
    "rgv": "Sandeep Chowta / RGV",
    "k raghavendra rao": "K. Raghavendra Rao",
    "spb": "S.P. Balasubrahmanyam",
    "sunitha": "Sunitha"
}

IGNORE_ARTISTS = ["Mango Music", "SPB Hits", "Telugu HD", "Telugu", "HD", "Mango", "Music", "Jukebox", "Telugu Full HD Songs"]

MOVIE_METADATA = {
    "alluda majaka": {"movie": "Alluda Majaka", "year": "1995", "md": "Koti"},
    "boss i love you": {"movie": "Boss I Love You", "year": "2006", "md": "Kalyani Malik"},
    "sri rama rajyam": {"movie": "Sri Rama Rajyam", "year": "2011", "md": "Ilaiyaraaja"},
    "pavitra prema": {"movie": "Pavitra Prema", "year": "1998", "md": "Koti"},
    "sahasa veerudu sagara kanya": {"movie": "Sahasa Veerudu Sagara Kanya", "year": "1996", "md": "M.M. Keeravani"},
    "eduruleni manishi": {"movie": "Eduruleni Manishi", "year": "2001", "md": "SA Rajkumar"},
    "shiridi sai": {"movie": "Shiridi Sai", "year": "2012", "md": "M.M. Keeravani"},
    "antham": {"movie": "Antham", "year": "1992", "md": "M.M. Keeravani / RGV"},
    "nari nari naduma murari": {"movie": "Nari Nari Naduma Murari", "year": "1990", "md": "K.V. Mahadevan"},
    "khaidi": {"movie": "Khaidi", "year": "1983", "md": "K. Chakravarthy"},
    "gharana mogudu": {"movie": "Gharana Mogudu", "year": "1992", "md": "M.M. Keeravani"},
    "chanti": {"movie": "Chanti", "year": "1992", "md": "Ilaiyaraaja"},
    "muta mestri": {"movie": "Muta Mestri", "year": "1993", "md": "Raj-Koti"},
    "mutamestri": {"movie": "Muta Mestri", "year": "1993", "md": "Raj-Koti"},
    "seetarama kalyanam": {"movie": "Seetarama Kalyanam", "year": "1986", "md": "K.V. Mahadevan"},
    "president gari abbayi": {"movie": "President Gari Abbayi", "year": "1987", "md": "K. Chakravarthy"},
    "kshana kshanam": {"movie": "Kshana Kshanam", "year": "1991", "md": "M.M. Keeravani"},
    "annamayya": {"movie": "Annamayya", "year": "1997", "md": "M.M. Keeravani"},
    "ramudochadu": {"movie": "Ramudochadu", "year": "1996", "md": "Raj-Koti"},
    "chattamtho poratam": {"movie": "Chattamtho Poratam", "year": "1985", "md": "K. Chakravarthy"},
    "krishna babu": {"movie": "Krishna Babu", "year": "1999", "md": "Koti"},
    "kondaveeti raja": {"movie": "Kondaveeti Raja", "year": "1986", "md": "K. Chakravarthy"},
    "seethamma vakitlo sirimalle chettu": {"movie": "Seethamma Vakitlo Sirimalle Chettu", "year": "2013", "md": "Mickey J. Meyer"},
    "svsc": {"movie": "Seethamma Vakitlo Sirimalle Chettu", "year": "2013", "md": "Mickey J. Meyer"},
    "raja vikramarka": {"movie": "Raja Vikramarka", "year": "1990", "md": "Raj-Koti"},
    "collector gari abbai": {"movie": "Collector Gari Abbai", "year": "1987", "md": "K. Chakravarthy"},
    "bangaru bullodu": {"movie": "Bangaru Bullodu", "year": "1993", "md": "Raj-Koti"},
    "srinivasa kalyanam": {"movie": "Srinivasa Kalyanam", "year": "1987", "md": "K.V. Mahadevan"},
    "prema yuddham": {"movie": "Prema Yuddham", "year": "1990", "md": "Hamsalekha"},
    "janaki ramudu": {"movie": "Janaki Ramudu", "year": "1988", "md": "K.V. Mahadevan"},
    "srimannarayana": {"movie": "Srimannarayana", "year": "2012", "md": "Chakri"},
    "donga mogudu": {"movie": "Donga Mogudu", "year": "1987", "md": "K. Chakravarthy"},
    "nirmala convent": {"movie": "Nirmala Convent", "year": "2016", "md": "Roshan Saluri"},
    "om namo venkatesaya": {"movie": "Om Namo Venkatesaya", "year": "2017", "md": "M.M. Keeravani"}
}

def clean_song_title(title):
    t = re.sub(r'(?i)\b(Full\s+Video\s+Song|Video\s+Song|Full\s+Telugu\s+Song|Telugu\s+Video\s+Song|Music\s+Video|Full\s+Song|Telugu\s+Song|Item\s+Song|Title\s+Song|Telugu\s+HD\s+Video\s+Song|Full\s+HD\s+Video\s+Song|HD\s+Video\s+Song|Song|Telugu\s+Full\s+HD\s+Songs)\b', '', title)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def clean_movie_title(movie):
    m = re.sub(r'(?i)\b(Telugu\s+Movie\s+Songs|Telugu\s+Movie\s+Video\s+Songs|Telugu\s+Movie|Movie\s+Songs|Movie\s+Video\s+Songs|Movie|Songs|Video\s+Songs\s+Jukebox)\b', '', movie)
    m = re.sub(r'\s+', ' ', m).strip()
    return m if m else "Classic Telugu Movie"

def run_yt_dlp(args):
    cmd = ["python", "-m", "yt_dlp"] + args
    result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    if result.returncode != 0:
        raise Exception(f"yt-dlp failed: {result.stderr}")
    return result.stdout

def parse_entry(e, sequence):
    video_id = e.get('id')
    raw_title = e.get('title', '')
    
    parts = [p.strip() for p in raw_title.split('|') if p.strip()]
    
    movie_raw = "Telugu Classic Movie"
    title_raw = raw_title
    artists = []
    found_md = None

    if len(parts) >= 2:
        if any(w in parts[0].lower() for w in ["movie", "songs", "jukebox"]):
            movie_raw = parts[0]
            title_raw = parts[1]
        else:
            title_raw = parts[0]
            movie_raw = parts[1]
            
        for p in parts[2:]:
            p_clean = p.strip()
            if any(ig.lower() == p_clean.lower() for ig in IGNORE_ARTISTS):
                continue
            
            matched_md = None
            for md_k, md_v in KNOWN_MDS.items():
                if md_k in p_clean.lower():
                    matched_md = md_v
                    break
            if matched_md:
                found_md = matched_md
            else:
                artists.append(p_clean)
    else:
        title_raw = parts[0]

    title = clean_song_title(title_raw)
    movie = clean_movie_title(movie_raw)
    
    year = "Classic Era"
    music_director = found_md if found_md else "Classic Telugu Music"

    for m_key, m_meta in MOVIE_METADATA.items():
        if m_key in movie_raw.lower() or m_key in title_raw.lower():
            movie = m_meta["movie"]
            year = m_meta["year"]
            if not found_md:
                music_director = m_meta["md"]
            break

    artist_str = ", ".join(artists) if artists else "Various Artists"

    for m_key in MOVIE_METADATA.keys():
        if title.lower().startswith(m_key):
            title = re.sub(f'(?i)^{m_key}', '', title).strip()

    title = clean_song_title(title)
    if not title:
        title = clean_song_title(raw_title)

    quote = SALOON_QUOTES[(sequence - 1) % len(SALOON_QUOTES)]
    ambience = SALOON_AMBIENCES[(sequence - 1) % len(SALOON_AMBIENCES)]

    return {
        "id": f"sal-{video_id}-{sequence}",
        "place": "saloon",
        "title": title,
        "movie": movie,
        "year": year,
        "artist": artist_str,
        "musicDirector": music_director,
        "youtubeVideoId": video_id,
        "youtubeUrl": f"https://www.youtube.com/watch?v={video_id}",
        "spotifyUrl": f"https://open.spotify.com/search/{title}",
        "sequence": sequence,
        "active": True,
        "quote": quote,
        "ambience": ambience
    }

def fetch_saloon_playlist():
    print(f"Fetching new Saloon playlist: {SALOON_PLAYLIST_URL}")
    flat_json = run_yt_dlp(["--dump-single-json", "--flat-playlist", SALOON_PLAYLIST_URL])
    playlist_data = json.loads(flat_json)
    entries = playlist_data.get('entries', [])
    print(f"Found {len(entries)} entries in new Saloon playlist.")
    
    saloon_songs = [parse_entry(e, i + 1) for i, e in enumerate(entries)]
    return saloon_songs

def main():
    existing_data = []
    if os.path.exists(SONGS_JSON_PATH):
        try:
            with open(SONGS_JSON_PATH, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
        except Exception as e:
            print(f"Error loading existing songs.json: {e}")

    # 1. Existing tractor-anna songs
    tractor_songs = [s for s in existing_data if s.get('place') == 'tractor-anna']
    print(f"Existing tractor-anna songs: {len(tractor_songs)}")

    # 2. Existing saloon songs -> transfer to tractor-anna
    saloon_to_transfer = [s for s in existing_data if s.get('place') == 'saloon']
    print(f"Transferring {len(saloon_to_transfer)} existing saloon songs to tractor-anna...")

    transferred_tractor_songs = []
    for s in saloon_to_transfer:
        transferred_song = dict(s)
        transferred_song['place'] = 'tractor-anna'
        transferred_tractor_songs.append(transferred_song)

    # Combine tractor-anna songs (existing + transferred)
    combined_tractor_songs = tractor_songs + transferred_tractor_songs
    print(f"Total tractor-anna songs after transfer: {len(combined_tractor_songs)}")

    # Re-sequence tractor-anna songs & update quote/ambience
    for i, s in enumerate(combined_tractor_songs):
        sequence = i + 1
        video_id = s.get('youtubeVideoId', f"vid-{sequence}")
        s['id'] = f"ta-{video_id}-{sequence}"
        s['sequence'] = sequence
        s['quote'] = TRACTOR_QUOTES[i % len(TRACTOR_QUOTES)]
        s['ambience'] = TRACTOR_AMBIENCES[i % len(TRACTOR_AMBIENCES)]

    # 3. Fetch new saloon songs from playlist
    new_saloon_songs = fetch_saloon_playlist()

    # Combine all
    all_songs = combined_tractor_songs + new_saloon_songs
    print(f"Total songs to save: {len(all_songs)} (Tractor: {len(combined_tractor_songs)}, Saloon: {len(new_saloon_songs)})")

    try:
        with open(SONGS_JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(all_songs, f, indent=2, ensure_ascii=False)
        print("Successfully updated songs.json!")
    except Exception as e:
        print(f"Error saving songs.json: {e}")

if __name__ == "__main__":
    main()
