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
  "చిగురాకుల శిలకమ్మ చిన్ని గుండె అలసిందో...",
  "నా పాట నీ నోట పలకాల చిలకా... నీ చిన్న నవ్వులో మెరవాలి కనుకా..."
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

      <div style={{ position: 'absolute', top: '12vh', left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', userSelect: 'none', padding: '0 24px', zIndex: 5 }} className="immersive-title-container">
        <h2 style={{ fontSize: '4.8rem', fontWeight: '900', letterSpacing: '0.04em', color: '#fff', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.75)', fontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif", textAlign: 'center' }} className="immersive-title">
          గుండమ్మ గ్రామ్‌ఫోన్
        </h2>
      </div>

      <div style={{ zIndex: 20, width: '100%', maxWidth: '680px', margin: '0 auto 24px', padding: '0 20px', display: 'flex', flexDirection: 'column' }}>
        <QuoteDisplay
          variant="box"
          text={currentLyric}
          textColor="#fde68a"
          textShadow="0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(245, 158, 11, 0.4)"
          borderColor="rgba(245, 158, 11, 0.3)"
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
        textColor="#ffe0b2"
        background="rgba(24, 18, 12, 0.7)"
        border="rgba(245, 158, 11, 0.25)"
        iconColor="#f59e0b"
      />
    </div>
  );
}
