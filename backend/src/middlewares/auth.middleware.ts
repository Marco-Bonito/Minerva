import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { UNAUTHORIZED } from '../constants/httpStatus';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')?.[1];
    if (!token) {
        return res.status(UNAUTHORIZED).json({ message: 'Unauthorized' });
    }
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        res.locals.user = decodedToken;
        next();
    } catch (error) {
        res.status(UNAUTHORIZED).json({ message: 'Unauthorized' });
    }
}
