"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import CategoryList from "@/components/CategoryList";
import ProductGrid from "@/components/ProductGrid";
import Cart from "@/components/Cart";
import ActionsPanel from "@/components/ActionsPanel";
import ChatPanel from "@/components/ChatPanel";
import { POSData } from "@/lib/types";

export default function POSPage() {
  const [data, setData] = useState<POSData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [discount, setDiscount] = useState(0);
  const router = useRouter();

  // ✅ load data
  useEffect(() => {
    const stored = localStorage.getItem("pos-data");
    if (stored) {
      const parsed = JSON.parse(stored);
      setData(parsed);

      // ✅ SAFE category init
      if (parsed.categories && parsed.categories.length > 0) {
        setSelectedCategory(parsed.categories[0]);
      } else {
        setSelectedCategory("");
      }
    }
  }, []);

  // ✅ detect mode
  const hasCategories =
    data?.categories && data.categories.length > 0;

  // ✅ cart logic (same as before)
  const addToCart = (product: any) => {
    const existing = cart.find(
      (item) => item.product.id === product.id
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.product.id !== id));
  };

  const increaseQty = (id: number) => {
    setCart(
      cart.map((item) =>
        item.product.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setCart(
      cart
        .map((item) =>
          item.product.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const pay = () => {
    alert("Payment successful ✅");
    setCart([]);
    setDiscount(0);
  };

  const applyDiscount = () => {
    setDiscount(10);
  };

  if (!data) {
    return (
      <div className="p-4 text-center">
        No data found. Go back and generate one.
      </div>
    );
  }

  const goBack = () => {
    router.push("/");
  };

  const exportJson = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "pos-config.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main>
      {/* ✅ TOP TOOLBAR */}
      <div className="flex items-center gap-4 px-6 py-3 bg-gray-100 border-b">
        <button
          onClick={goBack}
          className="text-sm text-gray-600 hover:text-black cursor-pointer"
        >
          ← Back
        </button>

        <button
          onClick={exportJson}
          className="text-sm text-gray-600 hover:text-black cursor-pointer"
        >
          Export JSON
        </button>
      </div>

      <Logo name={data.logo} />

      <div className="flex h-[75vh]">

        {/* ✅ CHAT */}
        <div className="w-[35%] border-r bg-white p-4 flex flex-col">
          <ChatPanel
            data={data}
            onUpdate={(newData: POSData) => setData(newData)}
          />
        </div>

        {/* ✅ POS */}
        <div className="w-[65%] flex">

          {/* ✅ ONLY SHOW IF HAS CATEGORIES */}
          {hasCategories && (
            <CategoryList
              categories={data.categories}
              selected={selectedCategory}
              setSelected={setSelectedCategory}
            />
          )}

          {/* ✅ PASS MODE TO GRID */}
          <ProductGrid
            products={data.products}
            selectedCategory={selectedCategory}
            addToCart={addToCart}
            hasCategories={hasCategories}
          />

          <Cart
            cart={cart}
            removeFromCart={removeFromCart}
            increaseQty={increaseQty}
            decreaseQty={decreaseQty}
            discount={discount}
          />
        </div>
      </div>

      <ActionsPanel pay={pay} applyDiscount={applyDiscount} />
    </main>
  );
}