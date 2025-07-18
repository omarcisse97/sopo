import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">
          SoPo - Oops! Something happened
        </h1>
        <p className="text-gray-600 mb-8 text-sm sm:text-base">
          Go to safety or contact SoPo Support
        </p>
        <Link 
          href="/" 
          className="text-gray-600 hover:text-gray-800 underline text-sm"
        >
          Go back to SoPo
        </Link>
      </div>
    </div>
  );
}