// app/[id]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Category, City, Country, Listing, PreviousURL } from '@/app/lib/definition';
import sql, { getCountries, getCities, getCategories } from '@/app/lib/data';
import { Header } from '@/app/ui/home/nav';
import Link from 'next/link';
import { createCurrentURL } from '@/app/lib/helpers';
import { getPriceLabel } from '@/app/lib/helpers';

// Function to get listing by ID
async function getListing(id: string): Promise<Listing | null> {
    try {
        const result = await sql`
      SELECT * FROM listings 
      WHERE id = ${parseInt(id)} AND status = 'active'
    ` as Listing[];

        return result[0] || null;
    } catch (error) {
        console.error('Error fetching listing:', error);
        return null;
    }
}

// Function to increment view count
async function incrementViews(id: number) {
    try {
        await sql`
      UPDATE listings 
      SET views = views + 1 
      WHERE id = ${id}
    `;
    } catch (error) {
        console.error('Error updating views:', error);
    }
}

export default async function ListingPage(props: { params: Promise<{ country: string, city: string, category: string, id: string }> }) {
    const params = await props.params;

    const country_slug = params.country;
    const city_slug = params.city;
    const category_slug = params.category;
    const listingID = params.id;

    if (!country_slug || !city_slug || !category_slug || !listingID) {
        notFound();
    }

    const country = getCountries(country_slug) as Country;
    const city = getCities(country_slug, city_slug) as City;
    const category = await getCategories(false, false, country_slug, city_slug, category_slug, false) as Category;
    const listing = await getListing(listingID);
    const categories = await getCategories(false, false,null,null,null,false) as Category[];
    if (!country || !city || !category || !listing) {
        notFound();
    }



    // Increment view count (fire and forget)

    incrementViews(listing.id);
    if (typeof listing.category_data === 'string') {
        listing.category_data = JSON.parse(listing.category_data);
    }

    const currentURL: PreviousURL = {
        title: `Ad ${listing.title}`,
        url: createCurrentURL(`/${country.slug}/${city.slug}/${category.slug}/${listing.id}`, null)
    }
    return (
        <>
            <Header country={country} city={city} currentURL={currentURL} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

                <div className="mb-4 text-sm text-gray-600">
                    <Link href={`/${country.slug}/${city.slug}`} className="text-blue-600 hover:underline">
                        {city.name}
                    </Link>
                    <span className="mx-2">›</span>
                    <Link href={`/${country.slug}/${city.slug}/${category.slug}`} className="text-blue-600 hover:underline">
                        {category.name}
                    </Link>
                    <span className="mx-2">›</span>

                    <span className="break-words">{listing.title}</span>
                </div>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>{listing.views} views</span>
                        <span>•</span>
                        <span>Posted {new Date(listing.created_at).toLocaleDateString()}</span>
                        {listing.expires_at && (
                            <>
                                <span>•</span>
                                <span>Expires {new Date(listing.expires_at).toLocaleDateString()}</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Images */}
                        {listing.images && listing.images.length > 0 && (
                            <div className="mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {listing.images.map((image, index) => (
                                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                                            <Image
                                                src={image}
                                                alt={`${listing.title} - Image ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Description</h2>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
                            </div>
                        </div>

                        {/* Category-specific data */}
                        {listing.category_data && Object.keys(listing.category_data).length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {Object.entries(listing.category_data).map(([key, value]) => (
                                            <div key={key}>
                                                <dt className="text-sm font-medium text-gray-500 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                </dt>
                                                <dd className="text-sm text-gray-900 mt-1">{String(value)}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </div>
                        )}

                        {/* Subcategories */}
                        {listing.subcategories && listing.subcategories.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                                <div className="flex flex-wrap gap-2">
                                    {listing.subcategories.map((subcat, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                        >
                                            {subcat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
                            {/* Price */}
                            {listing.price && (
                                <div className="mb-6">
                                    <div className="text-xl font-bold text-gray-900">
                                        {getPriceLabel(category.slug)}: {listing.price}
                                    </div>
                                    {listing.currency && <p className="text-sm text-gray-900">(in {listing.currency})</p>}
                                </div>
                            )}

                            {/* Location */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Location</h3>
                                <p className="text-gray-600">
                                    {listing.location && `${listing.location}, `}
                                    <span className="capitalize">{listing.city_slug.replace('-', ' ')}</span>
                                    {', '}
                                    <span className="capitalize">{listing.country_slug.replace('-', ' ')}</span>
                                </p>
                            </div>

                            {/* Contact Info */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                        <a
                                            href={`mailto:${listing.contact_email}`}
                                            className="block text-blue-600 hover:text-blue-800"
                                        >
                                            {listing.contact_email}
                                        </a>
                                    </div>

                                    {listing.contact_phone && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Phone</label>
                                            <a
                                                href={`tel:${listing.contact_phone}`}
                                                className="block text-blue-600 hover:text-blue-800"
                                            >
                                                {listing.contact_phone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact Buttons */}
                            <div className="space-y-3">
                                <a
                                    href={`mailto:${listing.contact_email}?subject=Interest in: ${listing.title}`}
                                    className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium block"
                                >
                                    Send Email
                                </a>

                                {listing.contact_phone && (
                                    <a
                                        href={`tel:${listing.contact_phone}`}
                                        className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium block"
                                    >
                                        Call Now
                                    </a>
                                )}
                            </div>

                            {/* Listing Meta */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="text-xs text-gray-500 space-y-1">
                                    <p>Listing ID: {listing.id}</p>
                                    <p>Category: <span className="capitalize">{listing.category_slug.replace('-', ' ')}</span></p>
                                    {listing.featured && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Featured
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="bg-white border-t border-gray-300 mt-4">
                <div className="max-w-6xl mx-auto px-4 py-3">

                    {categories && <div className="mb-3">
                        <h3 className="text-sm font-semibold text-gray-800 mb-2">
                            Categories
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {/* {country.cities.map(cityItem => (
                                <Link
                                    key={cityItem.id}
                                    href={`/${country.slug}/${cityItem.slug}`}
                                    className="text-blue-600 hover:underline text-xs"
                                >
                                    {cityItem.name}
                                </Link>
                            ))} */}
                            {categories && categories.map((category) => (
                                <Link
                                    key={category.slug}
                                    href={`/${country.slug}/${city.slug}/${category.slug}`}
                                    className="text-blue-600 hover:underline text-xs"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </div>}

                    <div className="mb-3">
                        <h3 className="text-sm font-semibold text-gray-800 mb-2">
                            Cities in {country.name}:
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {country.cities.map(cityItem => (
                                <Link
                                    key={cityItem.id}
                                    href={`/${country.slug}/${cityItem.slug}`}
                                    className="text-blue-600 hover:underline text-xs"
                                >
                                    {cityItem.name}
                                </Link>
                            ))}
                        </div>
                    </div>



                    {/* Bottom footer */}
                    <div className="border-t border-gray-300 pt-2">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex space-x-4">
                                <span className="text-blue-600 hover:underline cursor-pointer">safety</span>
                                <span className="text-blue-600 hover:underline cursor-pointer">privacy</span>
                                <span className="text-blue-600 hover:underline cursor-pointer">terms</span>
                            </div>
                            <div>
                                <span>© 2025 SoPo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
    const listing = await getListing(params.id);

    if (!listing) {
        return {
            title: 'Listing Not Found',
        };
    }

    return {
        title: `${listing.title} - ${listing.city_slug} | Your Site Name`,
        description: listing.description.slice(0, 160),
        openGraph: {
            title: listing.title,
            description: listing.description.slice(0, 160),
            images: listing.images?.[0] ? [listing.images[0]] : [],
        },
    };
}