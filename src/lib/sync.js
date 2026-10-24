// Cross-tab real-time sync for presentations and multi-window demonstrations
let syncChannel = null;

try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel('kachra-to-kamai-live-sync');
  }
} catch {
  syncChannel = null;
}

export function broadcastStateChange(payload) {
  if (syncChannel) {
    try {
      syncChannel.postMessage(payload);
    } catch {
      // ignore
    }
  }
}

export function subscribeStateSync(onSync) {
  if (typeof window === 'undefined') return () => {};

  function handleMessage(event) {
    if (event.data && typeof onSync === 'function') {
      onSync(event.data);
    }
  }

  function handleStorage(event) {
    if (event.key === 'kachra-to-kamai-demo-state-v1' && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (parsed && typeof onSync === 'function') {
          onSync(parsed);
        }
      } catch {
        // ignore
      }
    }
  }

  if (syncChannel) {
    syncChannel.addEventListener('message', handleMessage);
  }
  window.addEventListener('storage', handleStorage);

  return () => {
    if (syncChannel) {
      syncChannel.removeEventListener('message', handleMessage);
    }
    window.removeEventListener('storage', handleStorage);
  };
}
