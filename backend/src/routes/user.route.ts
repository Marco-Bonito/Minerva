import { Router } from 'express';
import { getAllUsers, getUserById } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const userRouter = Router();

userRouter.get('/', authMiddleware, getAllUsers);
userRouter.get('/:id', authMiddleware, getUserById);

export { userRouter };
