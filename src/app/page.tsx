'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFacebookF, FaShippingFast, FaShieldAlt, FaWallet } from "react-icons/fa";

const CATEGORIES = [
  { name: "Customised Gifts", slug: "customised-gifts", emoji: "🎁" },
  { name: "Clothing", slug: "clothing", emoji: "👕" },
  { name: "Wallets", slug: "wallets", emoji: "👜" },
  { name: "Premium", slug: "premium", emoji: "✨" },
  { name: "Accessories", slug: "accessories", emoji: "💎" },
];

export default function Home() {
  const [randomCategories, setRandomCategories] = useState<typeof CATEGORIES>([]);

  useEffect(() => {
    const shuffled = [...CATEGORIES].sort(() => Math.random() - 0.5);
    setRandomCategories(shuffled.slice(0, 2));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,0,0,0.12),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_20%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#B80000]/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-[#B80000]">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#B80000] text-white">🔥</span>
                Premium ecommerce store
              </span>

              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Authentic wallets, gifts, and premium accessories built for style.
              </h1>

              <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Shop premium leather wallets, customized gifts, and fast delivery across Pakistan with secure checkout and trusted support.
              </p>

              <div className="grid gap-3 sm:grid-cols-2 sm:items-center sm:gap-4 lg:max-w-xl">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center rounded-full bg-[#B80000] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-[#B80000]/20 transition hover:bg-[#9b0000]"
                >
                  Shop Now
                </Link>
                <Link
                  href="https://www.facebook.com/peerzadastore"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-4 text-base font-semibold text-slate-900 transition hover:border-[#B80000] hover:text-[#B80000]"
                >
                  <FaFacebookF className="h-4 w-4" />
                  Follow on Facebook
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B80000]/10 text-[#B80000]">
                    <FaShippingFast className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-slate-900">Fast Delivery</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Delivered quickly across Pakistan with secure packaging.
                  </p>
                </div>
                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B80000]/10 text-[#B80000]">
                    <FaShieldAlt className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-slate-900">Safe Payments</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Trusted checkout and secure order processing for every purchase.
                  </p>
                </div>
                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B80000]/10 text-[#B80000]">
                    <FaWallet className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-slate-900">Premium Quality</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Handpicked products with luxury finishes and authentic craftsmanship.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {randomCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  className="group overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="text-5xl">{category.emoji}</div>
                  <h2 className="mt-5 text-2xl font-semibold text-slate-900 group-hover:text-[#B80000]">
                    {category.name}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Explore our best {category.name.toLowerCase()} collection with new arrivals every week.
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#B80000] font-semibold">Shop by category</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Find what fits your style
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-500">
              Browse wallets, accessories, customized gifts and premium essentials made for the modern shopper.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="text-5xl">{category.emoji}</div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900 group-hover:text-[#B80000]">
                  {category.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Explore the best selection of {category.name.toLowerCase()} from our premium collection.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#B80000] text-white">
        <div className="max-w-7xl mx-auto grid gap-4 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:grid-cols-3 text-center">
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
            <p className="text-3xl font-black">24/7</p>
            <p className="mt-2 text-sm uppercase tracking-[0.24em]">Customer Support</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
            <p className="text-3xl font-black">Free</p>
            <p className="mt-2 text-sm uppercase tracking-[0.24em]">Shipping on select orders</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
            <p className="text-3xl font-black">100%</p>
            <p className="mt-2 text-sm uppercase tracking-[0.24em]">Satisfaction Guarantee</p>
          </div>
        </div>
      </section>
    </div>
  );
}
