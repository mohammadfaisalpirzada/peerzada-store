import Link from "next/link";
import React from "react";
import { client } from "../../sanity/lib/client";
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';

const builder = imageUrlBuilder(client);
function urlFor(source: Record<string, unknown>) {
  return builder.image(source);
}

async function getBlogs() {
  const query = `*[_type == "blog"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    mainImage
  }`;
  return client.fetch(query);
}

type Blog = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage?: Record<string, unknown>;
};

const MasterSahub = async () => {
  const blogs: Blog[] = await getBlogs();

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-red-500 to-green-600 bg-clip-text text-transparent mb-8 drop-shadow-lg tracking-tight">
        Master Sahub Blog
      </h1>
      <section className="flex flex-col gap-8">
        {blogs.map((blog: Blog) => (
          <article key={blog._id} className="flex flex-col sm:flex-row gap-4 items-start">
            {blog.mainImage && (
              <Image
                src={urlFor(blog.mainImage).width(300).height(200).url()}
                alt={blog.title}
                width={300}
                height={200}
                className="w-full sm:w-48 h-auto object-cover rounded"
              />
            )}
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <Link href={`/blog/${blog.slug.current}`} className="text-blue-600 hover:underline">
                Read more
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default MasterSahub;

