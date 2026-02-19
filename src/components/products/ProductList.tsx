
import React, { useState, useMemo } from 'react';
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

  // Client-side filtering
  const products = useMemo(() => {
    return initialProducts.filter(product => {
      // Filter by Category
      if (selectedCategory !== 'all') {
        const hasCategory = product.productCategories.nodes.some(
          node => node.slug === selectedCategory
        );
        if (!hasCategory) return false;
      }

      // Filter by Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesDesc = product.productData?.shortDescription?.toLowerCase().includes(query);
        const matchesCat = product.productCategories.nodes.some(n => n.name.toLowerCase().includes(query));

        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }

      return true;
    });
  }, [initialProducts, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden w-full sticky top-24 z-30">
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="w-full flex items-center justify-between bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold"
        >
          <span className="flex items-center gap-2"><SlidersHorizontal size={20} className="text-blue-400" /> Filter Products</span>
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
              <Search size={16} className="text-blue-400" /> Search
            </h3>
            <div className="relative group">
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all outline-none text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 text-sm"
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
                <Filter size={16} className="text-blue-400" /> Categories
              </h3>
              {selectedCategory !== 'all' && (
                <button onClick={() => setSelectedCategory('all')} className="text-xs text-blue-500 font-medium hover:text-blue-600 transition-colors">
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between group ${selectedCategory === 'all'
                  ? 'bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400'
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
                    ? 'bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                    }`}
                >
                  <span className="font-medium text-sm">{cat.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full transition-colors ${selectedCategory === cat.slug
                    ? 'bg-white/50 text-blue-600'
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
          </h2>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product, index) => {
              const categoryName = product.productCategories?.nodes?.[0]?.name || 'Product';
              const imageUrl = product.featuredImage?.node?.sourceUrl || 'https://placehold.co/600x600?text=Product';

              return (
                <a
                  key={product.slug}
                  href={`/${product.slug}`}
                  className="group relative block overflow-hidden rounded-xl border border-neutral-200 transition-all duration-300 hover:border-blue-400 hover:shadow-xl dark:border-neutral-700 dark:hover:border-blue-300 bg-white dark:bg-neutral-900"
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
                    <p className="text-xs font-medium uppercase tracking-wide text-blue-400 dark:text-blue-300">
                      {categoryName}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-neutral-800 dark:text-neutral-200 line-clamp-1">
                      {product.title}
                    </h3>
                    <div 
                      className="mt-2 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400"
                      dangerouslySetInnerHTML={{ __html: product.productData?.shortDescription || '' }}
                    />
                    <div className="mt-4 flex items-center text-sm font-medium text-blue-400 dark:text-blue-300">
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

