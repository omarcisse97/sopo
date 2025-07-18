import postgres from 'postgres';
import { Category, Listing, Option, SubCategory } from './definition';
import { categories, subCategoriesData } from '../data/categories';
import { countries, cities } from '../data/locations';
import { supabase } from './api';

const sql = postgres(process.env.POSTGRES_URL!);

export const getAllListing = async () => {
    try {
        const data = await sql<Listing[]>`
            SELECT * FROM listings 
            WHERE status = 'active'
            ORDER BY featured DESC, created_at DESC
        `;
        return data;
    } catch (error) {
        console.error('Failed to get all listings. Error(s): ', error);
        throw new Error('Failed to get all listings');
    }
}
export const getListingsBy = async (
    id: string | null,
    title: string | null,
    country_slug: string | null,
    city_slug: string | null,
    location: string | null,
    category_slug: string | null,
    subCategories: string | string[] | null,
    price: string | null,
    currency: string | null,
    contact_email: string | null,
    contact_phone: string | null,
    status: string | null
) => {
    try {


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const requests: Record<string, any | null> = {
            'id': id ? sql`id=${id} ` : null,
            'title': title ? sql` title=${title} ` : null,
            'country': country_slug ? sql` country_slug=${country_slug} ` : null,
            'city': city_slug ? sql` city_slug=${city_slug} ` : null,
            'location': location ? sql` location=${location} ` : null,
            'category': category_slug ? sql` category_slug=${category_slug} ` : null,
            'subCategories': subCategories ?
                Array.isArray(subCategories) ?
                    sql` subcategories && ${subCategories} `
                    : sql` EXISTS (
                        SELECT 1 FROM unnest(subcategories) AS sub 
                        WHERE LOWER(sub) = ${subCategories.toLowerCase()}
                    ) `
                : null,
            'price': price ? sql` price=${price} ` : null,
            'currency': currency ? sql` currency=${currency} ` : null,
            'email': contact_email ? sql` contact_email=${contact_email} ` : null,
            'phone': contact_phone ? sql` contact_phone=${contact_phone} ` : null,
            'status': status ? sql` status=${status} ` : null
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let WHERE: any = null;

        for (const field in requests) {
            if (requests[field] !== null) {
                if (!WHERE) {
                    WHERE = sql`WHERE ${requests[field]}`;
                    continue;
                }
                WHERE = sql`${WHERE} AND ${requests[field]}`;
            }

        }


        const data = await sql<Listing[]>`
            SELECT * FROM listings 
            ${WHERE ? WHERE : sql``}
        `;
        return data;
    } catch (error) {
        console.error('Failed to get listing. Error(s): ', error);
        throw new Error('Failed to get listing');
    }
}
export const getListingById = async (id: string) => {
    try {
        const data = await sql<Listing[]>`
            SELECT * FROM listings 
            WHERE id = ${id} AND status = 'active'
        `;
        return data[0] || null;
    } catch (error) {
        console.error('Failed to get listing by id. Error(s): ', error);
        throw new Error('Failed to get listing by id');
    }
}

export const getListingsByEmail = async (email: string) => {
    try {
        const data = await sql<Listing[]>`
            SELECT * FROM listings 
            WHERE contact_email = ${email}
            ORDER BY created_at DESC
        `;
        return data;
    } catch (error) {
        console.error('Failed to get listings by email. Error(s): ', error);
        throw new Error('Failed to get listings by email');
    }
}

export const getListingsByCountry = async (countrySlug: string) => {
    try {
        const data = await sql<Listing[]>`
            SELECT * FROM listings 
            WHERE country_slug = ${countrySlug} AND status = 'active'
            ORDER BY featured DESC, created_at DESC
        `;
        return data;
    } catch (error) {
        console.error('Failed to get listings by country. Error(s): ', error);
        throw new Error('Failed to get listings by country');
    }
}

export const getListingsByCity = async (citySlug: string) => {
    try {
        const data = await sql<Listing[]>`
            SELECT * FROM listings 
            WHERE city_slug = ${citySlug} AND status = 'active'
            ORDER BY featured DESC, created_at DESC
        `;
        return data;
    } catch (error) {
        console.error('Failed to get listings by city. Error(s): ', error);
        throw new Error('Failed to get listings by city');
    }
}

export const getListingsByCategory = async (categorySlug: string) => {
    try {
        const data = await sql<Listing[]>`
            SELECT * FROM listings 
            WHERE category_slug = ${categorySlug} AND status = 'active'
            ORDER BY featured DESC, created_at DESC
        `;
        return data;
    } catch (error) {
        console.error('Failed to get listings by category. Error(s): ', error);
        throw new Error('Failed to get listings by category');
    }
}


export const searchListing = async (
    keyword: string,
    category_slug: string | null,
    city_slug: string | null,
    limit: number | null,
    orderBy: string | null,
    orderType: string | null
) => {
    try {
        const searchTerm = `%${keyword}%`;

        const data = await sql<Listing[]>`
            SELECT * FROM listings
            WHERE status = 'active'
                ${category_slug ? sql`AND category_slug = ${category_slug}` : sql``}
                ${city_slug ? sql`AND city_slug = ${city_slug}` : sql``}
                AND (
                    title ILIKE ${searchTerm}
                    OR description ILIKE ${searchTerm}
                    OR location ILIKE ${searchTerm}
                    OR category_data->>'term' ILIKE ${searchTerm}
                    OR category_data->>'type' ILIKE ${searchTerm}
                    OR category_data->>'condition' ILIKE ${searchTerm}
                    OR category_data->>'brand' ILIKE ${searchTerm}
                    OR EXISTS (
                        SELECT 1 FROM unnest(subcategories) AS sub 
                        WHERE sub ILIKE ${searchTerm}
                    )
                )
                ${orderBy && orderType ? sql`ORDER BY ${sql(orderBy)} ${orderType === 'increasing' ? sql`ASC` : sql`DESC`}` : sql`ORDER BY featured DESC, created_at DESC`}
                ${limit ? sql`LIMIT ${limit}` : sql``}
        `;
        return data;
    } catch (error) {
        console.error('Failed to perform search. Error(s): ', error);
        return null;
    }
}
export const getFilteredListings = async ({
    countrySlug,
    citySlug,
    categorySlug,
    subcategories = [],
    condition,
    type,
    duration,
    term,
    bedrooms,
    priceMin,
    priceMax,
    sort,
    limit = 50,
    offset = 0
}: {
    countrySlug?: string;
    citySlug: string;
    categorySlug: string;
    subcategories?: string[];
    condition?: string;
    type?: string;
    duration?: string;
    term?: string;
    bedrooms?: string;
    priceMin?: string;
    priceMax?: string;
    sort?: string;
    limit?: number;
    offset?: number;
}) => {
    try {

        let orderByClause;
        switch (sort) {
            case 'price-low':
                orderByClause = sql`ORDER BY CAST(REGEXP_REPLACE(price, '[^0-9.]', '', 'g') AS DECIMAL) ASC NULLS LAST`;
                break;
            case 'price-high':
                orderByClause = sql`ORDER BY CAST(REGEXP_REPLACE(price, '[^0-9.]', '', 'g') AS DECIMAL) DESC NULLS LAST`;
                break;
            case 'date':
                orderByClause = sql`ORDER BY created_at DESC`;
                break;
            default:
                orderByClause = sql`ORDER BY featured DESC, created_at DESC`;
        }


        const normalizedSubcategories = subcategories.map(sub => sub.toLowerCase());


        const data = await sql<Listing[]>`
            SELECT * FROM listings 
            WHERE city_slug = ${citySlug}
              AND category_slug = ${categorySlug}
              AND status = 'active'
              ${countrySlug ? sql`AND country_slug = ${countrySlug}` : sql``}
              ${subcategories.length > 0 ? sql`AND subcategories && ${normalizedSubcategories}` : sql``}
              ${condition ? sql`AND category_data->>'condition' = ${condition.toLowerCase()}` : sql``}
              ${type ? sql`AND category_data->>'type' = ${type.toLowerCase()}` : sql``}
              ${duration ? sql`AND category_data->>'duration' = ${duration.toLowerCase()}` : sql``}
              ${term ? sql`AND category_data->>'term' = ${term.toLowerCase()}` : sql``}
              ${bedrooms ? sql`AND category_data->>'bedrooms' = ${bedrooms}` : sql``}
              ${priceMin ? sql`AND CAST(REGEXP_REPLACE(price, '[^0-9.]', '', 'g') AS DECIMAL) >= ${parseFloat(priceMin)}` : sql``}
              ${priceMax ? sql`AND CAST(REGEXP_REPLACE(price, '[^0-9.]', '', 'g') AS DECIMAL) <= ${parseFloat(priceMax)}` : sql``}
            ${orderByClause}
            LIMIT ${limit} OFFSET ${offset}
        `;

        return data as Listing[];

    } catch (error) {
        console.error('Failed to apply filters to listings. Error(s): ', error);
        return null;
    }
}


export const getListingsForPage = async ({
    countrySlug,
    citySlug,
    categorySlug,
    searchParams
}: {
    countrySlug: string;
    citySlug: string;
    categorySlug: string;
    searchParams: Record<string, string | undefined>;
}) => {
    const subcategories = searchParams.subcategories
        ? searchParams.subcategories.split(',').filter(Boolean)
        : [];

    return getFilteredListings({
        countrySlug,
        citySlug,
        categorySlug,
        subcategories,
        condition: searchParams.condition,
        type: searchParams.type,
        duration: searchParams.duration,
        term: searchParams.term,
        bedrooms: searchParams.bedrooms,
        priceMin: searchParams.priceMin,
        priceMax: searchParams.priceMax,
        sort: searchParams.sort,
    });
}



export const incrementListingViews = async (id: string) => {
    try {
        await sql`
            UPDATE listings 
            SET views = views + 1 
            WHERE id = ${id}
        `;
    } catch (error) {
        console.error('Failed to increment views. Error(s): ', error);

    }
}
export const getAdsCount = async (
    country_slug: string | null,
    city_slug: string | null,
    category_slug: string | null,
    subCategories: string | SubCategory[] | null
) => {
    try {
        let subCategoryQuery = null;
        if (subCategories) {
            switch (typeof subCategories) {
                case 'object':
                    if (Array.isArray(subCategories)) {
                        const subCategoriesEnhanced = subCategories?.map((sub) => sub.name.toLowerCase());
                        subCategoryQuery = sql`subcategories && ${subCategoriesEnhanced}`
                    }
                    break;
                case 'string':
                    if (subCategories) {
                        const subCategoriesEnhanced = subCategories.toLowerCase()
                        subCategoryQuery = sql`EXISTS (
                        SELECT 1 FROM unnest(subcategories) AS sub 
                        WHERE LOWER(sub) = ${subCategoriesEnhanced}
                    )`
                    }
                    break;
                default: break;
            }
        }

        const data = await sql`
            SELECT count(*) FROM listings
            ${country_slug || city_slug || category_slug || subCategoryQuery ?
                sql`WHERE`
                : sql``}
                ${country_slug ? sql` country_slug = ${country_slug}` : sql``}
                ${city_slug ?
                country_slug ?
                    sql` AND city_slug = ${city_slug}`
                    : sql` city_slug = ${city_slug}`
                : sql``}
                ${category_slug ?
                city_slug || country_slug ?
                    sql` AND category_slug = ${category_slug}`
                    : sql` category_slug = ${category_slug}`
                : sql``}
                
                ${subCategoryQuery ?
                category_slug || city_slug || country_slug ?
                    sql` AND ${subCategoryQuery}`
                    : sql` ${subCategoryQuery}`
                : sql``}
        `
        return Number(data[0]?.count) || 0;
    } catch (error) {
        console.error('Failed to get ads count. Error(s): ', error);
        return null;
    }
}

export const getSubCategories = async (
    subCount: boolean,
    country_slug: string | null,
    city_slug: string | null,
    sub_slug: string | null,
    category_slug: keyof typeof subCategoriesData | null

) => {
    try {
        const data: SubCategory[] | Record<string, SubCategory[]> = category_slug ? subCategoriesData[category_slug] : subCategoriesData;

        if (subCount === true && data) {
            if (Array.isArray(data) && category_slug) {
                for (const sub of data) {
                    if (sub) {
                        sub.count = await getAdsCount(
                            country_slug,
                            city_slug,
                            category_slug,
                            sub.name.toLowerCase()
                        ) ?? 0;

                    }

                }
            } else {

                for (const slug of Object.keys(data)) {
                    const key: keyof typeof data = slug as keyof typeof data;
                    const subs = data[key] as SubCategory[];
                    for (const sub of subs) {
                        sub.count = await getAdsCount(
                            country_slug,
                            city_slug,
                            null,
                            sub.name.toLowerCase()
                        ) ?? 0;
                    }
                }
            }

        }
        if (sub_slug && data) {
            if (Array.isArray(data)) {
                return data.find((sub) => sub.slug.toLowerCase() === sub_slug.toLowerCase()) ?? null;
            } else {
                for (const key in data) {
                    const subData = data[key].find((sub) => sub.slug.toLowerCase() === sub_slug.toLowerCase()) ?? null;
                    if (subData) {
                        return subData;
                    }
                }
                return null;
            }
        }
        return data;

    } catch (error) {
        console.error('Failed to fetch sub categories. Error(s): ', error);
        return null;
    }
}
export const createFilter = (
    type: string = 'select',
    key: string,
    label: string = 'Filter',
    options: Option[] = []

) => {
    return {
        type: type,
        key: key,
        label: label,
        options: options
    }
}
export const getCategories = async (
    categoryCount: boolean,
    subCount: boolean,
    country_slug: string | null,
    city_slug: string | null,
    category_slug: string | null,
    addSubCategoryFilter: boolean = false
) => {
    try {
        const data: Category[] | Category | null = !category_slug ? categories : categories.find((category) => category.slug.toLowerCase() === category_slug.toLowerCase()) ?? null;
        if (!data) {
            throw new Error('error getting category');
        }
        if (categoryCount === true || subCount === true) {
            if (Array.isArray(data)) {
                for (let i = 0; i < data.length; i++) {
                    if (categoryCount === true)
                        data[i].count = await getAdsCount(
                            country_slug,
                            city_slug,
                            null,
                            null
                        ) ?? 0;

                    if (subCount === true) {
                        for (let j = 0; j < data[i].subcategories.length; j++) {
                            data[i].subcategories[j].count = await getAdsCount(
                                country_slug,
                                city_slug,
                                data[i].slug,
                                data[i].subcategories[j].name.toLowerCase()
                            ) ?? 0;
                        }
                    }


                }
            } else {
                if (data) {
                    if (categoryCount === true)
                        data.count = await getAdsCount(
                            country_slug,
                            city_slug,
                            null,
                            null
                        ) ?? 0;

                    if (subCount === true && data.subcategories) {
                        for (let i = 0; i < data?.subcategories.length; i++) {
                            data.subcategories[i].count = await getAdsCount(
                                country_slug,
                                city_slug,
                                data.slug,
                                data.subcategories[i].name.toLowerCase()
                            ) ?? 0;
                        }
                    }


                }

            }

        }
        if (addSubCategoryFilter === true) {
            if (Array.isArray(data)) {
                for (let i = 0; i < data.length; i++) {
                    if (addSubCategoryFilter === true) {
                        const tempFilter = data[i].filterConfig.filters.find((filter) => filter.key === 'categories') ?? null;
                        if (!tempFilter) {
                            const optionsSubcat: Option[] = [];
                            data[i].subcategories.map((sub) => {
                                optionsSubcat.push({
                                    value: sub.slug,
                                    label: sub.name
                                });
                            });
                            data[i].filterConfig.filters.push(createFilter(
                                'select',
                                'categories',
                                'Categories',
                                optionsSubcat
                            ));
                        }
                    }
                }
            } else {
                const tempFilter = data.filterConfig.filters.find((filter) => filter.key === 'categories') ?? null;
                if (!tempFilter) {
                    const optionsSubcat: Option[] = [];
                    data.subcategories.map((sub) => {
                        optionsSubcat.push({
                            value: sub.slug,
                            label: sub.name
                        });
                    });
                    data.filterConfig.filters.push(createFilter(
                        'select',
                        'categories',
                        'Categories',
                        optionsSubcat
                    ));
                }
            }

        }
        return data;

    } catch (error) {
        console.log('Failed to fetch categories. Error(s): ', error);
        return null;
    }
}

export const getCountries = (
    country_slug: string | null
) => {
    const data = country_slug ? countries.find((country) => country.slug.toLowerCase() === country_slug.toLowerCase()) : countries ?? null;
    return data;
}
export const getCities = (
    country_slug: keyof typeof cities | null,
    city_slug: string | null,
) => {
    if (!country_slug && !city_slug) {
        return cities;
    }
    if (country_slug && !city_slug) {
        return cities[country_slug] ?? null;
    }
    if (city_slug && !country_slug) {
        return Object.values(cities)
            .flat()
            .find(city => city.slug.toLowerCase() === city_slug.toLowerCase()) || null;
    }
    if (city_slug && country_slug) {
        return cities[country_slug].find((city) => city.slug.toLowerCase() === city_slug.toLowerCase()) ?? null;
    }
}

export const getListingsCustomFilters = async (
    country_slug: string | null,
    city_slug: string | null,
    category_slug: string | null,
    filtersObj: Record<string, string | null> | null
) => {
    try {
        // Go back to your original approach but cleaner
        let whereClause = null;
        let sortClause = sql`ORDER BY featured DESC, created_at DESC`;

        // Build WHERE conditions step by step
        if (country_slug) {
            whereClause = sql`WHERE country_slug = ${country_slug}`;
        }

        if (city_slug) {
            whereClause = whereClause
                ? sql`${whereClause} AND city_slug = ${city_slug}`
                : sql`WHERE city_slug = ${city_slug}`;
        }

        if (category_slug) {
            whereClause = whereClause
                ? sql`${whereClause} AND category_slug = ${category_slug}`
                : sql`WHERE category_slug = ${category_slug}`;
        }

        // Add status filter
        whereClause = whereClause
            ? sql`${whereClause} AND status = 'active'`
            : sql`WHERE status = 'active'`;

        // Process additional filters
        if (filtersObj) {
            for (const filterKey in filtersObj) {
                const value = filtersObj[filterKey];
                if (!value) continue;

                if (filterKey === 'sort') {
                    if (value === 'price-low') {
                        sortClause = sql`ORDER BY CAST(REGEXP_REPLACE(price, '[^0-9.]', '', 'g') AS DECIMAL) ASC NULLS LAST`;
                    } else if (value === 'price-high') {
                        sortClause = sql`ORDER BY CAST(REGEXP_REPLACE(price, '[^0-9.]', '', 'g') AS DECIMAL) DESC NULLS LAST`;
                    } else if (value === 'date') {
                        sortClause = sql`ORDER BY created_at DESC`;
                    }
                } else if (filterKey === 'minPrice') {
                    whereClause = sql`${whereClause} AND CAST(REGEXP_REPLACE(price, '[^0-9.]', '', 'g') AS DECIMAL) >= ${parseFloat(value)}`;
                } else if (filterKey === 'maxPrice') {
                    whereClause = sql`${whereClause} AND CAST(REGEXP_REPLACE(price, '[^0-9.]', '', 'g') AS DECIMAL) <= ${parseFloat(value)}`;
                } else {
                    if (filterKey === 'categories') {
                        const subCategory = await getSubCategories(false, country_slug, city_slug, filtersObj[filterKey], category_slug) as SubCategory;
                        if (!subCategory) {
                            throw new Error('Sub category expected but it does not exist');
                        }
                        whereClause = sql`${whereClause} AND EXISTS (
                        SELECT 1 FROM unnest(subcategories) AS sub 
                        WHERE LOWER(sub) = ${subCategory.name.toLowerCase()}
                    ) `;
                    } else {
                        whereClause = sql`${whereClause} AND category_data->>${filterKey} = ${value.toLowerCase()}`;
                    }

                }
            }
        }

        const data = await sql<Listing[]>`
            SELECT * FROM listings 
            ${whereClause}
            ${sortClause}
        `;
        return data as Listing[];

    } catch (error) {
        console.error('Failed to get listing with filters. Error(s): ', error);
        return null;
    }
}

export async function cleanupImages(listingId: number) {
    try {
        const { data: files } = await supabase.storage
            .from('listing-images')
            .list(`listings/${listingId}`);

        if (files && files.length > 0) {
            const filePaths = files.map(file => `listings/${listingId}/${file.name}`);
            await supabase.storage
                .from('listing-images')
                .remove(filePaths);

            console.log(`🧹 Cleaned up ${filePaths.length} images for failed listing`);
        }
    } catch (error) {
        console.error('Cleanup failed:', error);
    }
}

export default sql;

