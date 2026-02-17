import { useStore } from '@nanostores/react';
import { cartStore, cartActions } from '@lib/cartStore';

export default function CartDisplay() {
  const cart = useStore(cartStore);

  if (cart.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 text-center shadow-sm">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-sm mx-auto">
          Start adding products to your cart and we'll help you with a technical quotation.
        </p>
        <a href="/products" className="inline-flex items-center justify-center px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all">
          Browse Products
        </a>
      </div>
    );
  }

  const handleRequestQuote = () => {
    // Redirect to contact page with cart data as query params
    const cartSummary = cart.map(item =>
      `${item.productName} (${item.variant.label}) x ${item.quantity}`
    ).join(', ');

    window.location.href = `/contact-us?cart=${encodeURIComponent(cartSummary)}`;
  };

  const hasOnRequestItems = cart.some(item => item.priceType === 'on_request');

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      {/* Cart Items List */}
      <div className="lg:col-span-2 space-y-4">
        {cart.map((item) => (
          <div key={item.variant.sku} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
              {/* Product Info */}
              <div className="flex-1 w-full text-center sm:text-left">
                <a href={`/${item.productSlug}`} className="text-lg font-bold text-neutral-900 dark:text-neutral-100 hover:text-orange-500 transition-colors block mb-1">
                  {item.productName}
                </a>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                  <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[10px] font-bold uppercase py-1 px-2 rounded">
                    {item.variant.label}
                  </span>
                  <span className="text-neutral-400 text-[10px] font-bold uppercase py-1 px-2">
                    SKU: {item.variant.sku}
                  </span>
                </div>

                {/* Mobile Quantity Control (Hidden on larger screens) */}
                <div className="sm:hidden flex items-center justify-center gap-4 mt-2">
                  <button onClick={() => cartActions.updateQuantity(item.variant.sku, item.quantity - 1)} className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" /></svg>
                  </button>
                  <span className="font-bold tabular-nums text-neutral-900 dark:text-neutral-100">{item.quantity}</span>
                  <button onClick={() => cartActions.updateQuantity(item.variant.sku, item.quantity + 1)} className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>
              </div>

              {/* Desktop Quantity & Price */}
              <div className="hidden sm:flex items-center gap-8">
                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <button onClick={() => cartActions.updateQuantity(item.variant.sku, item.quantity - 1)} className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" /></svg>
                  </button>
                  <span className="font-bold tabular-nums min-w-[1.5rem] text-center text-neutral-900 dark:text-neutral-100">{item.quantity}</span>
                  <button onClick={() => cartActions.updateQuantity(item.variant.sku, item.quantity + 1)} className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>

                {/* Price Display */}
                <div className="text-right min-w-[120px]">
                  {item.priceType === 'on_request' ? (
                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Price on Request</div>
                  ) : (
                    <>
                      <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        ₹{((item.price || 0) * item.quantity).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-medium">
                        ₹{item.price?.toLocaleString()} / unit
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => cartActions.removeFromCart(item.variant.sku)}
                className="text-neutral-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
                title="Remove Item"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quote Summary Sidebar */}
      <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 lg:p-8 space-y-8 lg:sticky lg:top-36">
        <div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Quote Summary</h3>
          <p className="text-sm text-neutral-500">Your selected items for technical verification and pricing.</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Total Items</span>
            <span className="font-bold text-neutral-900 dark:text-neutral-100">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>

          {!hasOnRequestItems && (
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-neutral-900 dark:text-neutral-100 font-bold">Estimated Total</span>
                <span className="text-2xl font-bold text-orange-500">
                  ₹{cart.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0).toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 italic">* Includes indicative pricing only. Final quote may vary.</p>
            </div>
          )}

          {hasOnRequestItems && (
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
              <div className="flex items-start gap-2 text-blue-600 dark:text-blue-400">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-[11px] font-medium leading-relaxed">Some items in your cart require custom technical calculation. Submit to receive a full quote.</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-4">
          <button
            onClick={handleRequestQuote}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-200 dark:shadow-none flex items-center justify-center gap-2"
          >
            Request Formal Quote
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>

          <button
            onClick={() => { if (confirm('Clear your cart?')) cartActions.clearCart(); }}
            className="w-full py-3 text-neutral-500 hover:text-neutral-700 text-sm font-semibold transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">B2B Priority</h4>
          <p className="text-xs text-neutral-500 leading-relaxed">Quotes are typically delivered within <span className="text-neutral-700 dark:text-neutral-300 font-bold">2 business hours</span> for corporate clients.</p>
        </div>
      </div>
    </div>
  );
}
