import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '../src/sanity/env';

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production', // CDN only in production
});

export default client;
