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
    mainImage,
    language
  }`;
  return client.fetch(query, {}, {
    next: { revalidate: 600 } // Revalidate every 10 minutes (600 seconds)
  });
}

type Blog = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage?: Record<string, unknown>;
  language?: string;
};

const MasterSahub = async () => {
  const blogs: Blog[] = await getBlogs();

  return (
    <main className="max-w-7xl mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-red-500 to-green-600 bg-clip-text text-transparent mb-8 drop-shadow-lg tracking-tight">
        Master Sahub Blog
      </h1>
      
      {/* Responsive Grid Layout */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog: Blog) => (
          <article key={blog._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
            {/* Clickable Image with Increased Height */}
            {blog.mainImage ? (
              <Link href={`/blog/${blog.slug.current}`} className="block">
                <div className="relative w-full h-80 overflow-hidden">
                  <Image
                    src={urlFor(blog.mainImage).width(400).height(350).url()}
                    alt={blog.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    style={{ objectPosition: 'top center' }}
                  />
                </div>
              </Link>
            ) : (
              <Link href={`/blog/${blog.slug.current}`} className="block">
                <div className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center hover:from-gray-300 hover:to-gray-400 transition-colors duration-300">
                  <span className="text-gray-500 text-lg font-medium">No Image</span>
                </div>
              </Link>
            )}
            
            {/* Content Section */}
            <div className="p-4 flex flex-col h-32">
              {/* Clickable Title with Urdu Font Support */}
              <Link href={`/blog/${blog.slug.current}`}>
                <h2 
                  className={`
                    text-lg font-semibold mb-2 hover:text-blue-600 transition-colors duration-200 cursor-pointer line-clamp-2
                    ${
                      blog.language === 'ur' 
                        ? 'urdu-text !text-xl !leading-relaxed' 
                        : 'font-sans'
                    }
                  `}
                  lang={blog.language}
                  dir={blog.language === 'ur' ? 'rtl' : 'ltr'}
                >
                  {blog.title}
                </h2>
              </Link>
              
              {/* Publication Date - Always in English */}
              {blog.publishedAt && (
                <p className="text-gray-500 text-sm mb-1 flex-shrink-0">
                  📅 {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              )}
              
              {/* Read More Link */}
              <div className="mt-auto">
                <Link 
                  href={`/blog/${blog.slug.current}`} 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                >
                  <span className={blog.language === 'ur' ? 'urdu-text' : ''}>
                    {blog.language === 'ur' ? 'مزید پڑھیں' : 'Read more'}
                  </span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default MasterSahub;

