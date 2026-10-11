// src/services/payment.service.ts
import api from "../api/axios";

export interface Payment {
    _id: string;
    user: string;
    booking: { _id: string; startDate: string; endDate: string; totalPrice: number } | string;
    amount: number;
    status: { _id: string; name: string; color: string; description: string } | string;
    paymentMethod: { _id: string; name: string; displayName: string; icon: string | null } | string;
    createdAt: string;
}

export interface PaymentMethod {
    _id: string;
    name: string;
    displayName: string;
    fee: number;
    active: boolean;
    icon: string | null;
}

export interface StatusPayment {
    _id: string;
    name: string;
    description: string;
    color: string;
    isFinal: boolean;
}

export async function getMyPayments(): Promise<Payment[]> {
    const { data } = await api.get<{ payments: Payment[] }>("/payments/my");
    return data.payments || [];
}

export async function getAllPayments(): Promise<Payment[]> {
    const { data } = await api.get<{ payments: Payment[] }>("/payments/all");
    return data.payments || [];
}

export async function createPayment(payload: {
    bookingId: string;
    amount: number;
    statusId: string;
    paymentMethodId: string;
}): Promise<Payment> {
    const { data } = await api.post<{ payment: Payment }>("/payments/create", payload);
    return data.payment;
}
