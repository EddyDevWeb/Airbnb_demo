// src/services/host.service.ts
import api from "../api/axios";
import type { Listing, Booking } from "../types/listing";

export async function getMyListings(): Promise<Listing[]> {
    const { data } = await api.get<{ listings: Listing[] }>("/listings/my");
    return data.listings;
}

export async function createListing(payload: {
    title: string;
    description: string;
    location: string;
    price: number;
    images: string[];
    category?: string;
}): Promise<Listing> {
    const { data } = await api.post<{ listing: Listing }>("/listings/create", payload);
    return data.listing;
}

export async function updateListing(id: string, payload: Partial<Listing>): Promise<Listing> {
    const { data } = await api.put<{ listing: Listing }>(`/listings/update/${id}`, payload);
    return data.listing;
}

export async function deleteListing(id: string): Promise<void> {
    await api.delete(`/listings/delete/${id}`);
}

export async function getHostBookings(): Promise<Booking[]> {
    const { data } = await api.get<{ bookings: Booking[] }>("/bookings/host");
    return data.bookings;
}

export async function updateBookingStatus(bookingId: string, statusName: string): Promise<Booking> {
    const { data } = await api.put<{ booking: Booking }>(`/bookings/${bookingId}/status`, { statusName });
    return data.booking;
}
