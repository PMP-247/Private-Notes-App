import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import { authenticateUser } from './middleware/auth.js';

dotenv.config();

const app = express();

// ✅ PRODUCTION-SAFE CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://YOUR-FRONTEND.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS blocked'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', authenticateUser, notesRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`>>> SERVER ACTIVE AT: http://0.0.0.0:${PORT}`);
});
export default app;
