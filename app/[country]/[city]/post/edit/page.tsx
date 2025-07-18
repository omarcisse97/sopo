import { getCities, getCountries } from '@/app/lib/data';
import { Country, City } from '@/app/lib/definition';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function UnderConstructionPage(props: { params: Promise<{ country: string, city: string}>}) {
    const params = await props.params;
    const country_slug = params.country;
    const city_slug = params.city;

    if(!country_slug || !city_slug){
        notFound();
    }

    const country = getCountries(country_slug) as Country;
    const city = getCities(country_slug, city_slug) as City;

    if(!country || !city){
        notFound();
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Construction Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
            </svg>
          </div>
          
          {/* Animated dots */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Coming Soon!
          </h1>
          
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Manage Your Posts
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            We&apos;re building a simple way for you to manage all your listings. 
            Soon you&apos;ll be able to edit, delete, and repost your ads with just your email—no passwords required!
          </p>

          {/* Features Preview */}
          <div className="text-left mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">What&apos;s coming:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Email-based access (no passwords!)
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                View all your listings
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Edit or delete posts
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Extend listing expiration
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          {/* <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Listings
            </Link>
            
            <Link
              href="/contact"
              className="block w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Get Notified When Ready
            </Link>
          </div> */}

          {/* Timeline */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Expected launch: <span className="font-medium text-gray-700">End 2025</span>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6">
          <Link
            href={`/${country.slug}/${city.slug}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to SoPo {city.name}
          </Link>
        </div>
      </div>
    </div>
  );
}