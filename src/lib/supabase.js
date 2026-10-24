import { createClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'k2k-custom-supabase-url';
const STORAGE_KEY_KEY = 'k2k-custom-supabase-key';

function getEnv(key) {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key] !== undefined) {
      return import.meta.env[key];
    }
  } catch {
    // ignore
  }
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key] !== undefined) {
      return process.env[key];
    }
  } catch {
    // ignore
  }
  return '';
}

const DEFAULT_SUPABASE_URL = 'https://sjfhiemzegdrvgnpxefk.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_xUhJkH3mozpTvf89FBDZJw_ErmWlP5D';

export function getSupabaseCredentials() {
  if (typeof window === 'undefined') {
    return {
      url: getEnv('VITE_SUPABASE_URL') || DEFAULT_SUPABASE_URL,
      key: getEnv('VITE_SUPABASE_PUBLISHABLE_KEY') || getEnv('VITE_SUPABASE_ANON_KEY') || DEFAULT_SUPABASE_KEY,
      isCustom: false,
    };
  }

  const customUrl = window.localStorage.getItem(STORAGE_URL_KEY);
  const customKey = window.localStorage.getItem(STORAGE_KEY_KEY);

  if (customUrl && customKey) {
    return { url: customUrl.trim(), key: customKey.trim(), isCustom: true };
  }

  const envUrl = (getEnv('VITE_SUPABASE_URL') || DEFAULT_SUPABASE_URL).trim();
  const envKey = (getEnv('VITE_SUPABASE_PUBLISHABLE_KEY') || getEnv('VITE_SUPABASE_ANON_KEY') || DEFAULT_SUPABASE_KEY).trim();

  return { url: envUrl, key: envKey, isCustom: false };
}

let cachedClient = null;
let cachedSignature = '';

export function getSupabaseClient() {
  const { url, key } = getSupabaseCredentials();

  if (!url || !key) return null;

  const signature = `${url}::${key}`;
  if (cachedClient && cachedSignature === signature) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    cachedSignature = signature;
    return cachedClient;
  } catch (err) {
    console.warn('[K2K Supabase Init Failed]', err);
    return null;
  }
}

export function saveCustomSupabaseConfig(url, key) {
  if (typeof window === 'undefined') return;
  if (!url || !key) {
    window.localStorage.removeItem(STORAGE_URL_KEY);
    window.localStorage.removeItem(STORAGE_KEY_KEY);
  } else {
    window.localStorage.setItem(STORAGE_URL_KEY, url.trim());
    window.localStorage.setItem(STORAGE_KEY_KEY, key.trim());
  }
  cachedClient = null;
  cachedSignature = '';
}
