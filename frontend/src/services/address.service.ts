// src/services/address.service.ts
import api from "../api/axios";

export interface Address {
    _id: string;
    user: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export async function createAddress(payload: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}): Promise<Address> {
    const { data } = await api.post<{ address: Address }>("/addresses/create", payload);
    return data.address;
}

export async function getMyAddresses(): Promise<Address[]> {
    const { data } = await api.get<{ value: Address[]; Count: number }>("/addresses/get/me");
    return data.value || [];
}

export async function deleteAddress(id: string): Promise<void> {
    await api.delete(`/addresses/addresses/${id}`);
}
