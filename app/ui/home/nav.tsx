"use client"

import Link from "next/link";
import { City, Country } from "@/app/lib/definition";
import { PreviousURL } from "@/app/lib/definition";

export const Header = (props: { country: Country, city: City, currentURL?: PreviousURL | null }) => {
  const country: Country = props.country;
  const city: City = props.city
  const previousURL: PreviousURL | null = props?.currentURL ?? null;
  return (
    <header className="bg-white border-b border-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center">
          {/* Left side - Logo and Location */}
          <div className="flex items-center space-x-4">
            <Link
              className="text-2xl font-bold text-blue-600 cursor-pointer"
              href="/"
            >
              SoPo
            </Link>

            <div className="flex items-center space-x-2 text-sm">
              <Link
                href={`/${country.slug}`}
                className="text-xl text-blue-600 hover:underline"
              >
                {country.name}
              </Link>
              <span className="text-gray-400">›</span>
              <span className="text-lg text-gray-700 font-medium">{city.name}</span>
            </div>
          </div>

          {/* Right side - Navigation */}
          <div className="flex items-center space-x-4 ml-auto">
            <Link
              className="text-blue-600 hover:underline"
              href={`/${country.slug}/${city.slug}/post${previousURL ? `?previousURL=${encodeURIComponent(JSON.stringify(previousURL))}` : ``}`}
            >
              post
            </Link>
            {/* <Link className="text-blue-600 hover:underline" href="/account">
              account
            </Link> */}
            <Link className="text-blue-600 hover:underline" href="/help">
              help
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};