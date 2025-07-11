import { type SchemaTypeDefinition } from 'sanity'
import walletSchema from './product';
import productSchema from './wallet';
import blogSchema from './blog';
import blockContent from './blockContent';

export const schemaTypes = [walletSchema, productSchema, blogSchema, blockContent];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}


