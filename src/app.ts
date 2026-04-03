import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import recordRoutes from './routes/records';
import dashboardRoutes from './routes/dashboard';

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
