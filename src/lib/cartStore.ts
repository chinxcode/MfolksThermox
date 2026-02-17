// Cart Store using Nanostores for Astro
import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';

export interface Variant {
  label: string;
  diameter?: string;
  length?: string;
  coating?: string;
  sku: string;
}

export interface CartItem {
  productId: string;
  productSlug: string;
  productName: string;
  variant: Variant;
  quantity: number;
  priceType: string;
  price?: number;
  priceUnit?: string;
}

// Persistent cart store (saves to localStorage)
export const cartStore = persistentAtom<CartItem[]>('mfolks_cart', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// Total items computed store
export const totalItems = atom(0);

// Update total items whenever cart changes
cartStore.subscribe((cart) => {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  totalItems.set(total);
});

// Cart actions
export const cartActions = {
  addToCart: (newItem: CartItem) => {
    const currentCart = cartStore.get();
    const existingItemIndex = currentCart.findIndex(
      (item) => item.variant.sku === newItem.variant.sku
    );

    if (existingItemIndex > -1) {
      const updatedCart = [...currentCart];
      updatedCart[existingItemIndex].quantity += newItem.quantity;
      cartStore.set(updatedCart);
    } else {
      cartStore.set([...currentCart, newItem]);
    }
  },

  removeFromCart: (sku: string) => {
    const currentCart = cartStore.get();
    cartStore.set(currentCart.filter((item) => item.variant.sku !== sku));
  },

  updateQuantity: (sku: string, quantity: number) => {
    if (quantity <= 0) {
      cartActions.removeFromCart(sku);
      return;
    }
    const currentCart = cartStore.get();
    cartStore.set(
      currentCart.map((item) =>
        item.variant.sku === sku ? { ...item, quantity } : item
      )
    );
  },

  clearCart: () => {
    cartStore.set([]);
  },
};
