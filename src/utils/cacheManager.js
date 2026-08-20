// Utility to manage browser / PWA cache purging, version checking, and clean reloading.
import { prefixPath } from '@/utils/paths';

/**
 * Checks if a newer app build is available by querying public/version.json.
 * @param {string} currentCommit
 * @returns {Promise<{ hasUpdate: boolean, latestVersion: string, latestCommit: string }>}
 */
export async function checkForAppUpdate(currentCommit) {
  if (typeof window === 'undefined') {
    return { hasUpdate: false, latestVersion: '', latestCommit: '' };
  }

  try {
    const versionUrl = prefixPath(`/version.json?t=${Date.now()}`);
    const res = await fetch(versionUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });

    if (!res.ok) {
      return { hasUpdate: false, latestVersion: '', latestCommit: '' };
    }

    const data = await res.json();
    const latestCommit = data.commit || '';
    const latestVersion = data.version || '';
    const hasUpdate = Boolean(
      latestCommit &&
      currentCommit &&
      currentCommit !== 'local-dev' &&
      latestCommit !== 'local-dev' &&
      latestCommit !== currentCommit
    );

    return {
      hasUpdate,
      latestVersion,
      latestCommit,
      tag: data.tag || `v${latestVersion}-${latestCommit}`,
    };
  } catch (err) {
    console.warn('[CacheManager] Version check failed:', err);
    return { hasUpdate: false, latestVersion: '', latestCommit: '' };
  }
}

/**
 * Purges all CacheStorage entries, unregisters service workers,
 * clears temporary session caches, and forces a clean hard reload.
 * Preserves essential local settings (e.g. user volume preferences).
 */
export async function purgeAppCacheAndReload() {
  if (typeof window === 'undefined') return;

  try {
    // 1. Purge CacheStorage API
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }

    // 2. Unregister or update Service Workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(async (registration) => {
          try {
            await registration.update();
            await registration.unregister();
          } catch (_) {}
        })
      );
    }

    // 3. Clear temporary sessionStorage
    try {
      sessionStorage.clear();
    } catch (_) {}

    // 4. Force a clean cache-busting hard reload
    const targetUrl = new URL(window.location.href);
    targetUrl.searchParams.set('fresh', Date.now().toString());
    window.location.replace(targetUrl.toString());
  } catch (error) {
    console.error('[CacheManager] Error purging cache:', error);
    // Fallback hard reload
    window.location.reload(true);
  }
}
