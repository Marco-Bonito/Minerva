import { Request, Response } from 'express';
import * as reviewService from '../services/review.service';
import { createReviewSchema, updateReviewSchema } from '../validations/review.validation';
import { BAD_REQUEST, NOT_FOUND, OK, CREATED } from '../constants/httpStatus';
import { getBookById } from '../services/book.services';

export const createReview = async (req: Request, res: Response) => {
    const { error } = createReviewSchema.validate(req.body);
    if (error) return res.status(BAD_REQUEST).json({ message: error.details[0].message });
    const userId = res.locals.user?.uid;
    if (!userId) return res.status(BAD_REQUEST).json({ message: 'User not authenticated' });
    const { bookId } = req.body;
    // Verifica che l'utente abbia accesso al libro (owner o pubblico)
    const book = await getBookById(bookId);
    if (!book) return res.status(NOT_FOUND).json({ message: 'Book not found' });
    if (!book.isPublic && book.ownerId !== userId) {
        return res.status(403).json({ message: 'Access denied to this book' });
    }
    // Un utente può lasciare una sola recensione per libro
    const existing = await reviewService.getUserReviewForBook(bookId, userId);
    if (existing) return res.status(BAD_REQUEST).json({ message: 'You already reviewed this book' });
    const review = await reviewService.createReview({ ...req.body, userId });
    res.status(CREATED).json(review);
};

export const getReviewsByBook = async (req: Request, res: Response) => {
    const { bookId } = req.params;
    const reviews = await reviewService.getReviewsByBook(bookId);
    res.status(OK).json(reviews);
};

export const updateReview = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { error } = updateReviewSchema.validate(req.body);
    if (error) return res.status(BAD_REQUEST).json({ message: error.details[0].message });
    const userId = res.locals.user?.uid;
    const review = await reviewService.getReviewById(id);
    if (!review) return res.status(NOT_FOUND).json({ message: 'Review not found' });
    if (review.userId !== userId) return res.status(403).json({ message: 'Not your review' });
    const updated = await reviewService.updateReview(id, req.body);
    res.status(OK).json(updated);
};

export const deleteReview = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = res.locals.user?.uid;
    const review = await reviewService.getReviewById(id);
    if (!review) return res.status(NOT_FOUND).json({ message: 'Review not found' });
    if (review.userId !== userId) return res.status(403).json({ message: 'Not your review' });
    await reviewService.deleteReview(id);
    res.status(OK).json({ message: 'Review deleted' });
};
