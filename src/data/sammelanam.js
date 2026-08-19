// Song pool + per-space theming for the Sammelanam (సమ్మేళనం) "random" space —
// see src/app/spaces/sammelanam/page.js. Merges all other spaces' catalogs
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
import campfireSongs from '@/data/songs/campfire-jamming.json';
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
  ...withLocalIndex(campfireSongs),
  ...withLocalIndex(gundammaSongs),
];

const stripEmoji = (s) => s.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

const AUTO_BG_IMAGES = [
  "url('/images/city_perspective_road.jpg')",
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

export const SPACE_THEMES = {
  'tractor-anna': {
    titleText: 'ట్రాక్టర్ అన్న',
    titleFontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif",
    weather: 'clear', particles: 'dust',
    capsuleTheme: {
      accentText: '#10b981', accentRgb: '16, 185, 129',
      glassBg: 'rgba(20, 20, 20, 0.85)', glassBorder: 'rgba(255, 255, 255, 0.1)',
      glassShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      vinylSize: 44, vinylBorder: '3px solid #10b981',
      vinylRingShadow: '0 0 0 2px rgba(16,185,129,0.3), 0 8px 16px rgba(0,0,0,0.6)',
      vinylBg: '#0a0a0a', spindleBg: '#222',
      artAlt: 'Album Art', fallbackEmoji: '🚜', fallbackTitle: 'పల్లెటూరి పాటలు',
      titleFontSize: '1rem', secondaryColor: '#9ca3af',
      subtitleFallback: 'Palletoori Melodies',
      subtitleFormat: (movie) => movie,
      prevNextColor: 'rgba(255,255,255,0.7)', prevTitle: 'Previous Track', nextTitle: 'Next Track',
      dividerColor: 'rgba(255, 255, 255, 0.1)',
      playIconColor: '#000', playShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
      restoreVolume: 50, volumeTrackBg: 'rgba(255, 255, 255, 0.2)', volumeWidth: 60,
      seekTrackBg: 'rgba(255, 255, 255, 0.1)', seekFillShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
      showSeekThumb: true, showControlIconHoverClass: true,
    },
    ambientAudio: { src: '/audio/tractor_engine.mp3', volume: 0.18, gate: 'playOnly' },
    getBackground: (song) => ({
      url: prefixPath(song.ambience?.background || "url('/images/sunset_farm_background.png')"),
      position: 'center bottom', transitionMs: 800,
    }),
    getQuote: (song) => song.quote ? stripEmoji(song.quote) : null,
    quoteTextColor: '#ffdd80', quoteTextShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(255, 221, 128, 0.4)',
    quoteBorderColor: 'rgba(255, 221, 128, 0.2)',
  },

  'auto': {
    titleText: 'ఆటో జానీ',
    titleFontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif",
    weather: 'clear', particles: 'dust',
    capsuleTheme: {
      accentText: '#eab308', accentRgb: '234, 179, 8',
      glassBg: 'rgba(20, 20, 20, 0.85)', glassBorder: 'rgba(255, 255, 255, 0.1)',
      glassShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      vinylSize: 44, vinylBorder: '3px solid #eab308',
      vinylRingShadow: '0 0 0 2px rgba(234,179,8,0.3), 0 8px 16px rgba(0,0,0,0.6)',
      vinylBg: '#0a0a0a', spindleBg: '#222',
      artAlt: 'Album Art', fallbackEmoji: '🛺', fallbackTitle: 'మాస్ మసాలా పాటలు',
      titleFontSize: '1rem', secondaryColor: '#9ca3af',
      subtitleFallback: 'Mass Melodies',
      subtitleFormat: (movie) => movie,
      prevNextColor: 'rgba(255,255,255,0.7)', prevTitle: 'Previous Track', nextTitle: 'Next Track',
      dividerColor: 'rgba(255, 255, 255, 0.1)',
      playIconColor: '#000', playShadow: '0 4px 12px rgba(234, 179, 8, 0.4)',
      restoreVolume: 50, volumeTrackBg: 'rgba(255, 255, 255, 0.2)', volumeWidth: 60,
      seekTrackBg: 'rgba(255, 255, 255, 0.1)', seekFillShadow: '0 0 8px rgba(234, 179, 8, 0.6)',
      showSeekThumb: true, showControlIconHoverClass: true,
    },
    ambientAudio: { src: '/audio/auto_rickshaw_engine.mp3', volume: 0.15, gate: 'playOnly' },
    getBackground: (song) => ({
      url: prefixPath(AUTO_BG_IMAGES[song.__localIndex % AUTO_BG_IMAGES.length]),
      position: 'center bottom', transitionMs: 800,
    }),
    getQuote: (song) => song.quote ? stripEmoji(song.quote) : null,
    quoteTextColor: '#fde047', quoteTextShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(253, 224, 71, 0.4)',
    quoteBorderColor: 'rgba(253, 224, 71, 0.2)',
  },

  'saloon': {
    titleText: 'రాయల్ సెలూన్',
    titleFontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif",
    weather: 'clear', particles: 'dust',
    capsuleTheme: {
      accentText: '#38bdf8', accentRgb: '56, 189, 248',
      glassBg: 'rgba(15, 23, 42, 0.85)', glassBorder: 'rgba(255, 255, 255, 0.1)',
      glassShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      vinylSize: 44, vinylBorder: '3px solid #38bdf8',
      vinylRingShadow: '0 0 0 2px rgba(56,189,248,0.3), 0 8px 16px rgba(0,0,0,0.6)',
      vinylBg: '#0a0a0a', spindleBg: '#222',
      artAlt: 'Album Art', fallbackEmoji: '💈', fallbackTitle: 'సెలూన్ క్లాసిక్స్',
      titleFontSize: '1rem', secondaryColor: '#94a3b8',
      subtitleFallback: 'Saloon Classics',
      subtitleFormat: (movie) => movie,
      prevNextColor: 'rgba(255,255,255,0.7)', prevTitle: 'Previous Track', nextTitle: 'Next Track',
      dividerColor: 'rgba(255, 255, 255, 0.1)',
      playIconColor: '#000', playShadow: '0 4px 12px rgba(56, 189, 248, 0.4)',
      restoreVolume: 50, volumeTrackBg: 'rgba(255, 255, 255, 0.2)', volumeWidth: 60,
      seekTrackBg: 'rgba(255, 255, 255, 0.1)', seekFillShadow: '0 0 8px rgba(56, 189, 248, 0.6)',
      showSeekThumb: true, showControlIconHoverClass: true,
    },
    ambientAudio: { src: '/audio/saloon_fan_white_noise.mp3', volume: 0.12, gate: 'none' },
    getBackground: (song) => ({
      url: prefixPath(song.ambience?.background || "url('/images/saloon_background.jpg')"),
      position: 'center bottom', transitionMs: 800,
    }),
    getQuote: (song) => song.quote ? stripEmoji(song.quote) : null,
    quoteTextColor: '#7dd3fc', quoteTextShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(125, 211, 252, 0.4)',
    quoteBorderColor: 'rgba(125, 211, 252, 0.2)',
  },

  'ammama': {
    titleText: 'అమ్మమ్మ రేడియో',
    titleFontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif",
    weather: 'fog', particles: 'dust',
    capsuleTheme: {
      accentText: '#fb923c', accentRgb: '251, 146, 60',
      glassBg: 'rgba(23, 14, 11, 0.85)', glassBorder: 'rgba(255, 183, 77, 0.2)',
      glassShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      vinylSize: 44, vinylBorder: '3px solid #e65100',
      vinylRingShadow: '0 0 0 2px rgba(255,183,77,0.3), 0 8px 16px rgba(0,0,0,0.7)',
      vinylBg: '#0d0806', spindleBg: '#2d1810',
      artAlt: 'Track Art', fallbackEmoji: '📻', fallbackTitle: 'అమ్మమ్మ రేడియో పాటలు',
      titleFontSize: '1rem', secondaryColor: '#ffcc80',
      subtitleFallback: 'Evergreen Radio Melodies',
      subtitleFormat: (movie, year) => `${movie} • ${year}`,
      prevNextColor: 'rgba(255,255,255,0.8)', prevTitle: 'Previous Track', nextTitle: 'Next Track',
      dividerColor: 'rgba(255, 255, 255, 0.1)',
      playIconColor: '#3e1500', playShadow: '0 4px 14px rgba(245, 124, 0, 0.5)',
      restoreVolume: 50, volumeTrackBg: 'rgba(255, 255, 255, 0.2)', volumeWidth: 60,
      seekTrackBg: 'rgba(255, 255, 255, 0.15)', seekFillShadow: '0 0 10px rgba(255, 183, 77, 0.8)',
      showSeekThumb: false, showControlIconHoverClass: false,
    },
    ambientAudio: { src: '/audio/grandfather_ambient.mp3', volume: 0.15, gate: 'none' },
    getBackground: (song) => ({
      url: prefixPath(`url('${GRANDMA_BG_IMAGES[song.__localIndex % GRANDMA_BG_IMAGES.length]}')`),
      position: 'center 30%', transitionMs: 1800,
    }),
    getQuote: (song) => VETURI_LYRICS[song.__localIndex % VETURI_LYRICS.length],
    quoteTextColor: '#ffcc80', quoteTextShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(255, 183, 77, 0.3)',
    quoteBorderColor: 'rgba(255, 183, 77, 0.2)',
  },

  'thathayya': {
    titleText: 'తాతయ్య టేప్ రికార్డర్',
    titleFontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif",
    weather: 'fog', particles: 'dust',
    capsuleTheme: {
      accentText: '#ffb74d', accentRgb: '255, 183, 77',
      glassBg: 'rgba(20, 16, 12, 0.85)', glassBorder: 'rgba(255, 204, 128, 0.25)',
      glassShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.12)',
      vinylSize: 48, vinylBorder: '3px solid #ff9800',
      vinylRingShadow: '0 0 0 2px rgba(255,183,77,0.35), 0 8px 16px rgba(0,0,0,0.7)',
      vinylBg: '#000', spindleBg: '#2c1e11',
      artAlt: 'Tape Art', fallbackEmoji: '📼', fallbackTitle: 'తాతయ్య పాటలు',
      titleFontSize: '1.05rem', secondaryColor: '#ffe0b2',
      subtitleFallback: 'Tape Recorder Melodies',
      subtitleFormat: (movie, year) => `${movie} • ${year}`,
      prevNextColor: 'rgba(255,255,255,0.85)', prevTitle: 'Previous Track', nextTitle: 'Next Track',
      dividerColor: 'rgba(255, 255, 255, 0.15)',
      playIconColor: '#2c1400', playShadow: '0 4px 16px rgba(255, 152, 0, 0.5)',
      restoreVolume: 50, volumeTrackBg: 'rgba(255, 255, 255, 0.2)', volumeWidth: 65,
      seekTrackBg: 'rgba(255, 255, 255, 0.15)', seekFillShadow: '0 0 10px rgba(255, 183, 77, 0.8)',
      showSeekThumb: false, showControlIconHoverClass: false,
    },
    ambientAudio: { src: '/audio/grandfather_ambient.mp3', volume: 0.15, gate: 'none' },
    getBackground: (song) => ({
      url: prefixPath(`url('${GRANDPA_BG_IMAGES[song.__localIndex % GRANDPA_BG_IMAGES.length]}')`),
      position: 'center 30%', transitionMs: 1800,
    }),
    getQuote: (song) => VETURI_LYRICS[song.__localIndex % VETURI_LYRICS.length],
    quoteTextColor: '#ffcc80', quoteTextShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(255, 183, 77, 0.3)',
    quoteBorderColor: 'rgba(255, 183, 77, 0.2)',
  },

  'vennallo': {
    titleText: 'మేడ మీద వెన్నెల్లో',
    titleFontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif",
    weather: 'clear', particles: 'stars',
    capsuleTheme: {
      accentText: '#818cf8', accentRgb: '129, 140, 248',
      glassBg: 'rgba(10, 14, 28, 0.85)', glassBorder: 'rgba(129, 140, 248, 0.25)',
      glassShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.12)',
      vinylSize: 48, vinylBorder: '3px solid #4338ca',
      vinylRingShadow: '0 0 0 2px rgba(129,140,248,0.35), 0 8px 16px rgba(0,0,0,0.7)',
      vinylBg: '#000', spindleBg: '#1e1b4b',
      artAlt: 'Moon Art', fallbackEmoji: '🌌', fallbackTitle: 'వెన్నెల్లో పాటలు',
      titleFontSize: '1.05rem', secondaryColor: '#c7d2fe',
      subtitleFallback: 'Midnight Melodies',
      subtitleFormat: (movie, year) => `${movie} • ${year}`,
      prevNextColor: 'rgba(255,255,255,0.85)', prevTitle: 'Previous Track', nextTitle: 'Next Track',
      dividerColor: 'rgba(255, 255, 255, 0.15)',
      playIconColor: '#1e1b4b', playShadow: '0 4px 16px rgba(99, 102, 241, 0.5)',
      restoreVolume: 50, volumeTrackBg: 'rgba(255, 255, 255, 0.2)', volumeWidth: 65,
      seekTrackBg: 'rgba(255, 255, 255, 0.15)', seekFillShadow: '0 0 10px rgba(129, 140, 248, 0.8)',
      showSeekThumb: false, showControlIconHoverClass: false,
    },
    ambientAudio: { src: '/audio/night_sky_ambience.mp3', volume: 0.12, gate: 'none' },
    getBackground: (song) => ({
      url: prefixPath(`url('${VENNELA_BG_IMAGES[song.__localIndex % VENNELA_BG_IMAGES.length]}')`),
      position: 'center 30%', transitionMs: 1800,
    }),
    getQuote: (song) => VETURI_LYRICS[song.__localIndex % VETURI_LYRICS.length],
    quoteTextColor: '#c7d2fe', quoteTextShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(129, 140, 248, 0.4)',
    quoteBorderColor: 'rgba(129, 140, 248, 0.3)',
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

  'campfire-jamming': {
    titleText: 'క్యాంప్ ఫైర్ జామ్మింగ్',
    titleFontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif",
    weather: 'clear', particles: 'stars',
    capsuleTheme: {
      accentText: '#ff9800', accentRgb: '255, 152, 0',
      glassBg: 'rgba(15, 12, 10, 0.85)', glassBorder: 'rgba(255, 152, 0, 0.3)',
      glassShadow: '0 25px 60px -15px rgba(0,0,0,0.95), inset 0 1px 1px rgba(255,255,255,0.15)',
      vinylSize: 48, vinylBorder: '3px solid #3e1b00',
      vinylRingShadow: '0 0 0 2px rgba(255, 152, 0, 0.4), 0 8px 16px rgba(0,0,0,0.8)',
      vinylBg: '#000', spindleBg: '#1a0c00',
      artAlt: 'Track Art', fallbackEmoji: '🔥', fallbackTitle: 'క్యాంప్ ఫైర్ జామ్మింగ్',
      titleFontSize: '1.05rem', secondaryColor: '#ffcc80',
      subtitleFallback: 'Campfire Jamming Hits',
      subtitleFormat: (movie, year) => `${movie} • ${year}`,
      prevNextColor: 'rgba(255,255,255,0.9)', prevTitle: 'Previous Track', nextTitle: 'Next Track',
      dividerColor: 'rgba(255,255,255,0.15)',
      playIconColor: '#2b1000', playShadow: '0 4px 18px rgba(255, 152, 0, 0.6)',
      restoreVolume: 50, volumeTrackBg: 'rgba(255,255,255,0.2)', volumeWidth: 65,
      seekTrackBg: 'rgba(255, 255, 255, 0.2)', seekFillShadow: '0 0 12px rgba(255, 152, 0, 0.9)',
      showSeekThumb: false, showControlIconHoverClass: false,
    },
    ambientAudio: { src: '/audio/night_sky_ambience.mp3', volume: 0.10, gate: 'none' },
    getBackground: () => ({
      url: prefixPath("url('/images/vennela_1.webp')"),
      position: 'center', transitionMs: 2000,
    }),
    getQuote: () => null,
  },
};
