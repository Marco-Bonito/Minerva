import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { CREATED, OK } from '../constants/httpStatus';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await authService.register(req.body);
        res.status(CREATED).json(user);
    } catch (error) {
        next(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await authService.login(req.body);
        res.status(OK).json(user);
    } catch (error) {
        next(error);
    }
}
