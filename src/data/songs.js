import songsData from './songs.json';
export const SONGS = songsData;

export const getSongsForPlace = (placeId) => {
  return SONGS.filter(song => song.place === placeId && song.active)
    .sort((a, b) => a.sequence - b.sequence);
};
