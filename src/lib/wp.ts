// WordPress GraphQL Integration for Astro
// ✅ EXACT QUERIES - NO HALLUCINATIONS, NO INVENTED FIELDS
// ✅ FETCH ONLY REAL DATA FROM WORDPRESS API

const WP_URL = import.meta.env.PUBLIC_WORDPRESS_URL || 'https://geotrix.mfolks.com/graphql';

export async function wpFetch(query: string, variables = {}) {
  try {
    const res = await fetch(WP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      console.error('WordPress GraphQL request failed:', res.status, res.statusText);
      throw new Error(`WordPress API HTTP Error: ${res.status}`);
    }

    const json = await res.json();
    
    if (json.errors) {
      console.error('GraphQL Errors:', json.errors);
      throw new Error(`GraphQL Error: ${json.errors.map((e: any) => e.message).join(', ')}`);
    }
    
    return json.data;
  } catch (error) {
    console.error('WordPress fetch failed:', error);
    throw error;
  }
}

// ===================================================================
// 1️⃣ GET ALL PRODUCTS (FOR /products PAGE)
// Use for: Product listing, cards, category filtering
// ===================================================================
export const ALL_PRODUCTS_QUERY = `
  query GetAllProducts {
    products(first: 100) {
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

// ===================================================================
// 2️⃣ GET SINGLE PRODUCT BY SLUG (FOR /products/[slug])
// Most important query - drives product detail, variants, cart
// ===================================================================
export const PRODUCT_BY_SLUG_QUERY = `
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      title
      slug

      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }

      productData {
        shortDescription

        technicalSpecs {
          specName
          specValue
          specUnit
        }

        productVariants {
          variantLabel
          variantDiameter
          variantLength
          variantCoating
          variantSku
          variantPriceType
          variantPrice
          variantPriceUnit
          variantPriceLastUpdated
          availability
        }

        benefits {
          benefitText
        }

        applicationsUsedIn

        productFaqs {
          question
          answer
        }

        relatedSystems {
          nodes {
            id
            slug
            ...ProductCard
          }
        }

        compatibleProducts {
          nodes {
            id
            slug
            ...ProductCard
          }
        }

        recommendedProducts {
          nodes {
            id
            slug
            ...ProductCard
          }
        }
      }
    }
  }

  fragment ProductCard on Product {
    title
    featuredImage {
      node {
        sourceUrl
        altText
        mediaDetails {
          width
          height
        }
      }
    }
  }
`;

// ===================================================================
// 3️⃣ GET ALL CATEGORIES
// ===================================================================
export const ALL_CATEGORIES_QUERY = `
  query GetAllCategories {
    productCategories {
      nodes {
        name
        slug
      }
    }
  }
`;

// ===================================================================
// 4️⃣ GET PRODUCTS BY CATEGORY (OPTIONAL)
// ===================================================================
export const PRODUCTS_BY_CATEGORY_QUERY = `
  query GetProductsByCategory($categorySlug: String!) {
    productCategories(where: { slug: [$categorySlug] }) {
      nodes {
        name
        products(first: 100) {
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

            productData {
              shortDescription
            }
          }
        }
      }
    }
  }
`;

// ===================================================================
// 5️⃣ SEARCH PRODUCTS WITH CATEGORY & KEYWORD FILTERING
// Use for: Dynamic search on products page
// ===================================================================
export const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts(
    $search: String
    $category: [String]
    $first: Int = 20
  ) {
    products(
      where: {
        search: $search
        taxQuery: {
          taxArray: [
            {
              taxonomy: PRODUCTCATEGORY
              field: SLUG
              terms: $category
            }
          ]
        }
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
          productVariants {
            variantPrice
          }
        }
      }
    }
  }
`;
