import Link from "next/link";
import { getCategories } from "./getCategories";

export default async function ExplorePage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Categories</h1>
          <p className="text-xl text-gray-600">Discover our wide range of premium products</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.value} 
              href={category.value === 'all' ? '/products' : `/products?category=${category.value}`}
              className="h-full"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-8 text-center group cursor-pointer min-h-[340px] max-h-[380px] flex flex-col justify-between items-center">
                <div className="text-6xl mb-4">
                  {typeof category.icon === 'string' ? (
                    <span>{category.icon}</span>
                  ) : (
                    category.icon
                  )}
                </div>
                <h2 className="font-semibold text-gray-800 text-xl group-hover:text-indigo-600 transition-colors duration-300 mb-2 text-center">
                  {category.name}
                  {category.count > 0 && (
                    <span className="ml-2 text-sm bg-gray-100 text-gray-700 py-1 px-2 rounded-full">
                      {category.count}
                    </span>
                  )}
                </h2>
                <p className="text-gray-500 text-sm text-justify max-w-xs mx-auto mt-2 mb-3 line-clamp-3">
                  {category.description}
                  {/* Optionally, you can add a span for '... more' if text is clamped, but Tailwind's line-clamp will handle the ellipsis. */}
                </p>
                <div className="text-gray-600 mb-3">Browse Collection →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
