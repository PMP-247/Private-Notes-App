import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import { authenticateUser } from './middleware/auth.js';

dotenv.config();

const app = express(); // ✅ ONLY ONCE

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/notes', authenticateUser, notesRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`>>> SERVER ACTIVE ON PORT ${PORT}`);
});

export default app;
