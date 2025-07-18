import { z, ZodObject, ZodRawShape } from "zod";
import { filterConfig, getCategoryNameByHandler, getSubCategories } from "./dummy-data";
import { Options, CategoryOptions } from "./definition";

export type SORT = 'date' | 'price-low' | 'price-high' | 'amount-low' | 'amount-high' | 'interest-low' | 'interest-high';
export type CONDITION = 'new' | 'excellent' | 'good' | 'fair';
export type SUBCATEGORY = string;
export type BEDROOMS = '' | '1'| '2' | '3' | '4+';
export type TYPE = 'apartment' |
    'house' |
    'room' |
    'sublet' |
    'internship' |
    'contract' |
    'part-time' |
    'full-time' |
    'cash-loan' |
    'item-lending' |
    'investment';
export type DURATION = 'hourly' | 'daily' | 'weekly' | 'monthly';
export type TERM = 'short' | 'medium' | 'long';

export type FILTERS_SCHEMA_TYPE = { [categorySlug: string]: ZodObject<ZodRawShape> }

const setSubCategoriesOptions = (subCategories: string[]) => {
    const obj: CategoryOptions = {
        type: 'select',
        key: 'subcategory',
        label: 'Categories',
        options: []
    }
    for (let i = 0; i < subCategories.length; i++) {
        let subCatName = subCategories[i].toLowerCase();
        // Replace ALL spaces with hyphens, not just the first one
        subCatName = subCatName.replace(/ /g, '-');
        
        const temp: Options = { value: subCatName, label: subCategories[i] };
        obj.options.push(temp);
    }
    const temp: Options = { value: '', label: 'All' }
    obj.options.push(temp);
    return obj;
}

// Create schemas dynamically without mutating original config
const createSchemaForCategory = (categorySlug: string) => {
    const categoryName = getCategoryNameByHandler(categorySlug) as string;
    const subCategories = getSubCategories(categoryName) as string[];
    const tempOptions: Record<string, unknown> = {};
    
    // Create a copy of filters and add subcategories (don't mutate original)
    const filtersWithSubcategories = [
        ...filterConfig[categorySlug].filters,
        setSubCategoriesOptions(subCategories)
    ];
    
    filtersWithSubcategories.map((filter) => {
        const values: string[] = filter.options.map((option) => {
            return option.value;
        });

        tempOptions[filter.key] = z.enum(values as [string, ...string[]], {
            message: `Invalid option for filter "${filter.key}". Valid options: ${values}`
        });
    });

    const options: ZodRawShape = tempOptions as ZodRawShape;
    const priceRange: ZodRawShape = { priceRange: z.literal(filterConfig[categorySlug].priceRange) };
    const sort: ZodRawShape = { sort: z.enum(filterConfig[categorySlug].sort as [string, ...string[]]) }
    
    return z.object({ ...options, ...priceRange, ...sort });
};

export const validateSelectedFilters = (
    categorySlug: keyof typeof filterConfig,
    selectedFilters: Record<string, any>
) => {
    const omitFields: Record<string, true> = {};
    const selectedEnhanced = {};
    
    console.log('SelectedFilters -> ', selectedFilters);
    
    // Create fresh schema for this validation
    const SCHEMA_FOR_CATEGORY = createSchemaForCategory(categorySlug);
    
    for (const key in selectedFilters) {
        if (selectedFilters[key] === '') {
            if (key in SCHEMA_FOR_CATEGORY.shape) {
                omitFields[key] = true;
            }
        } else {
            // Check if key exists in schema before adding
            if (!(key in SCHEMA_FOR_CATEGORY.shape)) {
                return { filters: null, error: `Filter key "${key}" does not exist for category "${categorySlug}"`}
            }
            selectedEnhanced[key] = selectedFilters[key];
        }
    }
    
    let SCHEMA_VALIDATION = SCHEMA_FOR_CATEGORY.omit({ priceRange: true });
    console.log('Omitting fields -> ', omitFields);
    
    if (Object.keys(omitFields).length > 0) {
        SCHEMA_VALIDATION = SCHEMA_VALIDATION.omit(omitFields);
    }

    const retVal = { filters: {}, error: null };
    if (Object.keys(selectedEnhanced).length > 0) {
        const validation = SCHEMA_VALIDATION.safeParse(selectedEnhanced);
        if (!validation.success) {
            return { filters: null, error: validation.error.message };
        }
        retVal.filters = validation.data;
    }

    return retVal;
}