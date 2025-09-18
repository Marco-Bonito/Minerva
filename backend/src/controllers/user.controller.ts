import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { OK } from '../constants/httpStatus';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(OK).json(users);
    } catch (error) {
        next(error);
    }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(OK).json(user);
    } catch (error) {
        next(error);
    }
}
