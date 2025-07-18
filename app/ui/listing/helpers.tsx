"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export const useCreateFilters = ({filterConfig, subCategories, currentFilters}) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Helper function to create filter URLs
    const createFilterUrl = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        return `${pathname}?${params.toString()}`;
    };

    return (
        <div className="w-64 bg-white border border-gray-300 p-4 h-fit">
            <h3 className="font-semibold text-lg mb-4">Filters</h3>

            {/* Subcategories first */}
            {subCategories && subCategories.length > 0 && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                    </label>
                    <select
                        value={currentFilters.subcategory || ''}
                        onChange={(e) => window.location.href = createFilterUrl('subcategory', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        {subCategories.map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Dynamic filters from filterConfig */}
            {filterConfig.filters.map((filterDef) => {
                if (filterDef.key === 'subcategory') return null; // Skip, already handled above
                
                return (
                    <div key={filterDef.key} className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {filterDef.label}
                        </label>
                        {filterDef.type === 'select' && (
                            <select
                                value={currentFilters[filterDef.key] || ''}
                                onChange={(e) => window.location.href = createFilterUrl(filterDef.key, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                {filterDef.options.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                );
            })}

            {/* Price Range - only if enabled for this category */}
            {filterConfig.priceRange && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range
                    </label>
                    <div className="space-y-2">
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={currentFilters.priceMin || ''}
                            onChange={(e) => window.location.href = createFilterUrl('priceMin', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={currentFilters.priceMax || ''}
                            onChange={(e) => window.location.href = createFilterUrl('priceMax', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>
            )}

            {/* Sort - using options from filterConfig */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                </label>
                <select
                    value={currentFilters.sortBy || 'date'}
                    onChange={(e) => window.location.href = createFilterUrl('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    {filterConfig.sort.map(sortOption => (
                        <option key={sortOption} value={sortOption}>
                            {sortOption === 'date' && 'Newest First'}
                            {sortOption === 'price-low' && 'Price: Low to High'}
                            {sortOption === 'price-high' && 'Price: High to Low'}
                            {sortOption === 'salary-high' && 'Salary: High to Low'}
                            {sortOption === 'salary-low' && 'Salary: Low to High'}
                        </option>
                    ))}
                </select>
            </div>

            {/* Clear Filters */}
            <Link
                href={pathname}
                className="block w-full px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors text-center"
            >
                Clear All Filters
            </Link>
        </div>
    );
};