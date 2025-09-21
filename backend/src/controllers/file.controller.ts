import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { BAD_REQUEST, OK, NOT_FOUND, UNAUTHORIZED } from '../constants/httpStatus';
import { getBookById } from '../services/book.services';
import { getLendingRequestById } from '../services/lending.service';

// Upload file (solo salva il path, la logica di salvataggio su Firebase può essere aggiunta)
export const uploadFile = async (req: Request, res: Response) => {
    if (!req.file) return res.status(BAD_REQUEST).json({ message: 'No file uploaded' });
    // Qui puoi aggiungere logica per caricare su Firebase Storage e ottenere l'URL
    // Per ora restituiamo il path locale
    res.status(OK).json({ fileUrl: `/uploads/${req.file.filename}` });
};

// Visualizza file (solo se permesso)
export const viewFile = async (req: Request, res: Response) => {
    const { id } = req.params; // id del libro
    const userId = res.locals.user?.uid;
    const book = await getBookById(id);
    if (!book) return res.status(NOT_FOUND).json({ message: 'Book not found' });
    // Se pubblico, ok
    if (book.isPublic) {
        return streamFile(res, book.fileUrl);
    }
    // Se owner, ok
    if (book.ownerId === userId) {
        return streamFile(res, book.fileUrl);
    }
    // Se ha una richiesta approvata
    const lendingRequests = await import('../services/lending.service').then(m => m.getRequestsForRequester(userId));
    const hasAccess = lendingRequests.some(r => r.bookId === id && r.status === 'approved');
    if (hasAccess) {
        return streamFile(res, book.fileUrl);
    }
    return res.status(UNAUTHORIZED).json({ message: 'Access denied' });
};

function streamFile(res: Response, fileUrl: string) {
    const filePath = path.join(process.cwd(), fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl);
    if (!fs.existsSync(filePath)) {
        return res.status(NOT_FOUND).json({ message: 'File not found' });
    }
    res.setHeader('Content-Type', 'application/pdf'); // supponiamo PDF
    fs.createReadStream(filePath).pipe(res);
}
