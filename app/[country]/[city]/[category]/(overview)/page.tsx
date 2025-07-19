import { Header } from "@/app/ui/home/nav";

import {
    SORT,
    CONDITION,
    TYPE,
    DURATION,
    TERM,
    BEDROOMS,
} from "@/app/lib/definition-filter";
import { getCountries, getCities, getCategories, getListingsCustomFilters } from "@/app/lib/data";
import { FilterSidebar } from "@/app/ui/listing/filters";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Listing, Category, City, Country, PreviousURL } from "@/app/lib/definition";
import { createCurrentURL } from "@/app/lib/helpers";
import Image from "next/image";


const validateSearchParams = (searchParams: Record<string, string | null>, category: Category) => {
    for (const param in searchParams) {
        if (param !== 'sort' && param !== 'minPrice' && param !== 'maxPrice' && searchParams[param]) {
            const tempFilter = category.filterConfig.filters.find((filter) => filter.key === param) ?? null;
            if (!tempFilter) {
                return false;
            }
            const searchOption = searchParams[param] as string;
            const tempOption = tempFilter.options.find((option) => {
                if (option && option.value.toLowerCase() === searchOption.toLowerCase()) {
                    return option;
                }
            }) ?? null;
            if (!tempOption) {
                return false;
            }
        } else {
            if (param === 'sort' && searchParams[param]) {
                const sort = category.filterConfig.sort;
                const searchOption = searchParams[param] as string;
                const tempOption = sort.find((option) => {
                    if (option && option.toLowerCase() === searchOption.toLowerCase()) {
                        return option;
                    }
                }) ?? null;
                if (!tempOption) {
                    return false;
                }

            }
        }

    }
    return true;
}

const Page = async (
    props: {
        params: Promise<{ country: string; city: string; category: string }>,
        searchParams?: Promise<{
            categories?: string;
            condition?: CONDITION;
            sort?: SORT;
            type?: TYPE;
            duration?: DURATION;
            term?: TERM;
            bedrooms?: BEDROOMS;
            minPrice?: string;
            maxPrice?: string;
        }>
    }) => {
    const params = await props.params;
    const searchParams = await (props?.searchParams) ?? null;

    const country_slug = params.country;
    const city_slug = params.city;
    const category_slug = params.category;

    const country = getCountries(country_slug) as Country;
    const city = getCities(country_slug, city_slug) as City;
    const categories = await getCategories(false, false, null, null, null, false) as Category[];
    const category = await getCategories(false, false, country_slug, city_slug, category_slug, true) as Category;
    if (!country || !city || !category) {
        notFound();
    }


    let searchParamsEnhanced: Record<string, string | null> | null = null;
    if (searchParams) {
        searchParamsEnhanced = {
            'categories': searchParams?.categories as string ?? null,
            'condition': searchParams?.condition as string ?? null,
            'sort': searchParams?.sort as string ?? null,
            'type': searchParams?.type as string ?? null,
            'duration': searchParams?.duration as string ?? null,
            'term': searchParams?.term as string ?? null,
            'bedrooms': searchParams?.bedrooms as string ?? null,
            'minPrice': searchParams?.minPrice as string ?? null,
            'maxPrice': searchParams?.maxPrice as string ?? null
        };
        const searchValidation = validateSearchParams(searchParamsEnhanced, category);

        if (searchValidation === false) {

            notFound();
        }
    }
    const listings: Listing[] = await getListingsCustomFilters(country_slug, city_slug, category_slug, searchParamsEnhanced) as Listing[];
    const showFilters = true;
    const currentURL: PreviousURL = {
        title: `Listings for ${category.name} ${searchParamsEnhanced ? searchParamsEnhanced['categories'] ? searchParamsEnhanced['categories'] : '' : ''}`,
        url: createCurrentURL(`/${country.slug}/${city.slug}/${category.slug}`, searchParamsEnhanced)
    }
    console.log('CATEGORY -> ', category);
    console.log('Listings -> ', listings);
    return (
        <>
            <Header country={country} city={city} currentURL={currentURL} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb */}
                <div className="mb-4 text-sm text-gray-600">
                    <Link href={`/${country.slug}/${city.slug}`} className="text-blue-600 hover:underline">
                        {city.name}
                    </Link>
                    <span className="mx-2">›</span>
                    <span className="break-words">{category.name}</span>
                </div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold break-words">
                        {category.name} in {city.name}
                    </h1>
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                        {listings.length} listing{listings.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Main Layout: Sidebar + Content */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Mobile Filter Toggle */}
                    {showFilters && (
                        <div className="lg:hidden">
                            <details className="group">
                                <summary className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-100">
                                    <span className="text-sm font-medium text-gray-700">Filters</span>
                                    <svg className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="mt-2">
                                    <FilterSidebar
                                        selectedFilters={searchParamsEnhanced ?? {}}
                                        category={category}
                                    />
                                </div>
                            </details>
                        </div>
                    )}

                    {/* Desktop Filter Sidebar */}
                    {showFilters && (
                        <div className="hidden lg:block lg:w-64 xl:w-72">
                            <FilterSidebar
                                selectedFilters={searchParamsEnhanced ?? {}}
                                category={category}
                            />
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {listings.length > 0 ? (
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                {listings.map((listing) => (
                                    <div key={listing.id} className="bg-white border border-gray-300 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                        <Link href={`/${country.slug}/${city.slug}/${category.slug}/${listing.id}`}>
                                            <div className="cursor-pointer hover:bg-gray-50">
                                                {/* Image */}
                                                {(!listing.images || listing.images.length === 0) &&
                                                    <div className="w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center">
                                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>}
                                                {listing.images && listing.images.length >= 1 &&
                                                    <Image
                                                        src={listing.images[0]}
                                                        alt="Listing"
                                                        width={400}
                                                        height={192}
                                                        className="w-full h-40 sm:h-48 object-cover"
                                                    />}


                                                <div className="p-4">
                                                    <h3 className="text-blue-600 hover:underline font-medium mb-2 line-clamp-2 text-sm sm:text-base">
                                                        {listing.title}
                                                    </h3>

                                                    <div className="text-sm sm:text-base font-bold text-green-600 mb-2">
                                                        {listing.price}
                                                    </div>

                                                    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                                        <div className="truncate">
                                                            {listing.location}
                                                        </div>
                                                        <div>{new Date(listing.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 sm:py-12 px-4">
                                <div className="text-gray-500 mb-4">
                                    <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
                                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                                    No {category.name.toLowerCase()} listings in {city.name} yet.
                                </p>
                                <Link
                                    href={`/${country.slug}/${city.slug}`}
                                    className="text-gray-600 hover:text-gray-800 underline text-sm"
                                >
                                    ← Back to all categories
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
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
};

export default Page;