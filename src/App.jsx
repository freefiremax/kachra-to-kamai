import { useEffect, useMemo, useState } from 'react';
import { initialListings, initialOrders, statusSteps } from './data';
import { calculateOrderBreakdown, getStatusIndex } from './lib/marketplace';
import { loadDemoState, resetDemoState, saveDemoState } from './lib/persistence';
import { broadcastStateChange, subscribeStateSync } from './lib/sync';

import { PortalHeader } from './components/PortalHeader';
import { BuyerPage } from './components/BuyerPage';
import { SellerPage } from './components/SellerPage';
import { AgentPage } from './components/AgentPage';
import { AdminPage } from './components/AdminPage';
import { PresenterPage } from './components/PresenterPage';
import { PaymentModal } from './components/PaymentModal';
import { NewListingModal } from './components/NewListingModal';

function getInitialPortal() {
  if (typeof window === 'undefined') return 'buyer';
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (['buyer', 'seller', 'agent', 'admin', 'presenter'].includes(hash)) return hash;

  const params = new URLSearchParams(window.location.search);
  const portalParam = (params.get('portal') || params.get('role') || '').toLowerCase();
  if (['buyer', 'seller', 'agent', 'admin', 'presenter'].includes(portalParam)) return portalParam;

  return 'presenter'; // Default to 4-in-1 presenter view for immediate wow factor & presentations!
}

export function App() {
  const [portal, setPortal] = useState(getInitialPortal);
  const initialState = useMemo(() => loadDemoState(), []);
  const [listings, setListings] = useState(initialState.listings || initialListings);
  const [orders, setOrders] = useState(initialState.orders || initialOrders);

  // Active modals
  const [activePayOrder, setActivePayOrder] = useState(null);
  const [showNewListingModal, setShowNewListingModal] = useState(false);
  const [toast, setToast] = useState('');

  // Persist locally & broadcast cross-tab sync
  useEffect(() => {
    saveDemoState({ listings, orders });
    broadcastStateChange({ listings, orders });
  }, [listings, orders]);

  // Subscribe to updates from other open windows/tabs during live presentations
  useEffect(() => {
    const unsubscribe = subscribeStateSync((incoming) => {
      if (incoming.listings && Array.isArray(incoming.listings)) {
        setListings(incoming.listings);
      }
      if (incoming.orders && Array.isArray(incoming.orders)) {
        setOrders(incoming.orders);
      }
    });
    return unsubscribe;
  }, []);

  // Sync hash routing
  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['buyer', 'seller', 'agent', 'admin', 'presenter'].includes(hash)) {
        setPortal(hash);
      }
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  function handleSelectPortal(nextPortal) {
    setPortal(nextPortal);
    if (typeof window !== 'undefined') {
      window.location.hash = nextPortal;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function notify(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }

  // 1. Buyer Sends Request to Buy
  function handleRequestBuy(listing, quantity) {
    const breakdown = calculateOrderBreakdown({
      price: listing.price,
      quantity,
      unit: listing.unit,
      distanceKm: listing.distanceKm,
      weightKg: listing.unit === 'kg' ? quantity : quantity * 10,
    });

    const newOrder = {
      id: `${1001 + orders.length}`,
      listingId: listing.id,
      listingTitle: listing.title,
      category: listing.category,
      quantity,
      unit: listing.unit,
      itemTotal: breakdown.itemTotal,
      deliveryFee: breakdown.deliveryFee,
      commission: breakdown.commission,
      distanceKm: listing.distanceKm,
      status: 'requested',
      buyer: 'Demo Buyer (Kopargaon)',
      seller: listing.seller,
      destination: 'MIDC Recycling Hub, Kopargaon',
      createdAt: 'Just now',
    };

    setOrders((curr) => [newOrder, ...curr]);
    notify(`Buy request for "${listing.title}" submitted! Seller must accept.`);
  }

  // 2. Seller Accepts Request
  function handleAcceptRequest(orderId) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Deduct quantity from listing
    setListings((curr) =>
      curr.map((item) => {
        if (item.id === order.listingId) {
          const remaining = Math.max(0, item.quantity - order.quantity);
          return {
            ...item,
            quantity: remaining,
            availability: remaining > 0 ? `${remaining} ${item.unit} remaining` : 'Batch reserved',
          };
        }
        return item;
      })
    );

    // Update status to seller_accepted
    setOrders((curr) =>
      curr.map((o) => (o.id === orderId ? { ...o, status: 'seller_accepted' } : o))
    );
    notify(`Order #${orderId} accepted! Buyer notified to proceed with payment.`);
  }

  function handleDeclineRequest(orderId) {
    setOrders((curr) => curr.filter((o) => o.id !== orderId));
    notify(`Order #${orderId} declined.`);
  }

  // 3. Buyer Completes Payment
  function handlePaymentSuccess(orderId) {
    setActivePayOrder(null);
    setOrders((curr) =>
      curr.map((o) => (o.id === orderId ? { ...o, status: 'payment_simulated' } : o))
    );
    notify(`Payment verified! Consignment is now ready for delivery agent pickup.`);
  }

  // 4. Delivery Agent Actions
  function handleAcceptDelivery(orderId) {
    setOrders((curr) =>
      curr.map((o) => (o.id === orderId ? { ...o, status: 'agent_assigned' } : o))
    );
    notify(`Consignment #${orderId} accepted! Drive to seller location for pickup.`);
  }

  function handlePickUp(orderId) {
    setOrders((curr) =>
      curr.map((o) => (o.id === orderId ? { ...o, status: 'picked_up' } : o))
    );
    notify(`Material loaded! Consignment is now in transit to destination.`);
  }

  function handleDeliver(orderId) {
    setOrders((curr) =>
      curr.map((o) => (o.id === orderId ? { ...o, status: 'delivered' } : o))
    );
    notify(`Consignment delivered at destination! Awaiting buyer receipt confirmation.`);
  }

  // 5. Buyer Confirms Receipt
  function handleConfirmReceipt(orderId) {
    setOrders((curr) =>
      curr.map((o) => (o.id === orderId ? { ...o, status: 'completed' } : o))
    );
    notify(`Receipt confirmed! Full circular transaction completed and funds settled.`);
  }

  // Demo Controls
  function handleAddListing(newListing) {
    setListings((curr) => [newListing, ...curr]);
    notify(`New listing "${newListing.title}" published!`);
  }

  function handleResetData() {
    resetDemoState();
    setListings(initialListings);
    setOrders(initialOrders);
    notify('Demo state reset to clean sample data.');
  }

  function handleFastForwardOrder(orderId) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const currentIndex = getStatusIndex(order.status);
    const orderFlow = ['requested', 'seller_accepted', 'payment_simulated', 'agent_assigned', 'picked_up', 'delivered', 'completed'];
    if (currentIndex < orderFlow.length - 1) {
      const nextStatus = orderFlow[currentIndex + 1];
      if (nextStatus === 'seller_accepted') {
        handleAcceptRequest(orderId);
      } else {
        setOrders((curr) => curr.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)));
        notify(`Order #${orderId} advanced to "${nextStatus}".`);
      }
    }
  }

  function handleGenerateQuickDemoOrder() {
    const sampleItem = listings[0] || initialListings[0];
    const newOrder = {
      id: `${1001 + orders.length}`,
      listingId: sampleItem.id,
      listingTitle: sampleItem.title,
      category: sampleItem.category,
      quantity: 40,
      unit: sampleItem.unit,
      itemTotal: sampleItem.price * 40,
      deliveryFee: 65,
      commission: Math.round(sampleItem.price * 40 * 0.05),
      distanceKm: sampleItem.distanceKm,
      status: 'requested',
      buyer: 'Demo Factory Buyer',
      seller: sampleItem.seller,
      destination: 'Industrial Area, Kopargaon',
      createdAt: 'Just now',
    };
    setOrders((curr) => [newOrder, ...curr]);
    notify(`Quick demo buy request created for ${sampleItem.title}!`);
  }

  // Badge counts
  const pendingRequestsCount = orders.filter((o) => o.status === 'requested').length;
  const availablePickupsCount = orders.filter((o) => o.status === 'payment_simulated').length;
  const pendingBuyerPaymentsCount = orders.filter((o) => o.status === 'seller_accepted').length;

  return (
    <div className={`app-shell portal-${portal}`}>
      {/* Top Main Navigation */}
      <PortalHeader
        activePortal={portal}
        onSelectPortal={handleSelectPortal}
        pendingRequestsCount={pendingRequestsCount}
        availablePickupsCount={availablePickupsCount}
        pendingBuyerPaymentsCount={pendingBuyerPaymentsCount}
      />

      {/* Main Portal View Router */}
      <main className="portal-content-wrap">
        {portal === 'buyer' && (
          <BuyerPage
            listings={listings}
            orders={orders}
            onRequestBuy={handleRequestBuy}
            onOpenPayModal={(order) => setActivePayOrder(order)}
            onConfirmReceipt={handleConfirmReceipt}
            onViewSellerPortal={() => handleSelectPortal('seller')}
          />
        )}

        {portal === 'seller' && (
          <SellerPage
            listings={listings}
            orders={orders}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
            onOpenNewListingModal={() => setShowNewListingModal(true)}
            onViewBuyerPortal={() => handleSelectPortal('buyer')}
          />
        )}

        {portal === 'agent' && (
          <AgentPage
            orders={orders}
            onAcceptDelivery={handleAcceptDelivery}
            onPickUp={handlePickUp}
            onDeliver={handleDeliver}
            onViewBuyerPortal={() => handleSelectPortal('buyer')}
          />
        )}

        {portal === 'admin' && (
          <AdminPage
            listings={listings}
            orders={orders}
            onResetData={handleResetData}
            onFastForwardOrder={handleFastForwardOrder}
            onGenerateQuickDemoOrder={handleGenerateQuickDemoOrder}
            onOpenPortal={handleSelectPortal}
          />
        )}

        {portal === 'presenter' && (
          <PresenterPage
            listings={listings}
            orders={orders}
            onRequestBuy={handleRequestBuy}
            onAcceptRequest={handleAcceptRequest}
            onOpenPayModal={(order) => setActivePayOrder(order)}
            onAcceptDelivery={handleAcceptDelivery}
            onPickUp={handlePickUp}
            onDeliver={handleDeliver}
            onConfirmReceipt={handleConfirmReceipt}
            onSwitchPortal={handleSelectPortal}
            onGenerateQuickDemoOrder={handleGenerateQuickDemoOrder}
          />
        )}
      </main>

      {/* Interactive Payment Gateway Simulator Modal */}
      {activePayOrder && (
        <PaymentModal
          order={activePayOrder}
          onClose={() => setActivePayOrder(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Add New Material Listing Modal for Sellers */}
      {showNewListingModal && (
        <NewListingModal
          onClose={() => setShowNewListingModal(false)}
          onAddListing={handleAddListing}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <span className="toast-icon">✨</span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default App;
