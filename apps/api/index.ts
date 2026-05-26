import express from 'express';
import cors    from 'cors';
import helmet  from 'helmet';
import nexusRoutes from './routes/nexus.routes';

const app  = express();
const PORT = process.env.PORT ?? 3001;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000' }));
app.use(express.json({ limit: '1mb' }));

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
