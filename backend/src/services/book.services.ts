import db from '../config/db';
import { Book } from '../models/book.model';

const collection = db.collection('books');

export const createBook = async (book: Book): Promise<Book> => {
	const docRef = await collection.add({
		...book,
		createdAt: new Date(),
		updatedAt: new Date(),
	});
	const doc = await docRef.get();
	return { id: doc.id, ...doc.data() } as Book;
};

export const getBookById = async (id: string): Promise<Book | null> => {
	const doc = await collection.doc(id).get();
	if (!doc.exists) return null;
	return { id: doc.id, ...doc.data() } as Book;
};

export const getAllBooks = async (userId?: string): Promise<Book[]> => {
	// Se userId è fornito, mostra anche i privati dell'utente
	let query = collection.where('isPublic', '==', true);
	if (userId) {
		query = db.collectionGroup('books').where('isPublic', 'in', [true, false]).where('ownerId', '==', userId);
	}
	const snapshot = await query.get();
	return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
};

export const updateBook = async (id: string, data: Partial<Book>): Promise<Book | null> => {
	const docRef = collection.doc(id);
	await docRef.update({ ...data, updatedAt: new Date() });
	const doc = await docRef.get();
	if (!doc.exists) return null;
	return { id: doc.id, ...doc.data() } as Book;
};

export const deleteBook = async (id: string): Promise<void> => {
	await collection.doc(id).delete();
};

export const getBooksByOwner = async (ownerId: string): Promise<Book[]> => {
	const snapshot = await collection.where('ownerId', '==', ownerId).get();
	return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
};
