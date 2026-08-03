"use client";

import { useRouter, usePathname } from "next/navigation";
import NotificationBell from "./NotificationBell";
import { LayoutDashboard, ShoppingBag, Menu, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import CustomUserButton from "./CustomUserButton";
import { useState } from "react";

type HeaderRole =
  | ""
  | "user"
  | "manager"
  | "admin";

export default function Header({ role }: { role: HeaderRole }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = role === "admin";
  const isManager = role === "manager";

  // Hide header on cashier login pages
  if (pathname.startsWith("/cashier/")) {
    return null;
  }

  // helper for active styling
  const isActive = (route: string) =>
    pathname === route || pathname.startsWith(`${route}/`);

  // Navigation handlers
  const goToFeatures = () => router.push("/features");
  const goToSolutions = () => router.push("/solutions");
  const goToHowItWorks = () => router.push("/how-it-works");
  const goToPricing = () => router.push("/pricing");
  const goToContact = () => router.push("/contact");
  const goToDashboard = () => router.push("/dashboard");
  const goToSignin = () => router.push("/sign-in");
  const goToSignup = () => router.push("/sign-up");

  const navLinks = [
    { label: "Features", onClick: goToFeatures },
    { label: "Solutions", onClick: goToSolutions },
    { label: "How It Works", onClick: goToHowItWorks },
    { label: "Pricing", onClick: goToPricing },
    { label: "Contact", onClick: goToContact },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 backdrop-blur-xl bg-white/90 border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* LOGO */}
        <div 
          onClick={() => router.push("/")}
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/30 group-hover:shadow-violet-500/40 group-hover:scale-105 transition-all duration-300">
            <ShoppingBag className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity duration-300">
            AutoPOS
          </span>
        </div>

        {/* NAV - Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.onClick}
              className="px-3.5 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 transition-all duration-200 relative group"
            >
              {link.label}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-gray-100/80 transition-colors duration-200 text-gray-600"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* NAV - Right Side */}
        <div className="hidden md:flex items-center gap-1 text-sm">
          {!isSignedIn ? (
            // Unauthenticated users - show Login/Sign Up
            <>
              <button
                onClick={goToSignin}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 transition-all duration-200"
              >
                Login
              </button>
              <button
                onClick={goToSignup}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-violet-500/30 hover:scale-105 transition-all duration-300"
              >
                Sign Up
              </button>
            </>
          ) : (
            // Authenticated users - show navigation
            <div className="flex items-center gap-3">

              {/* POS DASHBOARD */}
              <button
                onClick={goToDashboard}
                className={`
                  group flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-200
                  ${isActive("/dashboard")
                    ? "bg-indigo-50/80 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-200/50"
                    : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                  }
                `}
              >
                <LayoutDashboard size={16} className={`
                  ${isActive("/dashboard") ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}
                  transition-colors duration-200
                `} />
                <span>Dashboard</span>
                {isActive("/dashboard") && (
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full ml-0.5 animate-pulse" />
                )}
              </button>

              {/* DIVIDER */}
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

              {/* USER */}
              <div className="flex items-center p-1 rounded-lg hover:bg-gray-100/80 transition-colors duration-200">
                <NotificationBell />
                <CustomUserButton
                  isAdmin={isAdmin}
                  isManager={isManager}
                />
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-gray-200/50 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  link.onClick();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 transition-all duration-200 text-left"
              >
                {link.label}
              </button>
            ))}
            
            <div className="h-px bg-gray-200/50 my-1" />
            
            {!isSignedIn ? (
              <>
                <button
                  onClick={() => {
                    goToSignin();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 transition-all duration-200 text-left"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    goToSignup();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-200 text-center"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    goToDashboard();
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left flex items-center gap-2
                    ${isActive("/dashboard")
                      ? "bg-indigo-50/80 text-indigo-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                    }
                  `}
                >
                  <LayoutDashboard size={16} className={isActive("/dashboard") ? "text-indigo-600" : "text-gray-400"} />
                  Dashboard
                </button>
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-xs text-gray-400">Account</span>
                  <div className="flex items-center gap-2">
                    <NotificationBell />
                    <CustomUserButton
                      isAdmin={isAdmin}
                      isManager={isManager}
                    />
                  </div>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}