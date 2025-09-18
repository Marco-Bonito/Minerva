import { User } from '../models/user.model';
import db from '../config/db';

const usersCollection = db.collection('users');

export const getAllUsers = async () => {
    const snapshot = await usersCollection.get();
    const users: User[] = [];
    snapshot.forEach(doc => {
        const { password, ...user } = doc.data() as User;
        users.push({ ...user, id: doc.id });
    });
    return users;
}

export const getUserById = async (id: string) => {
    const userRef = await usersCollection.doc(id).get();
    if (!userRef.exists) {
        return null;
    }
    const { password, ...user } = userRef.data() as User;
    return { ...user, id: userRef.id };
}
