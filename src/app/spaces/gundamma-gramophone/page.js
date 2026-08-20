'use client';

import { useSpacePlayer } from '@/hooks/useSpacePlayer';
import { useSpaceKeyboardShortcuts } from '@/hooks/useSpaceKeyboardShortcuts';
import placeSongs from '@/data/songs/gundamma-gramophone.json';
import { prefixPath } from '@/utils/paths';
import SpaceHudHeader from '@/components/space/SpaceHudHeader';
import FloatingYouTubePlayer from '@/components/space/FloatingYouTubePlayer';
import PlayerErrorBanner from '@/components/space/PlayerErrorBanner';
import PlayerCapsule from '@/components/space/PlayerCapsule';
import QuoteDisplay from '@/components/space/QuoteDisplay';
import RadialVignette from '@/components/space/RadialVignette';
import { ListenersBadgeSingle } from '@/components/space/ListenersBadge';
import AmbientWeather from '@/components/AmbientWeather';
import { Tv } from 'lucide-react';

const BG_IMAGES = ['/images/gundamma_1.webp', '/images/gundamma_2.webp', '/images/gundamma_3.webp'];

const VINTAGE_TELUGU_LYRICS = [
  "తెలిసిందిలే తెలిసిందిలే నెలరాజ నీరూపు తెలిసిందిలే...",
  "పగలే వెన్నెల జగమే ఊయల... కదలే ఆశల కంటెను కోరికల...",
  "లహిరి లాహిరి లాహిరిలో ఓడల సాగెను శోభనలో...",
  "రావోయి చందమామ మా వింత గాథ వినుమా...",
  "ఎన్నెన్నో జన్మల బంధం నీదీ నాదీ... ఎన్నో రాత్రుల అనుబంధం...",
  "ఆకాశ వీధిలో హాయిగా ఎగిరేవు... దేశ దేశాలన్నీ చూసి వస్తావు...",
  "చిగురాకుల చిలకమ్మ చిన్ని గుండె అలసిందో...",
  "నా పాట నీ నోట పలకాల చిలకా... నీ చిన్న నవ్వులో మెరవాలి కనుకా...",
  "మనసున మనసై బ్రతుకున బ్రతుకై తోడొకరుండాలి...",
  "జగమే మాయ బ్రతుకే మాయ వేదాల సారమింతేనయా...",
  "కుడి ఎడమైతే పొరపాటు లేదురా... లోకం పోకడ ఇంతేరా...",
  "బొమ్మను చేసి ప్రాణము పోసి ఆడేవు నీకిది వేడుకగా...",
  "ఉందిలే మంచి కాలం ముందు ముందనా... అందరూ ఒక్కటై నిలవాలనా...",
  "రాలిపోయే పువ్వా నీకు రాగాలెందుకే... వాడిపోయే నవ్వునకూ వీడ్కోలెందుకే...",
  "మౌనమే నీ భాష ఓ మూగ మనసా... తలపులు ఎన్నెన్నో తపనలు ఎన్నెన్నో...",
  "సరిగాంచు చీర కట్టి సువ్వి సువ్వమ్మ... ముత్యాల ముగ్గులేసి మురిసే ముత్యమ్మ...",
  "ఏ దివిలో విరిసిన పారిజాతమో... ఏ కవిలో వెలసిన అమర గీతమో...",
  "శ్రీరస్తు శుభమస్తు శ్రీకారం చుట్టుకుంది శ్రీవారి కాపురం...",
  "ఆడవే హంసగమన... పాడవే మోహన రాగము...",
  "ఓ వసంత కోకిలా... నవ జీవన గీతిక పాడవా...",
  "పూజలు సేయగా పువ్వులు పూసెను పుణ్యాలన్నీ పండేను...",
  "నన్ను దోచుకుందువటే వన్నెల దొరసానీ...",
  "ముద్దబంతి పూవులో మూగకళ్ళ ఊసులో... ఎన్నెన్నో అందాలు దాగివున్నవి...",
  "నీవు లేక వీణా మూగబోయెను... తీగ తెగిన తంబూరై మనసు రోదించెను...",
  "కళ్ళల్లో పెళ్ళి పందిరి... గుండెల్లో వేల సన్నాయి రాగాలు...",
  "ఎవరి కోసం ఈ మౌనము... ఎవరి కొరకు ఈ విరహము...",
  "వేణువై వచ్చాను భువనానికి... గాలినై పోతాను గగనానికి...",
  "మల్లెల వేళాయె రావేలా ఓ చందమామ...",
  "ఓ బంగారు రంగుల చిలకా... పలకవే నా పైరగాలికి...",
  "సడిసేయకో గాలి సడిసేయకే... బడలికతో నా స్వామి ఒడిలోన నిదురించే..."
];

const AMBIENT_AUDIO = { src: '/audio/grandfather_ambient.mp3', volume: 0.15, gate: 'none' };
const PRESENCE_CONFIG = { channel: 'presence-gundamma-gramophone', base: 42, sineAmp: 4, cosAmp: 2, syncPad: 8, catchSpread: 10, catchOffset: 5 };
const AUTO_SKIP = { enabled: true };

const CAPSULE_THEME = {
  accentText: '#f59e0b', accentRgb: '245, 158, 11',
  glassBg: 'rgba(24, 18, 12, 0.85)', glassBorder: 'rgba(245, 158, 11, 0.3)',
  glassShadow: '0 25px 60px -15px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.12)',
  vinylSize: 48, vinylBorder: '3px solid #451a03',
  vinylRingShadow: '0 0 0 2px rgba(245, 158, 11, 0.3), 0 8px 16px rgba(0,0,0,0.7)',
  vinylBg: '#000', spindleBg: '#1c1917',
  artAlt: 'Track Art', fallbackEmoji: '🎷', fallbackTitle: 'గుండమ్మ గారి గ్రామ్‌ఫోన్ గీతాలు',
  titleFontSize: '1.05rem', secondaryColor: '#fde68a',
  subtitleFallback: '70s & 80s Golden Telugu Classics',
  subtitleFormat: (movie, year) => `${movie} • ${year}`,
  prevNextColor: 'rgba(255,255,255,0.85)', prevTitle: 'Previous Track', nextTitle: 'Next Track',
  dividerColor: 'rgba(255,255,255,0.15)',
  playIconColor: '#451a03', playShadow: '0 4px 16px rgba(245, 158, 11, 0.5)',
  restoreVolume: 50, volumeTrackBg: 'rgba(255,255,255,0.2)', volumeWidth: 65,
  seekTrackBg: 'rgba(255, 255, 255, 0.15)', seekFillShadow: '0 0 10px rgba(245, 158, 11, 0.8)',
  showSeekThumb: false, showControlIconHoverClass: false,
};

export default function GundammaGramophone() {
  const player = useSpacePlayer(placeSongs, {
    initialVolume: 50,
    ambientAudio: AMBIENT_AUDIO,
    presence: PRESENCE_CONFIG,
    autoSkipOnError: AUTO_SKIP,
    backgroundImage: (_, idx) => ({
      url: prefixPath(`url('${BG_IMAGES[idx % BG_IMAGES.length]}')`),
      position: 'center 30%',
      transitionMs: 1800,
    }),
  });

  const {
    currentSong, currentSongIndex, isPlaying, volume, currentTime, duration, presenceCount, timeString,
    ambientOn, setAmbientOn, playerError, isShuffle, setIsShuffle, seekHovered, setSeekHovered,
    volumeHovered, setVolumeHovered, showShuffleHint, videoVisible, setVideoVisible,
    handlePlayerReady, handlePlayerError, handleStateChange, handleTimeUpdate,
    togglePlay, next, prev, seek, seekBy, changeVolume, fmt,
  } = player;

  useSpaceKeyboardShortcuts({
    onTogglePlay: togglePlay, onNext: next, onPrev: prev, onChangeVolume: changeVolume,
    onSeekBy: seekBy,
    volume, restoreVolume: CAPSULE_THEME.restoreVolume,
    toggleShuffle: () => setIsShuffle(prev => !prev),
  });

  const currentLyric = currentSongIndex !== null ? VINTAGE_TELUGU_LYRICS[currentSongIndex % VINTAGE_TELUGU_LYRICS.length] : '';

  return (
    <div style={{ minHeight: '100dvh', width: '100vw', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
      <RadialVignette innerColor="rgba(24, 18, 12, 0.2)" outerColor="rgba(24, 18, 12, 0.75)" />

      <AmbientWeather weather="fog" particles="dust" active={isPlaying && ambientOn} />

      <FloatingYouTubePlayer
        videoVisible={videoVisible}
        videoId={currentSong?.youtubeVideoId}
        isPlaying={isPlaying}
        volume={volume}
        onStateChange={handleStateChange}
        onPlayerReady={handlePlayerReady}
        onTimeUpdate={handleTimeUpdate}
        onError={handlePlayerError}
        trackTitle={currentSong?.title}
        trackArtist={currentSong?.artist}
        trackAlbum={currentSong?.movie}
        onPrev={prev}
        onNext={next}
        onPlayPause={togglePlay}
      />

      {playerError && (
        <PlayerErrorBanner code={playerError} formatMessage={(code) => (
          code === 150 || code === 101 ? '⚠ Embedding restricted on localhost (Auto-skipping...)' : `⚠ Video Error: ${code}`
        )} />
      )}

      <SpaceHudHeader
        timeString={timeString}
        ambientOn={ambientOn}
        onToggleAmbient={() => setAmbientOn(a => !a)}
        videoVisible={videoVisible}
        onToggleVideo={() => setVideoVisible(v => !v)}
        accentText={CAPSULE_THEME.accentText}
        accentRgb={CAPSULE_THEME.accentRgb}
        VideoIcon={Tv}
        className="hud-top-header"
      />

      <div style={{ position: 'absolute', top: '10vh', left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', userSelect: 'none', padding: '0 24px', zIndex: 5 }} className="immersive-title-container">
        <h2 style={{ fontSize: '4.6rem', fontWeight: '900', letterSpacing: '0.04em', color: '#fff', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.85), 0 0 30px rgba(245, 158, 11, 0.45)', fontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif", textAlign: 'center' }} className="immersive-title">
          గుండమ్మ గారి గ్రామ్‌ఫోన్
        </h2>
      </div>

      <div style={{ zIndex: 20, width: '100%', maxWidth: '680px', margin: '0 auto 24px', padding: '0 20px', display: 'flex', flexDirection: 'column' }}>
        <QuoteDisplay
          variant="box"
          text={currentLyric}
          textColor="#fde68a"
          textShadow="0 2px 4px rgba(0,0,0,0.9), 0 0 12px rgba(245, 158, 11, 0.5)"
          borderColor="rgba(245, 158, 11, 0.35)"
          fontFamily="'Akaya Telivigala', 'Gurajada', serif"
        />

        <PlayerCapsule
          theme={CAPSULE_THEME}
          currentSong={currentSong}
          isPlaying={isPlaying} onTogglePlay={togglePlay}
          isShuffle={isShuffle} onToggleShuffle={() => setIsShuffle(prev => !prev)} showShuffleHint={showShuffleHint}
          onPrev={prev} onNext={next}
          volume={volume} onChangeVolume={changeVolume} volumeHovered={volumeHovered} onVolumeHoverChange={setVolumeHovered}
          currentTime={currentTime} duration={duration} onSeek={seek} seekHovered={seekHovered} onSeekHoverChange={setSeekHovered} fmt={fmt}
        />
      </div>

      <ListenersBadgeSingle
        count={presenceCount}
        label="listeners"
        textColor="#fde68a"
        background="rgba(24, 18, 12, 0.75)"
        border="rgba(245, 158, 11, 0.3)"
        iconColor="#f59e0b"
      />

      <style jsx global>{`
        @media (max-width: 768px) {
          .immersive-title { font-size: 2.3rem !important; }
          .btn-label { font-size: 0.7rem !important; }
          .immersive-title-container { top: 9vh !important; }
        }
      `}</style>
    </div>
  );
}
