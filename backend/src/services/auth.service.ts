import { User } from '../models/user.model';
import db from '../config/db';
import { hashPassword, comparePassword } from '../utils/hashPassword';
import { userSchema } from '../validations/user.validation';

const usersCollection = db.collection('users');

export const register = async (userData: User) => {
    const { error } = userSchema.validate(userData);
    if (error) {
        throw new Error(error.details[0].message);
    }
    const { username, password, email } = userData;
    const hashedPassword = await hashPassword(password!);
    const newUser: User = {
        username,
        password: hashedPassword,
        email
    }
    const userRef = await usersCollection.add(newUser);
    const user = await userRef.get();
    return { ...user.data(), id: user.id };
}

export const login = async (userData: User) => {
    const { username, password } = userData;
    const userRef = await usersCollection.where('username', '==', username).get();
    if (userRef.empty) {
        throw new Error('Invalid credentials');
    }
    const user = userRef.docs[0].data() as User;
    const isValid = await comparePassword(password!, user.password!);   
    if (!isValid) {
        throw new Error('Invalid credentials');
    }
    const { password: userPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
