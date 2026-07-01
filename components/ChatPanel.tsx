"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, User, Send, History, CheckCircle } from "lucide-react";

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

  const currentVersionIndex = history.length - 1;

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
          { role: "assistant", text: "Applying changes..." },
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

          if (!updated || !updated.products) {
            setMessages((prev) => [
              ...prev,
              { role: "assistant", text: "❌ Invalid update." },
            ]);
            setPendingInstruction(null);
            return;
          }

          onUpdate(updated);

          setMessages((prev) => [
            ...prev,
            { role: "assistant", text: "✅ Update applied." },
          ]);

          setPendingInstruction(null);
        } catch {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", text: "❌ Error applying change" },
          ]);
        }

        return;
      }

      if (["no", "cancel"].includes(instruction)) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Operation cancelled." },
        ]);
        setPendingInstruction(null);
        return;
      }
    }

    // ✅ PLAN MODE
    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: "🤖 Thinking..." },
    ]);

    try {
      const res = await fetch("/api/plan-pos", {
        method: "POST",
        body: JSON.stringify({ instruction: instructionRaw }),
      });

      const result = await res.json();
      setMessages((prev) => prev.slice(0, -1));

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: result.message || "⚠️ Could not understand.",
        },
      ]);

      setPendingInstruction(instructionRaw);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "❌ Failed" },
      ]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden transition-all hover:shadow-xl">

      {/* ✅ HEADER */}
      <div className="px-5 py-4 bg-gradient-to-r from-indigo-50/80 to-white border-b border-gray-200/60">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-100 rounded-lg">
            <Bot className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="font-semibold text-gray-800 text-sm tracking-wide">
            AI Assistant
          </h2>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
            <span className="text-[10px] text-gray-400 font-medium">Online</span>
          </span>
        </div>
      </div>

      {/* ✅ HISTORY */}
      {history.length > 0 && (
        <div className="px-3 py-2 border-b border-gray-200/60 bg-gray-50/50 max-h-36 overflow-y-auto scrollbar-thumb-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <History className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
              History
            </p>
          </div>

          <div className="space-y-1">
            {history.map((h: any, i: number) => {
              const isCurrent = i === currentVersionIndex;
              const isSelected = selectedVersion === i;
              
              return (
                <div
                  key={i}
                  onClick={() => setSelectedVersion(i)}
                  className={`
                    group flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg cursor-pointer 
                    transition-all duration-200
                    ${isSelected 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : isCurrent
                        ? "bg-emerald-50 text-gray-700 hover:bg-emerald-100/50"
                        : "hover:bg-gray-100 text-gray-600"
                    }
                  `}
                >
                  <span className={`
                    flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold
                    ${isSelected 
                      ? "bg-white/20 text-white" 
                      : isCurrent
                        ? "bg-emerald-200 text-emerald-600"
                        : "bg-gray-200 text-gray-400"
                    }
                  `}>
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate font-medium">
                    {h.label}
                    {isCurrent && " (current)"}
                  </span>
                  {isCurrent && (
                    <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ✅ CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-indigo-400" />
            </div>
            <p className="text-sm font-medium text-gray-600">How can I help you?</p>
            <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
              Try: "Add a drinks category" or "Increase prices by 10%"
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          const isThinking = msg.text === "🤖 Thinking...";
          
          return (
            <div
              key={i}
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div className={`
                flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                ${isUser 
                  ? "bg-gradient-to-br from-gray-700 to-gray-800" 
                  : "bg-gradient-to-br from-indigo-500 to-indigo-600"
                }
              `}>
                {isUser ? (
                  <User className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Bot className="w-3.5 h-3.5 text-white" />
                )}
              </div>

              {/* Message bubble */}
              <div className={`flex-1 max-w-[85%] ${isUser ? "flex justify-end" : ""}`}>
                <div className={`
                  inline-block px-4 py-2.5 rounded-2xl text-sm
                  ${isUser 
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/20" 
                    : "bg-gray-100 text-gray-700"
                  }
                  ${isThinking ? "opacity-70" : ""}
                `}>
                  {isUser ? (
                    <span>{msg.text}</span>
                  ) : (
                    <>
                      <div className="text-[10px] text-gray-400 font-medium mb-1">
                        AutoPOS AI
                      </div>
                      <span>{msg.text}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        <div ref={endRef} />
      </div>

      {/* ✅ INPUT */}
      <div className="border-t border-gray-200/60 p-4 bg-gray-50/50">
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-200/60 p-1.5 shadow-sm focus-within:border-indigo-300 focus-within:shadow-md focus-within:shadow-indigo-500/10 transition-all">
          
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400 px-3 py-2.5"
            placeholder="Ask AutoPOS AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`
              flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-200 flex items-center gap-2
              ${input.trim()
                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>

        </div>

        {/* Pending instruction indicator */}
        {pendingInstruction && (
          <div className="mt-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200/50 rounded-lg">
            <p className="text-xs text-yellow-700">
              ⚡ Confirm changes? Type <strong>yes</strong> or <strong>no</strong>
            </p>
          </div>
        )}
      </div>

    </div>
  );
}