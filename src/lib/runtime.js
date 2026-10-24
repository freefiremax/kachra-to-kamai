const mode = import.meta.env.VITE_APP_MODE || 'demo';

export const runtime = {
  mode,
  isDemo: mode === 'demo',
  isProduction: mode === 'production',
  appName: import.meta.env.VITE_APP_NAME || 'Kachra To Kamai',
  region: import.meta.env.VITE_APP_REGION || 'Kopargaon, Maharashtra',
  hasSupabasePublicConfig: Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY),
};

export function getRuntimeLabel() {
  if (runtime.isProduction && !runtime.hasSupabasePublicConfig) return 'Production configuration incomplete';
  if (runtime.isProduction) return 'Production configuration detected';
  return 'Demo mode · local browser data';
}
