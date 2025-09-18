import { Request, Response, NextFunction } from 'express';
import { INTERNAL_SERVER_ERROR } from '../constants/httpStatus';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || INTERNAL_SERVER_ERROR;
    const message = err.message || 'Something went wrong';
    res.status(status).json({ message });
}
