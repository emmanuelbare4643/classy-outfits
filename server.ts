import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_DELIVERIES, 
  INITIAL_BUSINESS_INFO, 
  INITIAL_REVIEWS 
} from './src/data/defaultData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Dedicated server-side persistent data directory
const DATA_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const DELIVERIES_FILE = path.join(DATA_DIR, 'deliveries.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const BUSINESS_FILE = path.join(DATA_DIR, 'businessInfo.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Helper to safely load or seed JSON files
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.trim()) {
        return JSON.parse(content);
      }
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonFile(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Initialize seed data if not present
if (!fs.existsSync(PRODUCTS_FILE)) {
  writeJsonFile(PRODUCTS_FILE, INITIAL_PRODUCTS);
}
if (!fs.existsSync(DELIVERIES_FILE)) {
  writeJsonFile(DELIVERIES_FILE, INITIAL_DELIVERIES);
}
if (!fs.existsSync(REVIEWS_FILE)) {
  writeJsonFile(REVIEWS_FILE, INITIAL_REVIEWS);
}
if (!fs.existsSync(BUSINESS_FILE)) {
  writeJsonFile(BUSINESS_FILE, INITIAL_BUSINESS_INFO);
}
if (!fs.existsSync(SETTINGS_FILE)) {
  writeJsonFile(SETTINGS_FILE, {
    onlyShowOwnerUploads: false,
    ownerCustomPin: '7913',
  });
}

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server for real-time instantaneous sync across devices
const wss = new WebSocketServer({ server, path: '/ws' });

// Broadcast helper to notify all connected phones and customer browsers immediately
function broadcast(event: { type: string; payload: any }) {
  const message = JSON.stringify(event);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(message);
      } catch (err) {
        console.error('WebSocket send error:', err);
      }
    }
  });
}

// When a client connects, send initial server state
wss.on('connection', (ws) => {
  try {
    const products = readJsonFile(PRODUCTS_FILE, INITIAL_PRODUCTS);
    const deliveries = readJsonFile(DELIVERIES_FILE, INITIAL_DELIVERIES);
    const reviews = readJsonFile(REVIEWS_FILE, INITIAL_REVIEWS);
    const businessInfo = readJsonFile(BUSINESS_FILE, INITIAL_BUSINESS_INFO);
    const settings = readJsonFile(SETTINGS_FILE, {
      onlyShowOwnerUploads: false,
      ownerCustomPin: '7913',
    });

    ws.send(JSON.stringify({
      type: 'init',
      payload: { products, deliveries, reviews, businessInfo, settings },
    }));
  } catch (err) {
    console.error('Failed to send init payload on WS connection:', err);
  }

  // Handle client ping
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      }
    } catch {}
  });
});

// ======================== API ROUTES ========================

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    time: new Date().toISOString(),
    connectedClients: wss.clients.size 
  });
});

// Products API
app.get('/api/products', (_req, res) => {
  const products = readJsonFile(PRODUCTS_FILE, INITIAL_PRODUCTS);
  res.json(products);
});

app.post('/api/products', (req, res) => {
  try {
    const products = readJsonFile<any[]>(PRODUCTS_FILE, INITIAL_PRODUCTS);
    const newProduct = {
      ...req.body,
      id: req.body.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      dateAdded: req.body.dateAdded || new Date().toISOString().split('T')[0],
      isOwnerUploaded: true,
    };
    
    // Add new product right at the top so it is immediately visible to all visitors
    const updated = [newProduct, ...products.filter(p => p.id !== newProduct.id)];
    writeJsonFile(PRODUCTS_FILE, updated);
    
    // Real-time broadcast immediately to all devices!
    broadcast({ type: 'product:created', payload: newProduct });

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const products = readJsonFile<any[]>(PRODUCTS_FILE, INITIAL_PRODUCTS);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    products[index] = { ...products[index], ...req.body };
    writeJsonFile(PRODUCTS_FILE, products);
    
    // Real-time broadcast update
    broadcast({ type: 'product:updated', payload: products[index] });

    res.json(products[index]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const products = readJsonFile<any[]>(PRODUCTS_FILE, INITIAL_PRODUCTS);
    const filtered = products.filter((p) => p.id !== id);
    writeJsonFile(PRODUCTS_FILE, filtered);
    
    // Real-time broadcast deletion
    broadcast({ type: 'product:deleted', payload: { id } });

    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Deliveries API (Real photos of products delivered)
app.get('/api/deliveries', (_req, res) => {
  const deliveries = readJsonFile(DELIVERIES_FILE, INITIAL_DELIVERIES);
  res.json(deliveries);
});

app.post('/api/deliveries', (req, res) => {
  try {
    const deliveries = readJsonFile<any[]>(DELIVERIES_FILE, INITIAL_DELIVERIES);
    const newDelivery = {
      ...req.body,
      id: req.body.id || `del-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      date: req.body.date || new Date().toISOString().split('T')[0],
      isOwnerUploaded: true,
    };
    const updated = [newDelivery, ...deliveries.filter(d => d.id !== newDelivery.id)];
    writeJsonFile(DELIVERIES_FILE, updated);
    
    // Real-time broadcast immediately
    broadcast({ type: 'delivery:created', payload: newDelivery });

    res.status(201).json(newDelivery);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add delivery proof' });
  }
});

app.delete('/api/deliveries/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deliveries = readJsonFile<any[]>(DELIVERIES_FILE, INITIAL_DELIVERIES);
    const filtered = deliveries.filter((d) => d.id !== id);
    writeJsonFile(DELIVERIES_FILE, filtered);
    
    broadcast({ type: 'delivery:deleted', payload: { id } });

    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete delivery' });
  }
});

// Reviews API
app.get('/api/reviews', (_req, res) => {
  const reviews = readJsonFile(REVIEWS_FILE, INITIAL_REVIEWS);
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  try {
    const reviews = readJsonFile<any[]>(REVIEWS_FILE, INITIAL_REVIEWS);
    const newReview = {
      ...req.body,
      id: req.body.id || `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      date: req.body.date || 'Just now',
      likes: 0,
    };
    const updated = [newReview, ...reviews];
    writeJsonFile(REVIEWS_FILE, updated);
    
    broadcast({ type: 'review:created', payload: newReview });

    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

app.post('/api/reviews/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const reviews = readJsonFile<any[]>(REVIEWS_FILE, INITIAL_REVIEWS);
    const index = reviews.findIndex((r) => r.id === id);
    if (index !== -1) {
      reviews[index].likes = (reviews[index].likes || 0) + 1;
      writeJsonFile(REVIEWS_FILE, reviews);
      
      broadcast({ type: 'review:liked', payload: reviews[index] });

      res.json(reviews[index]);
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to like review' });
  }
});

app.delete('/api/reviews/:id', (req, res) => {
  try {
    const { id } = req.params;
    const reviews = readJsonFile<any[]>(REVIEWS_FILE, INITIAL_REVIEWS);
    const filtered = reviews.filter((r) => r.id !== id);
    writeJsonFile(REVIEWS_FILE, filtered);
    
    broadcast({ type: 'review:deleted', payload: { id } });

    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Business Info & Principles API
app.get('/api/business-info', (_req, res) => {
  const info = readJsonFile(BUSINESS_FILE, INITIAL_BUSINESS_INFO);
  res.json(info);
});

app.post('/api/business-info', (req, res) => {
  try {
    const current = readJsonFile(BUSINESS_FILE, INITIAL_BUSINESS_INFO);
    const updated = { ...current, ...req.body };
    writeJsonFile(BUSINESS_FILE, updated);
    
    broadcast({ type: 'businessInfo:updated', payload: updated });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update business info' });
  }
});

// Settings API
app.get('/api/settings', (_req, res) => {
  const settings = readJsonFile(SETTINGS_FILE, {
    onlyShowOwnerUploads: false,
    ownerCustomPin: '7913',
  });
  res.json(settings);
});

app.post('/api/settings', (req, res) => {
  try {
    const current = readJsonFile(SETTINGS_FILE, {
      onlyShowOwnerUploads: false,
      ownerCustomPin: '7913',
    });
    const updated = { ...current, ...req.body };
    writeJsonFile(SETTINGS_FILE, updated);
    
    broadcast({ type: 'settings:updated', payload: updated });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Reset to Defaults
app.post('/api/reset-defaults', (_req, res) => {
  try {
    writeJsonFile(PRODUCTS_FILE, INITIAL_PRODUCTS);
    writeJsonFile(DELIVERIES_FILE, INITIAL_DELIVERIES);
    writeJsonFile(REVIEWS_FILE, INITIAL_REVIEWS);
    writeJsonFile(BUSINESS_FILE, INITIAL_BUSINESS_INFO);
    writeJsonFile(SETTINGS_FILE, {
      onlyShowOwnerUploads: false,
      ownerCustomPin: '7913',
    });

    broadcast({
      type: 'store:reset',
      payload: {
        products: INITIAL_PRODUCTS,
        deliveries: INITIAL_DELIVERIES,
        reviews: INITIAL_REVIEWS,
        businessInfo: INITIAL_BUSINESS_INFO,
      },
    });

    res.json({ success: true, message: 'Reset completed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset' });
  }
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server and WebSockets running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
