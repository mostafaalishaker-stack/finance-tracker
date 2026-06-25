import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  userId: number;
}

const transactions: Transaction[] = [];
let nextId = 1;
if (!process.env.JWT_SECRET) { console.error('Missing JWT_SECRET env var'); process.exit(1); }
const JWT_SECRET = process.env.JWT_SECRET;

interface JwtPayload {
  id: number;
  email: string;
}

function authMiddleware(req: Request, res: Response): number | void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as Request & { userId?: number }).userId = decoded.id;
    return decoded.id;
  } catch {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
}

router.get('/', (req: Request, res: Response) => {
  const userId = authMiddleware(req, res);
  if (!userId) return;

  let filtered = transactions.filter((t) => t.userId === userId);

  const month = req.query.month as string;
  const year = req.query.year as string;
  if (month && year) {
    filtered = filtered.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === parseInt(month) - 1 && d.getFullYear() === parseInt(year);
    });
  } else if (year) {
    filtered = filtered.filter((t) => new Date(t.date).getFullYear() === parseInt(year));
  }

  res.json(filtered);
});

router.post('/', (req: Request, res: Response) => {
  const userId = authMiddleware(req, res);
  if (!userId) return;

  const { type, amount, category, description, date } = req.body;
  if (!type || !amount || !category || !description || !date) {
    return res.status(400).json({ message: 'All fields required' });
  }
  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ message: 'Type must be income or expense' });
  }

  const transaction: Transaction = {
    id: nextId++,
    type,
    amount: parseFloat(amount),
    category,
    description,
    date,
    userId,
  };
  transactions.push(transaction);
  res.status(201).json(transaction);
});

router.delete('/:id', (req: Request, res: Response) => {
  const userId = authMiddleware(req, res);
  if (!userId) return;

  const id = parseInt(req.params.id);
  const index = transactions.findIndex((t) => t.id === id && t.userId === userId);
  if (index === -1) {
    return res.status(404).json({ message: 'Transaction not found' });
  }
  transactions.splice(index, 1);
  res.json({ message: 'Transaction deleted' });
});

router.get('/summary', (req: Request, res: Response) => {
  const userId = authMiddleware(req, res);
  if (!userId) return;

  const userTransactions = transactions.filter((t) => t.userId === userId);

  const totalIncome = userTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = userTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const categoryTotals: Record<string, number> = {};
  userTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
  const byCategory = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
  }));

  const now = new Date();
  const monthlyData: { month: string; income: number; expense: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' });
    const income = userTransactions
      .filter(
        (t) =>
          t.type === 'income' &&
          new Date(t.date).getMonth() === d.getMonth() &&
          new Date(t.date).getFullYear() === d.getFullYear()
      )
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = userTransactions
      .filter(
        (t) =>
          t.type === 'expense' &&
          new Date(t.date).getMonth() === d.getMonth() &&
          new Date(t.date).getFullYear() === d.getFullYear()
      )
      .reduce((sum, t) => sum + t.amount, 0);
    monthlyData.push({ month: monthLabel, income, expense });
  }

  res.json({ totalIncome, totalExpense, balance, byCategory, monthlyData });
});

export default router;
