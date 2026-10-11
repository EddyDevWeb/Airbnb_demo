// src/services/favorite.service.ts
import api from "../api/axios";
import type { Listing } from "../types/listing";

export interface Favorite {
    _id: string;
    user: string;
    listing: Listing;
    createdAt: string;
}

export async function addFavorite(listingId: string): Promise<void> {
    await api.post("/favorites/add", { listingId });
}

export async function getUserFavorites(): Promise<Favorite[]> {
    const { data } = await api.get<{ favorites: Favorite[] }>("/favorites/user/me");
    return data.favorites || [];
}

export async function removeFavorite(listingId: string): Promise<void> {
    await api.delete("/favorites/remove", { data: { listingId } });
}
