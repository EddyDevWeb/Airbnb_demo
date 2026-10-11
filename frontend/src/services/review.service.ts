// src/services/review.service.ts
import api from "../api/axios";

export interface Review {
    _id: string;
    user: { _id: string; name: string; email: string };
    listing: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface ReviewResponse {
    reviews: Review[];
    average: number;
    count: number;
}

export async function getReviewsByListing(listingId: string): Promise<ReviewResponse> {
    const { data } = await api.get<ReviewResponse>(`/reviews/listing/${listingId}`);
    return data;
}

export async function createReview(listingId: string, rating: number, comment: string): Promise<Review> {
    const { data } = await api.post<{ review: Review }>("/reviews/create", { listingId, rating, comment });
    return data.review;
}

export async function deleteReview(id: string): Promise<void> {
    await api.delete(`/reviews/delete/${id}`);
}
