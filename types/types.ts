export interface Location {
    name: string;
    slug: string;
    description?: string;
    lat: number;
    long: number;
    user: string;
    created_at: number;
    updated_at: number;
}