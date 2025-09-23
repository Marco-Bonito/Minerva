import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { authRouter } from './routes/auth.route';

const app = express();

app.use(cors());
app.use(json());

app.use('/api/auth', authRouter);

export default app;