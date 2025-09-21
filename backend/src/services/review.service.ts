import db from '../config/db';
import { Review } from '../models/review.model';

const collection = db.collection('reviews');

export const createReview = async (review: Review): Promise<Review> => {
    const docRef = await collection.add({
        ...review,
        createdAt: new Date(),
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as Review;
};

export const getReviewsByBook = async (bookId: string): Promise<Review[]> => {
    const snapshot = await collection.where('bookId', '==', bookId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
};

export const getReviewById = async (id: string): Promise<Review | null> => {
    const doc = await collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Review;
};

export const updateReview = async (id: string, data: Partial<Review>): Promise<Review | null> => {
    const docRef = collection.doc(id);
    await docRef.update(data);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Review;
};

export const deleteReview = async (id: string): Promise<void> => {
    await collection.doc(id).delete();
};

export const getUserReviewForBook = async (bookId: string, userId: string): Promise<Review | null> => {
    const snapshot = await collection.where('bookId', '==', bookId).where('userId', '==', userId).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Review;
};
