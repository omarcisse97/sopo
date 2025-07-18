'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Category, FilterConfig } from '@/app/lib/definition';

interface FilterSidebarProps {
    selectedFilters: Record<string, string | null>;
    category: Category;
}

export const FilterSidebar = ({ selectedFilters, category }: FilterSidebarProps) => {
    const { replace } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [filterConfig, setFilterConfig] = useState<FilterConfig | null>(null);

    

    useEffect(() => {
        if(category){
            setFilterConfig(category.filterConfig);
        }
    }, [category]);
    
    

    const updateURL = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        
        if (value && value !== '') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        
        replace(`${pathname}?${params.toString()}`);
    };

    const clearAllFilters = () => {
        const params = new URLSearchParams();
        replace(`${pathname}?${params.toString()}`);
    };

    const removeFilter = (key: string) => {
        const params = new URLSearchParams(searchParams);
        params.delete(key);
        replace(`${pathname}?${params.toString()}`);
    };

    // Check if any filters are active (non-null values)
    const hasActiveFilters = Object.values(selectedFilters).some(value => value !== null && value !== '');

    return (
        <div className="w-64 bg-white border border-gray-300 h-fit">
            {/* Header */}
            <div className="border-b border-gray-300 p-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Filters</h3>
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="divide-y divide-gray-200">
                {/* Price Range Filter */}

                {filterConfig && filterConfig.priceRange && (
                    <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Min Price
                                </label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    defaultValue={selectedFilters.minPrice || ''}
                                    onChange={(e) => updateURL('minPrice', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Max Price
                                </label>
                                <input
                                    type="number"
                                    placeholder="Any"
                                    defaultValue={selectedFilters.maxPrice || ''}
                                    onChange={(e) => updateURL('maxPrice', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Dynamic Filters */}
                {filterConfig && filterConfig.filters.map((filter) => (
                    <div key={filter.key} className="p-4">
                        <h4 className="font-medium text-gray-900 mb-3">{filter.label}</h4>
                        
                        {filter.type === 'select' && (
                            <select
                                value={selectedFilters[filter.key] || ''}
                                onChange={(e) => updateURL(filter.key, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All {filter.label}</option>
                                {filter.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}

                        {filter.type === 'radio' && (
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name={filter.key}
                                        value=""
                                        checked={!selectedFilters[filter.key]}
                                        onChange={() => updateURL(filter.key, '')}
                                        className="mr-2 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">All {filter.label}</span>
                                </label>
                                {filter.options.map((option) => (
                                    <label key={option.value} className="flex items-center">
                                        <input
                                            type="radio"
                                            name={filter.key}
                                            value={option.value}
                                            checked={selectedFilters[filter.key] === option.value}
                                            onChange={(e) => updateURL(filter.key, e.target.value)}
                                            className="mr-2 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {filter.type === 'checkbox' && (
                            <div className="space-y-2">
                                {filter.options.map((option) => {
                                    const currentValues = selectedFilters[filter.key]?.split(',').filter(v => v) || [];
                                    return (
                                        <label key={option.value} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                value={option.value}
                                                checked={currentValues.includes(option.value)}
                                                onChange={(e) => {
                                                    let newValues;
                                                    if (e.target.checked) {
                                                        newValues = [...currentValues, option.value];
                                                    } else {
                                                        newValues = currentValues.filter(v => v !== option.value);
                                                    }
                                                    updateURL(filter.key, newValues.join(','));
                                                }}
                                                className="mr-2 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">{option.label}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}

                {/* Sort Filter */}
                {filterConfig && filterConfig.sort && filterConfig.sort.length > 0 && (
                    <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
                        <select
                            value={selectedFilters.sort || ''}
                            onChange={(e) => updateURL('sort', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Default</option>
                            {filterConfig.sort.map((sortOption) => (
                                <option key={sortOption} value={sortOption}>
                                    {sortOption === 'date' && 'Newest First'}
                                    {sortOption === 'price-low' && 'Price: Low to High'}
                                    {sortOption === 'price-high' && 'Price: High to Low'}
                                    {sortOption === 'amount-low' && 'Amount: Low to High'}
                                    {sortOption === 'amount-high' && 'Amount: High to Low'}
                                    {sortOption === 'interest-low' && 'Interest: Low to High'}
                                    {sortOption === 'interest-high' && 'Interest: High to Low'}
                                    {!['date', 'price-low', 'price-high', 'amount-low', 'amount-high', 'interest-low', 'interest-high'].includes(sortOption) && sortOption}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="border-t border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Active Filters</h4>
                    <div className="space-y-1">
                        {Object.entries(selectedFilters).map(([key, value]) => {
                            if (!value) return null;
                            
                            // Handle price range differently
                            if (key === 'minPrice') {
                                return (
                                    <div key={key} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Min: ${value}</span>
                                        <button
                                            onClick={() => removeFilter(key)}
                                            className="text-red-500 hover:text-red-700 ml-2"
                                        >
                                            ×
                                        </button>
                                    </div>
                                );
                            }
                            
                            if (key === 'maxPrice') {
                                return (
                                    <div key={key} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Max: ${value}</span>
                                        <button
                                            onClick={() => removeFilter(key)}
                                            className="text-red-500 hover:text-red-700 ml-2"
                                        >
                                            ×
                                        </button>
                                    </div>
                                );
                            }
                            
                            // Handle regular filters
                            const filter = filterConfig? filterConfig.filters.find(f => f.key === key) : null;
                            const option = filter? filter?.options.find(o => o.value === value) : null;
                            
                            if(filter && option){
                                return (
                                <div key={key} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                        {filter?.label || key}: {option?.label || value}
                                    </span>
                                    <button
                                        onClick={() => removeFilter(key)}
                                        className="text-red-500 hover:text-red-700 ml-2"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                            }
                            
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};