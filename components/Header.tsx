"use client";

import { useRouter, usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Shield, ShoppingBag, BarChart3 } from "lucide-react";

export default function Header({ role }: { role: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = role === "admin";
  if (pathname.startsWith("/cashier")) {
    return null;
  }

  // ✅ helper for active styling
  const isActive = (route: string) => pathname === route;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm">

      <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-7xl mx-auto">

        {/* LOGO */}
        <div 
          onClick={() => router.push("/welcome")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-80 transition">
            AutoPOS
          </h1>
        </div>

        {/* NAV - Enhanced */}
        <div className="flex items-center gap-3 text-sm">

          {/* ANALYTICS */}
          <button
            onClick={() => router.push("/analytics")}
            className={`
              group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200
              ${isActive("/analytics")
                ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            <BarChart3
              size={16}
              className={
                isActive("/analytics")
                  ? "text-indigo-600"
                  : "text-gray-400 group-hover:text-gray-600"
              }
            />

            <span>Dashboard</span>

            {isActive("/analytics") && (
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full ml-1" />
            )}
          </button>

          {/* DASHBOARD */}
          <button
            onClick={() => router.push("/dashboard")}
            className={`
              group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200
              ${isActive("/dashboard")
                ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            <LayoutDashboard size={16} className={`
              ${isActive("/dashboard") ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}
            `} />
            <span>POS</span>
            {isActive("/dashboard") && (
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full ml-1" />
            )}
          </button>

          {/* ADMIN */}
          {isAdmin && (
            <button
              onClick={() => router.push("/admin")}
              className={`
                group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200
                ${isActive("/admin")
                  ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              <Shield size={16} className={`
                ${isActive("/admin") ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}
              `} />
              <span>Admin</span>
              {isActive("/admin") && (
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full ml-1" />
              )}
            </button>
          )}

          {/* DIVIDER */}
          <div className="w-px h-8 bg-gray-200 mx-1" />

          {/* USER */}
          <div className="flex items-center p-1 rounded-lg hover:bg-gray-100 transition">
            <UserButton />
          </div>

        </div>
      </div>

    </header>
  );
}