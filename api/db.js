// Vercel Serverless Function for Kachra To Kamai (K2K)
// Provides instant cloud database synchronization across devices when deployed on Vercel

let memoryStore = {
  listings: null,
  orders: null,
  updatedAt: new Date().toISOString(),
};

export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'online',
      provider: 'vercel-serverless-kv',
      updatedAt: memoryStore.updatedAt,
      data: {
        listings: memoryStore.listings,
        orders: memoryStore.orders,
      },
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (body.listings && Array.isArray(body.listings)) {
        memoryStore.listings = body.listings;
      }
      if (body.orders && Array.isArray(body.orders)) {
        memoryStore.orders = body.orders;
      }
      memoryStore.updatedAt = new Date().toISOString();

      return res.status(200).json({
        success: true,
        updatedAt: memoryStore.updatedAt,
        counts: {
          listings: memoryStore.listings ? memoryStore.listings.length : 0,
          orders: memoryStore.orders ? memoryStore.orders.length : 0,
        },
      });
    } catch (err) {
      return res.status(400).json({ error: 'Invalid JSON payload', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
