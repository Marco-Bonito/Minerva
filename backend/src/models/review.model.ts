export interface Review {
    id?: string;
    bookId: string;
    userId: string;
    rating: number; // 1-5
    comment?: string;
    createdAt?: Date;
}