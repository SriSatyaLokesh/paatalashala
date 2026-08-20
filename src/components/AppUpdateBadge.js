'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, Check } from 'lucide-react';
import { checkForAppUpdate, purgeAppCacheAndReload } from '@/utils/cacheManager';

// Build version data generated at compile-time by scripts/generate-version.js
import versionInfo from '../../public/version.json';

export default function AppUpdateBadge() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [latestTag, setLatestTag] = useState('');

  const currentCommit = versionInfo?.commit || 'local-dev';
  const currentTag = versionInfo?.tag || 'v0.1.0';

  useEffect(() => {
    let isMounted = true;

    async function check() {
      const result = await checkForAppUpdate(currentCommit);
      if (isMounted && result.hasUpdate) {
        setUpdateAvailable(true);
        setLatestTag(result.tag);
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

  return (
    <div className="update-badge-wrapper">
      {/* 
        Per requirement: If user is already on latest version, we do NOT show intrusive banners.
        When an update IS available, we render a glowing "Update App" pill.
        When on latest, we render a subtle version indicator with on-demand cache refresh.
      */}
      {updateAvailable ? (
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="update-action-btn update-pulse"
          title="A newer version of Paatalashala is available! Click to update."
          aria-label="Update app to latest version"
        >
          <span className="update-icon-glow">
            <Sparkles size={14} className="sparkle-icon" />
          </span>
          <span className="update-text">
            {isUpdating ? 'Updating Paatalashala...' : 'New Update Available'}
          </span>
          <RefreshCw size={13} className={`refresh-icon ${isUpdating ? 'spin-fast' : ''}`} />
        </button>
      ) : (
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="version-subtle-btn"
          title="Click to clear cache and reload fresh data"
          aria-label="App version and fresh cache reload"
        >
          <span className="version-dot" />
          <span className="version-label">{currentTag}</span>
          <RefreshCw size={11} className={`refresh-subtle ${isUpdating ? 'spin-fast' : ''}`} />
        </button>
      )}

      <style jsx>{`
        .update-badge-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Prominent Glow Button (Only when new version exists) ── */
        .update-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px;
          border-radius: 9999px;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.35) 100%);
          border: 1px solid rgba(251, 191, 36, 0.45);
          color: #fef08a;
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 4px 16px rgba(245, 158, 11, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .update-action-btn:hover {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.32) 0%, rgba(217, 119, 6, 0.48) 100%);
          border-color: rgba(251, 191, 36, 0.7);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        .update-action-btn:active {
          transform: translateY(1px);
        }

        .update-pulse {
          animation: pulseGlow 2.4s infinite ease-in-out;
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4), 0 4px 16px rgba(245, 158, 11, 0.2);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(245, 158, 11, 0), 0 4px 20px rgba(245, 158, 11, 0.4);
          }
        }

        .update-icon-glow {
          display: flex;
          align-items: center;
          color: #fbbf24;
        }

        /* ── Subtle Badge (When already on latest version) ── */
        .version-subtle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(243, 222, 194, 0.65);
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          cursor: pointer;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        }
        .version-subtle-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(220, 170, 90, 0.3);
          color: rgba(243, 222, 194, 0.95);
        }

        .version-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 5px rgba(16, 185, 129, 0.6);
        }

        .refresh-subtle {
          opacity: 0.5;
          transition: opacity 0.2s ease;
        }
        .version-subtle-btn:hover .refresh-subtle {
          opacity: 0.9;
        }

        .spin-fast {
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
