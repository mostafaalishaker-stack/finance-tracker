import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
