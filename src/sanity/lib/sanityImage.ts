import createImageUrlBuilder from '@sanity/image-url';
import { dataset, projectId } from '../env'; // Ensure env.ts has projectId & dataset exported

const builder = createImageUrlBuilder({
  projectId: projectId,
  dataset: dataset,
});

export const urlFor = (source: any) => {
  return builder.image(source);
};
