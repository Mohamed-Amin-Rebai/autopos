"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Play, ShoppingCart, Sparkles } from "lucide-react";

type DemoProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  color: string;
};

const products: DemoProduct[] = [
  { id: 1, name: "Cappuccino", description: "Double espresso with silky steamed milk", price: 4.5, category: "Coffee", color: "from-amber-100 to-orange-100" },
  { id: 2, name: "Berry Bowl", description: "Greek yogurt, berries, granola, and honey", price: 8.9, category: "Breakfast", color: "from-pink-100 to-rose-100" },
  { id: 3, name: "Avocado Toast", description: "Sourdough, avocado, chili flakes, and herbs", price: 7.5, category: "Breakfast", color: "from-emerald-100 to-lime-100" },
  { id: 4, name: "Iced Matcha", description: "Ceremonial matcha, oat milk, and vanilla", price: 5.5, category: "Coffee", color: "from-green-100 to-teal-100" },
];

export default function DemoPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<number[]>([]);
  const categories = ["All", ...new Set(products.map((product) => product.category))];
  const visibleProducts = products.filter(
    (product) => activeCategory === "All" || product.category === activeCategory
  );
  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (total, productId) =>
          total + (products.find((product) => product.id === productId)?.price ?? 0),
        0
      ),
    [cart]
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700">
              <Sparkles className="h-4 w-4" /> Interactive AutoPOS demo
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
              See your counter in action
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Browse the menu, add items to a live cart, and experience the simple
              workflow your team can use every day.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
            <ShoppingCart className="h-5 w-5 text-violet-600" />
            <span className="font-semibold text-slate-900">{cart.length} items</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600">{cartTotal.toFixed(2)} TND</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-3xl bg-white p-5 shadow-xl shadow-slate-200/60 ring-1 ring-slate-200 md:p-7">
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeCategory === category
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {visibleProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setCart((current) => [...current, product.id])}
                  className="group rounded-2xl border border-slate-200 p-4 text-left transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"
                >
                  <div className={`mb-4 flex h-28 items-center justify-center rounded-xl bg-gradient-to-br ${product.color}`}>
                    <span className="text-4xl">☕</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-slate-900">{product.name}</h2>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{product.description}</p>
                    </div>
                    <span className="whitespace-nowrap font-semibold text-violet-700">
                      {product.price.toFixed(2)}
                    </span>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-600">
                    Add to order <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </button>
              ))}
            </div>
          </section>

          <aside className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl shadow-slate-300/50">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Current order</p>
                <h2 className="text-xl font-semibold">Table 04</h2>
              </div>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300">
                Open
              </span>
            </div>
            <div className="min-h-40 space-y-3">
              {cart.length === 0 ? (
                <div className="flex min-h-40 flex-col items-center justify-center text-center text-slate-400">
                  <ShoppingCart className="mb-2 h-8 w-8" />
                  <p className="text-sm">Your order is empty</p>
                  <p className="mt-1 text-xs">Select a product to get started</p>
                </div>
              ) : (
                [...new Set(cart)].map((productId) => {
                  const product = products.find((item) => item.id === productId);
                  if (!product) return null;
                  const quantity = cart.filter((id) => id === productId).length;
                  return (
                    <div key={product.id} className="flex justify-between gap-3 text-sm">
                      <span>{quantity} × {product.name}</span>
                      <span className="text-slate-300">{(product.price * quantity).toFixed(2)}</span>
                    </div>
                  );
                })
              )}
            </div>
            <div className="mt-6 border-t border-slate-700 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span><span>{cartTotal.toFixed(2)} TND</span>
              </div>
              <button
                type="button"
                disabled={cart.length === 0}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-3 font-medium transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check className="h-4 w-4" /> Complete demo order
              </button>
            </div>
          </aside>
        </div>

        <section className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white md:flex-row md:p-8">
          <div>
            <h2 className="text-xl font-semibold">Want to see the full workflow?</h2>
            <p className="mt-1 text-sm text-violet-100">
              A product walkthrough video will be available here soon.
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
            <Play className="h-6 w-6 fill-current" />
          </div>
        </section>
      </div>
    </main>
  );
}