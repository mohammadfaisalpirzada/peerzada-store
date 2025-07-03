import { type SchemaTypeDefinition } from 'sanity'
import walletSchema from './wallet';
import productSchema from './product';

export const schemaTypes = [walletSchema, productSchema];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}


