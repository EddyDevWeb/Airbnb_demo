// src/services/listing.service.ts
import api from "../api/axios";
import { type Listing } from "../types/listing";

export async function getAllListings(): Promise<Listing[]> {
    const { data } = await api.get<{ listings: Listing[] }>("/listings/get");
    return data.listings;
}

export async function getListingById(id: string): Promise<Listing> {
    const { data } = await api.get<{ listing: Listing }>(`/listings/getId/${id}`);
    return data.listing;
}
