import { Country, City } from "../lib/definition";

export const cities: Record<string, City[]> = {
    'nigeria': [
        { id: 1, name: 'Lagos', slug: 'lagos' },
        { id: 2, name: 'Abuja', slug: 'abuja' },
        { id: 3, name: 'Kano', slug: 'kano' },
        { id: 4, name: 'Ibadan', slug: 'ibadan' },
        { id: 5, name: 'Port Harcourt', slug: 'port-harcourt' },
        { id: 6, name: 'Benin City', slug: 'benin-city' }
    ],
    'ghana': [
        { id: 7, name: 'Accra', slug: 'accra' },
        { id: 8, name: 'Kumasi', slug: 'kumasi' },
        { id: 9, name: 'Tamale', slug: 'tamale' },
        { id: 10, name: 'Takoradi', slug: 'takoradi' }
    ],
    'senegal': [
        { id: 11, name: 'Dakar', slug: 'dakar' },
        { id: 12, name: 'Thiès', slug: 'thies' },
        { id: 13, name: 'Kaolack', slug: 'kaolack' },
        { id: 14, name: 'Saint-Louis', slug: 'saint-louis' }
    ],
    'ivory-coast': [
        { id: 15, name: 'Abidjan', slug: 'abidjan' },
        { id: 16, name: 'Yamoussoukro', slug: 'yamoussoukro' },
        { id: 17, name: 'Bouaké', slug: 'bouake' },
        { id: 18, name: 'Daloa', slug: 'daloa' }
    ],
    'mali': [
        { id: 19, name: 'Bamako', slug: 'bamako' },
        { id: 20, name: 'Sikasso', slug: 'sikasso' },
        { id: 21, name: 'Mopti', slug: 'mopti' },
        { id: 22, name: 'Ségou', slug: 'segou' }
    ],
    'guinea': [
        { id: 23, name: 'Conakry', slug: 'conakry' },
        { id: 24, name: 'Kankan', slug: 'kankan' },
        { id: 25, name: 'Labé', slug: 'labe' },
        { id: 26, name: 'Nzérékoré', slug: 'nzerekore' }
    ],
    'burkina-faso': [
        { id: 27, name: 'Ouagadougou', slug: 'ouagadougou' },
        { id: 28, name: 'Bobo-Dioulasso', slug: 'bobo-dioulasso' },
        { id: 29, name: 'Koudougou', slug: 'koudougou' }
    ],
    'sierra-leone': [
        { id: 30, name: 'Freetown', slug: 'freetown' },
        { id: 31, name: 'Bo', slug: 'bo' },
        { id: 32, name: 'Kenema', slug: 'kenema' }
    ],
    'liberia': [
        { id: 33, name: 'Monrovia', slug: 'monrovia' },
        { id: 34, name: 'Gbarnga', slug: 'gbarnga' },
        { id: 35, name: 'Kakata', slug: 'kakata' }
    ],
    'togo': [
        { id: 36, name: 'Lomé', slug: 'lome' },
        { id: 37, name: 'Sokodé', slug: 'sokode' },
        { id: 38, name: 'Kara', slug: 'kara' }
    ],
    'benin': [
        { id: 39, name: 'Cotonou', slug: 'cotonou' },
        { id: 40, name: 'Porto-Novo', slug: 'porto-novo' },
        { id: 41, name: 'Parakou', slug: 'parakou' }
    ],
    'kenya': [
        { id: 42, name: 'Nairobi', slug: 'nairobi' },
        { id: 43, name: 'Mombasa', slug: 'mombasa' },
        { id: 44, name: 'Kisumu', slug: 'kisumu' },
        { id: 45, name: 'Nakuru', slug: 'nakuru' }
    ],
    'tanzania': [
        { id: 46, name: 'Dar es Salaam', slug: 'dar-es-salaam' },
        { id: 47, name: 'Dodoma', slug: 'dodoma' },
        { id: 48, name: 'Mwanza', slug: 'mwanza' },
        { id: 49, name: 'Arusha', slug: 'arusha' }
    ],
    'uganda': [
        { id: 50, name: 'Kampala', slug: 'kampala' },
        { id: 51, name: 'Gulu', slug: 'gulu' },
        { id: 52, name: 'Lira', slug: 'lira' },
        { id: 53, name: 'Jinja', slug: 'jinja' }
    ],
    'ethiopia': [
        { id: 54, name: 'Addis Ababa', slug: 'addis-ababa' },
        { id: 55, name: 'Dire Dawa', slug: 'dire-dawa' },
        { id: 56, name: 'Mekelle', slug: 'mekelle' },
        { id: 57, name: 'Gondar', slug: 'gondar' }
    ],
    'south-africa': [
        { id: 58, name: 'Johannesburg', slug: 'johannesburg' },
        { id: 59, name: 'Cape Town', slug: 'cape-town' },
        { id: 60, name: 'Durban', slug: 'durban' },
        { id: 61, name: 'Pretoria', slug: 'pretoria' },
        { id: 62, name: 'Port Elizabeth', slug: 'port-elizabeth' }
    ],
    'zimbabwe': [
        { id: 63, name: 'Harare', slug: 'harare' },
        { id: 64, name: 'Bulawayo', slug: 'bulawayo' },
        { id: 65, name: 'Chitungwiza', slug: 'chitungwiza' }
    ],
    'botswana': [
        { id: 66, name: 'Gaborone', slug: 'gaborone' },
        { id: 67, name: 'Francistown', slug: 'francistown' },
        { id: 68, name: 'Molepolole', slug: 'molepolole' }
    ],
    'egypt': [
        { id: 69, name: 'Cairo', slug: 'cairo' },
        { id: 70, name: 'Alexandria', slug: 'alexandria' },
        { id: 71, name: 'Giza', slug: 'giza' },
        { id: 72, name: 'Luxor', slug: 'luxor' }
    ],
    'morocco': [
        { id: 73, name: 'Casablanca', slug: 'casablanca' },
        { id: 74, name: 'Rabat', slug: 'rabat' },
        { id: 75, name: 'Marrakech', slug: 'marrakech' },
        { id: 76, name: 'Fez', slug: 'fez' }
    ],
    'tunisia': [
        { id: 77, name: 'Tunis', slug: 'tunis' },
        { id: 78, name: 'Sfax', slug: 'sfax' },
        { id: 79, name: 'Sousse', slug: 'sousse' }
    ],
    'cameroon': [
        { id: 80, name: 'Douala', slug: 'douala' },
        { id: 81, name: 'Yaoundé', slug: 'yaounde' },
        { id: 82, name: 'Bamenda', slug: 'bamenda' },
        { id: 83, name: 'Bafoussam', slug: 'bafoussam' }
    ],
    'democratic-republic-of-congo': [
        { id: 84, name: 'Kinshasa', slug: 'kinshasa' },
        { id: 85, name: 'Lubumbashi', slug: 'lubumbashi' },
        { id: 86, name: 'Mbuji-Mayi', slug: 'mbuji-mayi' },
        { id: 87, name: 'Kisangani', slug: 'kisangani' }
    ]
};

export const countries: Country[] = [
    // West Africa
    {
        id: 1,
        code: 'NG',
        name: 'Nigeria',
        slug: 'nigeria',
        cities: cities['nigeria']
    },
    {
        id: 2,
        code: 'GH',
        name: 'Ghana',
        slug: 'ghana',
        cities: cities['ghana']
    },
    {
        id: 3,
        code: 'SN',
        name: 'Senegal',
        slug: 'senegal',
        cities: cities['senegal']
    },
    {
        id: 4,
        code: 'CI',
        name: 'Ivory Coast',
        slug: 'ivory-coast',
        cities: cities['ivory-coast']
    },
    {
        id: 5,
        code: 'ML',
        name: 'Mali',
        slug: 'mali',
        cities: cities['mali']
    },
    {
        id: 6,
        code: 'GN',
        name: 'Guinea',
        slug: 'guinea',
        cities: cities['guinea']
    },
    {
        id: 7,
        code: 'BF',
        name: 'Burkina Faso',
        slug: 'burkina-faso',
        cities: cities['burkina-faso']
    },
    {
        id: 8,
        code: 'SL',
        name: 'Sierra Leone',
        slug: 'sierra-leone',
        cities: cities['sierra-leone']
    },
    {
        id: 9,
        code: 'LR',
        name: 'Liberia',
        slug: 'liberia',
        cities: cities['liberia']
    },
    {
        id: 10,
        code: 'TG',
        name: 'Togo',
        slug: 'togo',
        cities: cities['togo']
    },
    {
        id: 11,
        code: 'BJ',
        name: 'Benin',
        slug: 'benin',
        cities: cities['benin']
    },
    // East Africa
    {
        id: 12,
        code: 'KE',
        name: 'Kenya',
        slug: 'kenya',
        cities: cities['kenya']
    },
    {
        id: 13,
        code: 'TZ',
        name: 'Tanzania',
        slug: 'tanzania',
        cities: cities['tanzania']
    },
    {
        id: 14,
        code: 'UG',
        name: 'Uganda',
        slug: 'uganda',
        cities: cities['uganda']
    },
    {
        id: 15,
        code: 'ET',
        name: 'Ethiopia',
        slug: 'ethiopia',
        cities: cities['ethiopia']
    },
    // Southern Africa
    {
        id: 16,
        code: 'ZA',
        name: 'South Africa',
        slug: 'south-africa',
        cities: cities['south-africa']
    },
    {
        id: 17,
        code: 'ZW',
        name: 'Zimbabwe',
        slug: 'zimbabwe',
        cities: cities['zimbabwe']
    },
    {
        id: 18,
        code: 'BW',
        name: 'Botswana',
        slug: 'botswana',
        cities: cities['botswana']
    },
    // North Africa
    {
        id: 19,
        code: 'EG',
        name: 'Egypt',
        slug: 'egypt',
        cities: cities['egypt']
    },
    {
        id: 20,
        code: 'MA',
        name: 'Morocco',
        slug: 'morocco',
        cities: cities['morocco']
    },
    {
        id: 21,
        code: 'TN',
        name: 'Tunisia',
        slug: 'tunisia',
        cities: cities['tunisia']
    },
    // Central Africa
    {
        id: 22,
        code: 'CM',
        name: 'Cameroon',
        slug: 'cameroon',
        cities: cities['cameroon']
    },
    {
        id: 23,
        code: 'CD',
        name: 'Democratic Republic of Congo',
        slug: 'democratic-republic-of-congo',
        cities: cities['democratic-republic-of-congo']
    }
];

// Helper functions
export const getCountryBySlug = (slug: string): Country | undefined => 
    countries.find(country => country.slug === slug);

export const getCitiesByCountry = (countrySlug: string): City[] => 
    cities[countrySlug] || [];

export const getCityBySlug = (citySlug: string): City | undefined => 
    Object.values(cities).flat().find(city => city.slug === citySlug);

export const getAllCities = (): City[] => 
    Object.values(cities).flat();

export const getCountryNameBySlug = (slug: string): string => 
    getCountryBySlug(slug)?.name || '';

