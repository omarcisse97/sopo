export type Listing = {
    id: number;
    title: string;
    description: string;
    country_slug: string;
    city_slug: string;
    location: string | null;
    category_slug: string;
    subcategories: string[] | null;
    price: string | null;
    currency: string;
    images: string[] | null;
    contact_email: string;
    contact_phone: string | null;
    category_data: Record<string, unknown> | null;
    status: string;
    featured: boolean;
    views: number;
    created_at: Date;
    updated_at: Date;
    expires_at: Date | null;
    user_id: number | null;
    user_ip: string | null;
    search_vector: string | null;
};
export type SearchOption = {
    category?: string | null;
    query?: string;
    mode?: "contains" | "startsWith";
};
export type City = {
    id: number,
    name: string,
    slug: string
};

export type Country = {
    id: number,
    code: string,
    name: string,
    slug: string,
    cities: City[]

};
export type Option = {
    value: string;
    label: string;
}
export type FilterOption = {
    type: string;
    key: string;
    label: string;
    options: Option[];
}
export type FilterConfigs = {
    [category: string]: {
        filters: FilterOption[],
        priceRange: boolean,
        sort: string[]
    }
}
export type FilterConfig = {
    filters: FilterOption[],
    priceRange: boolean,
    sort: string[]
}
export type SubCategory = {
    slug: string,
    name: string,
    count?: number
}
export type Category = {
    slug: string,
    name: string,
    icon?: string,
    count?: number
    subcategories: SubCategory[],
    filterConfig: FilterConfig
}
export type PreviousURL = {
    title: string,
    url: string
}
