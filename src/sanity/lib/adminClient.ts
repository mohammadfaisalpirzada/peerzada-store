import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env';

export function getAdminSanityClient() {
  const token =
    process.env.SANITY_API_TOKEN ||
    process.env.SANITY_TOKEN ||
    process.env.SANITY_WRITE_TOKEN;

  if (!token) {
    throw new Error('SANITY_API_TOKEN is missing in environment variables.');
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}
