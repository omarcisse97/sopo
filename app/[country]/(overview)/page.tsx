import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Country } from '@/app/lib/definition';
import { getCountries } from '@/app/lib/data';

export const metadata: Metadata = {
    title: 'City Selection'
}

const Page = async (props: { params: Promise<{ country: string }> }) => {
    const params = await props.params;
    const countrySlug = params.country;
    const country = getCountries(countrySlug) as Country;
    
    if (!country) {
        notFound();
    }
    
    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link 
                        href="/"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Select Country
                    </Link>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">{country.name}</h1>
                    <p className="text-xl text-gray-600">Choose a city</p>
                    <p className="text-sm text-gray-500 mt-2">
                        {country.cities.length} cities available
                    </p>
                </div>


                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {country.cities.map((city) => (
                        <Link 
                            key={city.id}
                            href={`/${country.slug}/${city.slug}`}
                            className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 hover:border-blue-300"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {city.name}
                                    </h3>
                                    
                                </div>
                                <svg 
                                    className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>

                {country.cities.length > 6 && (
                    <div className="mt-12">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                            Popular Cities
                        </h2>
                        <div className="flex flex-wrap justify-center gap-3">
                            {country.cities.slice(0, 5).map((city) => (
                                <Link
                                    key={`popular-${city.id}`}
                                    href={`/${country.slug}/${city.slug}`}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
                                >
                                    {city.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-16 text-center bg-white rounded-xl p-8 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Don&apos;t see your city?
                    </h3>
                    <p className="text-gray-600 mb-4">
                        We&apos;re expanding to new cities regularly. Check back soon!
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center px-4 py-2 bg-gray-200 text-blue rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Request New City
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Page;