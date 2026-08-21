'use client';

import { Users } from 'lucide-react';

// Two listener-count display patterns found across the 6 spaces:
// - Dual (tractor, auto): a floating desktop badge + a separate row rendered
//   inline inside the capsule on mobile, both using a pulsing green dot.
//   Use ListenersBadgeDesktop + ListenersBadgeMobileRow together.
// - Single (saloon, ammama, thathayya, vennallo): one floating badge, hidden
//   on mobile via CSS, using the Users icon. Use ListenersBadgeSingle alone.

export function ListenersBadgeDesktop({ count, label }) {
  return (
    <div style={{
      position: 'fixed', right: '32px', bottom: '24px',
      display: 'flex', alignItems: 'center', gap: '8px',
      fontSize: '0.85rem', fontWeight: '600', color: '#a7f3d0',
      background: 'rgba(10, 11, 15, 0.65)', border: '1px solid rgba(255, 255, 255, 0.12)',
      backdropFilter: 'blur(12px)', padding: '8px 16px', borderRadius: '9999px',
      zIndex: 35, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', whiteSpace: 'nowrap',
    }} className="listeners-badge-desktop">
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
      <span suppressHydrationWarning>{count} {label}</span>
    </div>
  );
}

export function ListenersBadgeMobileRow({ count, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      fontSize: '0.75rem', fontWeight: '600', color: '#a7f3d0', justifyContent: 'center',
    }} className="mobile-listeners-row">
      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
      <span suppressHydrationWarning>{count} {label}</span>
    </div>
  );
}

export function ListenersBadgeSingle({ count, label, textColor, background, border, iconColor }) {
  return (
    <div style={{
      position: 'fixed', right: '24px', bottom: '24px',
      display: 'flex', alignItems: 'center', gap: '8px',
      fontSize: '0.85rem', fontWeight: '600', color: textColor,
      background, border: `1px solid ${border}`,
      backdropFilter: 'blur(12px)', padding: '8px 16px', borderRadius: '9999px',
      zIndex: 35, boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
    }} className="listeners-badge">
      <Users size={14} style={{ color: iconColor }} />
      <span suppressHydrationWarning>{count} {label}</span>
    </div>
  );
}
