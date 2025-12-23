export interface Profile {
    id: string;
    full_name: string | null;
    role: 'student' | 'landlord' | null;
    university: string | null;
    year: string | null;
    current_address: string | null;
    city: string | null;
    province: string | null;
    email: string | null;
    avatar_url: string | null;
    created_at: string | null;
}
