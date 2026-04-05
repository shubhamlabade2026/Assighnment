import { execSync } from 'child_process';
import { existsSync } from 'fs';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import recordRoutes from './routes/records';
import dashboardRoutes from './routes/dashboard';

// ─── Virtual Database (Vercel) ───────────────────────────────────────────────
// On Vercel, /tmp is a writable RAM-backed disk. We store SQLite there so no
// external database is needed. Data is ephemeral (resets on cold start).
if (process.env.VERCEL) {
  const dbPath = '/tmp/dev.db';
  process.env.DATABASE_URL = `file:${dbPath}`;
  if (!existsSync(dbPath)) {
    try {
      execSync('./node_modules/.bin/prisma db push --skip-generate --accept-data-loss', {
        stdio: 'pipe',
        env: { ...process.env, DATABASE_URL: `file:${dbPath}` },
      });
      console.log('✅ Virtual SQLite DB initialized at', dbPath);
    } catch (err) {
      console.error('❌ Virtual DB init error:', err);
    }
  }
}
// ─────────────────────────────────────────────────────────────────────────────

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Finance Dashboard API is running.' });
});

// Fallback error handling
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
