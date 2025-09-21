import db from '../config/db';
import { LendingRequest } from '../models/lending.model';

const collection = db.collection('lendingRequests');

export const createLendingRequest = async (request: LendingRequest): Promise<LendingRequest> => {
    const docRef = await collection.add({
        ...request,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as LendingRequest;
};

export const getLendingRequestById = async (id: string): Promise<LendingRequest | null> => {
    const doc = await collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as LendingRequest;
};

export const getRequestsForBook = async (bookId: string): Promise<LendingRequest[]> => {
    const snapshot = await collection.where('bookId', '==', bookId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LendingRequest));
};

export const getRequestsForOwner = async (ownerId: string): Promise<LendingRequest[]> => {
    const snapshot = await collection.where('ownerId', '==', ownerId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LendingRequest));
};

export const getRequestsForRequester = async (requesterId: string): Promise<LendingRequest[]> => {
    const snapshot = await collection.where('requesterId', '==', requesterId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LendingRequest));
};

export const updateLendingRequest = async (id: string, data: Partial<LendingRequest>): Promise<LendingRequest | null> => {
    const docRef = collection.doc(id);
    await docRef.update({ ...data, updatedAt: new Date() });
    const doc = await docRef.get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as LendingRequest;
};
