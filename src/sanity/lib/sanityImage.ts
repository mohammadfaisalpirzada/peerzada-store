

import createImageUrlBuilder from '@sanity/image-url';
import { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder'; // Import the correct type
import { SanityImageSource } from '@sanity/image-url/lib/types/types'; // Import the correct type for the source
import { dataset, projectId } from '../env'; // Ensure env.ts has projectId & dataset exported

const builder = createImageUrlBuilder({
  projectId: projectId,
  dataset: dataset,
});

export const urlFor = (source: SanityImageSource): ImageUrlBuilder => {
  return builder.image(source);
};
