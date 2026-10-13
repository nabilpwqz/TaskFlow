"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Conversation, Message } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { MessageSquare, Send, Loader2, Sparkles, ChevronLeft } from "lucide-react";

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function loadConversations() {
      try {
        const res = await fetch("/api/conversations");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setConversations(data.data);
          if (data.data.length > 0) {
            setActiveConv(data.data[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadConversations();
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    const currentConvId = activeConv._id;
    async function loadMessages() {
      try {
        const res = await fetch(`/api/conversations/${currentConvId}/messages`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadMessages();
  }, [activeConv]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv || !body.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`/api/conversations/${activeConv._id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.data]);
        setBody("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const getRecipient = (conv: Conversation) => {
    return conv.participants?.find((p) => p._id !== user?._id) || null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Project Messaging</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Direct communication with your clients and freelancers on active orders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-glass overflow-hidden min-h-[540px]">
        {/* Left: Conversation list (4-5 cols) */}
        <div
          className={`md:col-span-5 lg:col-span-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 flex flex-col space-y-2 ${
            activeConv ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Conversations
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {conversations.length}
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center my-auto">
              <Loader2 className="h-6 w-6 animate-spin text-amber-500 mx-auto" />
            </div>
          ) : conversations.length > 0 ? (
            <div className="space-y-1.5 overflow-y-auto max-h-[460px] pr-1">
              {conversations.map((conv) => {
                const recipient = getRecipient(conv);
                const isSelected = activeConv?._id === conv._id;
                return (
                  <button
                    key={conv._id}
                    onClick={() => setActiveConv(conv)}
                    className={`w-full flex items-center gap-3 rounded-xl p-3 text-left transition border ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500/40 text-slate-900 dark:text-white shadow-sm ring-1 ring-amber-500/20"
                        : "hover:bg-slate-200/60 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-transparent"
                    }`}
                  >
                    {recipient?.avatar ? (
                      <img
                        src={recipient.avatar}
                        alt={recipient.name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {recipient?.name ? recipient.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {recipient?.name || "Participant"}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                          {formatRelativeTime(conv.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {conv.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-16 px-4 text-center flex flex-col items-center justify-center my-auto">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 ring-1 ring-amber-500/20">
                <MessageSquare className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No conversations yet</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-[220px] leading-relaxed">
                Messages appear when orders are placed.
              </p>
            </div>
          )}
        </div>

        {/* Right: Message history & input (7-8 cols) */}
        <div
          className={`md:col-span-7 lg:col-span-8 flex flex-col justify-between h-[540px] bg-white dark:bg-slate-900/30 ${
            !activeConv ? "hidden md:flex" : "flex"
          }`}
        >
          {activeConv ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80">
                {/* Mobile Back Button to return to list */}
                <button
                  type="button"
                  onClick={() => setActiveConv(null)}
                  className="md:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
                  title="Back to conversation list"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {getRecipient(activeConv)?.avatar ? (
                  <img
                    src={getRecipient(activeConv)?.avatar}
                    alt={getRecipient(activeConv)?.name}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs ring-1 ring-amber-500/30">
                    {getRecipient(activeConv)?.name ? getRecipient(activeConv)?.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {getRecipient(activeConv)?.name || "Participant"}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Active on TaskFlow</span>
                  </div>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40 dark:bg-transparent">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 dark:text-slate-400">
                    <Sparkles className="h-6 w-6 text-amber-500 mb-2 opacity-60" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Start the conversation</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Send a message to discuss deliverables and timeline.</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMine = m.senderId === user?._id;
                    return (
                      <div
                        key={m._id}
                        className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                            isMine
                              ? "bg-amber-500 text-slate-950 font-medium rounded-br-none"
                              : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700/60"
                          }`}
                        >
                          {m.body}
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                          {formatRelativeTime(m.createdAt)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-amber-500 focus:outline-none transition shadow-inner"
                />
                <button
                  type="submit"
                  disabled={sending || !body.trim()}
                  className="flex items-center justify-center rounded-xl bg-amber-500 p-2.5 text-slate-950 hover:bg-amber-400 disabled:opacity-40 transition font-bold shadow-sm"
                  aria-label="Send message"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-slate-50/30 dark:bg-transparent">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 ring-1 ring-amber-500/20">
                <MessageSquare className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Select a conversation to view chat history</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                Pick a thread from the list on the left to review messages and coordinate milestones.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
