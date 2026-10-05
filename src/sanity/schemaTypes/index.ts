import { type SchemaTypeDefinition } from 'sanity'
import productSchema from './product';
import blockContent from './blockContent';
import categorySchema from './category';
import educationalSchema from './educational';

export const schemaTypes = [productSchema, blockContent, categorySchema, educationalSchema];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}


