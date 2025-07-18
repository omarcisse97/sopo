import Link from "next/link";
import { getCountries } from "./lib/data";
import { Country } from "./lib/definition";

const Page = () => {
  const countries = getCountries(null) as Country[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-50  to-gray-50">
      <div className="text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            SoPo.
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-2">
            Classifieds Ads
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pick a Location
          </h2>
          {/* <p className="text-gray-600">
            Select your country to start browsing local listings
          </p> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {countries.map(country => (
            <div
              key={country.code}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >

              <div className="mb-6">
                <Link
                  href={`/${country.slug}`}
                  className="group flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {country.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {country.cities.length} cities available
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Cities:</h4>
                {country.cities.slice(0, 5).map(city => (
                  <Link
                    key={city.slug}
                    href={`/${country.slug}/${city.slug}`}
                    className="block text-blue-600 hover:text-blue-800 hover:underline text-sm py-1 px-2 rounded hover:bg-blue-50 transition-all"
                  >
                    {city.name}
                  </Link>
                ))}

                {country.cities.length > 5 && (
                  <Link
                    href={`/${country.slug}`}
                    className="block text-gray-500 hover:text-blue-600 text-sm py-1 px-2 italic"
                  >
                    +{country.cities.length - 5} more cities...
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center space-x-6 mb-4">
              <Link href="/help" className="text-blue-600 hover:underline text-sm">Help</Link>
              <Link href="/safety" className="text-blue-600 hover:underline text-sm">Safety</Link>
              <Link href="/privacy" className="text-blue-600 hover:underline text-sm">Privacy</Link>
              <Link href="/terms" className="text-blue-600 hover:underline text-sm">Terms</Link>
            </div>
            <p className="text-xs text-gray-500">
              © 2025 SoPo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;