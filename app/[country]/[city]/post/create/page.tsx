import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountries, getCities, getCategories } from "@/app/lib/data";
import { Country, City, Category, PreviousURL } from "@/app/lib/definition";

const Page = async (
    props: {
        params: Promise<{ country: string, city: string }>,
        searchParams?: Promise<{ previousURL?: string | null }>
    }
) => {
    const params = await props.params;
    const searchParams = await props.searchParams ?? null;
    const country_slug = params.country;
    const city_slug = params.city;
    let previousURL: PreviousURL | null = null;
    if (!country_slug || !city_slug) {
        notFound();
    }

    const country = getCountries(country_slug) as Country;
    const city = getCities(country_slug, city_slug) as City;

    if (!city || !country) {
        notFound();
    }
    if (searchParams) {
        if (searchParams.previousURL) {
            previousURL = JSON.parse(decodeURIComponent(searchParams.previousURL));
        }
    }
    const categories = await getCategories(true, false, country.slug, city.slug, null, false) as Category[];

    if (!categories) {
        notFound();
    }
    console.log(categories);


    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            {/* Back link */}
            <div className="mb-4">
                <Link
                    className="text-blue-600 hover:underline text-sm"
                    href={`/${country.slug}/${city.slug}/post`}
                    style={{ cursor: 'pointer' }}
                >
                    create or edit post
                </Link>
                {previousURL && <> OR <Link
                    className="text-blue-600 hover:underline text-sm"
                    href={previousURL.url}
                    style={{ cursor: 'pointer' }}
                >
                    navigate back to {previousURL.title}
                </Link> </>}

            </div>

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">SoPo</h1>
                <p className="text-gray-600">Select a category</p>
                <div className="w-16 h-0.5 bg-blue-600 mx-auto mt-2"></div>
            </div>

            {/* Cities list */}
            <div className="border border-gray-300">
                {categories.length < 1 && <p className="text-gray-600 text-sm">No categories available</p>}
                {categories.length > 0 && categories.map((category) => (
                    <Link
                        key={category.slug}
                        href={`/${country.slug}/${city.slug}/post/create/${category.slug}`}
                        className="block px-6 py-4 hover:bg-gray-100 text-blue-600 hover:underline text-sm">
                        {category.name}
                    </Link>
                ))}
                {/* 
        <Link
          href={`/${countrySlug}/${citySlug}/post/edit`}
          className="block px-6 py-4 hover:bg-gray-100 text-blue-600 hover:underline text-md">
          Manage Post
        </Link> */}

            </div>


        </div>


    );
};
export default Page;