import React, { useState } from 'react';
import { fetchGraphQL, SEARCH_PRODUCTS_QUERY } from '@lib/graphql';

const ProductSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) return;

        setLoading(true);
        setError(null);
        try {
            const data = await fetchGraphQL(SEARCH_PRODUCTS_QUERY, { search: searchTerm });
            // API returns: { products: { nodes: [...] } }
            // Some WPGraphQL implementations might return different structures, adapting to standard
            if (data?.products?.nodes) {
                setResults(data.products.nodes);
            } else {
                setResults([]);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch results');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <form onSubmit={handleSearch} className="mb-8 relative">
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for thermal spray products..." 
                    className="w-full p-4 pl-12 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-orange-500 outline-none transition-shadow shadow-sm"
                />
                 <svg 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button 
                    type="submit" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Search
                </button>
            </form>

            {loading && (
                <div className="text-center py-12">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                     <p className="mt-4 text-neutral-500">Searching...</p>
                </div>
            )}

            {error && <div className="text-center py-8 text-red-500">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product: any) => (
                    <a key={product.slug} href={`/${product.slug}`} className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="aspect-square relative bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
                            {product.featuredImage?.node?.sourceUrl ? (
                                <img 
                                    src={product.featuredImage.node.sourceUrl} 
                                    alt={product.featuredImage.node.altText || product.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <span className="text-neutral-400">No Image</span>
                            )}
                        </div>
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-orange-600 transition-colors">
                                {product.title}
                            </h3>
                            {product.productData?.shortDescription && (
                                <div 
                                    className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2"
                                    dangerouslySetInnerHTML={{ __html: product.productData.shortDescription }}
                                />
                            )}
                            <div className="mt-4 flex items-center text-orange-600 font-medium text-sm">
                                View Details 
                                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </a>
                ))}
                {!loading && results.length === 0 && searchTerm && (
                    <div className="col-span-full text-center py-12 text-neutral-500">
                        No products found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductSearch;
