import client from "../../../sanity/sanityClient";

export async function getProducts() {
  const query = `*[_type == "product"]{
    _id,
    title,
    description,
    price,
    image,
    brand,
    category,
    inStock
  }`;
  return await client.fetch(query);
}
