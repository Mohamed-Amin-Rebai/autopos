"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CashierLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/cashier-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      router.push(
        `/cashier?cashierId=${data.cashierId}`
      );

    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-200 p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Cashier Login
        </h1>

        <p className="text-sm text-gray-500 text-center mb-8">
          Sign in to access your POS
        </p>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
          />

          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-violet-600 text-white py-3 rounded-xl font-medium hover:bg-violet-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </div>
      </div>
    </main>
  );
}