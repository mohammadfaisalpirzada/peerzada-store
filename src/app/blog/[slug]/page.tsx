import { client } from '../../../sanity/lib/client';
import { PortableText } from '@portabletext/react';
import imageUrlBuilder from '@sanity/image-url';
import { notFound } from 'next/navigation';

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

async function getBlogBySlug(slug) {
  const query = `*[_type == "blog" && slug.current == $slug][0]`;
  return client.fetch(query, { slug });
}

export default async function BlogPostPage({ params }) {
  const awaitedParams = await params;
  const { slug } = awaitedParams;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">{blog.title}</h1>
      {blog.mainImage && (
        <img
          src={urlFor(blog.mainImage).width(800).url()}
          alt={blog.title}
          className="w-full h-auto rounded mb-6"
        />
      )}
      <article className="prose max-w-none urdu-text" lang="ur"><PortableText value={blog.body} /></article>
    </main>
  );
}