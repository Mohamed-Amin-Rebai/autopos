"use client";

import { useState } from "react";
import { Sparkles, Upload, Package, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AppPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  // const [productFiles, setProductFiles] = useState<FileList | null>(null);
  const router = useRouter();

  const generate = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const result = await res.json();
      
      if (!res.ok || !result.posId) {
        toast.error("AI is busy, try again");

        return;
      }

      router.push(`/pos/${result.posId}`)
    } catch {
      toast.error("AI is busy, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex flex-col">

      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-300 rounded-full blur-[120px] opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full blur-[120px] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-300 rounded-full blur-[160px] opacity-5" />
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-4 py-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 text-center">
          Create Your POS
        </h1>

        <p className="text-gray-500 mb-8 text-center max-w-md">
          Describe your business and generate a ready-to-use POS system instantly
        </p>

        {/* ✅ INPUT */}
        <div className="w-full max-w-2xl">
          <div className="relative">
            <textarea
              maxLength={1000}
              className="w-full border border-gray-200 rounded-2xl p-5 h-[160px] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md resize-none text-gray-700 placeholder-gray-400"
              placeholder="e.g. fast food restaurant, clothing store, coffee shop, electronics store..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {prompt.length > 0 && `${prompt.length} characters`}
            </div>
          </div>
        </div>

        {/* ✅ uploads */}
        {/* <div className="w-full max-w-2xl mt-6">
          <div className="grid grid-cols-1 gap-4">
            <label className="relative flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-violet-400 hover:bg-violet-50/50 transition-all duration-200 group bg-white/50 backdrop-blur-sm">
              <input
                type="file"
                multiple
                hidden
                onChange={(e) =>
                  setProductFiles(e.target.files)
                }
              />
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 group-hover:from-violet-200 group-hover:to-indigo-200 transition-all duration-200">
                  <Upload className="w-6 h-6 text-violet-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-violet-700 transition-colors">
                    Upload Products
                  </p>
                  <p className="text-xs text-gray-400">
                    {productFiles 
                      ? `${productFiles.length} file(s) selected` 
                      : "Upload product data (CSV, JSON, or images)"}
                  </p>
                </div>
                {productFiles && (
                  <div className="ml-auto">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      <Package className="w-3 h-3" />
                      {productFiles.length}
                    </span>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div> */}

        {/* ✅ BUTTON */}
        <div className="mt-8 w-full max-w-2xl">
          <button
            onClick={generate}
            disabled={loading || !prompt.trim()}
            className="group relative w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-medium shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-violet-500/25 flex items-center justify-center gap-3 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating your POS...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate POS
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          
          {!prompt.trim() && !loading && (
            <p className="text-center text-xs text-gray-400 mt-3">
              Describe your business to get started
            </p>
          )}
        </div>

        {/* Features hint */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200/50">
            <Sparkles className="w-3 h-3 text-violet-500" />
            <span>AI-powered generation</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200/50">
            <Package className="w-3 h-3 text-indigo-500" />
            <span>Instant POS system</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200/50">
            <Upload className="w-3 h-3 text-emerald-500" />
            <span>Product uploads supported</span>
          </div>
        </div>

      </div>
    </main>
  );
}