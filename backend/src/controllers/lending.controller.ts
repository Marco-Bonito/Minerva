import { Request, Response } from 'express';
import * as lendingService from '../services/lending.service';
import { createLendingRequestSchema, updateLendingRequestSchema } from '../validations/lending.validation';
import { getBookById } from '../services/book.services';
import { BAD_REQUEST, NOT_FOUND, OK, CREATED } from '../constants/httpStatus';
import { sendEmail } from '../services/email.service';
import db from '../config/db';

export const requestAccess = async (req: Request, res: Response) => {
    const { error } = createLendingRequestSchema.validate(req.body);
    if (error) return res.status(BAD_REQUEST).json({ message: error.details[0].message });
    const requesterId = res.locals.user?.uid;
    if (!requesterId) return res.status(BAD_REQUEST).json({ message: 'User not authenticated' });
    const { bookId } = req.body;
    const book = await getBookById(bookId);
    if (!book) return res.status(NOT_FOUND).json({ message: 'Book not found' });
    if (book.isPublic) return res.status(BAD_REQUEST).json({ message: 'Book is public, no need to request access' });
    if (book.ownerId === requesterId) return res.status(BAD_REQUEST).json({ message: 'You are the owner' });
    // Check if already requested
    const existing = await lendingService.getRequestsForRequester(requesterId);
    if (existing.some(r => r.bookId === bookId && r.status === 'pending')) {
        return res.status(BAD_REQUEST).json({ message: 'Request already pending' });
    }
    const request = await lendingService.createLendingRequest({
        bookId,
        requesterId,
        ownerId: book.ownerId,
        status: 'pending',
    });

    // Recupera email del proprietario e del richiedente
    const ownerSnap = await db.collection('users').doc(book.ownerId).get();
    const requesterSnap = await db.collection('users').doc(requesterId).get();
    const owner = ownerSnap.data();
    const requester = requesterSnap.data();
    if (owner?.email && requester?.username) {
        await sendEmail(
            owner.email,
            'Nuova richiesta di accesso a un tuo libro',
            `L'utente ${requester.username} ha richiesto di visualizzare il tuo libro: ${book.title}`
        );
    }

    res.status(CREATED).json(request);
};

export const getRequestsForMe = async (req: Request, res: Response) => {
    const ownerId = res.locals.user?.uid;
    if (!ownerId) return res.status(BAD_REQUEST).json({ message: 'User not authenticated' });
    const requests = await lendingService.getRequestsForOwner(ownerId);
    res.status(OK).json(requests);
};

export const getMyRequests = async (req: Request, res: Response) => {
    const requesterId = res.locals.user?.uid;
    if (!requesterId) return res.status(BAD_REQUEST).json({ message: 'User not authenticated' });
    const requests = await lendingService.getRequestsForRequester(requesterId);
    res.status(OK).json(requests);
};

export const updateRequestStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { error } = updateLendingRequestSchema.validate(req.body);
    if (error) return res.status(BAD_REQUEST).json({ message: error.details[0].message });
    const ownerId = res.locals.user?.uid;
    const request = await lendingService.getLendingRequestById(id);
    if (!request) return res.status(NOT_FOUND).json({ message: 'Request not found' });
    if (request.ownerId !== ownerId) return res.status(403).json({ message: 'Not your request to approve/reject' });
    const updated = await lendingService.updateLendingRequest(id, { status: req.body.status });
    res.status(OK).json(updated);
};
