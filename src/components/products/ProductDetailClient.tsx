import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { cartStore, cartActions, type CartItem } from '@lib/cartStore';

interface ProductDetailClientProps {
  product: any;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const cart = useStore(cartStore);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const variants = product.productData?.productVariants || [];
  const currentVariant = variants[selectedVariant];

  if (variants.length === 0) {
    return (
      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 text-center">
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Contact us for pricing and availability.
        </p>
        <a href="/contact-us" className="inline-block w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors">
          Request Quote
        </a>
      </div>
    );
  }

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      productId: product.slug,
      productSlug: product.slug,
      productName: product.title,
      variant: {
        label: currentVariant.variantLabel,
        diameter: currentVariant.variantDiameter,
        length: currentVariant.variantLength,
        coating: currentVariant.variantCoating,
        sku: currentVariant.variantSku,
      },
      quantity,
      priceType: currentVariant.variantPriceType,
      price: currentVariant.variantPrice,
      priceUnit: currentVariant.variantPriceUnit,
    };

    cartActions.addToCart(cartItem);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-100 dark:border-neutral-700">
        <div className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-1">Pricing & Configuration</div>
        {currentVariant.variantPriceType === 'on_request' ? (
          <div className="text-2xl font-bold text-orange-500">Price on Request</div>
        ) : (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                ₹{currentVariant.variantPrice?.toLocaleString()}
              </span>
              <span className="text-sm text-neutral-500 font-medium">
                /{currentVariant.variantPriceUnit || 'unit'}
              </span>
            </div>
            {currentVariant.variantPriceLastUpdated && (
              <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Updated: {new Date(currentVariant.variantPriceLastUpdated).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            )}
          </>
        )}
        {currentVariant.variantPriceType === 'indicative' && (
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-medium bg-orange-50 dark:bg-orange-900/30 inline-block px-2 py-1 rounded">
            * Indicative Ex-Works Price
          </p>
        )}
      </div>

      {/* Variant Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300">
          Select Configuration ({variants.length})
        </label>
        <div className="relative">
          <select
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(Number(e.target.value))}
            className="w-full pl-4 pr-10 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none transition-shadow font-medium text-sm"
          >
            {variants.map((variant: any, index: number) => (
              <option key={variant.variantSku} value={index}>
                {variant.variantLabel}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </div>
        </div>
        <div className="text-xs text-neutral-500 flex justify-between px-1">
          <span>SKU: <span className="font-mono text-neutral-700 dark:text-neutral-300">{currentVariant.variantSku}</span></span>
          {currentVariant.variantCoating && <span>{currentVariant.variantCoating}</span>}
        </div>
      </div>

      {/* Quantity & Add */}
      <div className="pt-2 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Quantity</label>
          <div className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-200 shadow-sm hover:text-orange-500 transition-colors"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 text-center bg-transparent border-none p-0 text-neutral-900 dark:text-neutral-100 font-bold focus:ring-0"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-200 shadow-sm hover:text-orange-500 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={handleAddToCart}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-center transition-all duration-300 shadow-lg ${added
              ? 'bg-green-600 text-white shadow-green-200'
              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200 dark:shadow-none'
              }`}
          >
            {added ? (
              <span className="flex items-center justify-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Added to List
              </span>
            ) : (
              'Add to Quote List'
            )}
          </button>
          <a
            href="/contact-us"
            className="w-full py-3.5 px-4 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 font-bold rounded-xl text-center hover:border-orange-500 hover:text-orange-500 transition-colors"
          >
            Request Formal Quote
          </a>
        </div>
      </div>
    </div>
  );
}
