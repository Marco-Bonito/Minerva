
import { Request, Response } from 'express';
import * as bookService from '../services/book.services';
import { createBookSchema, updateBookSchema } from '../validations/book.validation';
import { BAD_REQUEST, NOT_FOUND, OK, CREATED } from '../constants/httpStatus';

export const createBook = async (req: Request, res: Response) => {
	const { error } = createBookSchema.validate(req.body);
	if (error) return res.status(BAD_REQUEST).json({ message: error.details[0].message });
	const ownerId = res.locals.user?.uid;
	if (!ownerId) return res.status(BAD_REQUEST).json({ message: 'User not authenticated' });
	try {
		const book = await bookService.createBook({ ...req.body, ownerId });
		res.status(CREATED).json(book);
	} catch (err) {
		res.status(BAD_REQUEST).json({ message: 'Error creating book', error: err });
	}
};

export const getBook = async (req: Request, res: Response) => {
	const { id } = req.params;
	const book = await bookService.getBookById(id);
	if (!book) return res.status(NOT_FOUND).json({ message: 'Book not found' });
	// Se privato, solo owner o chi ha accesso può vedere (qui solo owner per ora)
	if (!book.isPublic && res.locals.user?.uid !== book.ownerId) {
		return res.status(403).json({ message: 'Access denied' });
	}
	res.status(OK).json(book);
};

export const getBooks = async (req: Request, res: Response) => {
	const userId = res.locals.user?.uid;
	const books = await bookService.getAllBooks(userId);
	res.status(OK).json(books);
};

export const updateBook = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { error } = updateBookSchema.validate(req.body);
	if (error) return res.status(BAD_REQUEST).json({ message: error.details[0].message });
	const book = await bookService.getBookById(id);
	if (!book) return res.status(NOT_FOUND).json({ message: 'Book not found' });
	if (res.locals.user?.uid !== book.ownerId) {
		return res.status(403).json({ message: 'Access denied' });
	}
	const updated = await bookService.updateBook(id, req.body);
	res.status(OK).json(updated);
};

export const deleteBook = async (req: Request, res: Response) => {
	const { id } = req.params;
	const book = await bookService.getBookById(id);
	if (!book) return res.status(NOT_FOUND).json({ message: 'Book not found' });
	if (res.locals.user?.uid !== book.ownerId) {
		return res.status(403).json({ message: 'Access denied' });
	}
	await bookService.deleteBook(id);
	res.status(OK).json({ message: 'Book deleted' });
};
