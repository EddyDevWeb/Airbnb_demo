// src/services/booking.service.ts
import api from "../api/axios";
import { type Booking } from "../types/listing";

interface CreateBookingPayload {
    user: string;
    listing: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
    const { data } = await api.post<{ booking: Booking }>("/bookings/create", payload);
    return data.booking;
}

export async function getAllBookings(): Promise<Booking[]> {
    const { data } = await api.get<{ bookings: Booking[] }>("/bookings/GetAll");
    return data.bookings;
}

export async function deleteBooking(id: string): Promise<void> {
    await api.delete(`/bookings/delete/${id}`);
}
