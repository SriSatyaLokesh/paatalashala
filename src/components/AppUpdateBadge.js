'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { checkForAppUpdate, purgeAppCacheAndReload } from '@/utils/cacheManager';

// Build version data generated at compile-time by scripts/generate-version.js
import versionInfo from '../../public/version.json';

export default function AppUpdateBadge() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Real build commit baked at compile time
  const currentCommit = versionInfo?.commit || process.env.NEXT_PUBLIC_APP_COMMIT || 'local-dev';

  useEffect(() => {
    let isMounted = true;

    async function check() {
      const result = await checkForAppUpdate(currentCommit);
      if (isMounted && result.hasUpdate) {
        setUpdateAvailable(true);
      }
    }

    check();

    // Re-check periodically when user returns to tab
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        check();
      }
    };

    window.addEventListener('visibilitychange', onVisibilityChange);
    const interval = setInterval(check, 60000); // Check every 60s

    return () => {
      isMounted = false;
      window.removeEventListener('visibilitychange', onVisibilityChange);
      clearInterval(interval);
    };
  }, [currentCommit]);

  const handleUpdate = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    // Brief animation delay so user feels feedback
    setTimeout(async () => {
      await purgeAppCacheAndReload();
    }, 400);
  };

  // Only render when a new update is actually available
  if (!updateAvailable) {
    return null;
  }

  return (
    <div className="update-badge-wrapper">
      <button
        onClick={handleUpdate}
        disabled={isUpdating}
        className="update-action-btn update-pulse"
        title="A newer version of Paatalashala is available. Click to update."
        aria-label="Update app to latest version"
      >
        <span className="pulse-dot" />
        <span className="update-text">
          {isUpdating ? 'Updating...' : 'New update available'}
        </span>
        <RefreshCw size={12} className={`refresh-icon ${isUpdating ? 'spin-fast' : ''}`} />
      </button>

      <style jsx>{`
        .update-badge-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        /* ── Simple, Attentive & Refined Update Pill ── */
        .update-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 9999px;
          background: rgba(24, 18, 12, 0.85);
          border: 1px solid rgba(245, 158, 11, 0.45);
          color: #fef08a;
          font-size: 0.76rem;
          font-weight: 550;
          letter-spacing: 0.03em;
          cursor: pointer;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12);
          transition: all 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .update-action-btn:hover {
          background: rgba(36, 24, 14, 0.95);
          border-color: rgba(251, 191, 36, 0.75);
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 4px 18px rgba(245, 158, 11, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .update-action-btn:active {
          transform: translateY(1px);
        }

        /* ── Subtle Status Pulse Dot ── */
        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fbbf24;
          box-shadow: 0 0 6px #fbbf24;
          animation: dotBreathe 1.8s infinite ease-in-out;
        }

        @keyframes dotBreathe {
          0%, 100% {
            opacity: 0.8;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1.25);
            box-shadow: 0 0 9px #fbbf24;
          }
        }

        /* ── Subtle Border/Shadow Pulse ── */
        .update-pulse {
          animation: pillGlow 2.8s infinite ease-in-out;
        }

        @keyframes pillGlow {
          0%, 100% {
            border-color: rgba(245, 158, 11, 0.4);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35), 0 0 0 0 rgba(245, 158, 11, 0.3);
          }
          50% {
            border-color: rgba(251, 191, 36, 0.7);
            box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4), 0 0 0 4px rgba(245, 158, 11, 0);
          }
        }

        .update-text {
          line-height: 1;
        }

        .refresh-icon {
          color: #fbbf24;
          opacity: 0.85;
          transition: transform 0.3s ease, opacity 0.2s ease;
        }

        .update-action-btn:hover .refresh-icon {
          opacity: 1;
          transform: rotate(45deg);
        }

        .spin-fast {
          animation: spin 0.6s linear infinite !important;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
