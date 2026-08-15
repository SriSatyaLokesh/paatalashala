// Pure helper — intentionally has NO data import. Each space page statically
// imports its own file from src/data/songs/<place>.json so bundlers can code-
// split per route. Do not import songs.json or add data here; that would
// reintroduce the single shared 900KB+ chunk this file was split to avoid.
export function getActiveSongs(songs) {
  return songs.filter(song => song.active).sort((a, b) => a.sequence - b.sequence);
}
