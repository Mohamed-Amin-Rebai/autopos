"use client";

import { useRouter, usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";

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
    <header className="flex justify-between items-center px-8 py-4 bg-white border-b">

      {/* LOGO */}
      <h1
        onClick={() => router.push("/app")}
        className="text-xl font-bold cursor-pointer hover:opacity-80"
      >
        AutoPOS
      </h1>

      {/* NAV */}
      <div className="flex items-center gap-5 text-sm">

        <button
          onClick={() => router.push("/dashboard")}
          className={`hover:text-black ${
            isActive("/dashboard")
              ? "text-black font-semibold"
              : "text-gray-600"
          }`}
        >
          Dashboard
        </button>

        {/* ✅ show only if admin AND after role loads */}
        {!loadingRole && isAdmin && (
          <button
            onClick={() => router.push("/admin")}
            className={`hover:text-black ${
              isActive("/admin")
                ? "text-black font-semibold"
                : "text-gray-600"
            }`}
          >
            Admin
          </button>
        )}

        <UserButton />
      </div>

    </header>
  );
}