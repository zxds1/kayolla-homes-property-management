import express from 'express';
import cors from 'cors';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import type { Request, Response, NextFunction } from 'express';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import type { Property } from './src/data/listings.ts';

type AppData = {
  listings: Property[];
  config: Record<string, unknown>;
  contactSubmissions?: ContactSubmission[];
  viewingRequests?: ViewingRequest[];
};

type ContactSubmission = {
  id: string;
  name: string;
  phone: string;
  service: string;
  message: string;
  createdAt: string;
};

type ViewingRequest = {
  id: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message: string;
  fee: number;
  createdAt: string;
};

type AuthorizedRequest = Request & {
  adminUser?: {
    uid: string;
    email?: string | null;
    name?: string | null;
  };
};

const DATA_FILE = path.join(process.cwd(), 'data.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const ALLOWED_ADMIN_EMAILS = (process.env.ALLOWED_ADMIN_EMAILS || process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || '';
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL || '';
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';
const firebaseStorageBucket = process.env.FIREBASE_STORAGE_BUCKET || (firebaseProjectId ? `${firebaseProjectId}.appspot.com` : '');
const firebaseConfigured = Boolean(firebaseProjectId && firebaseClientEmail && firebasePrivateKey);
const appUrl = process.env.APP_URL || '';
const allowedPublicOrigins = [
  appUrl,
  ...(process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
].filter(Boolean);

let firestore: ReturnType<typeof getFirestore> | null = null;
let storage: any = null;

if (firebaseConfigured && !getApps().length) {
  initializeApp({
    credential: cert({
      projectId: firebaseProjectId,
      clientEmail: firebaseClientEmail,
      privateKey: firebasePrivateKey,
    }),
    storageBucket: firebaseStorageBucket || undefined,
  });
}

if (firebaseConfigured) {
  firestore = getFirestore();
  storage = getStorage().bucket(firebaseStorageBucket);
}

const aiKey = process.env.GEMINI_API_KEY || '';
const ai = aiKey ? new GoogleGenAI({ apiKey: aiKey }) : null;

const publicLimiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

const writeLimiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const chatLimiter = rateLimit({
  windowMs: 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

async function ensureUploadsDir() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

async function readLocalData(): Promise<AppData> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as AppData;
  } catch (error) {
    console.error('Failed to read local data.json:', error);
    return { listings: [], config: {} };
  }
}

async function writeLocalData(data: AppData) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

function sanitizeText(value: unknown, maxLength = 500) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function sanitizeLongText(value: unknown, maxLength = 4000) {
  return sanitizeText(value, maxLength);
}

function isAllowedOrigin(origin: string | undefined) {
  if (!origin) return true;
  if (allowedPublicOrigins.length === 0) return true;
  return allowedPublicOrigins.some((allowed) => origin === allowed || origin.startsWith(`${allowed}/`));
}

function rejectSuspiciousOrigin(req: Request, res: Response) {
  const origin = req.header('origin') || undefined;
  if (!isAllowedOrigin(origin)) {
    res.status(403).json({ error: 'Invalid origin' });
    return true;
  }
  return false;
}

function pushLocalSubmission<T extends { id: string }>(key: keyof AppData, entry: T) {
  return readLocalData().then(async (data) => {
    const current = Array.isArray(data[key]) ? (data[key] as T[]) : [];
    const next = [...current, entry];
    await writeLocalData({ ...data, [key]: next });
  });
}

async function readSiteData(): Promise<AppData> {
  if (firestore) {
    try {
      const snapshot = await firestore.collection('site').doc('content').get();
      if (snapshot.exists) {
        const remote = snapshot.data()?.data as AppData | undefined;
        if (remote?.listings && remote?.config) {
          return remote;
        }
      }
    } catch (error) {
      console.error('Failed to read Firebase site data, falling back to local JSON:', error);
    }
  }

  return readLocalData();
}

async function saveSiteData(data: AppData) {
  if (firestore) {
    await firestore.collection('site').doc('content').set(
      {
        data,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return;
  }

  await writeLocalData(data);
}

async function requireAdmin(req: AuthorizedRequest, res: Response, next: NextFunction) {
  const authHeader = req.header('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (bearerToken && firebaseConfigured) {
    try {
      const decoded = await getAuth().verifyIdToken(bearerToken);
      const email = decoded.email?.toLowerCase() || null;
      if (ALLOWED_ADMIN_EMAILS.length > 0 && (!email || !ALLOWED_ADMIN_EMAILS.includes(email))) {
        return res.status(403).json({ error: 'You are not allowed to access the admin panel.' });
      }

      req.adminUser = {
        uid: decoded.uid,
        email: decoded.email ?? null,
        name: decoded.name ?? null,
      };
      return next();
    } catch (error) {
      console.error('Admin token verification failed:', error);
    }
  }

  if (!firebaseConfigured && process.env.NODE_ENV !== 'production') {
    return next();
  }

  if (process.env.NODE_ENV !== 'production' && process.env.ADMIN_PASSWORD) {
    const devPassword = req.header('x-admin-password');
    if (devPassword && devPassword === process.env.ADMIN_PASSWORD) {
      return next();
    }
  }

  return res.status(401).json({ error: 'Admin authentication required.' });
}

function normalizeSearchValue(value: unknown) {
  return String(value ?? '').trim().toLowerCase();
}

function matchesPropertySearch(property: Property, query: string) {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return true;

  const searchableFields = [
    property.id,
    property.title,
    property.type,
    property.location,
    property.description,
    property.price,
    ...(property.features ?? []),
    ...(property.amenities?.schools ?? []),
    ...(property.amenities?.hospitals ?? []),
    ...(property.amenities?.shopping ?? []),
  ];

  return searchableFields.some((field) => normalizeSearchValue(field).includes(normalizedQuery));
}

function matchesCriteria(property: Property, criteria?: { bedrooms?: number; bathrooms?: number; type?: string }) {
  if (!criteria) return true;
  const type = criteria.type?.trim() || 'All';
  const matchesType = type === 'All' || property.type === type;
  const matchesBedrooms = !criteria.bedrooms || criteria.bedrooms === 0 || (property.bedrooms ? property.bedrooms >= criteria.bedrooms : false);
  const matchesBathrooms = !criteria.bathrooms || criteria.bathrooms === 0 || (property.bathrooms ? property.bathrooms >= criteria.bathrooms : false);
  return matchesType && matchesBedrooms && matchesBathrooms;
}

function buildPropertyContext(data: AppData) {
  const summary = data.listings.map((property) => ({
    id: property.id,
    title: property.title,
    type: property.type,
    price: property.price,
    location: property.location,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    featured: property.isFeatured ?? false,
  }));

  return `
You are Kayolla Homes AI, a premium real-estate assistant for Mombasa, Kenya.

Company:
- Agency: ${String(data.config?.agencyName || 'Kayolla Homes')}
- Location: ${String(data.config?.location || 'Mombasa, Kenya')}
- Support Email: ${String(data.config?.supportEmail || 'support@kayolla.com')}
- Support Phone: ${String(data.config?.supportPhone || '0737 510 006')}

Services:
${JSON.stringify((data.config as any)?.services ?? [], null, 2)}

Listings summary:
${JSON.stringify(summary, null, 2)}

If the user asks about a listing, answer using the summary above and the full data passed in the conversation.
Keep answers short, practical, and grounded in the actual inventory.
`;
}

async function uploadFile(file: Express.Multer.File) {
  const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
  const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext) ? ext : '.jpg';
  const filename = `${Date.now()}-${randomUUID()}${safeExt}`;

  if (storage) {
    const remotePath = `uploads/${filename}`;
    const bucketFile = storage.file(remotePath);
    await bucketFile.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
        cacheControl: 'public, max-age=31536000, immutable',
      },
      resumable: false,
    });

    const [url] = await bucketFile.getSignedUrl({
      action: 'read',
      expires: new Date('2500-01-01T00:00:00.000Z'),
    });
    return url;
  }

  await ensureUploadsDir();
  const localPath = path.join(UPLOADS_DIR, filename);
  await fs.writeFile(localPath, file.buffer);
  return `/uploads/${filename}`;
}

async function startServer() {
  await ensureUploadsDir();
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(cors({ origin: true }));
  app.use(express.json({ limit: '5mb' }));
  app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '1y', immutable: true }));

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      firebase: firebaseConfigured,
      storage: Boolean(storage),
      firestore: Boolean(firestore),
    });
  });

  app.get('/api/data', publicLimiter, async (_req, res) => {
    try {
      const data = await readSiteData();
      res.json(data);
    } catch (error) {
      console.error('Failed to read site data:', error);
      res.status(500).json({ error: 'Failed to read site data' });
    }
  });

  app.post('/api/data', writeLimiter, requireAdmin, async (req: AuthorizedRequest, res) => {
    try {
      const data = req.body as AppData;
      if (!data || !Array.isArray(data.listings) || typeof data.config !== 'object') {
        return res.status(400).json({ error: 'Invalid data payload' });
      }

      await saveSiteData(data);
      res.json({ success: true });
    } catch (error) {
      console.error('Failed to save site data:', error);
      res.status(500).json({ error: 'Failed to save site data' });
    }
  });

  app.post('/api/upload', writeLimiter, requireAdmin, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({ error: 'Only image uploads are allowed' });
      }

      const url = await uploadFile(req.file);
      res.json({ url });
    } catch (error) {
      console.error('Upload failed:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  app.post('/api/contact', publicLimiter, async (req, res) => {
    try {
      if (rejectSuspiciousOrigin(req, res)) return;

      const submission: ContactSubmission = {
        id: randomUUID(),
        name: sanitizeText(req.body?.name, 120),
        phone: sanitizeText(req.body?.phone, 40),
        service: sanitizeText(req.body?.service, 120),
        message: sanitizeLongText(req.body?.message, 2000),
        createdAt: new Date().toISOString(),
      };

      if (sanitizeText(req.body?.website, 120)) {
        return res.status(400).json({ error: 'Invalid contact submission' });
      }

      if (!submission.name || !submission.phone || !submission.message) {
        return res.status(400).json({ error: 'Missing required contact fields' });
      }

      if (firestore) {
        await firestore.collection('contactSubmissions').add(submission);
      } else {
        await pushLocalSubmission('contactSubmissions', submission);
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Failed to save contact submission:', error);
      res.status(500).json({ error: 'Failed to save contact submission' });
    }
  });

  app.post('/api/viewings', publicLimiter, async (req, res) => {
    try {
      if (rejectSuspiciousOrigin(req, res)) return;

      const submission: ViewingRequest = {
        id: randomUUID(),
        propertyId: sanitizeText(req.body?.propertyId, 80),
        propertyTitle: sanitizeText(req.body?.propertyTitle, 160),
        name: sanitizeText(req.body?.name, 120),
        email: sanitizeText(req.body?.email, 120),
        phone: sanitizeText(req.body?.phone, 40),
        date: sanitizeText(req.body?.date, 20),
        time: sanitizeText(req.body?.time, 20),
        message: sanitizeLongText(req.body?.message, 2000),
        fee: Number(req.body?.fee || 0) || 0,
        createdAt: new Date().toISOString(),
      };

      if (sanitizeText(req.body?.website, 120)) {
        return res.status(400).json({ error: 'Invalid viewing request' });
      }

      if (!submission.propertyId || !submission.name || !submission.email || !submission.phone || !submission.date || !submission.time) {
        return res.status(400).json({ error: 'Missing required viewing fields' });
      }

      if (firestore) {
        await firestore.collection('viewingRequests').add(submission);
      } else {
        await pushLocalSubmission('viewingRequests', submission);
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Failed to save viewing request:', error);
      res.status(500).json({ error: 'Failed to save viewing request' });
    }
  });

  app.post('/api/search', publicLimiter, async (req, res) => {
    try {
      if (rejectSuspiciousOrigin(req, res)) return;

      const { query = '', criteria } = req.body as {
        query?: string;
        criteria?: { bedrooms?: number; bathrooms?: number; type?: string };
      };
      const safeQuery = sanitizeText(query, 200);
      const data = await readSiteData();
      const listings = data.listings.filter((property) => matchesPropertySearch(property, safeQuery) && matchesCriteria(property, criteria));

      if (!ai || !safeQuery.trim()) {
        return res.json({ listings });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
You are a real-estate search assistant.

Query: ${safeQuery}
Criteria: ${JSON.stringify(criteria || {}, null, 2)}

Available listings:
${JSON.stringify(data.listings, null, 2)}

Return only a JSON array of listing IDs that best match the request.
`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
      });

      const matchedIds = JSON.parse(response.text || '[]') as string[];
      const results = data.listings.filter((property) => matchedIds.includes(property.id));
      res.json({ listings: results.length ? results : listings });
    } catch (error) {
      console.error('AI search failed, using local filtering:', error);
      const data = await readSiteData();
      const { query = '', criteria } = req.body as {
        query?: string;
        criteria?: { bedrooms?: number; bathrooms?: number; type?: string };
      };
      const listings = data.listings.filter((property) => matchesPropertySearch(property, sanitizeText(query, 200)) && matchesCriteria(property, criteria));
      res.json({ listings });
    }
  });

  app.post('/api/chat', chatLimiter, async (req, res) => {
    try {
      if (rejectSuspiciousOrigin(req, res)) return;

      const { message = '', history = [] } = req.body as {
        message?: string;
        history?: { role: 'user' | 'bot'; text: string }[];
      };
      const safeMessage = sanitizeLongText(message, 2000);
      const safeHistory = Array.isArray(history)
        ? history
            .slice(-10)
            .map((entry) => ({
              role: entry.role === 'user' ? ('user' as const) : ('bot' as const),
              text: sanitizeLongText(entry.text, 1200),
            }))
        : [];
      const data = await readSiteData();

      if (!ai) {
        return res.json({
          text: `I can help with ${data.listings.length} active listings and current company details. Please enable GEMINI_API_KEY for full AI replies.`,
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: buildPropertyContext(data) }] },
          ...safeHistory.map((entry) => ({
            role: entry.role === 'user' ? ('user' as const) : ('model' as const),
            parts: [{ text: entry.text }],
          })),
          { role: 'user', parts: [{ text: safeMessage }] },
        ],
      });

      res.json({ text: response.text || 'I could not generate a response right now.' });
    } catch (error) {
      console.error('Chat failed:', error);
      res.status(500).json({ error: 'Chat failed' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Firebase: ${firebaseConfigured ? 'enabled' : 'disabled'}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exitCode = 1;
});
