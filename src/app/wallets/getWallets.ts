import client from "../../../sanity/sanityClient";

export async function getWallets() {
  const query = `*[_type == "wallet"]{
    _id,
    title,
    description,
    price,
    image,
    brand,
    color,
    inStock
  }`;
  return await client.fetch(query);
}
