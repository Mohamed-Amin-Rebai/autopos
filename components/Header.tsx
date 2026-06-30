"use client";

import { useRouter, usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { LayoutDashboard, Shield } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();

        if (data.role === "admin") {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRole(false);
      }
    };

    fetchRole();
  }, []);

  // ✅ hide header on landing
  if (pathname === "/") return null;

  // ✅ helper for active styling
  const isActive = (route: string) =>
    pathname.startsWith(route);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/60 shadow-sm">

      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">

        {/* LOGO */}
        <div 
          onClick={() => router.push("/app")}
          className="flex items-center gap-2.5 cursor-pointer group"
        > 
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:opacity-80 transition">
            AutoPOS
          </h1>
        </div>

        {/* NAV - Enhanced */}
        <div className="flex items-center gap-6 text-sm">

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
            <span>Dashboard</span>
            {isActive("/dashboard") && (
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full ml-1" />
            )}
          </button>

          {/* ADMIN */}
          {!loadingRole && isAdmin && (
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
          <div className="w-px h-8 bg-gray-200" />

          {/* USER */}
          <div className="flex items-center p-1 rounded-lg hover:bg-gray-100 transition">
            <UserButton />
          </div>

        </div>
      </div>

    </header>
  );
}