import { languages, useTranslation } from '../lib/i18n';
import { BrandLogo } from './BrandLogo';

export function PortalHeader({
  activePortal,
  onSelectPortal,
  pendingRequestsCount,
  availablePickupsCount,
  pendingBuyerPaymentsCount,
  onOpenDbModal,
  onOpenGetStarted,
}) {
  const { lang, setLang, t } = useTranslation();

  return (
    <>
      {/* Top Navbar Matching User Reference Screenshot */}
      <header className="ktk-header">
        <div className="ktk-header-inner">
          
          {/* Brand Logo with Sprout */}
          <div className="flex items-center gap-3">
            <button
              className="ktk-brand-btn"
              onClick={() => onSelectPortal('home')}
              title="Kachra To Kamai - Turn Waste Into Worth"
              aria-label="Kachra To Kamai Home"
            >
              <BrandLogo size="medium" />
            </button>

            {/* DB Sync indicator */}
            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
              onClick={onOpenDbModal}
              title="Database & Real-time Cloud Sync Status"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>DB Sync</span>
            </button>
          </div>

          {/* Center Navigation Links (Exact Match to Screenshot) */}
          <nav className="ktk-nav-menu" aria-label="Main Navigation">
            <button
              type="button"
              className={`ktk-nav-link ${activePortal === 'home' ? 'active' : ''}`}
              onClick={() => onSelectPortal('home')}
            >
              Home
            </button>

            <button
              type="button"
              className={`ktk-nav-link ${activePortal === 'buyer' ? 'active' : ''}`}
              onClick={() => onSelectPortal('buyer')}
            >
              <span>Browse</span>
              {pendingBuyerPaymentsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
              )}
            </button>

            <button
              type="button"
              className={`ktk-nav-link ${activePortal === 'seller' ? 'active' : ''}`}
              onClick={() => onSelectPortal('seller')}
            >
              <span>Sell Waste</span>
              {pendingRequestsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px]">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className={`ktk-nav-link ${activePortal === 'buyer' ? 'active' : ''}`}
              onClick={() => onSelectPortal('buyer')}
            >
              Buy Waste
            </button>

            <button
              type="button"
              className="ktk-nav-link"
              onClick={() => {
                if (activePortal !== 'home') {
                  onSelectPortal('home');
                }
                setTimeout(() => {
                  const el = document.getElementById('about');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              About
            </button>

            {/* Quick 4-in-1 Stage Shortcut */}
            <button
              type="button"
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activePortal === 'presenter'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
              }`}
              onClick={() => onSelectPortal('presenter')}
              title="4-in-1 Live Presentation Stage"
            >
              <span>🎭</span>
              <span>4-in-1 Stage</span>
            </button>
          </nav>

          {/* Right Action: Language Switcher & Get Started CTA */}
          <div className="flex items-center gap-3">
            
            {/* Language Switcher */}
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-full text-xs font-bold">
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code)}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    lang === item.code
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title={item.label}
                >
                  {item.short}
                </button>
              ))}
            </div>

            {/* "Get Started" Button (Exact Match to Screenshot) */}
            <button
              type="button"
              onClick={onOpenGetStarted}
              className="ktk-btn-get-started"
            >
              Get Started
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Floating Bottom Dock (hidden on desktop) */}
      <nav className="ktk-mobile-dock fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] max-w-md bg-white/95 backdrop-blur-md border border-slate-200 rounded-full shadow-2xl p-1.5 grid grid-cols-5 gap-1">
        <button
          type="button"
          onClick={() => onSelectPortal('home')}
          className={`py-2 rounded-full flex flex-col items-center justify-center text-[10px] font-bold ${
            activePortal === 'home' ? 'bg-[#0a3d24] text-white' : 'text-slate-600'
          }`}
        >
          <span className="text-base leading-none">🏠</span>
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectPortal('buyer')}
          className={`py-2 rounded-full flex flex-col items-center justify-center text-[10px] font-bold ${
            activePortal === 'buyer' ? 'bg-[#0a3d24] text-white' : 'text-slate-600'
          }`}
        >
          <span className="text-base leading-none">🔍</span>
          <span>Browse</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectPortal('seller')}
          className={`py-2 rounded-full flex flex-col items-center justify-center text-[10px] font-bold ${
            activePortal === 'seller' ? 'bg-[#0a3d24] text-white' : 'text-slate-600'
          }`}
        >
          <span className="text-base leading-none">📦</span>
          <span>Sell</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectPortal('agent')}
          className={`py-2 rounded-full flex flex-col items-center justify-center text-[10px] font-bold ${
            activePortal === 'agent' ? 'bg-[#0a3d24] text-white' : 'text-slate-600'
          }`}
        >
          <span className="text-base leading-none">🚚</span>
          <span>Fleet</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectPortal('presenter')}
          className={`py-2 rounded-full flex flex-col items-center justify-center text-[10px] font-bold ${
            activePortal === 'presenter' ? 'bg-purple-600 text-white' : 'text-purple-700'
          }`}
        >
          <span className="text-base leading-none">🎭</span>
          <span>Stage</span>
        </button>
      </nav>
    </>
  );
}

export default PortalHeader;
