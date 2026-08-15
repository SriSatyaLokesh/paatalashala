'use client';

// Fixed error pill shown when playerError is set. Each space supplies its
// own formatMessage(code) — text templates differ (e.g. tractor's plain
// "⚠ YT Player Error: {code}" vs ammama/thathayya/vennallo's special-cased
// "Auto-skipping..." message for codes 150/101). Auto never renders this at
// all (preserves its existing behavior of tracking playerError silently).
export default function PlayerErrorBanner({ code, formatMessage, bottom = 170, right = 30 }) {
  return (
    <div style={{ position: 'fixed', bottom: `${bottom}px`, right: `${right}px`, background: 'rgba(220,38,38,0.9)', color: '#fff', padding: '8px 14px', borderRadius: '10px', fontSize: '0.75rem', zIndex: 50 }}>
      {formatMessage(code)}
    </div>
  );
}
