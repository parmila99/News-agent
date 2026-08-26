import React, { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot, User, RefreshCw } from "lucide-react";
import { chatWithAI } from "../lib/gemini";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface AiNewsAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AiNewsAssistantModal({ isOpen, onClose }: AiNewsAssistantModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Namaste! I am the RGNN AI News Assistant. Ask me anything about breaking world news, Nepal and South Asian politics, economic trends, or Rajbanshi history and culture.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    const newMsg: Message = {
      role: "user",
      content: userMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setLoading(true);

    try {
      const res = await chatWithAI(userMsg);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: res.reply || "I analyzed the latest reports, but couldn't retrieve a definitive answer. Please try rephrasing.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm currently unable to reach the RGNN AI knowledge engine. Please check your connection.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Summarize today's top global stories",
    "What is the latest update on Nepal's green energy summit?",
    "Tell me about the history of Rajbanshi culture",
    "How are global tech markets performing today?"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#141414] text-white w-full max-w-2xl rounded-3xl shadow-2xl border border-white/10 flex flex-col h-[620px] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#AA0000] to-[#660000] p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur">
              <Sparkles size={20} className="text-yellow-300" />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight uppercase italic flex items-center gap-2">
                RGNN AI Assistant <span className="bg-white/20 text-[10px] tracking-widest px-2 py-0.5 rounded font-mono">GEMINI 2.5</span>
              </h3>
              <p className="text-[11px] text-white/80">Real-time Journalism & Knowledge Companion</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#AA0000] flex items-center justify-center text-white shrink-0 mt-1 shadow-md">
                  <Bot size={16} />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-[#AA0000] text-white rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 text-neutral-200 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap">{m.content}</p>
                <span className="text-[10px] text-white/40 block mt-2 text-right">{m.timestamp}</span>
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-white shrink-0 mt-1">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-neutral-400 text-xs italic">
              <div className="w-8 h-8 rounded-full bg-[#AA0000] flex items-center justify-center text-white animate-pulse">
                <Bot size={16} />
              </div>
              <span className="flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin text-[#AA0000]" />
                RGNN AI is searching verified news wires and analyzing sources...
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-6 py-2 border-t border-white/5 bg-black/40 flex gap-2 overflow-x-auto scrollbar-hide">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(prompt);
              }}
              className="text-[11px] whitespace-nowrap bg-white/5 hover:bg-[#AA0000]/30 hover:border-[#AA0000]/40 border border-white/10 px-3 py-1.5 rounded-full text-neutral-300 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-black border-t border-white/10 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask RGNN AI about any news topic, country, or event..."
            className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#AA0000] transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-[#AA0000] hover:bg-[#880000] disabled:opacity-40 text-white px-5 rounded-xl font-bold transition flex items-center justify-center shadow-lg shadow-[#AA0000]/20"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
