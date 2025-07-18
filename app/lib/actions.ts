'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabase } from '@/app/lib/api';
import { cleanupImages } from '@/app/lib/data';
import { Listing } from './definition';
import sql from '@/app/lib/data';

/**
 * export type Listing = {
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
 */

const FormSchema = z.object({
    id: z.string(),
    title: z.string({
        message: 'Please enter a valid title',
    }).min(1, 'Title is required'), // Add this

    description: z.string({
        message: 'Please enter a valid description',
    }).min(1, 'Description is required'), // Add this

    country_slug: z.string({
        message: 'Error capturing country code',
    }),
    city_slug: z.string({
        message: 'Error capturing city code',
    }),
    location: z.string().optional(),
    category_slug: z.string({
        message: 'Error capturing category code',
    }),
    expires_at: z.string().optional(),
    subcategories: z.array(z.string()).optional(),
    price: z.string().optional(),
    currency: z.string().optional(),
    images: z.array(
        z.custom<File>((file) => {
            if (!(file instanceof File)) return false;
            if (!file.type.startsWith('image/')) return false;
            if (file.size > 8 * 1024 * 1024) return false;
            if (file.size === 0) return false;
            return true;
        }, "Each image must be under 8MB and a valid image file")
    ).max(8, "Maximum 8 images allowed")
        .optional(),
    contact_email: z.email({
        message: 'Please enter a valid email address'
    }),
    contact_phone: z.string().optional(),
});

const CreateListingSchema = FormSchema.omit({ id: true });

export type State = {
    errors?: {
        title?: string[];
        description?: string[];
        country_slug?: string[];
        city_slug?: string[];
        category_slug?: string[];
        location?: string[];
        expires_at?: string[];
        subcategories?: string[];
        price?: string[];
        currency?: string[];
        images?: string[];
        contact_email?: string[];
        contact_phone?: string[];
    };
    message: string | null;
};

export const uploadImagesBucket = async (images: File[], listingId: number) => {
    const imageUrls: string[] = [];
    if (images.length < 1) {
        return imageUrls;
    }
    try {
        for (const [index, image] of images.entries()) {
            if (image instanceof File && image.size > 0) {
                const fileExt = image.name.split('.').pop()?.toLowerCase() || 'jpg';

                const fileName = `image_${String(index + 1).padStart(2, '0')}.${fileExt}`;

                const filePath = `listings/${listingId}/${fileName}`;

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { data, error } = await supabase.storage
                    .from('classifieds')
                    .upload(filePath, image, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (error) {
                    console.error(`Upload error for image ${index + 1}:`, error);
                    throw new Error(`Failed to upload image ${index + 1}: ${error.message}`);
                }
                const { data: publicUrlData } = supabase.storage
                    .from('classifieds')
                    .getPublicUrl(filePath);

                imageUrls.push(publicUrlData.publicUrl);
                console.log(`✅ Uploaded: ${fileName} → ${publicUrlData.publicUrl}`);
            }
        }
        return imageUrls;
    } catch (error) {
        console.error('Failed to upload images to bucket. Error(s): ', error);
        if (imageUrls.length > 0) {
            await cleanupImages(listingId);
        }
        return null;

    }
}

const extractCategoryData = (formData: FormData, excludeKeys: string[]) => {
    const excludeSet = new Set(excludeKeys);
    const categoryData: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
        if (!key.startsWith('$ACTION') &&
            !excludeSet.has(key) &&
            value &&
            value.toString().trim() !== '') {
            categoryData[key] = value.toString();
        }
    }

    return categoryData;
};

export const createListing = async (prevState: State, formData: FormData) => {
    console.log('🚀 createListing in progress');
    let listingId: number | null = null;

    const mainListingKeys = [
        'title', 'description', 'country_slug', 'city_slug', 'location',
        'category_slug', 'expires_at', 'subcategories', 'price', 'currency',
        'images', 'contact_email', 'contact_phone'
    ];
    const categoryData = extractCategoryData(formData, mainListingKeys);

    console.log('📦 Category data extracted');

    const validateListing = CreateListingSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        country_slug: formData.get('country_slug'),
        city_slug: formData.get('city_slug'),
        location: formData.get('location'),
        category_slug: formData.get('category_slug'),
        expires_at: formData.get('expires_at'),
        subcategories: formData.getAll('subcategories') as string[],
        price: formData.get('price') ?? undefined,
        currency: formData.get('currency') ?? undefined,
        images: formData.getAll('images'),
        contact_email: formData.get('contact_email'),
        contact_phone: formData.get('contact_phone')
    });

    console.log('🔍 Validation result:', {
        success: validateListing.success,
        errors: validateListing.success ? null : validateListing.error.flatten().fieldErrors
    });


    if (!validateListing.success) {
        console.log('❌ Validation failed:', validateListing.error.flatten().fieldErrors);
        return {
            errors: validateListing.error.flatten().fieldErrors,
            message: 'Failed to create listing. Fix all errors and try again',
        };
    }

    console.log('✅ Validation passed');

    const fields: string[] = [];
    const values: (string | number | boolean | null | string[] | object)[] = [];
    let field: keyof typeof validateListing.data;

    for (field in validateListing.data) {
        if (field as string !== 'subcategories') {
            if (field as string === 'images') {
                continue;
            }
            if (validateListing.data[field]) {
                fields.push(field as string);
                values.push(validateListing.data[field]!);
            }
        } else {

            fields.push('subcategories');
            if (!validateListing.data[field] || !Array.isArray(validateListing.data[field])) {
                values.push([]);
            } else {
                values.push(validateListing.data[field]!);
            }
        }
    }
    fields.push('category_data');
    values.push(
        !categoryData ||
            (typeof categoryData === 'object' && Object.keys(categoryData).length < 1) ?
            {}
            : categoryData);

    if (fields.length !== values.length || values.length < 0 || fields.length < 0) {
        console.log('💥 Field/value mismatch error');
        return {
            errors: {},
            message: 'An error occured while creating the listing. Contact support or try again',
        };
    }

    try {
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
        const fieldList = fields.join(', ');

        const query = `INSERT INTO listings (${fieldList}) VALUES (${placeholders}) RETURNING *`;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await sql.unsafe(query, values as any[]) as Listing[];
        if (validateListing.data.images && validateListing.data.images.length > 0 && data && data?.length > 0 && data?.[0]?.id) {
            try {
                const imageUrls = await uploadImagesBucket(validateListing.data.images, data[0].id);
                if (imageUrls) {
                    await sql`UPDATE listings SET images = ${imageUrls} WHERE id=${data[0].id}`;
                    console.log('✅ Images uploaded successfully');
                }

            } catch (error) {
                console.error('Failed to upload images. Error(s): ', error);
            }

        }
        console.log('🔄 Revalidating and redirecting...');
        listingId = data?.[0]?.id ?? null;

    } catch (error) {
        console.error('Failed to create listing. Error(s): ', error);
        return {
            errors: {},
            message: 'Failed to create listing. Ty again or contact SoPo Support',
        };
    }
    revalidatePath(`/${validateListing.data.country_slug}/${validateListing.data.city_slug}/${validateListing.data.category_slug}${listingId?`/${listingId}`: ''}`);
    redirect(`/${validateListing.data.country_slug}/${validateListing.data.city_slug}/${validateListing.data.category_slug}${listingId?`/${listingId}`: ''}`);

}