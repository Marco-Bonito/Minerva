import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { authRouter, userRouter, bookRouter, reviewRouter, lendingRouter, fileRouter } from './routes';
import { errorHandler } from './middlewares/error.middleware';
import logger from './utils/logger';

const app = express();

app.use(cors());
app.use(json());


app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.use('/api/books', bookRouter);
app.use('/api/reviews', reviewRouter);

app.use('/api/lending', lendingRouter);

app.use('/api/files', fileRouter);

app.use(errorHandler);

app.use((req, res, next) => {
    logger.info({ message: 'Request received', method: req.method, url: req.originalUrl });
    next();
});

export default app;
