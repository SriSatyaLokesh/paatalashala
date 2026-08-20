'use client';

import { useSpacePlayer } from '@/hooks/useSpacePlayer';
import { useSpaceKeyboardShortcuts } from '@/hooks/useSpaceKeyboardShortcuts';
import placeSongs from '@/data/songs/ammama.json';
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

const BG_IMAGES = ['/images/grandma_1.webp', '/images/grandma_2.webp', '/images/grandma_3.webp'];

const AMMAMA_LYRICS = [
  "జో అచ్యుతానంద జోజో ముకుందా... రావె పరమానంద రామ గోవిందా...",
  "చందమామ రావే జాబిల్లి రావే... కొండెక్కి రావే గోరుముద్ద తీవే...",
  "లాలీ లాలీ జో లాలీ... లాలీ లాలీ వటపత్ర శాయీ...",
  "చిన్ని చిన్ని కలలే ఏవేవో కంటూ... వెన్నెలమ్మ ఒడిలో నిదురించు బాబు...",
  "అమ్మ ఒడి ప్రశాంతమైన ఆలయము... అమ్మ పిలుపు అమృత భాండము...",
  "గోరుముద్దలు తినిపించు అమ్మ ప్రేమ... గోవుల కాచే గోపాలుని చల్లని నీడ...",
  "జో జో లాలి జో జో లాలి... జోల పాడుతా నిదురపోవమ్మ...",
  "తెలిమంచు కరిగింది తూరుపు కనులలో... తొలికిరణమొచ్చింది నీ నయనాలలో...",
  "చిన్నారి పొన్నారి చిరునవ్వులు... చిలకమ్మ పలికిన తీయని పలుకులు..."
];

const AMBIENT_AUDIO = { src: '/audio/grandfather_ambient.mp3', volume: 0.15, gate: 'none' };
const PRESENCE_CONFIG = { channel: 'presence-ammama', base: 28, sineAmp: 3, cosAmp: 1, syncPad: 9, catchSpread: 8, catchOffset: 4 };
const AUTO_SKIP = { enabled: true };

const CAPSULE_THEME = {
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
};

export default function AmmamaRadio() {
  const player = useSpacePlayer(placeSongs, {
    initialVolume: 50,
    ambientAudio: AMBIENT_AUDIO,
    presence: PRESENCE_CONFIG,
    autoSkipOnError: AUTO_SKIP,
    backgroundImage: (song, index) => ({
      url: prefixPath(`url('${BG_IMAGES[index !== null ? index % BG_IMAGES.length : 0]}')`),
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
  });

  const currentLyric = currentSongIndex !== null ? AMMAMA_LYRICS[currentSongIndex % AMMAMA_LYRICS.length] : '';

  return (
    <div style={{ minHeight: '100dvh', width: '100vw', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
      <RadialVignette innerColor="rgba(15, 23, 42, 0.2)" outerColor="rgba(15, 23, 42, 0.65)" />

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
          అమ్మమ్మ రేడియో
        </h2>
      </div>

      <div style={{ zIndex: 20, width: '100%', maxWidth: '680px', margin: '0 auto 24px', padding: '0 20px', display: 'flex', flexDirection: 'column' }}>
        <QuoteDisplay
          variant="box"
          text={currentLyric}
          textColor="#ffcc80"
          textShadow="0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(255, 183, 77, 0.3)"
          borderColor="rgba(255, 183, 77, 0.2)"
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
        background="rgba(15, 17, 26, 0.7)"
        border="rgba(255, 204, 128, 0.25)"
        iconColor="#ffb74d"
      />

      <style jsx global>{`
        @media (max-width: 768px) {
          .immersive-title { font-size: 2.2rem !important; }
          .btn-label { font-size: 0.7rem !important; }
        }
      `}</style>
    </div>
  );
}
