import { Category, SubCategory, FilterConfig } from "../lib/definition";


export const createPostConfig = {
  'for-sale': {
    title: 'Sell',
    fields: ['price', 'condition', 'brand', 'location'],
    priceLabel: 'Price',
    pricePlaceholder: 'Enter price or "negotiable"',
    descriptionPlaceholder: 'Describe your item: condition, age, reason for selling...',
    showImages: true,
    maxImages: 8
  },
  'housing': {
    title: 'List Your Property',
    fields: ['price', 'type', 'bedrooms', 'bathrooms', 'size', 'location'],
    priceLabel: 'Rent/Price',
    pricePlaceholder: 'Monthly rent or sale price',
    descriptionPlaceholder: 'Describe the property: amenities, neighborhood, lease terms...',
    showImages: true,
    maxImages: 10
  },
  'jobs': {
    title: 'Post a Job',
    fields: ['salary', 'type', 'experience', 'location'],
    priceLabel: 'Salary',
    pricePlaceholder: 'Salary range or "competitive"',
    descriptionPlaceholder: 'Job description: responsibilities, requirements, benefits...',
    showImages: false,
    maxImages: 0
  },
  'services': {
    title: 'Offer Your Service',
    fields: ['price', 'type', 'location'],
    priceLabel: 'Rate',
    pricePlaceholder: 'Hourly rate or project price',
    descriptionPlaceholder: 'Describe your service: what you offer, experience, availability...',
    showImages: true,
    maxImages: 5
  },
  'community': {
    title: 'Community Post',
    fields: ['location', 'date'],
    priceLabel: '',
    pricePlaceholder: '',
    descriptionPlaceholder: 'Describe your event, activity, or community need...',
    showImages: true,
    maxImages: 3
  },
  'personal': {
    title: 'Personal Ad',
    fields: ['age', 'location'],
    priceLabel: '',
    pricePlaceholder: '',
    descriptionPlaceholder: 'Describe what you\'re looking for...',
    showImages: false,
    maxImages: 0
  },
  'rentals': {
    title: 'Rent Your Item',
    fields: ['price', 'duration', 'location'],
    priceLabel: 'Rental Rate',
    pricePlaceholder: 'Price per day/week/month',
    descriptionPlaceholder: 'Describe what you\'re renting: condition, terms, pickup/delivery...',
    showImages: true,
    maxImages: 6
  },
  'p2p-lending': {
    title: 'Financial Service',
    fields: ['amount', 'term', 'interest', 'location'],
    priceLabel: 'Amount',
    pricePlaceholder: 'Loan amount or investment minimum',
    descriptionPlaceholder: 'Describe your financial service: terms, requirements, purpose...',
    showImages: false,
    maxImages: 0
  }
};

const defaultFilterConfig: FilterConfig = {
    filters: [],
    priceRange: true,
    sort: ['featured', 'date', 'price-low', 'price-high']
};

const housingFilterConfig: FilterConfig = {
    filters: [
        {
            type: 'select',
            key: 'type',
            label: 'Type',
            options: [
                { value: 'rent', label: 'For Rent' },
                { value: 'sale', label: 'For Sale' }
            ]
        },
        {
            type: 'select',
            key: 'bedrooms',
            label: 'Bedrooms',
            options: [
                { value: '1', label: '1 Bedroom' },
                { value: '2', label: '2 Bedrooms' },
                { value: '3', label: '3 Bedrooms' },
                { value: '4+', label: '4+ Bedrooms' }
            ]
        }
    ],
    priceRange: true,
    sort: ['featured', 'date', 'price-low', 'price-high']
};

const saleFilterConfig: FilterConfig = {
    filters: [
        {
            type: 'select',
            key: 'condition',
            label: 'Condition',
            options: [
                { value: 'new', label: 'New' },
                { value: 'used', label: 'Used' },
                { value: 'refurbished', label: 'Refurbished' }
            ]
        }
    ],
    priceRange: true,
    sort: ['featured', 'date', 'price-low', 'price-high']
};

const jobsFilterConfig: FilterConfig = {
    filters: [
        {
            type: 'select',
            key: 'type',
            label: 'Employment Type',
            options: [
                { value: 'full-time', label: 'Full-time' },
                { value: 'part-time', label: 'Part-time' },
                { value: 'contract', label: 'Contract' },
                { value: 'internship', label: 'Internship' }
            ]
        }
    ],
    priceRange: true,
    sort: ['featured', 'date']
};

const servicesFilterConfig: FilterConfig = {
    filters: [],
    priceRange: true,
    sort: ['featured', 'date', 'price-low', 'price-high']
};

const rentalsFilterConfig: FilterConfig = {
    filters: [
        {
            type: 'select',
            key: 'duration',
            label: 'Rental Duration',
            options: [
                { value: 'hourly', label: 'Hourly' },
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' }
            ]
        }
    ],
    priceRange: true,
    sort: ['featured', 'date', 'price-low', 'price-high']
};

const lendingFilterConfig: FilterConfig = {
    filters: [
        {
            type: 'select',
            key: 'term',
            label: 'Loan Term',
            options: [
                { value: 'short', label: 'Short Term (< 6 months)' },
                { value: 'medium', label: 'Medium Term (6-24 months)' },
                { value: 'long', label: 'Long Term (> 24 months)' }
            ]
        }
    ],
    priceRange: true,
    sort: ['featured', 'date', 'price-low', 'price-high']
};

export const subCategoriesData: Record<string, SubCategory[]> = {
    'for-sale': [
        { slug: 'electronics', name: 'Electronics' },
        { slug: 'furniture', name: 'Furniture' },
        { slug: 'cars-trucks', name: 'Cars & Trucks' },
        { slug: 'clothing', name: 'Clothing' },
        { slug: 'books', name: 'Books' },
        { slug: 'sporting-goods', name: 'Sporting Goods' }
    ],
    'housing': [
        { slug: 'apartments', name: 'Apartments' },
        { slug: 'houses', name: 'Houses' },
        { slug: 'rooms', name: 'Rooms' },
        { slug: 'sublets', name: 'Sublets' },
        { slug: 'vacation-rentals', name: 'Vacation Rentals' }
    ],
    'jobs': [
        { slug: 'full-time', name: 'Full-time' },
        { slug: 'part-time', name: 'Part-time' },
        { slug: 'contract', name: 'Contract' },
        { slug: 'gigs', name: 'Gigs' },
        { slug: 'internships', name: 'Internships' }
    ],
    'services': [
        { slug: 'automotive', name: 'Automotive' },
        { slug: 'computer', name: 'Computer' },
        { slug: 'creative', name: 'Creative' },
        { slug: 'household', name: 'Household' },
        { slug: 'legal', name: 'Legal' },
        { slug: 'real-estate', name: 'Real Estate' }
    ],
    'community': [
        { slug: 'activities', name: 'Activities' },
        { slug: 'events', name: 'Events' },
        { slug: 'volunteers', name: 'Volunteers' },
        { slug: 'classes', name: 'Classes' },
        { slug: 'general', name: 'General' }
    ],
    'personal': [
        { slug: 'strictly-platonic', name: 'Strictly Platonic' },
        { slug: 'women-seeking-women', name: 'Women Seeking Women' },
        { slug: 'women-seeking-men', name: 'Women Seeking Men' },
        { slug: 'men-seeking-women', name: 'Men Seeking Women' },
        { slug: 'men-seeking-men', name: 'Men Seeking Men' }
    ],
    'rentals': [
        { slug: 'tools-equipment', name: 'Tools & Equipment' },
        { slug: 'furniture-rental', name: 'Furniture' },
        { slug: 'books-media', name: 'Books & Media' },
        { slug: 'electronics-rental', name: 'Electronics' },
        { slug: 'sports-equipment', name: 'Sports Equipment' },
        { slug: 'party-supplies', name: 'Party Supplies' }
    ],
    'p2p-lending': [
        { slug: 'cash-loans', name: 'Cash Loans' },
        { slug: 'item-lending', name: 'Item Lending' },
        { slug: 'equipment-loans', name: 'Equipment Loans' },
        { slug: 'emergency-funds', name: 'Emergency Funds' },
        { slug: 'business-loans', name: 'Business Loans' },
        { slug: 'investment-opportunities', name: 'Investment Opportunities' }
    ]

}

export const categories: Category[] = [
    {
        slug: 'for-sale',
        name: 'Sale',
        icon: '💰',
        subcategories: subCategoriesData['for-sale'],
        filterConfig: saleFilterConfig
    },
    {
        slug: 'housing',
        name: 'Housing',
        icon: '🏠',
        subcategories: subCategoriesData['housing'],
        filterConfig: housingFilterConfig
    },
    {
        slug: 'jobs',
        name: 'Jobs',
        icon: '💼',
        subcategories: subCategoriesData['jobs'],
        filterConfig: jobsFilterConfig
    },
    {
        slug: 'services',
        name: 'Services',
        icon: '🔧',
        subcategories: subCategoriesData['services'],
        filterConfig: servicesFilterConfig
    },
    {
        slug: 'community',
        name: 'Community',
        icon: '👥',
        subcategories: subCategoriesData['community'],
        filterConfig: defaultFilterConfig
    },
    {
        slug: 'personal',
        name: 'Personal',
        icon: '💕',
        subcategories: subCategoriesData['personal'],
        filterConfig: { ...defaultFilterConfig, priceRange: false }
    },
    {
        slug: 'rentals',
        name: 'Rentals',
        icon: '📦',
        subcategories: subCategoriesData['rentals'],
        filterConfig: rentalsFilterConfig
    },
    {
        slug: 'p2p-lending',
        name: 'P2P Lending',
        icon: '🏦',
        subcategories: subCategoriesData['p2p-lending'],
        filterConfig: lendingFilterConfig
    }
];