import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { authRouter, userRouter } from './routes';
import { errorHandler } from './middlewares/error.middleware';
import logger from './utils/logger';

const app = express();

app.use(cors());
app.use(json());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.use(errorHandler);

app.use((req, res, next) => {
    logger.info({ message: 'Request received', method: req.method, url: req.originalUrl });
    next();
});

export default app;
