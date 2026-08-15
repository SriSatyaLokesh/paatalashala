#!/usr/bin/env node
// Regenerates src/data/songs/<place>.json from src/data/songs.json.
// Run this after every edit to songs.json (e.g. after scripts/parse_playlist.py
// runs) and commit the resulting files under src/data/songs/.
const fs = require('fs');
const path = require('path');

const SONGS_JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'songs.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data', 'songs');

// Known active place ids — kept explicit (not derived) so an unrecognized
// `place` value in songs.json fails loudly instead of silently being dropped.
const PLACES = ['tractor-anna', 'auto', 'thathayya', 'ammama', 'vennallo', 'saloon'];

const songs = JSON.parse(fs.readFileSync(SONGS_JSON_PATH, 'utf8'));

const unknown = songs.filter(s => !PLACES.includes(s.place));
if (unknown.length > 0) {
  console.error(`Found ${unknown.length} song(s) with unrecognized place value(s): ${[...new Set(unknown.map(s => s.place))].join(', ')}`);
  process.exit(1);
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

for (const place of PLACES) {
  const subset = songs.filter(s => s.place === place);
  const outPath = path.join(OUTPUT_DIR, `${place}.json`);
  fs.writeFileSync(outPath, JSON.stringify(subset, null, 2) + '\n', 'utf8');
  console.log(`${place}: ${subset.length} songs -> ${path.relative(process.cwd(), outPath)}`);
}
console.log('Done.');
