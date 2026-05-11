const url = "https://thermox.mfolks.com/graphql";

async function fetchGraphQL(query, variables = {}) {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
    });
    const json = await response.json();
    if (json.errors) {
        console.error("GraphQL Errors:", JSON.stringify(json.errors, null, 2));
        throw new Error("Failed to fetch GraphQL data");
    }
    return json.data;
}

const GET_ALL_PRODUCT_SLUGS = `
query GetAllProductSlugs {
  products(first: 100) {
    nodes {
      slug
    }
  }
}
`;

const GET_PRODUCT_BY_SLUG = `
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

async function test() {
    console.log("Using URL:", url);
    try {
        const data = await fetchGraphQL(GET_ALL_PRODUCT_SLUGS);

        if (data?.products?.nodes?.length > 0) {
            const slug = data.products.nodes[0].slug;
            console.log("Fetching for slug:", slug);
            const productData = await fetchGraphQL(GET_PRODUCT_BY_SLUG, { slug });
            console.log("Product:", productData?.product?.title);
        }
    } catch (error) {
        console.error("Error in test script:", error);
    }
}

test();
