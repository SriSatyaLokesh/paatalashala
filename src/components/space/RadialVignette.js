'use client';

// Single full-viewport radial vignette used by saloon, ammama, thathayya,
// and vennallo (each with its own tint). Tractor's dual top/bottom linear-
// gradient strips and auto's lack of any vignette stay local to those pages.
export default function RadialVignette({ innerColor, outerColor }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: `radial-gradient(circle at center, ${innerColor} 0%, ${outerColor} 100%)`,
      pointerEvents: 'none',
      zIndex: 1,
    }} />
  );
}
