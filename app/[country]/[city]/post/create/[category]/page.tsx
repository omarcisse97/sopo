import Link from 'next/link';
import { Category, City, Country} from '@/app/lib/definition';
import { notFound } from 'next/navigation';
import { createPostConfig} from '@/app/data/categories';
import { CreateListing } from '@/app/ui/forms';
import { getCountries, getCities, getCategories } from '@/app/lib/data';



export default async function Page(
  props: {
    params: Promise<{ country: string, city: string, category: string}>,
    searchParams?: Promise<{ previousURL?: string}>
  }
) {
  const params = await props.params;
  const country_slug = params.country;
  const city_slug = params.city;
  const category_slug = params.category;

  
  if(!country_slug || !city_slug || !category_slug){
    notFound();
  }
  const country: Country | null = getCountries(country_slug) as Country ?? null;
  const city: City | null = getCities(country.slug,city_slug.toLowerCase()) as City ?? null;
  const category: Category | null = await getCategories(false,false,country_slug,city_slug,category_slug,true) as Category ?? null;

  if(!country || !city || !category){
    notFound();
  }

 
  const configKey = category.slug as keyof typeof createPostConfig;
  const config = createPostConfig[configKey];
  
  if (!config ||  !category.subcategories) {
    notFound();
  }
  if(category.subcategories.length < 1){
    notFound();
  }


  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href={`/${country.slug}/${city.slug}/post/create`}
        className="flex items-center text-blue-600 hover:underline mb-4 text-sm"
      >
        ← select category
      </Link>
      <CreateListing 
      country={country}
      city={city}
      category={category}
       />
      
  
    </div>
  );
}