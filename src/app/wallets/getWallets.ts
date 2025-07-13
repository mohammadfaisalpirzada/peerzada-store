import client from "../../../sanity/sanityClient";

export async function getWallets() {
  const query = `*[_type == "wallet"]{
    _id,
    title,
    slug { current },
    description,
    price,
    image,
    brand,
    color,
    inStock
  }`;
  
  // Add revalidation for fresh data
  return await client.fetch(query, {}, {
    next: { revalidate: 0 } // Always fetch fresh data
  });
}
