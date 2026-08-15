'use client';

// Renders whatever quote/lyric text a page passes it — the page decides the
// text source (song.quote vs. a local hardcoded lyric array indexed by
// currentSongIndex) and, for 'pill'/'bare', whether it's already emoji-
// stripped. Three variants found across the spaces:
// - 'bare' (tractor): plain centered <p>, no visible quote marks.
// - 'pill' (auto): rounded glass pill wrapper around the same <p> style.
// - 'box' (ammama, thathayya): a smaller rounded box with literal "quote marks".
export default function QuoteDisplay({ variant, text, fontFamily, textColor, textShadow, borderColor }) {
  if (!text) return null;

  if (variant === 'box') {
    return (
      <div style={{
        textAlign: 'center', fontSize: '0.95rem', fontWeight: '500', color: textColor,
        textShadow, marginBottom: '14px', padding: '8px 16px',
        background: 'rgba(23, 14, 11, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px',
        border: `1px solid ${borderColor}`,
        width: 'fit-content', alignSelf: 'center', fontFamily,
      }}>
        &quot;{text}&quot;
      </div>
    );
  }

  const inner = (
    <p style={{
      fontSize: variant === 'pill' ? '1.15rem' : '1.2rem',
      fontWeight: variant === 'pill' ? '500' : '400',
      color: textColor,
      margin: 0,
      textShadow,
      letterSpacing: variant === 'pill' ? '0.01em' : '0.03em',
      lineHeight: '1.4',
      fontFamily,
    }} className="immersive-quote">
      {text}
    </p>
  );

  return (
    <div style={{ textAlign: 'center', marginBottom: '12px', width: '100%', pointerEvents: 'none' }}>
      {variant === 'pill' ? (
        <span className="auto-quote-pill" style={{
          display: 'inline-block', background: 'rgba(10, 11, 15, 0.72)', backdropFilter: 'blur(16px)',
          padding: '8px 24px', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)', maxWidth: '90%',
        }}>
          {inner}
        </span>
      ) : inner}
    </div>
  );
}
