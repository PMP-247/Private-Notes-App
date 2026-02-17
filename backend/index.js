import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

// --- Route Imports ---
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import { authenticateUser } from './middleware/auth.js';

dotenv.config();

const app = express();


// --- Middleware (Global) ---
// Note: Only define CORS once to avoid handshake conflicts
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// --- Routes ---

// 1. Auth Routes (Public - no middleware needed)
app.use('/api/auth', authRoutes);

// 2. Notes Routes (Protected - middleware included here)
app.use('/api/notes', authenticateUser, notesRoutes);

// --- Start Server ---
const PORT = 5001;
app.listen(PORT, '127.0.0.1', () => {
    console.log(`>>> SERVER ACTIVE AT: http://127.0.0.1:${PORT}`);
});