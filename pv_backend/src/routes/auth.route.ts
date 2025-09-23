//gestire tutta la parte di autenticazione
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/register');
authRouter.post('/login');
authRouter.post('/logout');
authRouter.post('/forgot-password');
authRouter.post('/reset-password');
authRouter.get('/is-authenticated');

export { authRouter };