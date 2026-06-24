"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import CategoryList from "@/components/CategoryList";
import ProductGrid from "@/components/ProductGrid";
import Cart from "@/components/Cart";
import ChatPanel from "@/components/ChatPanel";
import { POSData } from "@/lib/types";

export default function POSPage() {
  const [data, setData] = useState<POSData | null>(null);
  const [historyFromDB, setHistoryFromDB] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // ✅ get posId once
  const urlParams = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : null;
  const posId = urlParams?.get("posId");

  // ✅ load data
  useEffect(() => {
    const fetchPOS = async () => {
      try {
        if (!posId) return;

        setLoading(true);

        const res = await fetch(`/api/pos?posId=${posId}`);
        const response = await res.json();

        if (response) {
          setData(response.current);
          setHistoryFromDB(response.history || []);

          if (response.current.categories?.length > 0) {
            setSelectedCategory(response.current.categories[0]);
          } else {
            setSelectedCategory("");
          }
        }
      } catch (err) {
        console.error("Failed to load POS", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPOS();
  }, [posId]);

  // ✅ loading UI
  if (loading) {
    return <div className="p-4 text-center">Loading POS...</div>;
  }

  // ✅ no data fallback
  if (!data) {
    return (
      <div className="p-4 text-center">
        No data found. Go back and generate one.
      </div>
    );
  }

  const hasCategories =
    data?.categories && data.categories.length > 0;

  // ✅ cart logic
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

  const handleSave = async () => {
    if (!posId) {
      alert("Missing POS ID");
      return;
    }

    try {
      await fetch("/api/pos/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          posId,
        }),
      });

      // ✅ refresh from DB after save
      const res = await fetch(`/api/pos?posId=${posId}`);
      const updated = await res.json();

      setData(updated.current);
      setHistoryFromDB(updated.history);

      alert("✅ POS saved successfully");
    } catch (err) {
      alert("❌ Failed to save POS");
    }
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

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          Save POS
        </button>
      </div>

      <Logo name={data.logo} />

      <div className="flex h-[75vh]">

        {/* ✅ CHAT */}
        <div className="w-[35%] border-r bg-white p-4 flex flex-col">
          <ChatPanel
            data={data}
            historyFromDB={historyFromDB}
            onUpdate={(newData: POSData) => setData(newData)}
          />
        </div>

        {/* ✅ POS */}
        <div className="w-[65%] flex">

          {hasCategories && (
            <CategoryList
              categories={data.categories}
              selected={selectedCategory}
              setSelected={setSelectedCategory}
            />
          )}

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
            data={data}
          />
        </div>
      </div>
    </main>
  );
}