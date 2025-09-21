import { Router } from 'express';
import * as lendingController from '../controllers/lending.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Richiesta accesso a libro privato
router.post('/', authMiddleware, lendingController.requestAccess);
// Proprietario: visualizza richieste ricevute
router.get('/received', authMiddleware, lendingController.getRequestsForMe);
// Utente: visualizza richieste inviate
router.get('/sent', authMiddleware, lendingController.getMyRequests);
// Proprietario: approva/rifiuta richiesta
router.put('/:id', authMiddleware, lendingController.updateRequestStatus);

export { router as lendingRouter };
