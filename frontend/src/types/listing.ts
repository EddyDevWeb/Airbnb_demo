export interface ListingHost {
    _id: string;
    name: string;
    email: string;
}

export interface ListingCategory {
    _id: string;
    name: string;
}

export interface ListingAvailability {
    startDate: string;
    endDate: string;
}

export interface Listing {
    _id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    images: string[];
    host: ListingHost | string;
    category: ListingCategory | string;
    availability?: ListingAvailability[];
    createdAt: string;
    updatedAt: string;
    rating?: number;
}

export interface Booking {
    _id: string;
    user: { _id: string; name: string; email: string } | string;
    listing: Listing | string;
    startDate: string;
    endDate: string;
    status: { _id: string; name: string; color: string } | string;
    totalPrice: number;
    createdAt: string;
}
