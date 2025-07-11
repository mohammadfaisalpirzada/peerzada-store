import Link from "next/link";
import React from "react";
import { client } from "../../sanity/lib/client";
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);
function urlFor(source) {
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

const MasterSahub = async () => {
  const blogs = await getBlogs();

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Master Sahub Blog</h1>
      <section className="flex flex-col gap-8">
        {blogs.map((blog) => (
          <article key={blog._id} className="flex flex-col sm:flex-row gap-4 items-start">
            {blog.mainImage && (
              <img
                src={urlFor(blog.mainImage).width(300).height(200).url()}
                alt={blog.title}
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

