import express from 'express';
import dotenv from 'dotenv';

// 1. Load environment variables IMMEDIATELY
dotenv.config();

import cookieParser from 'cookie-parser';
import cors from 'cors';

// 2. Import routes and middleware
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import { authenticateUser } from './middleware/auth.js';

const app = express();

// 3. CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://private-notes-app-five.vercel.app', 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Required for cross-domain cookies (Vercel -> Render)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 4. Standard Middleware
app.use(cookieParser()); // Must be before auth routes to read cookies
app.use(express.json());
app.set('trust proxy', 1); 

// 5. Request Logger (Helpful for debugging 404s)
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});


app.use('/api/notes', authenticateUser, notesRoutes);

// 7. Server Listener
const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`>>> SERVER ACTIVE ON PORT ${PORT}`);
});

export default app;