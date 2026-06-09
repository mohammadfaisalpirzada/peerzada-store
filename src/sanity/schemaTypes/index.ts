import { type SchemaTypeDefinition } from 'sanity'
import productSchema from './product';
import blogSchema from './blog';
import blockContent from './blockContent';
import categorySchema from './category';
import educationalSchema from './educational';
// import subcategorySchema from './subcategory';

export const schemaTypes = [productSchema, blogSchema, blockContent, categorySchema, educationalSchema];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}


