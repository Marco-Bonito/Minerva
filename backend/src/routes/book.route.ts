
import { Router } from 'express';
import * as bookController from '../controllers/book.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, bookController.createBook);
router.get('/', authMiddleware, bookController.getBooks);
router.get('/:id', authMiddleware, bookController.getBook);
router.put('/:id', authMiddleware, bookController.updateBook);
router.delete('/:id', authMiddleware, bookController.deleteBook);

export { router as bookRouter };
