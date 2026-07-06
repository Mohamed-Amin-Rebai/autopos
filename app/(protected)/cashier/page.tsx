"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams} from "next/navigation";
import CategoryList from "@/components/CategoryList";
import ProductGrid from "@/components/ProductGrid";
import Cart from "@/components/Cart";
import { POSData } from "@/lib/types";
import {Loader2, LogOut, User, DollarSign} from "lucide-react";

export default function CashierPage() {

  type CartItem = {
    product: any;
    quantity: number;
  };

  const [data, setData] = useState<POSData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [posId, setPosId] = useState("");
  const [loading, setLoading] = useState(true);
  const [cashier, setCashier] = useState<any>(null);
  const router = useRouter();

  // ✅ get cashierid
  const searchParams = useSearchParams();
  const cashierId = searchParams.get("cashierId");

  const loadPOS = async () => {
    if (!cashierId) {
      router.push("/welcome");
      return null;
    }
    const res = await fetch(`/api/cashier/${cashierId}`);
    if (!res.ok) throw new Error("Failed to fetch POS");
    const response = await res.json();

    setPosId(response.cashier.posId);
    setCashier(response.cashier);
    setData(response.pos.current);

    if (response.pos.current.categories?.length) {
      setSelectedCategory(response.pos.current.categories[0]);
    }
    
    return response;
  }

  useEffect(() => {
    const fetchPOS = async () => {
      try {
        setLoading(true);
        await loadPOS();
      } catch (err) {
        console.error(err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPOS();
  }, [cashierId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading Cashier Page...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md text-center border border-gray-200/50">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔍</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Data Found</h2>
          <p className="text-gray-500 mb-6">Go back and find an available cashier.</p>
          <button
            onClick={() => router.push("/welcome")}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const hasCategories = data?.categories && data.categories.length > 0;

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
      cart.map((item) => item.product.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setCart(
      cart.map((item) => item.product.id === id
        ? { ...item, quantity: item.quantity - 1 }
        : item
      ).filter((item) => item.quantity > 0)
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex flex-col p-4 md:p-6">

      {/* ✅ Cashier Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-4 md:p-5 mb-6 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cashier</p>
              <p className="font-semibold text-gray-900 text-lg">
                {cashier?.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200/50">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-xs text-gray-500">Opening Cash</p>
                <p className="font-semibold text-emerald-700 text-sm">
                  {cashier?.openingCash} TND
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push("/cashier/login")}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all hover:scale-105"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* ✅ POS MAIN - Grid Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4">
        <div className="flex gap-4">
          
          {/* CATEGORY */}
          {hasCategories && (
            <div className="w-[200px] flex-shrink-0">
              <CategoryList
                categories={data.categories}
                selected={selectedCategory}
                setSelected={setSelectedCategory}
              />
            </div>
          )}

          {/* PRODUCTS */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={data.products}
              selectedCategory={selectedCategory}
              addToCart={addToCart}
              hasCategories={hasCategories}
            />
          </div>

          {/* CART */}
          <div className="w-[340px] flex-shrink-0">
            <Cart
              cart={cart}
              cashierId={cashierId || undefined}
              posId={posId}
              onClearCart={() => setCart([])}
              removeFromCart={removeFromCart}
              increaseQty={increaseQty}
              decreaseQty={decreaseQty}
              data={data}
            />
          </div>

        </div>
      </div>

    </main>
  );
}