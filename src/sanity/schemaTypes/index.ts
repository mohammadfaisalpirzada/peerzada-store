import { type SchemaTypeDefinition } from 'sanity'
import { productShema } from './product'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productShema],
}
