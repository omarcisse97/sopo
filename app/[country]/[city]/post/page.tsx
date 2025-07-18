import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountries, getCities } from "@/app/lib/data";
import { City, Country } from "@/app/lib/definition";
import { PreviousURL } from "@/app/lib/definition";



const Page = (
  props: { 
    params: { country: string, city: string} ,
    searchParams?: { previousURL?: string | null }}
) => {
  const params = props.params;
  const searchParams = props.searchParams ?? null;
  const country_slug = params.country;
  const city_slug = params.city;
  let previousURL: PreviousURL | null = null;

  if (!country_slug || !city_slug) {
    notFound();
  }

  const country = getCountries(country_slug) as Country;
  const city = getCities(country_slug,city_slug) as City;

  if (!city || !country) {
    notFound();
  }

  if(searchParams){
    if(searchParams.previousURL){
      previousURL = JSON.parse(decodeURIComponent(searchParams.previousURL));
    }
  }
  


  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back link */}
      <div className="mb-4">
        
        <Link
          className="text-blue-600 hover:underline text-sm"
          href={`${previousURL? previousURL.url : `/${country.slug}/${city.slug}`}`}
          style={{ cursor: 'pointer' }}
        >
          ← {previousURL? `back to ${previousURL.title}`: `SoPo ${country.name}(${city.name})`}
        </Link>
      </div>
      

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">SoPo</h1>
        <p className="text-gray-600">Manage your posts in {city.name}</p>
        <div className="w-16 h-0.5 bg-blue-600 mx-auto mt-2"></div>
      </div>

      {/* Cities list */}
      <div className="border border-gray-300">

        <Link
          href={`/${country.slug}/${city.slug}/post/create`}
          className="block px-6 py-4 hover:bg-gray-100 text-blue-600 hover:underline text-md">
          Create Post
        </Link>
        <Link
          href={`/${country.slug}/${city.slug}/post/edit`}
          className="block px-6 py-4 hover:bg-gray-100 text-blue-600 hover:underline text-md">
          Manage Post
        </Link>
      </div>


    </div>


  );
};
export default Page;