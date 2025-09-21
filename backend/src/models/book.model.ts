
export interface Book {
	id?: string;
	title: string;
	author: string;
	description?: string;
	fileUrl: string;
	ownerId: string; // user id
	isPublic: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}
