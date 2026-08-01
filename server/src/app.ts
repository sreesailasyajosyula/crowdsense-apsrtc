import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import journeyRoutes from './routes/journey.routes.js';
import insightsRoutes from './routes/insights.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // In local dev, allow any origin. In production, set FRONTEND_URL to
  // your deployed frontend's exact URL (e.g. https://your-app.vercel.app)
  // so only your own site can call this API.
  const allowedOrigin = process.env.FRONTEND_URL;
  app.use(
    cors(
      allowedOrigin
        ? { origin: allowedOrigin }
        : { origin: true }
    )
  );
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  app.use('/api/auth', authRoutes);
  app.use('/api/journeys', journeyRoutes);
  app.use('/api/insights', insightsRoutes);
  app.use('/api/admin', adminRoutes);

  app.use(errorHandler);

  return app;
}
