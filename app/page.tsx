"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [productFiles, setProductFiles] = useState<FileList | null>(null);

  const router = useRouter();

  const generate = async () => {
    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    const json = await res.json();

    if (logoFile) {
      json.logo = URL.createObjectURL(logoFile);
    }

    if (productFiles) {
      json.products = json.products.map((p: any, i: number) => ({
        ...p,
        image:
          productFiles[i]
            ? URL.createObjectURL(productFiles[i])
            : null,
      }));
    }

    localStorage.setItem("pos-data", JSON.stringify(json));

    setLoading(false);
    router.push("/pos");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ✅ HEADER */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <h1 className="text-xl font-bold cursor-pointer">AutoPOS</h1>

        <div className="flex gap-4">
          <button className="text-gray-600 hover:text-black cursor-pointer">
            Login
          </button>

          <button className="bg-black text-white px-4 py-1 hover:bg-gray-800 cursor-pointer">
            Get Started
          </button>
        </div>
      </header>

      {/* ✅ HERO */}
      <section className="text-center py-20 px-6">
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
      </section>

      {/* ✅ GENERATOR */}
      <section className="flex flex-col items-center pb-20">
        <p className="mb-2 text-gray-700">
          What do you want to build?
        </p>

        <textarea
          className="border rounded shadow-sm p-4 w-[500px] h-[140px] mb-6 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="e.g. fast food restaurant, clothing store with sizes, tech shop with specs... / Categorized POS , Flat POS"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        {/* ✅ UPLOAD UI */}
          <div className="flex gap-4 mb-6 w-[500px]">

            {/* LOGO UPLOAD */}
            <label className="flex-1 border rounded p-3 text-center cursor-pointer hover:bg-gray-100 transition">
              <input
                type="file"
                hidden
                onChange={(e) =>
                  setLogoFile(e.target.files?.[0] || null)
                }
              />

              <p className="font-medium text-sm">
                📤 Upload Logo
              </p>

              {logoFile && (
                <p className="text-xs text-green-600 mt-1 truncate">
                  ✔ {logoFile.name}
                </p>
              )}
            </label>

            {/* PRODUCT IMAGES */}
            <label className="flex-1 border rounded p-3 text-center cursor-pointer hover:bg-gray-100 transition">
              <input
                type="file"
                multiple
                hidden
                onChange={(e) =>
                  setProductFiles(e.target.files)
                }
              />

              <p className="font-medium text-sm">
                📦 Upload Products
              </p>

              {productFiles && (
                <p className="text-xs text-green-600 mt-1">
                  ✔ {productFiles.length} file(s)
                </p>
              )}
            </label>
          </div>
          
        {/* ✅ BUTTON */}
        <button
          className="bg-black text-white px-8 py-3 text-lg hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
          onClick={generate}
          disabled={loading}
        >
          {loading ? "⏳ Generating..." : "Generate POS"}
        </button>
      </section>
    </main>
  );
}