import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as fileController from '../controllers/file.controller';

const upload = multer({ dest: 'uploads/' });
const router = Router();

// Upload file
router.post('/upload', authMiddleware, upload.single('file'), fileController.uploadFile);
// Visualizza file (solo se permesso)
router.get('/:id/view', authMiddleware, fileController.viewFile);

export { router as fileRouter };
