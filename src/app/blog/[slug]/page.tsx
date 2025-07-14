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
  return client.fetch(query, { slug }, {
    next: { revalidate: 0 } // Always fetch fresh data
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      {/* Stylish Title */}
      <div className="text-center mb-12 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl opacity-30 blur-3xl transform -rotate-1"></div>
        
        <div className="relative z-10 py-8">
          <h1 
            className={`
              font-black mb-6 text-center leading-tight
              bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
              bg-clip-text text-transparent
              drop-shadow-lg
              transform transition-all duration-500 hover:scale-105
              animate-fade-in
              ${
                blog.language === 'ur' 
                  ? 'urdu-text !text-3xl md:!text-4xl lg:!text-5xl tracking-wide' 
                  : 'font-sans text-3xl md:text-4xl lg:text-5xl tracking-tight'
              }
            `}
            lang={blog.language}
            dir={blog.language === 'ur' ? 'rtl' : 'ltr'}
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.1)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              textAlign: 'center',
              width: '100%',
              display: 'block'
            }}
          >
            {blog.title}
          </h1>
          
          {/* Stylish decorative elements */}
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-500 rounded"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-pink-500 rounded"></div>
          </div>
          
          {/* Publication date */}
          {blog.publishedAt && (
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full shadow-md">
              <p className="text-gray-700 text-sm font-medium">
                📅 {new Date(blog.publishedAt).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Featured Image - Normal Size */}
      {blog.mainImage && (
        <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={urlFor(blog.mainImage).width(800).url()}
            alt={blog.title}
            width={800}
            height={600}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      
      {/* Blog Content with Standard Text Size */}
      <article
        className={`
          prose prose-base max-w-none
          prose-headings:text-gray-900 prose-headings:font-bold
          prose-p:text-gray-700
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900
          ${
            blog.language === 'ur' 
              ? 'urdu-text prose-p:!text-base prose-p:!leading-relaxed prose-li:!text-base prose-li:!leading-relaxed prose-headings:!text-lg prose-headings:!leading-normal prose-strong:!text-base !leading-relaxed' 
              : 'ltr-text prose-p:text-base prose-p:leading-normal prose-li:text-base prose-li:leading-normal'
          }
        `}
        lang={blog.language}
        dir={blog.language === 'ur' ? 'rtl' : 'ltr'}
        style={{
          marginBottom: blog.language === 'ur' ? '2rem' : '1rem'
        }}
      >
        <PortableText value={blog.body} />
      </article>
    </main>
  );
}