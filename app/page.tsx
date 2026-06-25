"use client";

import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  // ✅ actions
  const goToSignup = () => router.push("/sign-up");
  const goToSignin = () => router.push("/sign-in");
  const goToApp = () => router.push("/app");
  const goToDashboard = () => router.push("/dashboard");

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ✅ HEADER */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <h1
          onClick={goToApp}
          className="text-xl font-bold cursor-pointer"
        >
          AutoPOS
        </h1>

        <div className="flex items-center gap-4">

          {!isSignedIn ? (
            <>
              <button
                onClick={goToSignin}
                className="text-gray-600 hover:text-black cursor-pointer"
              >
                Login
              </button>

              <button
                onClick={goToSignup}
                className="bg-black text-white px-4 py-1 hover:bg-gray-800 cursor-pointer"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button
                onClick={goToDashboard}
                className="text-gray-600 hover:text-black text-sm"
              >
                Dashboard
              </button>

              <button
                onClick={goToApp}
                className="text-gray-600 hover:text-black text-sm"
              >
                Home
              </button>

              <UserButton/>
            </>
          )}

        </div>
      </header>

      {/* ✅ HERO */}
      <section className="text-center py-32 px-6">

        <h2 className="text-5xl font-bold mb-6">
          Turn Any Idea Into a Smart POS System
        </h2>

        <p className="text-gray-600 max-w-xl mx-auto mb-4">
          Describe a business and instantly generate a functional
          point-of-sale system with categories, products,
          and real business logic powered by AI.
        </p>

        <p className="text-gray-500 mb-10">
          No setup. No coding. Instant results.
        </p>

        {/* ✅ CTA */}
        <button
          onClick={isSignedIn ? goToApp : goToSignup}
          className="bg-black text-white px-10 py-4 text-lg rounded hover:bg-gray-800"
        >
          Get Started
        </button>

      </section>
    </main>
  );
}