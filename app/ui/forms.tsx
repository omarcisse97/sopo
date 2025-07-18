'use client';

import { useActionState } from 'react';
import { Country, City, Category } from '@/app/lib/definition';
import { createPostConfig } from '@/app/data/categories';
import { createListing, State } from '@/app/lib/actions';

export const CreateListing = (props: { country: Country, city: City, category: Category }) => {
    const initialState: State = { message: null, errors: {} };
    const country = props.country;

    const city = props.city;
    const category = props.category;
    const configKey = category.slug as keyof typeof createPostConfig;
    const config = createPostConfig[configKey];
    const [state, formAction] = useActionState(createListing, initialState);

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
            <div className="bg-white border border-gray-300 rounded-lg p-4 sm:p-6">
                <h1 className="text-xl sm:text-2xl font-bold mb-6">
                    {config.title} in {city.name}
                </h1>

                <div>
                    <form action={formAction}>

                        {/* Title */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Brief title for your listing"
                                aria-describedby="title-error"
                            />
                            <div id="title-error" aria-live="polite" aria-atomic="true">
                                {state && state.errors?.title &&
                                    state.errors.title.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                rows={5}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder={config.descriptionPlaceholder}
                                aria-describedby="description-error"
                            />
                            <div id="description-error" aria-live="polite" aria-atomic="true">
                                {state && state.errors?.description &&
                                    state.errors.description.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </div>

                        {/* Price (if applicable) */}
                        {config.fields.includes('price') && config.priceLabel && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {config.priceLabel}
                                </label>
                                <input
                                    type="text"
                                    name="price"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={config.pricePlaceholder}

                                />
                            </div>
                        )}

                        {/* Currency (optional) */}
                        {config.fields.includes('price') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Currency
                                </label>
                                <select
                                    name="currency"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select currency</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="CAD">CAD</option>
                                </select>
                            </div>
                        )}

                        {/* Location */}
                        {config.fields.includes('location') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={`Specific location in ${city.name}`}
                                />
                            </div>
                        )}

                        {/* Subcategories */}
                        {category.subcategories && category.subcategories.length > 0 && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subcategories
                                </label>
                                <div className="space-y-2">
                                    {category.subcategories.map((subcat) => (
                                        <label key={subcat.slug} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="subcategories"
                                                value={subcat.name}
                                                className="mr-2 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">{subcat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Expires At */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expires At
                            </label>
                            <input
                                type="date"
                                name="expires_at"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave empty for no expiration</p>
                        </div>

                        {/* Dynamic Fields Based on Category */}
                        {config.fields.includes('condition') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Condition
                                </label>
                                <select
                                    name="condition"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select condition</option>
                                    <option value="new">New</option>
                                    <option value="like-new">Like New</option>
                                    <option value="good">Good</option>
                                    <option value="fair">Fair</option>
                                    <option value="poor">Poor</option>
                                </select>
                            </div>
                        )}

                        {config.fields.includes('brand') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Brand
                                </label>
                                <input
                                    type="text"
                                    name="brand"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Brand name"
                                />
                            </div>
                        )}

                        {config.fields.includes('type') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>
                                <select
                                    name="type"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select type</option>
                                    {category.slug === 'housing' && (
                                        <>
                                            <option value="apartment">Apartment</option>
                                            <option value="house">House</option>
                                            <option value="condo">Condo</option>
                                            <option value="room">Room</option>
                                        </>
                                    )}
                                    {category.slug === 'jobs' && (
                                        <>
                                            <option value="full-time">Full-time</option>
                                            <option value="part-time">Part-time</option>
                                            <option value="contract">Contract</option>
                                            <option value="freelance">Freelance</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        )}

                        {config.fields.includes('bedrooms') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bedrooms
                                </label>
                                <select
                                    name="bedrooms"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select bedrooms</option>
                                    <option value="studio">Studio</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5+">5+</option>
                                </select>
                            </div>
                        )}

                        {config.fields.includes('bathrooms') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bathrooms
                                </label>
                                <select
                                    name="bathrooms"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select bathrooms</option>
                                    <option value="1">1</option>
                                    <option value="1.5">1.5</option>
                                    <option value="2">2</option>
                                    <option value="2.5">2.5</option>
                                    <option value="3">3</option>
                                    <option value="3.5">3.5</option>
                                    <option value="4+">4+</option>
                                </select>
                            </div>
                        )}

                        {config.fields.includes('size') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Size
                                </label>
                                <input
                                    type="text"
                                    name="size"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Square feet or dimensions"
                                />
                            </div>
                        )}

                        {config.fields.includes('experience') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Experience Level
                                </label>
                                <select
                                    name="experience"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select experience level</option>
                                    <option value="entry">Entry Level</option>
                                    <option value="1-3">1-3 years</option>
                                    <option value="3-5">3-5 years</option>
                                    <option value="5+">5+ years</option>
                                    <option value="senior">Senior Level</option>
                                </select>
                            </div>
                        )}

                        {config.fields.includes('duration') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration
                                </label>
                                <select
                                    name="duration"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select duration</option>
                                    <option value="hourly">Hourly</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                        )}

                        {config.fields.includes('term') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Term
                                </label>
                                <select
                                    name="term"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select term</option>
                                    <option value="1-month">1 month</option>
                                    <option value="3-months">3 months</option>
                                    <option value="6-months">6 months</option>
                                    <option value="1-year">1 year</option>
                                    <option value="2+years">2+ years</option>
                                </select>
                            </div>
                        )}

                        {config.fields.includes('interest') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Interest Rate
                                </label>
                                <input
                                    type="text"
                                    name="interest"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 5% APR"
                                />
                            </div>
                        )}

                        {config.fields.includes('amount') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {config.priceLabel}
                                </label>
                                <input
                                    type="text"
                                    name="amount"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={config.pricePlaceholder}
                                />
                            </div>
                        )}

                        {config.fields.includes('salary') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {config.priceLabel}
                                </label>
                                <input
                                    type="text"
                                    name="salary"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={config.pricePlaceholder}
                                />
                            </div>
                        )}

                        {config.fields.includes('age') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    min="18"
                                    max="100"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Age"
                                />
                            </div>
                        )}

                        {config.fields.includes('date') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        )}

                        {/* Images */}
                        {config.showImages && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Images 
                                </label>
                                <input
                                    type="file"
                                    name="images"
                                    multiple
                                    accept="image/*"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Upload images (aim for 8MB per images)
                                </p>
                            </div>
                        )}

                        {/* Contact Email */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Email *
                            </label>
                            <input
                                type="email"
                                name="contact_email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="your@email.com"
                                aria-describedby="email-error"
                            />
                            <div id="email-error" aria-live="polite" aria-atomic="true">
                                {state && state.errors?.contact_email &&
                                    state.errors.contact_email.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </div>

                        {/* Contact Phone */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Phone
                            </label>
                            <input
                                type="tel"
                                name="contact_phone"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Phone number (optional)"
                            />
                        </div>

                        {/* Hidden Fields */}
                        <input type="hidden" name="country_slug" value={country.slug} />
                        <input type="hidden" name="city_slug" value={city.slug} />
                        <input type="hidden" name="category_slug" value={category.slug} />

                        {/* Submit Button */}

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                Create Listing
                            </button>
                        </div>
                        <div id="error-message">
                            {state && state.message && <p className="mt-2 text-sm text-red-500">{state.message}</p>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}