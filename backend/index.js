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



app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// --- Routes ---


app.use('/api/auth', authRoutes);


app.use('/api/notes', authenticateUser, notesRoutes);

// --- Start Server ---
const PORT = 5001;
app.listen(PORT, '127.0.0.1', () => {
    console.log(`>>> SERVER ACTIVE AT: http://127.0.0.1:${PORT}`);
});

export default app;