import { createContext, createElement, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'kachra-to-kamai-lang-v1';

export const languages = [
  { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', short: 'हिं', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', short: 'म', flag: '🚩' },
];

export const translations = {
  en: {
    // Brand & Header
    tagline: 'Waste se value · Value se kamai',
    region: 'Kopargaon, Maharashtra',
    buyer: 'Buyer',
    seller: 'Seller',
    fleet: 'Fleet',
    ops: 'Ops',
    stage4in1: '4-in-1 Stage',
    allMaterials: 'All Materials',
    searchPlaceholder: 'Search cotton stalks, cardboard, plastic crates, scrap...',

    // Roles & Portals
    buyerPortalTitle: 'Source verified scrap, surplus &',
    buyerPortalSub: 'Browse verified local batches in Kopargaon, submit purchase requests directly to sellers, pay securely via escrow, and track direct doorstep delivery.',
    buyerTag: 'BUYER PORTAL · KHAREEDDAR HUB',
    browseMaterials: 'Browse Materials',
    myPurchases: 'My Purchases',
    toPay: 'to Pay',
    activeBatches: 'Active Batches',
    myOrdersCount: 'My Orders',
    paymentAwaitingAction: 'Payment Awaiting Action!',
    availableStock: 'Available Stock',
    unitRate: 'Unit Rate',
    pickupHub: 'Pickup Hub',
    distance: 'Distance',
    buyRequest: 'Buy / Request',
    sendBuyRequest: 'Send Buy Request to Seller',
    qtyToRequest: 'Quantity to Request',
    subtotal: 'Material Subtotal',
    doorstepDelivery: 'Doorstep Delivery',
    estimatedTotal: 'Estimated Total',
    sellerMustReview: 'Seller must review & accept before payment is requested.',

    // Seller Portal
    sellerPortalTitle: 'Monetize industrial scrap &',
    sellerPortalSub: 'Receive direct purchase requests from local buyers in Kopargaon, approve consignments in 1-tap, and get verified bank payouts upon pickup.',
    sellerTag: 'SELLER & SUPPLIER PORTAL · VIKRETA DASHBOARD',
    incomingRequests: 'Incoming Requests',
    myInventory: 'My Inventory',
    pipelinePayouts: 'Pipeline & Payouts',
    listNewScrap: '+ List New Scrap',
    newRequestsToAccept: 'New Requests to Accept',
    ordersInPipeline: 'Orders In Pipeline',
    netSellerKamai: 'Net Seller Kamai',
    activeListings: 'Active Listings',
    buyerProfile: 'Buyer Profile',
    requestedVolume: 'Requested Volume',
    netPayoutToYou: 'Net Payout to You',
    acceptAndAlert: 'Accept Request & Alert Buyer',
    decline: 'Decline',
    sellerSettlement: 'Seller Settlement',

    // Fleet Portal
    fleetPortalTitle: 'Point-to-point material',
    fleetPortalSub: 'Pick up verified industrial batches and crop residues from sellers in Kopargaon, navigate optimized direct routes, and earn per-trip payouts.',
    fleetTag: 'DELIVERY FLEET PORTAL · SAARTHI RIDER HUB',
    availableForPickup: 'Available for Pickup',
    activeDeliveries: 'Active Deliveries',
    completedJobs: 'Completed Jobs',
    availablePickups: 'Available Pickups',
    activeRuns: 'Active Runs',
    tripPayouts: 'Trip Payouts',
    deliveredLoads: 'Delivered Loads',
    yourPayout: 'Your Payout',
    pickupPoint: 'Pickup Hub (Seller)',
    dropPoint: 'Drop Point (Buyer Destination)',
    acceptDelivery: 'Accept Delivery Consignment',
    confirmPickup: 'Confirm Material Picked Up from Seller',
    confirmDrop: 'Confirm Drop & Delivery to Buyer',
    deliveredSuccessfully: 'Delivered',

    // Admin Ops
    opsPortalTitle: 'Kopargaon Circular Economy',
    opsTag: 'OPERATIONS & ECOSYSTEM TELEMETRY',
    commandCockpit: 'Command Cockpit',
    transactionsCount: 'Transactions',
    wasteDiverted: 'Waste Diverted',
    platformGMV: 'Platform GMV',
    escrowCommission: '5% Escrow Commission',
    co2Avoidance: 'CO₂ Avoidance',
    generateDemoRequest: '⚡ Generate Test Buy Request',
    resetDemo: '↺ Reset Demo State',
    transactionFlowTitle: 'Real-Time 5-Stage Transaction Flow',
    orderLedgerTitle: 'All System Orders & Consignments',
    all: 'All',
    fastForward: 'Fast-Forward ➔',

    // Flow Steps & Badges
    stepRequested: 'Request Sent',
    stepAccepted: 'Seller Accepted',
    stepPaid: 'Payment Done',
    stepAssigned: 'Agent Assigned',
    stepPickedUp: 'In Transit',
    stepDelivered: 'Delivered',
    stepCompleted: 'Completed',

    // Flow prompts
    waitingSellerAccept: 'Waiting for seller to accept your buy request.',
    sellerAcceptedPayNow: 'Seller accepted! Please complete payment to dispatch delivery.',
    payNowBtn: 'PAY NOW',
    paidDispatched: 'Payment Done · Escrow Protected. Awaiting Fleet Pickup.',
    confirmReceiptBtn: '✓ Confirm Material Receipt',
    receiptConfirmed: 'Receipt confirmed! Full transaction completed.',

    // Payment Modal
    instantPayment: 'Instant Payment',
    escrowProtocol: 'K2K SECURE ESCROW PROTOCOL',
    totalPayable: 'Total Payable',
    upiTab: 'UPI / QR',
    cardTab: 'Card',
    codTab: 'On Dispatch',
    scanViaUpi: 'SCAN VIA ANY UPI APP',
    payInstantly: 'Pay Instantly',
    paymentVerified: 'Payment Verified!',
    securedInEscrow: 'Secured in Escrow',
    escrowGuaranteeText: 'Protected by Kachra To Kamai Escrow. Seller gets settlement only after delivery.',

    // 4-in-1 Presenter
    presenterTitle: 'Full Circular Lifecycle',
    presenterLiveDemo: 'LIVE 4-PERSONA COLLABORATIVE STAGE',
    presenterSub: 'Watch all 4 participant interfaces on one screen. Actions in any quadrant immediately trigger live updates across the whole network.',
    focusView: 'Focus View:',
    step1Ribbon: 'Send Buy Request',
    step2Ribbon: 'Accept Request',
    step3Ribbon: 'Pay Now (Escrow)',
    step4Ribbon: 'Pickup & Deliver',
  },

  hi: {
    // Brand & Header
    tagline: 'कचरे से मूल्य · मूल्य से कमाई',
    region: 'कोपरगांव, महाराष्ट्र',
    buyer: 'खरीदार',
    seller: 'विक्रेता',
    fleet: 'सारथी बेड़ा',
    ops: 'संचालन',
    stage4in1: '4-इन-1 स्टेज',
    allMaterials: 'सभी सामग्रियां',
    searchPlaceholder: 'कपास के डंठल, गत्ता, प्लास्टिक क्रेट, कबाड़ खोजें...',

    // Roles & Portals
    buyerPortalTitle: 'सत्यापित कचरा, अवशेष और',
    buyerPortalSub: 'कोपरगांव में स्थानीय कचरे की जांच करें, विक्रेताओं को सीधा खरीद अनुरोध भेजें, सुरक्षित एस्क्रो भुगतान करें और घर तक डिलीवरी पाएं।',
    buyerTag: 'खरीदार पोर्टल · खरीददार केंद्र',
    browseMaterials: 'सामग्री देखें',
    myPurchases: 'मेरी खरीदारियां',
    toPay: 'भुगतान बाकी',
    activeBatches: 'सक्रिय लॉट',
    myOrdersCount: 'मेरे ऑर्डर्स',
    paymentAwaitingAction: 'भुगतान की प्रतीक्षा!',
    availableStock: 'उपलब्ध स्टॉक',
    unitRate: 'प्रति इकाई दर',
    pickupHub: 'पिकअप हब',
    distance: 'दूरी',
    buyRequest: 'खरीदें / अनुरोध भेजें',
    sendBuyRequest: 'विक्रेता को खरीद अनुरोध भेजें',
    qtyToRequest: 'आवश्यक मात्रा',
    subtotal: 'सामग्री उप-योग',
    doorstepDelivery: 'घर तक डिलीवरी',
    estimatedTotal: 'अनुमानित कुल',
    sellerMustReview: 'भुगतान से पहले विक्रेता द्वारा स्वीकृति आवश्यक है।',

    // Seller Portal
    sellerPortalTitle: 'औद्योगिक कचरे का मुद्रीकरण करें और',
    sellerPortalSub: 'कोपरगांव के स्थानीय खरीदारों से सीधे खरीद अनुरोध प्राप्त करें, 1-टैप में स्वीकृति दें और पिकअप पर सुरक्षित बैंक भुगतान प्राप्त करें।',
    sellerTag: 'विक्रेता व आपूर्तिकर्ता पोर्टल · कमाई डैशबोर्ड',
    incomingRequests: 'आए हुए खरीद अनुरोध',
    myInventory: 'मेरी सामग्री सूची',
    pipelinePayouts: 'वितरण व भुगतान',
    listNewScrap: '+ नया कबाड़ जोड़ें',
    newRequestsToAccept: 'स्वीकृति हेतु नए अनुरोध',
    ordersInPipeline: 'प्रक्रियाधीन ऑर्डर्स',
    netSellerKamai: 'शुद्ध विक्रेता कमाई',
    activeListings: 'सक्रिय सामग्रियां',
    buyerProfile: 'खरीदार प्रोफ़ाइल',
    requestedVolume: 'मांगी गई मात्रा',
    netPayoutToYou: 'आपकी शुद्ध कमाई',
    acceptAndAlert: 'अनुरोध स्वीकार करें और खरीदार को सूचित करें',
    decline: 'अस्वीकार करें',
    sellerSettlement: 'विक्रेता को भुगतान',

    // Fleet Portal
    fleetPortalTitle: 'सामग्री परिवहन व सीधी',
    fleetPortalSub: 'कोपरगांव में विक्रेताओं से औद्योगिक व कृषि अवशेष लोड करें, सीधे मार्गों से ले जाएं और प्रति ट्रिप पारदर्शी किराया कमाएं।',
    fleetTag: 'डिलीवरी बेड़ा पोर्टल · सारथी राइडर हब',
    availableForPickup: 'पिकअप हेतु उपलब्ध',
    activeDeliveries: 'चालू डिलीवरी',
    completedJobs: 'पूर्ण यात्राएं',
    availablePickups: 'उपलब्ध पिकअप',
    activeRuns: 'सक्रिय ट्रिप',
    tripPayouts: 'ट्रिप कमाई',
    deliveredLoads: 'पहुंचाए गए लॉट',
    yourPayout: 'आपकी डिलीवरी कमाई',
    pickupPoint: 'पिकअप हब (विक्रेता)',
    dropPoint: 'ड्रॉप पॉइंट (खरीदार)',
    acceptDelivery: 'डिलीवरी स्वीकार करें',
    confirmPickup: 'विक्रेता से सामग्री लोड की पुष्टि करें',
    confirmDrop: 'खरीदार को डिलीवरी पूर्ण होने की पुष्टि करें',
    deliveredSuccessfully: 'सफलतापूर्वक पहुंचाई गई',

    // Admin Ops
    opsPortalTitle: 'कोपरगांव सर्कुलर अर्थव्यवस्था',
    opsTag: 'संचालन एवं निगरानी कॉकपिट',
    commandCockpit: 'कमांड सेंटर',
    transactionsCount: 'कुल लेनदेन',
    wasteDiverted: 'कचरा लैंडफिल से बचाया',
    platformGMV: 'प्लेटफ़ॉर्म जीएमवी',
    escrowCommission: '5% एस्क्रो कमीशन',
    co2Avoidance: 'अनुमानित CO₂ बचत',
    generateDemoRequest: '⚡ टेस्ट खरीद अनुरोध बनाएं',
    resetDemo: '↺ डेमो रीसेट करें',
    transactionFlowTitle: 'रीयल-टाइम 5-चरणीय लेनदेन प्रवाह',
    orderLedgerTitle: 'सिस्टम के सभी ऑर्डर्स का बहीखाता',
    all: 'सभी',
    fastForward: 'आगे बढ़ाएं ➔',

    // Flow Steps & Badges
    stepRequested: 'अनुरोध भेजा गया',
    stepAccepted: 'विक्रेता ने स्वीकार किया',
    stepPaid: 'भुगतान संपन्न',
    stepAssigned: 'सारथी नियुक्त',
    stepPickedUp: 'रास्ते में है',
    stepDelivered: 'पहुंचा दिया गया',
    stepCompleted: 'सफलतापूर्वक पूर्ण',

    // Flow prompts
    waitingSellerAccept: 'विक्रेता द्वारा आपके खरीद अनुरोध की स्वीकृति की प्रतीक्षा है।',
    sellerAcceptedPayNow: 'विक्रेता ने स्वीकार किया! कृपया डिलीवरी भेजने हेतु भुगतान पूरा करें।',
    payNowBtn: 'अभी भुगतान करें',
    paidDispatched: 'भुगतान संपन्न · एस्क्रो में सुरक्षित। डिलीवरी बेड़े को भेजा गया।',
    confirmReceiptBtn: '✓ सामग्री प्राप्ति की पुष्टि करें',
    receiptConfirmed: 'सामग्री प्राप्ति की पुष्टि हुई! लेनदेन पूर्ण व भुगतान जारी।',

    // Payment Modal
    instantPayment: 'त्वरित भुगतान',
    escrowProtocol: 'K2K सुरक्षित एस्क्रो प्रोटोकॉल',
    totalPayable: 'कुल देय राशि',
    upiTab: 'यूपीआई / क्यूआर',
    cardTab: 'कार्ड',
    codTab: 'पहुंचने पर',
    scanViaUpi: 'किसी भी यूपीआई ऐप से स्कैन करें',
    payInstantly: 'तुरंत भुगतान करें',
    paymentVerified: 'भुगतान सत्यापित!',
    securedInEscrow: 'एस्क्रो में सुरक्षित',
    escrowGuaranteeText: 'कचरा तो कमाई एस्क्रो द्वारा सुरक्षित। डिलीवरी के बाद ही विक्रेता को राशि मिलती है।',

    // 4-in-1 Presenter
    presenterTitle: 'संपूर्ण सर्कुलर जीवनचक्र',
    presenterLiveDemo: 'लाइव 4-व्यक्तिगत साझा मंच',
    presenterSub: 'एक ही स्क्रीन पर चारों उपयोगकर्ताओं का अनुभव देखें। किसी भी भाग में की गई क्रिया पूरे नेटवर्क में तुरंत अपडेट होती है।',
    focusView: 'फोकस दृश्य:',
    step1Ribbon: 'खरीद अनुरोध भेजें',
    step2Ribbon: 'अनुरोध स्वीकार करें',
    step3Ribbon: 'भुगतान करें (एस्क्रो)',
    step4Ribbon: 'पिकअप व डिलीवरी',
  },

  mr: {
    // Brand & Header
    tagline: 'कचऱ्यातून मूल्य · मूल्यांतून कमाई',
    region: 'कोपरगाव, महाराष्ट्र',
    buyer: 'खरेदीदार',
    seller: 'विक्रेता',
    fleet: 'सारथी फ्लीट',
    ops: 'ऑपरेशन्स',
    stage4in1: '4-इन-1 स्टेज',
    allMaterials: 'सर्व साहित्य',
    searchPlaceholder: 'कापूस पराटी, पुठ्ठा, प्लास्टिक क्रेट्स, भंगार शोधा...',

    // Roles & Portals
    buyerPortalTitle: 'प्रमाणित स्क्रॅप, शिल्लक व',
    buyerPortalSub: 'कोपरगाव परिसरातील उपलब्ध कच्चा माल तपासा, थेट विक्रेत्यांना खरेदी विनंती पाठवा, एस्क्रो द्वारे सुरक्षित पैसे भरा आणि घरपोच डिलिव्हरी मिळवा.',
    buyerTag: 'खरेदीदार पोर्टल · ग्राहक केंद्र',
    browseMaterials: 'साहित्य शोधा',
    myPurchases: 'माझ्या खरेदी',
    toPay: 'पैसे देणे बाकी',
    activeBatches: 'सक्रिय साठे',
    myOrdersCount: 'माझ्या ऑर्डर्स',
    paymentAwaitingAction: 'पैसे भरण्याची वाट पाहत आहे!',
    availableStock: 'उपलब्ध साठा',
    unitRate: 'दर प्रति युनिट',
    pickupHub: 'पिकअप केंद्र',
    distance: 'अंतर',
    buyRequest: 'खरेदी विनंती पाठवा',
    sendBuyRequest: 'विक्रेत्यास खरेदी विनंती पाठवा',
    qtyToRequest: 'मागणीचे प्रमाण',
    subtotal: 'साहित्याचे मूल्य',
    doorstepDelivery: 'घरपोच वाहतूक',
    estimatedTotal: 'अंदाजे एकूण रक्कम',
    sellerMustReview: 'पैसे भरण्यापूर्वी विक्रेत्याची संमती आवश्यक आहे.',

    // Seller Portal
    sellerPortalTitle: 'औद्योगिक कचऱ्यातून कमाई करा व',
    sellerPortalSub: 'कोपरगावातील स्थानिक खरेदीदारांकडून थेट मागण्या मिळवा, 1-क्लिकमध्ये मंजुरी द्या आणि मालाच्या पिकअपवर खात्रीशीर बँक पेमेंट मिळवा.',
    sellerTag: 'विक्रेता पोर्टल · कचऱ्यातून कमाई डॅशबोर्ड',
    incomingRequests: 'आलेल्या खरेदी मागण्या',
    myInventory: 'माझा शिल्लक साठा',
    pipelinePayouts: 'वाहतूक व पेमेंट्स',
    listNewScrap: '+ नवीन भंगार नोंदवा',
    newRequestsToAccept: 'स्वीकृतीसाठी नवीन मागण्या',
    ordersInPipeline: 'प्रक्रियेत असलेल्या ऑर्डर्स',
    netSellerKamai: 'निव्वळ विक्रेत्याची कमाई',
    activeListings: 'नोंदणीकृत साहित्य',
    buyerProfile: 'खरेदीदार माहिती',
    requestedVolume: 'मागणी केलेले प्रमाण',
    netPayoutToYou: 'आपली निव्वळ कमाई',
    acceptAndAlert: 'मागणी स्वीकारा व खरेदीदारास कळवा',
    decline: 'नाकारा',
    sellerSettlement: 'विक्रेत्यास देय रक्कम',

    // Fleet Portal
    fleetPortalTitle: 'थेट पॉईंट-टू-पॉईंट माल वाहतूक',
    fleetPortalSub: 'कोपरगाव मधील विक्रेत्यांकडून कृषी व औद्योगिक अवशेष उचला, थेट मार्गाने पोहोचवा आणि प्रति फेरी पारदर्शक भाडे मिळवा.',
    fleetTag: 'डिलिव्हरी फ्लीट पोर्टल · सारथी रायडर हब',
    availableForPickup: 'पिकअपसाठी उपलब्ध',
    activeDeliveries: 'सध्या चालू डिलिव्हरी',
    completedJobs: 'पूर्ण झालेल्या फेऱ्या',
    availablePickups: 'उपलब्ध माल',
    activeRuns: 'सक्रिय फेऱ्या',
    tripPayouts: 'फेरी कमाई',
    deliveredLoads: 'पोहोचवलेला माल',
    yourPayout: 'तुमची डिलिव्हरी कमाई',
    pickupPoint: 'पिकअप केंद्र (विक्रेता)',
    dropPoint: 'डिलिव्हरी ठिकाण (खरेदीदार)',
    acceptDelivery: 'डिलिव्हरी काम स्वीकारा',
    confirmPickup: 'विक्रेत्याकडून माल भरल्याची नोंद करा',
    confirmDrop: 'खरेदीदारास माल पोहोचवल्याची नोंद करा',
    deliveredSuccessfully: 'यशस्वीरीत्या पोहोचवले',

    // Admin Ops
    opsPortalTitle: 'कोपरगाव चक्रीय अर्थव्यवस्था',
    opsTag: 'ऑपरेशन्स व देखरेख कॉकपिट',
    commandCockpit: 'कमांड सेंटर',
    transactionsCount: 'एकूण व्यवहार',
    wasteDiverted: 'कचऱ्याचे पुनर्वापरात रूपांतर',
    platformGMV: 'एकूण उलाढाल (GMV)',
    escrowCommission: '5% एस्क्रो कमिशन',
    co2Avoidance: 'अंदाजे CO₂ बचत',
    generateDemoRequest: '⚡ टेस्ट खरेदी मागणी तयार करा',
    resetDemo: '↺ डेमो रीसेट करा',
    transactionFlowTitle: 'थेट 5-टप्प्यांची व्यवहार प्रक्रिया',
    orderLedgerTitle: 'सर्व व्यवहारांची तपशीलवार नोंदवही',
    all: 'सर्व',
    fastForward: 'पुढे न्या ➔',

    // Flow Steps & Badges
    stepRequested: 'मागणी पाठवली',
    stepAccepted: 'विक्रेत्याने स्वीकारली',
    stepPaid: 'पेमेंट पूर्ण',
    stepAssigned: 'सारथी नियुक्त',
    stepPickedUp: 'वाहतुकीत आहे',
    stepDelivered: 'पोहोचवला',
    stepCompleted: 'यशस्वी पूर्ण',

    // Flow prompts
    waitingSellerAccept: 'विक्रेत्याकडून मागणी स्वीकारण्याची प्रतीक्षा करत आहे.',
    sellerAcceptedPayNow: 'विक्रेत्याने स्वीकारले! कृपया माल पाठवण्यासाठी पेमेंट पूर्ण करा.',
    payNowBtn: 'आता पैसे भरा',
    paidDispatched: 'पेमेंट पूर्ण · एस्क्रो मध्ये सुरक्षित. वाहतुकीसाठी सारथी पाठवला.',
    confirmReceiptBtn: '✓ माल मिळाल्याची खात्री करा',
    receiptConfirmed: 'माल पोहोचल्याची खात्री झाली! व्यवहार पूर्ण व विक्रेत्यास रक्कम जमा.',

    // Payment Modal
    instantPayment: 'झटपट पेमेंट',
    escrowProtocol: 'K2K सुरक्षित एस्क्रो सुरक्षा',
    totalPayable: 'एकूण भरावयाची रक्कम',
    upiTab: 'यूपीआय / क्यूआर',
    cardTab: 'कार्ड',
    codTab: 'डिलिव्हरी वेळी',
    scanViaUpi: 'कोणत्याही UPI अ‍ॅपवरून स्कॅन करा',
    payInstantly: 'आता पैसे भरा',
    paymentVerified: 'पेमेंट यशस्वी!',
    securedInEscrow: 'एस्क्रो खात्यात सुरक्षित',
    escrowGuaranteeText: 'कचरा तो कमाई एस्क्रो द्वारे 100% सुरक्षित. माल पोहोचल्यावरच विक्रेत्यास पैसे दिले जातात.',

    // 4-in-1 Presenter
    presenterTitle: 'संपूर्ण चक्रीय व्यवहार चक्र',
    presenterLiveDemo: 'थेट 4-भूमिकांचे सादरीकरण मंच',
    presenterSub: 'एकाच स्क्रीनवर चौघांचे कार्य प्रत्यक्ष पहा. एका ठिकाणी केलेली कृती संपूर्ण यंत्रणेत लगेच दिसते.',
    focusView: 'लक्ष्य दृश्य:',
    step1Ribbon: 'खरेदी मागणी पाठवा',
    step2Ribbon: 'मागणी स्वीकारा',
    step3Ribbon: 'पैसे भरा (एस्क्रो)',
    step4Ribbon: 'पिकअप व डिलिव्हरी',
  },
};

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === 'undefined') return 'en';
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return ['en', 'hi', 'mr'].includes(stored) ? stored : 'en';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, lang);
    }
  }, [lang]);

  function setLang(newLang) {
    if (['en', 'hi', 'mr'].includes(newLang)) {
      setLangState(newLang);
    }
  }

  function t(key, fallback = '') {
    const dict = translations[lang] || translations.en;
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    const enDict = translations.en;
    if (enDict && enDict[key] !== undefined) {
      return enDict[key];
    }
    return fallback || key;
  }

  return createElement(
    LanguageContext.Provider,
    { value: { lang, setLang, t } },
    children
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
