export interface LendingRequest {
    id?: string;
    bookId: string;
    requesterId: string;
    ownerId: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt?: Date;
    updatedAt?: Date;
}
