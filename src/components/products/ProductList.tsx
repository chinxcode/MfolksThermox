
import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronRight, SlidersHorizontal, PackageX } from 'lucide-react';

interface Product {
  title: string;
  slug: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  productCategories: {
    nodes: { name: string; slug: string }[];
  };
  productData: {
    shortDescription: string;
  };
}

interface Category {
  name: string;
  slug: string;
}

const WP_URL = import.meta.env.PUBLIC_WORDPRESS_URL || 'https://geotrix.mfolks.com/graphql';

const getSearchQuery = (hasCategory: boolean) => `
  query SearchProducts(
    $search: String
    ${hasCategory ? '$category: [String]' : ''}
    $first: Int = 100
  ) {
    products(
      where: {
        search: $search
        ${hasCategory ? `
        taxQuery: {
          taxArray: [
            {
              taxonomy: PRODUCTCATEGORY
              field: SLUG
              terms: $category
            }
          ]
        }
        ` : ''}
      }
      first: $first
    ) {
      nodes {
        id
        title
        slug

        featuredImage {
          node {
            sourceUrl
            altText
          }
        }

        productCategories {
          nodes {
            name
            slug
          }
        }

        productData {
          shortDescription
        }
      }
    }
  }
`;

export default function ProductList({
  initialProducts,
  categories
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products when search or category changes
  useEffect(() => {
    const fetchProducts = async () => {
      // If no search and no category filter, use initial products
      if (!searchQuery && selectedCategory === 'all') {
        setProducts(initialProducts);
        return;
      }

      setIsLoading(true);
      try {
        const hasCategory = selectedCategory !== 'all';
        const variables: any = { first: 100 };

        if (searchQuery) {
          variables.search = searchQuery;
        }

        if (hasCategory) {
          variables.category = [selectedCategory];
        }

        const response = await fetch(WP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: getSearchQuery(hasCategory),
            variables
          }),
        });

        const json = await response.json();

        if (json.data?.products?.nodes) {
          setProducts(json.data.products.nodes);
        }
      } catch (error) {
        console.error('Search failed:', error);
        setProducts(initialProducts);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, initialProducts]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden w-full sticky top-24 z-30">
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="w-full flex items-center justify-between bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold"
        >
          <span className="flex items-center gap-2"><SlidersHorizontal size={20} className="text-orange-400" /> Filter Products</span>
          <ChevronRight className={`transition-transform duration-300 ${isMobileFiltersOpen ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Sidebar Filters */}
      <aside className={`
        lg:w-64 lg:block lg:sticky lg:top-32 lg:h-fit
        ${isMobileFiltersOpen ? 'block' : 'hidden'} 
        w-full transition-all duration-300 ease-in-out flex-shrink-0
      `}>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-8">
          {/* Search */}
          <div className="space-y-3">
            <h3 className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Search size={16} className="text-orange-400" /> Search
            </h3>
            <div className="relative group">
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all outline-none text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="h-px bg-neutral-200 dark:bg-neutral-700" />

          {/* Categories */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 text-sm uppercase tracking-wide">
                <Filter size={16} className="text-orange-400" /> Categories
              </h3>
              {selectedCategory !== 'all' && (
                <button onClick={() => setSelectedCategory('all')} className="text-xs text-orange-500 font-medium hover:text-orange-600 transition-colors">
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between group ${selectedCategory === 'all'
                  ? 'bg-orange-50 dark:bg-orange-400/10 text-orange-600 dark:text-orange-400'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
              >
                <span className="font-medium text-sm">All Products</span>
                {selectedCategory === 'all' && <ChevronRight size={16} />}
              </button>
              {categories.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between group ${selectedCategory === cat.slug
                    ? 'bg-orange-50 dark:bg-orange-400/10 text-orange-600 dark:text-orange-400'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                    }`}
                >
                  <span className="font-medium text-sm">{cat.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full transition-colors ${selectedCategory === cat.slug
                    ? 'bg-white/50 text-orange-600'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500'
                    }`}>
                    {initialProducts.filter(p => p.productCategories?.nodes?.some(c => c.slug === cat.slug)).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-1 min-w-0">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-bold text-neutral-800 dark:text-neutral-200 text-xl">
            Showing {products.length} Result{products.length !== 1 ? 's' : ''}
            {isLoading && <span className="ml-2 text-sm text-neutral-400">(Searching...)</span>}
          </h2>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product, index) => {
              // Logic to alternate card sizes if possible, or just keep uniform for filter view
              // Original logic: index % 4 === 0 || index % 4 === 3 -> Small
              // else -> Wide
              // However, in a filtered list, widespread grid items might break layout if not careful.
              // Let's stick to the Small Card design for consistency in the filtered view, 
              // BUT use the EXACT styling classes from ProductCardSmall.astro

              const categoryName = product.productCategories?.nodes?.[0]?.name || 'Product';
              const imageUrl = product.featuredImage?.node?.sourceUrl || '/placeholder-product.jpg';

              return (
                <a
                  key={product.slug}
                  href={`/${product.slug}`}
                  className="group relative block overflow-hidden rounded-xl border border-neutral-200 transition-all duration-300 hover:border-orange-400 hover:shadow-xl dark:border-neutral-700 dark:hover:border-orange-300 bg-white dark:bg-neutral-900"
                >
                  <div className="aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-orange-400 dark:text-orange-300">
                      {categoryName}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-neutral-800 dark:text-neutral-200 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                      {product.productData?.shortDescription || ''}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium text-orange-400 dark:text-orange-300">
                      View Details
                      <svg
                        className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-4 text-neutral-400">
              <PackageX size={32} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">No Products Found</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-6 text-sm">
              We couldn't find any products matching "{searchQuery}" in the selected category.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery('') }}
              className="px-6 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Clear Filters & View All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
