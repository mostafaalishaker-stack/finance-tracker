import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(authLimiter);

interface User {
  id: number;
  email: string;
  password: string;
}

const users: User[] = [];
let nextId = 1;
if (!process.env.JWT_SECRET) { console.error('Missing JWT_SECRET env var'); process.exit(1); }
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user: User = { id: nextId++, email, password: hashedPassword };
  users.push(user);
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });
  res.status(201).json({ token, user: { id: user.id, email: user.email } });
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });
  res.json({ token, user: { id: user.id, email: user.email } });
});

export default router;
