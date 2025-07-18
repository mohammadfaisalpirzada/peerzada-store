import { type SchemaTypeDefinition } from 'sanity'
import productSchema from './product';
import blogSchema from './blog';
import blockContent from './blockContent';
import categorySchema from './category';
// import subcategorySchema from './subcategory';

export const schemaTypes = [productSchema, blogSchema, blockContent, categorySchema];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}


