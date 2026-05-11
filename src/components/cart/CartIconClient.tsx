import { useStore } from "@nanostores/react";
import { totalItems } from "@lib/cartStore";

export default function CartIconClient() {
    const itemCount = useStore(totalItems);

    return (
        <a
            href="/cart"
            className="relative p-2 text-neutral-600 hover:text-blue-500 dark:text-neutral-400 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="View Cart"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
            {itemCount > 0 && (
                <span className="absolute top-2 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-blue-500 border-2 border-white dark:border-neutral-900 rounded-full">
                    {itemCount}
                </span>
            )}
        </a>
    );
}
