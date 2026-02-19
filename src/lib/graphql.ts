
export const WP_API_URL = import.meta.env.PUBLIC_WORDPRESS_URL;

export async function fetchGraphQL(query: string, variables: Record<string, any> = {}) {
  const response = await fetch(WP_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await response.json();
  if (json.errors) {
    console.error('GraphQL Errors:', json.errors);
    throw new Error('Failed to fetch GraphQL data');
  }

  return json.data;
}

export const GET_PRODUCT_BY_SLUG = `
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
    productCategories {
      nodes {
        name
        slug
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
        variantWeight
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
          ... on Product {
            id
            title
            slug
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
      compatibleProducts {
        nodes {
          ... on Product {
            id
            title
            slug
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
      recommendedProducts {
        nodes {
          ... on Product {
            id
            title
            slug
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    }
  }
}
`;

export const SEARCH_PRODUCTS_QUERY = `
query SearchProducts($search: String!) {
  products(where: { search: $search }) {
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
            variantPriceUnit
        }
      }
    }
  }
}
`;

export const GET_PRODUCTS_LIST = `
query GetProductsList {
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

export const GET_PRODUCT_CATEGORIES = `
query GetProductCategories {
  productCategories(first: 20) {
    nodes {
      id
      name
      slug
      description
      count
    }
  }
}
`;

export const GET_ALL_PRODUCT_SLUGS = `
query GetAllProductSlugs {
  products(first: 100) {
    nodes {
      slug
    }
  }
}
`;
