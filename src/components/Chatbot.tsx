import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { useAppData } from "../hooks/useAppData";

type ChatMessage = { role: "user" | "bot"; text: string };

export default function Chatbot() {
  const { data } = useAppData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Hello! I'm your Kayolla Homes AI assistant. Ask me about listings, locations, pricing, or the services we offer.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-8),
        }),
      });

      const json = await response.json();
      const reply =
        typeof json.text === "string"
          ? json.text
          : "I could not generate a response right now.";

      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, I am having trouble connecting right now. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-24 w-14 h-14 bg-kayolla-red text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-40 group"
      >
        <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-kayolla-black text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
          AI
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-28 right-8 w-[90vw] md:w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-2xl z-50 flex flex-col overflow-hidden border border-kayolla-black/5"
          >
            <div className="bg-kayolla-black p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-kayolla-red rounded-xl flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm">{data?.config?.agencyName || "Kayolla Homes"} AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-kayolla-gray/30">
              {messages.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        m.role === "user" ? "bg-kayolla-red text-white" : "bg-kayolla-black text-white"
                      }`}
                    >
                      {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-kayolla-red text-white rounded-tr-none"
                          : "bg-white text-kayolla-black shadow-sm rounded-tl-none"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-lg bg-kayolla-black text-white flex items-center justify-center">
                      <Bot size={14} />
                    </div>
                    <div className="p-4 rounded-2xl bg-white text-kayolla-black shadow-sm rounded-tl-none flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      <span className="text-xs font-medium">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-kayolla-black/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full pl-6 pr-14 py-4 bg-kayolla-gray rounded-2xl border-none focus:ring-2 focus:ring-kayolla-red transition-all text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-2 w-10 h-10 bg-kayolla-red text-white rounded-xl flex items-center justify-center hover:bg-kayolla-black transition-all disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-kayolla-black/30 font-bold uppercase tracking-widest">
                <Sparkles size={10} />
                <span>Powered by server-side Gemini</span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
