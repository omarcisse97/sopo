import { Header } from "@/app/ui/home/nav";
import { getCountries, getCities, getCategories } from "@/app/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Country, City, Category } from "@/app/lib/definition";
import { PreviousURL } from "@/app/lib/definition";

const Page = async (props: { params: Promise<{ country: string, city: string }> }) => {
  const params = await props.params;
  const countrySlug = params.country;
  const citySlug = params.city;
  const country = getCountries(countrySlug) as Country;
  const city = getCities(countrySlug, citySlug) as City;
  const categories = await getCategories(false, false, countrySlug, citySlug, null) as Category[];
  
  if (!country || !city || !categories) {
    notFound();
  }
  
  const currentURL: PreviousURL = {
    title: `Categories Selection in ${country.name}(${city.name})`,
    url: `/${country.slug}/${city.slug}`
  }


  return (
    <>
      <Header country={country} city={city} currentURL={currentURL} />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Categories in {city.name}
          </h1>
          <p className="text-gray-600">
            Select a category to continue
          </p>
        </div>

        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">{category.icon}</span>
                <div>
                  <Link
                    className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    href={`/${countrySlug}/${citySlug}/${category.slug}`}
                  >
                    {category.name}
                  </Link>
                </div>
              </div>

              
              <div className="space-y-2">
                {category.subcategories.slice(0, 5).map((sub, idxSub) => (
                  <div key={idxSub} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-50 transition-colors">
                    <Link
                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium flex-1"
                      href={`/${countrySlug}/${citySlug}/${category.slug}?categories=${sub.slug}`}
                    >
                      {sub.name}
                    </Link>
                    
                  </div>
                ))}
                
                
                {category.subcategories.length > 5 && (
                  <Link
                    href={`/${countrySlug}/${citySlug}/${category.slug}`}
                    className="text-sm text-gray-500 hover:text-blue-600 italic block pt-2"
                  >
                    +{category.subcategories.length - 5} more...
                  </Link>
                )}
              </div>

              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href={`/${countrySlug}/${citySlug}/${category.slug}`}
                  className="block w-full text-center py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  View All {category.name}
                </Link>
              </div>
            </div>
          ))}
        </div>

       
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to post?
            </h2>
            <p className="text-gray-600 mb-4">
              Share your items, services, or opportunities with the {city.name} community
            </p>
            <Link
              href={`/${countrySlug}/${citySlug}/post/create`}
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-blue font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Listing
            </Link>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-300 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-4">
         
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Cities in {country.name}:
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {country.cities.map(cityItem => (
                <Link
                  key={cityItem.id}
                  href={`/${countrySlug}/${cityItem.slug}`}
                  className={`text-xs hover:underline transition-colors ${
                    cityItem.slug === citySlug 
                      ? 'text-blue-800 font-medium' 
                      : 'text-blue-600'
                  }`}
                >
                  {cityItem.name}
                </Link>
              ))}
            </div>
          </div>

          
          <div className="border-t border-gray-300 pt-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex space-x-4">
                <Link href="/safety" className="text-blue-600 hover:underline">safety</Link>
                <Link href="/privacy" className="text-blue-600 hover:underline">privacy</Link>
                <Link href="/terms" className="text-blue-600 hover:underline">terms</Link>
              </div>
              <div>
                <span>© 2025 SoPo</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Page;