"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatPanel({
  data,
  onUpdate,
  historyFromDB,
}: any) {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);

  const [pendingInstruction, setPendingInstruction] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  const history = historyFromDB || [];

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const instructionRaw = input;
    const instruction = input.toLowerCase();

    setMessages((prev) => [
      ...prev,
      { role: "user", text: instructionRaw },
    ]);

    setInput("");

    // ✅ CONFIRMATION MODE
    if (pendingInstruction) {
      if (["yes", "y", "confirm"].includes(instruction)) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Applying requested change..." },
        ]);

        try {
          const res = await fetch("/api/update-pos", {
            method: "POST",
            body: JSON.stringify({
              currentData: data,
              instruction: pendingInstruction,
            }),
          });

          const updated = await res.json();

          setMessages((prev) => prev.slice(0, -1));

          if (!updated || !updated.products || !updated.actions) {
            setMessages((prev) => [
              ...prev,
              { role: "assistant", text: "❌ Invalid update." },
            ]);
            setPendingInstruction(null);
            return;
          }

          const isSame =
            JSON.stringify(updated) === JSON.stringify(data);

          if (isSame) {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                text: "⚠️ No changes were applied.",
              },
            ]);
            setPendingInstruction(null);
            return;
          }

          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: "Operation completed successfully.",
            },
          ]);

          onUpdate(updated);
          setPendingInstruction(null);
        } catch {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: "❌ Error applying change",
            },
          ]);
          setPendingInstruction(null);
        }

        return;
      }

      if (["no", "cancel", "stop"].includes(instruction)) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Operation cancelled." },
        ]);
        setPendingInstruction(null);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: 'Please reply with "yes" or "no".',
        },
      ]);

      return;
    }

    // ✅ PLAN MODE
    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: "🤖 Thinking..." },
    ]);

    try {
      const res = await fetch("/api/plan-pos", {
        method: "POST",
        body: JSON.stringify({
          instruction: instructionRaw,
        }),
      });

      const result = await res.json();

      setMessages((prev) => prev.slice(0, -1));

      const message =
        result?.message && result.message.trim().length > 0
          ? result.message
          : "⚠️ I couldn’t understand the request.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: message },
      ]);

      setPendingInstruction(instructionRaw);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "❌ Failed to process request",
        },
      ]);
    }
  };

  // ✅ RESTORE VERSION
  const restoreVersion = () => {
    if (selectedVersion === null) return;

    const selected = history[selectedVersion];

    if (!selected) return;

    onUpdate(selected.data);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: "Restored selected version.",
      },
    ]);

    setSelectedVersion(null);
  };

  const currentVersionIndex = history.length - 1;

  return (
    <div className="h-full flex flex-col">

      <h2 className="font-bold mb-4">AI Assistant</h2>

      {/* ✅ HISTORY */}
      {history.length > 0 && (
        <div className="mb-4 border p-2 rounded bg-gray-50 max-h-40 overflow-y-auto">
          <p className="text-sm font-semibold mb-2">History</p>

          {history.map((h, i) => (
            <div
              key={i}
              onClick={() => setSelectedVersion(i)}
              className={`text-xs mb-1 cursor-pointer px-1 py-1 rounded ${
                selectedVersion === i
                  ? "bg-black text-white"
                  : i === currentVersionIndex
                  ? "bg-green-100 font-semibold"
                  : "text-blue-600 hover:underline"
              }`}
            >
              {i + 1}. {h.label}
              {i === currentVersionIndex && " (current)"}
            </div>
          ))}

          {/* ✅ RESTORE BUTTON */}
          {selectedVersion !== null && (
            <button
              onClick={restoreVersion}
              className="mt-2 w-full bg-black text-white text-sm py-1 rounded"
            >
              Restore Selected Version
            </button>
          )}
        </div>
      )}

      {/* ✅ CHAT */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded max-w-[80%] ${
              msg.role === "user"
                ? "bg-black text-white self-end ml-auto"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="text-xs text-gray-500 mb-1">
                AutoPOS AI
              </div>
            )}
            {msg.text}
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      {/* ✅ INPUT */}
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded focus:outline-none"
          placeholder="e.g. add drinks category..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="bg-black text-white px-3 rounded hover:bg-gray-800 cursor-pointer disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}