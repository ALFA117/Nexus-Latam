import express from 'express';
import cors    from 'cors';
import helmet  from 'helmet';
import rateLimit from 'express-rate-limit';
import nexusRoutes from './routes/nexus.routes';

const app  = express();
const PORT = process.env.PORT ?? 3001;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000' }));
app.use(express.json({ limit: '1mb' }));

// Rate limit: 120 req/min por IP en todos los endpoints públicos
app.use('/api/v1', rateLimit({
  windowMs:    60 * 1000,
  max:         120,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Too many requests — please wait a moment' },
}));

// Stricter limit on trade creation (prevents spam)
app.use('/api/v1/trades', rateLimit({
  windowMs:    60 * 1000,
  max:         10,
  methods:     ['POST'],
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Trade creation rate limit exceeded — max 10/min' },
}));

// API routes
app.use('/api/v1', nexusRoutes);

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[API Error]', err.message);
  res.status(500).json({ error: err.message ?? 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`NEXUS LATAM API running on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/v1/health`);
});

export default app;
