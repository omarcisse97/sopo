'use client'
import Link from 'next/link';


export default function NotFound() {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-300 p-6">
          <h1 className="text-xl font-bold mb-4">SoPo - Oops! Something happened</h1>
          <p className="text-gray-600 mb-4">
            Unable to create a post at this time
          </p>
          <p className="text-sm text-gray-500 mb-4">
           Please try again later or contact support
          </p>
          <Link
            href="/"
            className="text-blue-600 hover:underline"
          >
            ← SoPo
          </Link>
        </div>
      </div>
    );
}