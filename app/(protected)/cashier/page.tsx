"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams} from "next/navigation";
import CategoryList from "@/components/CategoryList";
import ProductGrid from "@/components/ProductGrid";
import Cart from "@/components/Cart";
import { POSData } from "@/lib/types";
import {Loader2 , LogOut} from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading Cashier Page...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Data Found</h2>
          <p className="text-gray-600 mb-4">Go back and find an available cashier.</p>
          <button
            onClick={() => router.push("/welcome")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex flex-col">

      <div className="bg-white border rounded-xl p-4 mb-4 flex justify-between items-center">
        <div>
          <p className="font-semibold">
            Cashier: {cashier?.username}
          </p>

          <p className="text-sm text-gray-500">
            Opening Cash: {cashier?.openingCash} TND
          </p>
        </div>

        <button
          onClick={() => router.push("/cashier/login")}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
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