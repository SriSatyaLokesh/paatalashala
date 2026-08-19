// Song pool + per-space theming for the Sammelanam (సమ్మేళనం) "random" space —
// see src/app/spaces/sammelanam/page.js. Merges all 6 other spaces' catalogs
// and re-derives, per song, whatever that song's home page would have shown
// for background/title/colors/quote, so a song "visiting" Sammelanam looks
// like it does at home.

import { getActiveSongs } from '@/data/songs';
import { prefixPath } from '@/utils/paths';

import tractorAnnaSongs from '@/data/songs/tractor-anna.json';
import autoSongs from '@/data/songs/auto.json';
import saloonSongs from '@/data/songs/saloon.json';
import ammamaSongs from '@/data/songs/ammama.json';
import thathayyaSongs from '@/data/songs/thathayya.json';
import vennalloSongs from '@/data/songs/vennallo.json';
import gundammaSongs from '@/data/songs/gundamma-gramophone.json';

// __localIndex = this song's index within its own space's active+sorted list
// (i.e. exactly what currentSongIndex would be on that song's home page).
// tractor-anna/saloon's background comes straight off song.ambience.background
// (song data, portable as-is) but auto/ammama/thathayya/vennallo instead cycle
// backgrounds *positionally* by currentSongIndex on their own pages — so
// __localIndex is what lets those 4 reproduce that cycling here.
const withLocalIndex = (raw) => getActiveSongs(raw).map((s, i) => ({ ...s, __localIndex: i }));

export const ALL_SONGS = [
  ...withLocalIndex(tractorAnnaSongs),
  ...withLocalIndex(autoSongs),
  ...withLocalIndex(saloonSongs),
  ...withLocalIndex(ammamaSongs),
  ...withLocalIndex(thathayyaSongs),
  ...withLocalIndex(vennalloSongs),
  ...withLocalIndex(gundammaSongs),
];

const stripEmoji = (s) => s.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

const AUTO_BACKGROUNDS = [
  "url('/images/city_perspective_road1.jpg')",
  "url('/images/city_perspective_road2.jpg')",
  "url('/images/city_perspective_road3.jpg')",
  "url('/images/city_skyline_road.webp')",
  "url('/images/city_vector_road.webp')",
];
const GRANDMA_BG_IMAGES = ['/images/grandma_1.webp', '/images/grandma_2.webp', '/images/grandma_3.webp'];
const GRANDPA_BG_IMAGES = ['/images/grandpa_1.webp', '/images/grandpa_2.webp', '/images/grandpa_3.webp'];
const VENNELA_BG_IMAGES = ['/images/vennela_1.webp', '/images/vennela_2.webp', '/images/vennela_3.webp'];
const GUNDAMMA_BG_IMAGES = ['/images/gundamma_1.webp', '/images/gundamma_2.webp', '/images/gundamma_3.webp'];

const VETURI_LYRICS = [
  "రాలిపోయే పువ్వా నీకు రాగాలెందుకే... వాడిపోయే నవ్వునకూ వీడ్కోలెందుకే...",
  "కీరవాణి రాగంలో పిలిచింది కృష్ణవేణి... ఈ వేళ నాలోన రేగింది ఏదో కీరవాణి రాగం...",
  "ఆమని పాడవే ప్రణయ గీతికా... మనసున రేగని మమతల తారక...",
  "మళ్ళీ మళ్ళీ ఇది రాని రోజు... మళ్ళీ మళ్ళీ ఈ వెలుగుల పండగ రోజు...",
  "ఓ ప్రియా ప్రియతమా... రాగాల పల్లకిలో కోయిలమ్మ పాడనీ...",
  "వేదం అణువణువున నాదం... నాదం ప్రాణపదమైన వేదం...",
  "మౌనమే నీ భాష ఓ మూగ మనసా... తలపులు ఎన్నెన్నో తపనలు ఎన్నెన్నో...",
  "ఆకాశ దేశాన ఆషాఢ మాసాన... పడిలేచే కడలి తరంగాలనడుగు...",
  "తకిట తదిమి తకిట తదిమి తందానా... హృదయలయల జతుల గతుల తందానా...",
  "తెలిమంచు కరిగింది తూరుపు కనులలో... తొలికిరణమొచ్చింది నీ నయనాలలో...",
  "గోదారి గట్టుంది గట్టు మీద చెట్టుంది... చెట్టు కొమ్మన పిట్ట పిట్ట మనసున ఏముంది...",
  "జాబిలి కోసం ఆకాశమల్లే వేచి చూశాను నీ రాక కోసం...",
  "చిలకమ్మ చిటికేయంగా చింతలన్నీ తీరిపోవా... రాగాలమ్మ రేగంగా గుండెల్లోన హాయి నిండదా...",
  "బొటనీ పాఠముంది మేటనీ ఆటనుంది... చదువుకు వెలుతుంది సరదాకు టైముంది...",
  "కమ్మని ఈ ప్రేమలేఖ రాసింది హృదయమే... ప్రియతమా నీవను రాగమే అనురాగమై...",
];
const AMMAMA_LYRICS = [
  "జో అచ్యుతానంద జోజో ముకుందా... రావె పరమానంద రామ గోవిందా...",
  "చందమామ రావే జాబిల్లి రావే... కొండెక్కి రావే గోరుముద్ద తీవే...",
  "లాలీ లాలీ జో లాలీ... లాలీ లాలీ వటపత్ర శాయీ...",
  "చిన్ని చిన్ని కలలే ఏవేవో కంటూ... వెన్నెలమ్మ ఒడిలో నిదురించు బాబు...",
  "అమ్మ ఒడి ప్రశాంతమైన ఆలయము... అమ్మ పిలుపు అమృత భాండము...",
  "గోరుముద్దలు తినిపించు అమ్మ ప్రేమ... గోవుల కాచే గోపాలుని చల్లని నీడ...",
  "జో జో లాలి జో జో లాలి... జోల పాడుతా నిదురపోవమ్మ...",
  "తెలిమంచు కరిగింది తూరుపు కనులలో... తొలికిరణమొచ్చింది నీ నయనాలలో...",
  "చిన్నారి పొన్నారి చిరునవ్వులు... చిలకమ్మ పలికిన తీయని పలుకులు...",
];

export const SPACE_THEMES = {
  'tractor-anna': {
    titleText: 'ట్రాక్టర్ అన్న',
    titleFontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif",
    weather: 'clear', particles: 'dust',
    capsuleTheme: {
      accentText: '#fbbf24', accentRgb: '245, 158, 11',
      glassBg: 'rgba(10, 11, 15, 0.45)', glassBorder: 'rgba(255, 255, 255, 0.12)',
      glassShadow: '0 25px 60px -15px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.06)',
      vinylSize: 46, vinylBorder: '4px solid #111',
      vinylRingShadow: '0 0 0 2px rgba(255,255,255,0.15), 0 8px 16px rgba(0,0,0,0.6)',
      vinylBg: '#000', spindleBg: 'rgba(18, 20, 26, 0.95)',
      artAlt: 'Album Art', fallbackEmoji: '🚜', fallbackTitle: 'Loading song…',
      titleFontSize: '1rem', secondaryColor: '#a1a1aa',
      subtitleFallback: 'Telugu Classics',
      subtitleFormat: (movie, year) => `${movie} (${year || 'Classic'})`,
      prevNextColor: 'rgba(255,255,255,0.7)', prevTitle: 'Previous Song', nextTitle: 'Next Song',
      dividerColor: 'rgba(255,255,255,0.1)',
      playIconColor: '#000', playShadow: '0 4px 14px rgba(255,255,255,0.3)',
      restoreVolume: 60, volumeTrackBg: 'rgba(255,255,255,0.15)', volumeWidth: 70,
      seekTrackBg: 'rgba(255, 255, 255, 0.12)', seekFillShadow: '0 0 8px rgba(251, 191, 36, 0.6)',
      showSeekThumb: true, showControlIconHoverClass: true,
    },
    ambientAudio: { src: '/audio/tractor_ambient.mp3', volume: 0.03, gate: 'started+ytReady' },
    getBackground: (song) => ({
      url: prefixPath(song?.ambience?.background || "url('/images/sunset_farm_background.webp')"),
      position: 'center', transitionMs: 1800,
    }),
    getQuote: () => null,
    quoteTextColor: 'rgba(254, 240, 138, 0.95)', quoteTextShadow: '0 2px 8px rgba(0,0,0,0.85)',
    quoteBorderColor: 'rgba(245, 158, 11, 0.2)',
  },
  auto: {
    titleText: 'ఆటో జానీ',
    titleFontFamily: "'Lakki Reddy', 'Ramabhadra', 'Anek Telugu', serif",
    weather: 'clear', particles: 'dust',
    capsuleTheme: {
      accentText: '#fbbf24', accentRgb: '245, 158, 11',
      glassBg: 'rgba(10, 11, 15, 0.55)', glassBorder: 'rgba(255, 255, 255, 0.14)',
      glassShadow: '0 25px 60px -15px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.08)',
      vinylSize: 46, vinylBorder: '4px solid #111',
      vinylRingShadow: '0 0 0 2px rgba(255,255,255,0.15), 0 8px 16px rgba(0,0,0,0.6)',
      vinylBg: '#000', spindleBg: 'rgba(18, 20, 26, 0.95)',
      artAlt: 'Album Art', fallbackEmoji: '🛺', fallbackTitle: 'Loading track…',
      titleFontSize: '1rem', secondaryColor: '#a1a1aa',
      subtitleFallback: 'Telugu Mass Hits',
      subtitleFormat: (movie, year) => `${movie} (${year || 'Hit'})`,
      prevNextColor: 'rgba(255,255,255,0.7)', prevTitle: 'Previous Song', nextTitle: 'Next Song',
      dividerColor: 'rgba(255,255,255,0.1)',
      playIconColor: '#000', playShadow: '0 4px 14px rgba(255,255,255,0.3)',
      restoreVolume: 60, volumeTrackBg: 'rgba(255,255,255,0.15)', volumeWidth: 70,
      seekTrackBg: 'rgba(255, 255, 255, 0.12)', seekFillShadow: '0 0 8px rgba(251, 191, 36, 0.6)',
      showSeekThumb: true, showControlIconHoverClass: true,
    },
    ambientAudio: { src: '/audio/city_ambient.mp3', volume: 0.15, gate: 'ytReady' },
    // auto's own page picks its background *positionally* (AUTO_BACKGROUNDS[currentSongIndex % 5]),
    // overriding song.ambience.background entirely — not song-data-driven like tractor-anna/saloon.
    getBackground: (song) => ({
      url: prefixPath(AUTO_BACKGROUNDS[song.__localIndex % AUTO_BACKGROUNDS.length]),
      position: 'center', transitionMs: 1800,
    }),
    getQuote: () => null,
    quoteTextColor: 'rgba(254, 240, 138, 0.95)', quoteTextShadow: '0 1px 3px rgba(0,0,0,0.5)',
    quoteBorderColor: 'rgba(245, 158, 11, 0.2)',
  },
  saloon: {
    titleText: 'రాయల్ సెలూన్',
    titleFontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif",
    weather: 'clear', particles: 'dust',
    capsuleTheme: {
      accentText: '#ffb74d', accentRgb: '255, 183, 77',
      glassBg: 'rgba(15, 17, 26, 0.65)', glassBorder: 'rgba(255, 204, 128, 0.2)',
      glassShadow: '0 25px 60px -15px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1)',
      vinylSize: 48, vinylBorder: '3px solid #2e1c16',
      vinylRingShadow: '0 0 0 2px rgba(255, 183, 77, 0.3), 0 8px 16px rgba(0,0,0,0.6)',
      vinylBg: '#000', spindleBg: '#151515',
      artAlt: 'Track Art', fallbackEmoji: '💈', fallbackTitle: 'రాయల్ సెలూన్ గీతాలు',
      titleFontSize: '1.05rem', secondaryColor: '#ffcc80',
      subtitleFallback: 'S.A. Rajkumar Melodies',
      subtitleFormat: (movie, year) => `${movie} • ${year}`,
      prevNextColor: 'rgba(255,255,255,0.8)', prevTitle: 'Previous Track', nextTitle: 'Next Track',
      dividerColor: 'rgba(255,255,255,0.12)',
      playIconColor: '#2e1c16', playShadow: '0 4px 16px rgba(255, 183, 77, 0.4)',
      restoreVolume: 50, volumeTrackBg: 'rgba(255,255,255,0.2)', volumeWidth: 65,
      seekTrackBg: 'rgba(255, 255, 255, 0.15)', seekFillShadow: '0 0 10px rgba(255, 183, 77, 0.7)',
      showSeekThumb: false, showControlIconHoverClass: false,
    },
    ambientAudio: { src: '/audio/village_ambience.mp3', volume: 0.15, gate: 'none' },
    getBackground: (song) => ({
      url: prefixPath(song?.ambience?.background || "url('/images/saloon_background.webp')"),
      position: 'center', transitionMs: 1800,
    }),
    getQuote: () => null,
  },
  ammama: {
    titleText: 'అమ్మమ్మ రేడియో',
    titleFontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif",
    weather: 'fog', particles: 'dust',
    capsuleTheme: {
      accentText: '#ffb74d', accentRgb: '255, 183, 77',
      glassBg: 'rgba(15, 17, 26, 0.65)', glassBorder: 'rgba(255, 204, 128, 0.2)',
      glassShadow: '0 25px 60px -15px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1)',
      vinylSize: 46, vinylBorder: '2px solid rgba(255,255,255,0.15)',
      vinylRingShadow: '0 4px 10px rgba(0,0,0,0.4)',
      vinylBg: '#151515', spindleBg: '#151515',
      artAlt: 'Track Art', fallbackEmoji: '📻', fallbackTitle: 'అమ్మమ్మ రేడియో గీతాలు',
      titleFontSize: '1.05rem', secondaryColor: '#ffcc80',
      subtitleFallback: 'Classic Telugu Melodies',
      subtitleFormat: (movie, year) => `${movie} • ${year}`,
      prevNextColor: 'rgba(255,255,255,0.8)', prevTitle: 'Previous Track', nextTitle: 'Next Track',
      dividerColor: 'rgba(255,255,255,0.12)',
      playIconColor: '#2e1c16', playShadow: '0 4px 16px rgba(255, 183, 77, 0.4)',
      restoreVolume: 50, volumeTrackBg: 'rgba(255,255,255,0.2)', volumeWidth: 65,
      seekTrackBg: 'rgba(255, 255, 255, 0.15)', seekFillShadow: '0 0 10px rgba(255, 183, 77, 0.7)',
      showSeekThumb: false, showControlIconHoverClass: false,
    },
    ambientAudio: { src: '/audio/grandfather_ambient.mp3', volume: 0.15, gate: 'none' },
    getBackground: (song) => ({
      url: prefixPath(`url('${GRANDMA_BG_IMAGES[song.__localIndex % GRANDMA_BG_IMAGES.length]}')`),
      position: 'center 30%', transitionMs: 1800,
    }),
    getQuote: () => null,
    quoteTextColor: '#ffcc80', quoteTextShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(255, 183, 77, 0.3)',
    quoteBorderColor: 'rgba(255, 183, 77, 0.2)',
  },
  thathayya: {
    titleText: 'తాతయ్య టేప్ రికార్డర్',
    titleFontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif",
    weather: 'fog', particles: 'dust',
    capsuleTheme: {
      accentText: '#ffb74d', accentRgb: '255, 183, 77',
      glassBg: 'rgba(15, 17, 26, 0.65)', glassBorder: 'rgba(255, 204, 128, 0.2)',
      glassShadow: '0 25px 60px -15px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1)',
      vinylSize: 48, vinylBorder: '3px solid #2e1c16',
      vinylRingShadow: '0 0 0 2px rgba(255, 183, 77, 0.3), 0 8px 16px rgba(0,0,0,0.6)',
      vinylBg: '#000', spindleBg: '#151515',
      artAlt: 'Track Art', fallbackEmoji: '📼', fallbackTitle: 'తాతయ్య టేప్ రికార్డర్ గీతాలు',
      titleFontSize: '1.05rem', secondaryColor: '#ffcc80',
      subtitleFallback: 'Ilaiyaraaja & SPB Classics',
      subtitleFormat: (movie, year) => `${movie} • ${year}`,
      prevNextColor: 'rgba(255,255,255,0.8)', prevTitle: 'Previous Track', nextTitle: 'Next Track',
      dividerColor: 'rgba(255,255,255,0.12)',
      playIconColor: '#2e1c16', playShadow: '0 4px 16px rgba(255, 183, 77, 0.4)',
      restoreVolume: 50, volumeTrackBg: 'rgba(255,255,255,0.2)', volumeWidth: 65,
      seekTrackBg: 'rgba(255, 255, 255, 0.15)', seekFillShadow: '0 0 10px rgba(255, 183, 77, 0.7)',
      showSeekThumb: false, showControlIconHoverClass: false,
    },
    ambientAudio: { src: '/audio/grandfather_ambient.mp3', volume: 0.15, gate: 'none' },
    getBackground: (song) => ({
      url: prefixPath(`url('${GRANDPA_BG_IMAGES[song.__localIndex % GRANDPA_BG_IMAGES.length]}')`),
      position: 'center 30%', transitionMs: 1800,
    }),
    getQuote: () => null,
    quoteTextColor: '#ffcc80', quoteTextShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(255, 183, 77, 0.3)',
    quoteBorderColor: 'rgba(255, 183, 77, 0.2)',
  },
  vennallo: {
    titleText: 'మేడ మీద వెన్నెల్లో',
    titleFontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif",
    weather: 'clear', particles: 'stars',
    capsuleTheme: {
      accentText: '#818cf8', accentRgb: '129, 140, 248',
      glassBg: 'rgba(10, 12, 26, 0.7)', glassBorder: 'rgba(129, 140, 248, 0.2)',
      glassShadow: '0 25px 60px -15px rgba(0,0,0,0.85), inset 0 1px 1px rgba(255,255,255,0.08)',
      vinylSize: 48, vinylBorder: '3px solid #1e2238',
      vinylRingShadow: '0 0 0 2px rgba(129, 140, 248, 0.3), 0 8px 16px rgba(0,0,0,0.6)',
      vinylBg: '#000', spindleBg: '#0d0e1a',
      artAlt: 'Track Art', fallbackEmoji: '🌌', fallbackTitle: 'వెన్నెల్లో మైమరపు గీతాలు',
      titleFontSize: '1.05rem', secondaryColor: '#a5b4fc',
      subtitleFallback: 'Nostalgic Night Melodies',
      subtitleFormat: (movie, year) => `${movie} • ${year}`,
      prevNextColor: 'rgba(255,255,255,0.8)', prevTitle: 'Previous Track', nextTitle: 'Next Track',
      dividerColor: 'rgba(255,255,255,0.12)',
      playIconColor: '#0f111a', playShadow: '0 4px 16px rgba(129, 140, 248, 0.4)',
      restoreVolume: 50, volumeTrackBg: 'rgba(255,255,255,0.2)', volumeWidth: 65,
      seekTrackBg: 'rgba(255, 255, 255, 0.15)', seekFillShadow: '0 0 10px rgba(129, 140, 248, 0.7)',
      showSeekThumb: false, showControlIconHoverClass: false,
    },
    ambientAudio: { src: '/audio/night_sky_ambience.mp3', volume: 0.12, gate: 'none' },
    getBackground: (song) => ({
      url: prefixPath(`url('${VENNELA_BG_IMAGES[song.__localIndex % VENNELA_BG_IMAGES.length]}')`),
      position: 'center 40%', transitionMs: 2000,
    }),
    getQuote: () => null,
  },
  'gundamma-gramophone': {
    titleText: 'గుండమ్మ గ్రామ్‌ఫోన్',
    titleFontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif",
    weather: 'fog', particles: 'dust',
    capsuleTheme: {
      accentText: '#f59e0b', accentRgb: '245, 158, 11',
      glassBg: 'rgba(24, 18, 12, 0.85)', glassBorder: 'rgba(245, 158, 11, 0.3)',
      glassShadow: '0 25px 60px -15px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.12)',
      vinylSize: 48, vinylBorder: '3px solid #451a03',
      vinylRingShadow: '0 0 0 2px rgba(245, 158, 11, 0.3), 0 8px 16px rgba(0,0,0,0.7)',
      vinylBg: '#000', spindleBg: '#1c1917',
      artAlt: 'Track Art', fallbackEmoji: '🎷', fallbackTitle: 'గుండమ్మ గ్రామ్‌ఫోన్ గీతాలు',
      titleFontSize: '1.05rem', secondaryColor: '#fde68a',
      subtitleFallback: '70s & 80s Golden Telugu Classics',
      subtitleFormat: (movie, year) => `${movie} • ${year}`,
      prevNextColor: 'rgba(255,255,255,0.85)', prevTitle: 'Previous Track', nextTitle: 'Next Track',
      dividerColor: 'rgba(255,255,255,0.15)',
      playIconColor: '#451a03', playShadow: '0 4px 16px rgba(245, 158, 11, 0.5)',
      restoreVolume: 50, volumeTrackBg: 'rgba(255,255,255,0.2)', volumeWidth: 65,
      seekTrackBg: 'rgba(255, 255, 255, 0.15)', seekFillShadow: '0 0 10px rgba(245, 158, 11, 0.8)',
      showSeekThumb: false, showControlIconHoverClass: false,
    },
    ambientAudio: { src: '/audio/grandfather_ambient.mp3', volume: 0.15, gate: 'none' },
    getBackground: (song) => ({
      url: prefixPath(`url('${GUNDAMMA_BG_IMAGES[song.__localIndex % GUNDAMMA_BG_IMAGES.length]}')`),
      position: 'center 30%', transitionMs: 1800,
    }),
    getQuote: (song) => song.quote,
    quoteTextColor: '#fde68a', quoteTextShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(245, 158, 11, 0.4)',
    quoteBorderColor: 'rgba(245, 158, 11, 0.3)',
  },
};
