
'use client'
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function NotFound() {
    const params = useParams();
    const country_slug = params?.country ?? null;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white border border-gray-300 p-6">
                <h1 className="text-xl font-bold mb-4">SoPo - Oops! Something happened</h1>
                <p className="text-gray-600 mb-4">
                    {country_slug ? `Country "${country_slug}" does not exist in SoPo yet!` : `An Error occured :(`}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                    {country_slug ? `You can request country "${country_slug}" to be added by contacting SoPo Support` : `Please go back to safety or contact SoPo Support for assistance`}
                </p>
                <Link
                    href="/"
                    className="text-blue-600 hover:underline"
                >
                    ← go back to SoPo
                </Link>
            </div>
        </div>
    );
}