import Link from "next/link";

export default function ExplorePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Explore the Store</h1>
        <Link href="/" className="text-blue-600 font-semibold">Back</Link>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/wallets">
            <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center cursor-pointer hover:shadow-lg transition">
              <div className="font-semibold text-gray-800">Wallets</div>
            </div>
          </Link>
          <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center cursor-pointer hover:shadow-lg transition">
            <div className="font-semibold text-gray-800">Keychains</div>
          </div>
        </div>
      </section>
    </div>
  );
}
