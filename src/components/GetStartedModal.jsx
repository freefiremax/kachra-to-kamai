import { BrandLogo } from './BrandLogo';

export function GetStartedModal({ onClose, onSelectRole, onOpenNewListing }) {
  const roles = [
    {
      id: 'buyer',
      title: 'I want to Buy Waste & Biomass',
      roleText: 'Procure verified agricultural residues, sorted paper, plastics, and compost feedstock.',
      badge: 'Buyers & Recyclers',
      icon: '🛒',
      accent: 'emerald',
      action: () => {
        onSelectRole('buyer');
        onClose();
      },
    },
    {
      id: 'seller',
      title: 'I want to Sell Waste & Scrap',
      roleText: 'Monetize farm by-products, shop cardboard, and factory surplus with guaranteed payouts.',
      badge: 'Farmers & Businesses',
      icon: '📦',
      accent: 'amber',
      action: () => {
        onSelectRole('seller');
        if (onOpenNewListing) onOpenNewListing();
        onClose();
      },
    },
    {
      id: 'agent',
      title: 'I want to Deliver & Earn',
      roleText: 'Join the local Kopargaon green delivery fleet. Pick up consignments and earn per trip.',
      badge: 'Delivery Fleet',
      icon: '🚚',
      accent: 'blue',
      action: () => {
        onSelectRole('agent');
        onClose();
      },
    },
    {
      id: 'presenter',
      title: '4-in-1 Live Interactive Stage',
      roleText: 'See Buyer, Seller, Delivery Agent, and Ops Admin work simultaneously in real time.',
      badge: 'Demo & Presentation',
      icon: '🎭',
      accent: 'purple',
      action: () => {
        onSelectRole('presenter');
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-emerald-50 via-amber-50/40 to-white border-b border-slate-100 flex items-center justify-between">
          <BrandLogo size="medium" />
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center text-lg font-bold border border-slate-200 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="mb-5 text-center">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Get Started with <span className="text-emerald-700">Kachra</span> <span className="text-amber-600">To Kamai</span>
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Choose how you want to participate in Kopargaon's circular waste marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={r.action}
                className="group relative p-4 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 text-left transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl p-2 rounded-xl bg-slate-50 group-hover:bg-white group-hover:scale-110 transition-transform">
                      {r.icon}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800">
                      {r.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-emerald-800 text-base leading-snug">
                    {r.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {r.roleText}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">
                  <span>Enter Portal</span>
                  <span>→</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-medium text-slate-700">Kopargaon Cluster Live</span>
            </div>
            <span>No sign-up fee · Escrow protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetStartedModal;
