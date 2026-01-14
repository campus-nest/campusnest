export type ListingStatus = "active" | "inactive" | "rented";
export type ListingVisibility = "public" | "private";

export interface Listing {
  id: string;
  landlord_id: string;
  title: string;
  address: string;
  rent: number;
  lease_term: string;
  utilities?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  move_in_date?: string | null;
  status: ListingStatus;
  visibility: ListingVisibility;
  description?: string | null;
  security_deposit?: number | null;
  nearby_university?: string | null;
  is_furnished?: boolean | null;
  photo_urls?: string[] | null;
  tenant_preferences?: string | null;
  location_area?: string | null;
  created_at: string;
}

export interface CreateListingInput {
  landlord_id: string;
  title: string;
  address: string;
  rent: number;
  lease_term: string;
  status: ListingStatus;
  visibility: ListingVisibility;
  utilities?: string | null;
  nearby_university?: string | null;
  description?: string | null;
  tenant_preferences?: string | null;
  is_furnished?: boolean | null;
  move_in_date?: string | null;
  location_area?: string | null;
  photo_urls?: string[] | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  security_deposit?: number | null;
}

export interface ListingFilters {
  status?: ListingStatus;
  visibility?: ListingVisibility;
  landlord_id?: string;
}