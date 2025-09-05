import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

// Import routers
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import projectRouter from './routes/project.routes.js';
import teamRouter from './routes/team.routes.js';
import chatRouter from './routes/chat.routes.js';
import learningRouter from './routes/learning.routes.js';

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to TeamSync API!', status: 'OK' });
});

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/teams', teamRouter);
app.use('/api/v1/chats', chatRouter);
app.use('/api/v1/learning', learningRouter);

export default app;