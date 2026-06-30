"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AppPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [productFiles, setProductFiles] = useState<FileList | null>(null);

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

      if (!res.ok) {
        console.error("Failed to generate POS");
        return;
      }

      const result = await res.json();
      
      if (!res.ok || !result.posId) {
        alert("AI is busy, try again");
        return;
      }

      // ✅ redirect immediately (we don’t need to mutate data here)
      window.location.href = `/pos?posId=${result.posId}`;
    } catch (err) {
      console.error("Generate error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">

      <div className="flex flex-col items-center justify-center flex-1 px-4">

        <h1 className="text-3xl font-bold mb-2">
          Create Your POS
        </h1>

        <p className="text-gray-500 mb-6 text-center">
          Describe your business and generate a ready-to-use POS system
        </p>

        {/* ✅ INPUT */}
        <textarea
          className="border rounded p-4 w-full max-w-[500px] h-[140px] mb-4 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="e.g. fast food restaurant, clothing store..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        {/* ✅ uploads */}
        <div className="flex gap-4 mb-6 w-full max-w-[500px]">

          <label className="flex-1 border rounded p-3 text-center cursor-pointer hover:bg-gray-100">
            <input
              type="file"
              hidden
              onChange={(e) =>
                setLogoFile(e.target.files?.[0] || null)
              }
            />
            <p className="text-sm">📤 Upload Logo</p>

            {logoFile && (
              <p className="text-xs text-green-600 mt-1 truncate">
                ✔ {logoFile.name}
              </p>
            )}
          </label>

          <label className="flex-1 border rounded p-3 text-center cursor-pointer hover:bg-gray-100">
            <input
              type="file"
              multiple
              hidden
              onChange={(e) =>
                setProductFiles(e.target.files)
              }
            />
            <p className="text-sm">📦 Upload Products</p>

            {productFiles && (
              <p className="text-xs text-green-600 mt-1">
                ✔ {productFiles.length} file(s)
              </p>
            )}
          </label>
        </div>

        {/* ✅ BUTTON */}
        <button
          onClick={generate}
          disabled={loading || !prompt.trim()}
          className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "⏳ Generating..." : "Generate POS"}
        </button>

      </div>
    </main>
  );
}