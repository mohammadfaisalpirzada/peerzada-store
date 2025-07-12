import { client } from '../../../sanity/lib/client';
import { PortableText } from '@portabletext/react';
import imageUrlBuilder from '@sanity/image-url';
import { notFound } from 'next/navigation';
import Image from 'next/image';

const builder = imageUrlBuilder(client);
function urlFor(source: Record<string, unknown>) {
  return builder.image(source);
}

async function getBlogBySlug(slug: string) {
  const query = `*[_type == "blog" && slug.current == $slug][0]`;
  return client.fetch(query, { slug });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">{blog.title}</h1>
      {blog.mainImage && (
        <Image
          src={urlFor(blog.mainImage).width(800).url()}
          alt={blog.title}
          width={800}
          height={600}
          className="w-full h-auto rounded mb-6"
        />
      )}
      <article
        className={`prose max-w-none urdu-text ${blog.language === 'ur' ? '' : 'ltr-text'}`}
        lang={blog.language}
        dir={blog.language === 'ur' ? 'rtl' : 'ltr'}
      >
        <PortableText value={blog.body} />
      </article>
    </main>
  );
}