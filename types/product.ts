export interface Product {
    _id: string; // Unique identifier for the product
    productName: string; // Name of the product
    _type: 'product'; // Fixed type for sanity schema type
    image: {
      asset: {
        _ref: string; // Reference to the image asset in Sanity
        _type: 'image'; // Fixed type for image
      };
      alt: string; // Alternative text for the image
    };
  }
  

  // Interface for the Sanity asset reference
export interface ImageAsset {
    _ref: string; // Reference to the image asset in Sanity
    _type: 'image'; // Fixed type for image
  }
  
  // Interface for the image object in the product
  export interface Image {
    asset: ImageAsset; // The asset reference
    alt: string; // Alternative text for the image
  }
  
  // Interface for a single product
  export interface Product {
    _id: string; // Unique identifier for the product
    productName: string; // Name of the product
    _type: 'product'; // Fixed type for sanity schema type
    image: Image; // Image details
    price: string; // Price of the product
    description: string; // Short description of the product
    discountPercentage?: number; // Discount percentage (optional)
    isFeaturedProduct: boolean; // Whether the product is featured
    stockLevel: number; // The stock level of the product
    category: string; // Product category (e.g., "Wallet", "Key Chain")
    _createdAt: string; // ISO date string for when the product was created
    _updatedAt: string; // ISO date string for when the product was last updated
  }
  