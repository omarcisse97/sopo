import { createPostConfig } from '@/app/data/categories';

export const createCurrentURL = (preURL: string, searchParams: Record<string, string | null> | null) => {
    let url: string = preURL;

    if (searchParams) {
        const params: [string, string | null][] = Object.entries(searchParams).filter(([key, value]) => key && value);
        const relations: string[] = params.map(([key, value]) => `${key}=${value}`);
        if (relations.length > 0) {
            url = `${url}?${relations.join('&')}`
        }

    }
    return url;
}
export function getPriceLabel(categorySlug: string): string {
    const config = createPostConfig[categorySlug as keyof typeof createPostConfig];
    return config?.priceLabel || 'Price';
}