'use client'
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { countries } from '@/app/data/locations';
import { categories } from '@/app/data/categories';
import { City, Country, Option } from '@/app/lib/definition';
import { Header } from '@/app/ui/home/nav';
import { FilterSidebar } from '@/app/ui/listing/filters';

const createFilter = (
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

export default function NotFound() {
    const params = useParams();
    const country_slug: string | null = params?.country as string ?? null;
    const city_slug: string | null = params?.city as string ?? null;
    const category_slug: string | null = params?.category as string ?? null;

    let current_country = null;
    let current_city = null;
    let current_category = null;
    let tmp_category = null;

    if (country_slug && city_slug) {
        current_country = countries.find((country) => country.slug.toLowerCase() === country_slug.toLowerCase()) as Country ?? null;
        if (current_country) {
            current_city = current_country.cities.find((city) => city.slug.toLowerCase() === city_slug.toLowerCase()) as City ?? null;
        }
    }
    if (category_slug) {
        current_category = categories.find((category) => category.slug.toLowerCase() === category_slug.toLowerCase()) ?? null;
        tmp_category = { ...current_category };
        const subFiltering = tmp_category.filterConfig?.filters.find((filter) => filter.key === 'categories') ?? null;
        if (Array.isArray(tmp_category.subcategories) && !subFiltering) {
            const optionsTmp = [];
            for (const sub of tmp_category.subcategories) {
                optionsTmp.push({
                    value: sub.slug,
                    label: sub.name
                });
            }
            if (optionsTmp.length > 0) {
                tmp_category.filterConfig?.filters.push(createFilter(
                    'select',
                    'categories',
                    'Categories',
                    optionsTmp
                ));
            }
        }
    }


    return (
        <>
            {current_country && current_city && <Header country={current_country} city={current_city} />}

            {current_category && current_country && current_city && <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb */}
                <div className="mb-4 text-sm text-gray-600">
                    <Link href={`/${current_country.slug}/${current_city.slug}`} className="text-blue-600 hover:underline">
                        {current_city.name}
                    </Link>
                    <span className="mx-2">›</span>
                    <span className="break-words">{current_category.name}</span>
                </div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold break-words">
                        {current_category.name} in {current_city.name}
                    </h1>
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                        Error fetching listings
                    </div>
                </div>

                {/* Main Layout: Sidebar + Content */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden">
                        <details className="group">
                            <summary className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-100">
                                <span className="text-sm font-medium text-gray-700">Filters</span>
                                <svg className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <div className="mt-2">
                                {(tmp_category || current_category) && (
                                    <FilterSidebar
                                        selectedFilters={{}}
                                        category={tmp_category || current_category}
                                    />
                                )}
                            </div>
                        </details>
                    </div>

                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:w-64 xl:w-72">
                        {(tmp_category || current_category) && (
                            <FilterSidebar
                                selectedFilters={{}}
                                category={tmp_category || current_category}
                            />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="text-center py-8 sm:py-12 px-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                An error occurred and we could not fetch any listings
                            </p>
                            <button
                                onClick={() => {
                                    window.location.href = `/${current_country.slug}/${current_city.slug}/${current_category.slug}`;
                                }}
                                className="text-gray-600 hover:text-gray-800 underline text-sm"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            </div>}

            {!current_category && <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                    <div className="text-center">
                        <h1 className="text-xl font-bold mb-4">Something went wrong</h1>
                        <p className="text-gray-600 mb-4 max-w-md mx-auto">
                            An error occurred. Please go back to safety or contact SoPo support
                        </p>
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-gray-800 underline text-sm"
                        >
                            Go back to SoPo
                        </Link>
                    </div>
                </div>
            </div>}

            {current_country && current_city && <footer className="bg-white border-t border-gray-300 mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">
                            Cities in {current_country.name}:
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            {current_country.cities.map(cityItem => (
                                <Link
                                    key={cityItem.id}
                                    href={`/${current_country.slug}/${cityItem.slug}`}
                                    className="text-blue-600 hover:underline text-xs truncate"
                                    title={cityItem.name}
                                >
                                    {cityItem.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-300 pt-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex flex-wrap gap-4 text-sm">
                                <Link href="/safety" className="text-blue-600 hover:underline">safety</Link>
                                <Link href="/privacy" className="text-blue-600 hover:underline">privacy</Link>
                                <Link href="/terms" className="text-blue-600 hover:underline">terms</Link>
                            </div>
                            <div className="text-sm text-gray-600">
                                <span>© 2025 SoPo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>}

        </>
    );
}