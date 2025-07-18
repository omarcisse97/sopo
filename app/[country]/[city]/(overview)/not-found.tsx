
'use client'
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function NotFound() {
    const params = useParams();
    const country_slug = params?.country ?? null;
    const city_slug = params?.city ?? null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-300 p-6">
          <h1 className="text-xl font-bold mb-4">SoPo - Oops! Something happened</h1>
          <p className="text-gray-600 mb-4">
            {country_slug? city_slug? `"${city_slug}" is not a valid city for country ${country_slug} in SoPo yet!`: `An Error occured :(`: `An Error occured :(`}
          </p>
          <p className="text-sm text-gray-500 mb-4">
           {city_slug? `You can request country "${city_slug}" to be added by contacting SoPo Support`: `Please go back to safety or contact SoPo Support for assistance`}
          </p>
          <Link
            href={country_slug? `/${country_slug}`: `/`}
            className="text-blue-600 hover:underline"
          >
            ← go back to SoPo {country_slug? country_slug : ''}
          </Link>
        </div>
      </div>
  );
}