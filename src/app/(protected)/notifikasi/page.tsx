"use client";

import React, { useState } from "react";
import { Bell, Send } from "lucide-react";

type Message = {
  id: number;
  sender: "admin" | "user";
  text: string;
  time: string;
};

type Conversation = {
  id: number;
  projectTitle: string;
  targetUser: string; // dari sudut pandang user -> admin tujuan
  messages: Message[];
};

const initialConversations: Conversation[] = [
  {
    id: 1,
    projectTitle: "PPDB SMA Perintis 2 Bandar Lampung",
    targetUser: "Admin PPDB",
    messages: [
      {
        id: 1,
        sender: "admin",
        text: "Halo, mohon cek kembali data siswa yang belum terverifikasi ya.",
        time: "09:15",
      },
      {
        id: 2,
        sender: "user",
        text: "Siap, hari ini saya review dan update, Pak.",
        time: "09:20",
      },
    ],
  },
  {
    id: 2,
    projectTitle: "Aplikasi MPP Digital Kabupaten Lampung Timur",
    targetUser: "Admin MPP Digital",
    messages: [
      {
        id: 3,
        sender: "admin",
        text: "Besok ada demo fitur Booking Antrian, pastikan environment sudah siap.",
        time: "10:05",
      },
    ],
  },
];

const Page: React.FC = () => {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [activeId, setActiveId] = useState<number>(initialConversations[0]?.id);
  const [messageText, setMessageText] = useState("");

  const activeConversation = conversations.find((c) => c.id === activeId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: messageText.trim(),
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation.id
          ? { ...conv, messages: [...conv.messages, newMessage] }
          : conv
      )
    );

    setMessageText("");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar daftar notifikasi / percakapan */}
        <aside className="w-full md:w-1/3 border-r border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-200 bg-white">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-sm">
                Notifikasi & Pesan
              </h2>
              <p className="text-xs text-slate-500">
                Chat hanya antara Anda dan admin.
              </p>
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {conversations.map((conv) => {
              const lastMsg =
                conv.messages[conv.messages.length - 1]?.text ?? "";
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={`w-full text-left px-4 py-3 border-b border-slate-100 transition ${
                    activeId === conv.id
                      ? "bg-blue-50/80"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-700 line-clamp-1">
                    {conv.projectTitle}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {lastMsg}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {conv.targetUser}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Area chat + form balasan */}
        <main className="w-full md:w-2/3 flex flex-col">
          {/* Header room */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-500">
            <div>
              <p className="text-xs text-blue-100">Room Pesan</p>
              <h1 className="text-sm md:text-base font-semibold text-white">
                {activeConversation?.projectTitle ?? "Pilih percakapan"}
              </h1>
            </div>
            {activeConversation && (
              <div className="text-right">
                <p className="text-[11px] text-blue-100">Admin tujuan</p>
                <p className="text-xs font-medium text-white">
                  {activeConversation.targetUser}
                </p>
              </div>
            )}
          </div>

          {/* Chat messages */}
          <div className="flex-1 bg-slate-50 px-4 md:px-6 py-4 overflow-y-auto space-y-4">
            {activeConversation ? (
              activeConversation.messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 text-xs shadow-sm ${
                        isUser
                          ? "bg-blue-500 text-white rounded-br-sm"
                          : "bg-white text-slate-800 rounded-bl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>
                      <p
                        className={`mt-1 text-[10px] ${
                          isUser ? "text-blue-100" : "text-slate-400"
                        } text-right`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 text-center mt-10">
                Tidak ada percakapan yang dipilih.
              </p>
            )}
          </div>

          {/* Form detail laporan / balasan */}
          {activeConversation && (
            <div className="border-t border-slate-200 bg-white px-4 md:px-6 py-4">
              <h2 className="text-xs font-semibold text-slate-700 mb-3">
                Detail Laporan & Balasan
              </h2>
              <form onSubmit={handleSend} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Judul Project
                    </label>
                    <input
                      type="text"
                      value={activeConversation.projectTitle}
                      readOnly
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      User Tujuan
                    </label>
                    <input
                      type="text"
                      value={activeConversation.targetUser}
                      readOnly
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Isi laporan / balasan Anda
                  </label>
                  <textarea
                    rows={3}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Tulis balasan untuk admin di sini..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition disabled:bg-slate-300"
                    disabled={!messageText.trim()}
                  >
                    <span>Kirim</span>
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Page;
