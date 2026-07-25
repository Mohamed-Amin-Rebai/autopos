"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  User, 
  Lock, 
  LogIn, 
  Loader2, 
  ShoppingBag,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function CashierLogin(
    {
        cashierId,
    }: {
        cashierId: string;
    }
) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

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
          cashierId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }

      setAuthenticated(true);

    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (authenticated) {
    window.location.reload();
    return null;
  }

  return (
    
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50/50 px-4 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-300 rounded-full blur-[120px] opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full blur-[120px] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-300 rounded-full blur-[160px] opacity-5" />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 p-8 hover:shadow-3xl transition-shadow duration-300">
          
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Cashier Login
          </h1>

          <p className="text-sm text-gray-400 text-center mb-8 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            Sign in to access your POS
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          </p>

          <div className="space-y-4">

            {/* Username Input */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white placeholder:text-gray-400"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white placeholder:text-gray-400"
              />
            </div>

            {/* Login Button */}
            <button
              onClick={login}
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3.5 rounded-xl font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200/50">
            <p className="text-center text-xs text-gray-400">
              Secure access for authorized cashiers only
            </p>
          </div>

        </div>

        {/* Brand */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Powered by <span className="font-semibold text-gray-600">AutoPOS</span>
          </p>
        </div>

      </div>

    </main>
  );
}