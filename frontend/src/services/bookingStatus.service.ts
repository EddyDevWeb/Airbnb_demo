// src/services/bookingStatus.service.ts
import api from "../api/axios";

export interface BookingStatus {
    _id: string;
    name: string;
    description: string;
    color: string;
    isFinal: boolean;
}

export async function getAllBookingStatuses(): Promise<BookingStatus[]> {
    const { data } = await api.get<{ statuses: BookingStatus[] }>("/bookingsStatus/booking-statuses/getAll");
    return data.statuses;
}

export async function createBookingStatus(payload: {
    name: string;
    description: string;
    color: string;
    isFinal: boolean;
}): Promise<BookingStatus> {
    const { data } = await api.post<{ status: BookingStatus }>("/bookingsStatus/booking-statuses/create", payload);
    return data.status;
}

export async function updateBookingStatus(id: string, payload: Partial<BookingStatus>): Promise<BookingStatus> {
    const { data } = await api.put<{ status: BookingStatus }>(`/bookingsStatus/booking-statuses/update/${id}`, payload);
    return data.status;
}

export async function deleteBookingStatus(id: string): Promise<void> {
    await api.delete(`/bookingsStatus/booking-statuses/delete/${id}`);
}
