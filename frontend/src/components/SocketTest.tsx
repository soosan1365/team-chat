"use client";

import { useSocket } from "../hooks/useSocket";
import { useRoomMessages } from "../features/messages/hooks/useRoomMessages";

const roomId = "cmv6nprm90000ichphuvq3t5t";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  user?: {
    name: string | null;
  };
};

export default function SocketTest() {
  const { data: messages, isLoading, error } = useRoomMessages(roomId);

  useSocket(roomId);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-800">
      <section className="mx-auto flex h-[85vh] max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900">General Chat</h1>
            <p className="mt-1 text-sm text-slate-500">Team conversation</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Connected
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50 p-6">
          {isLoading && (
            <p className="text-center text-sm text-slate-500">
              Loading messages...
            </p>
          )}

          {error && (
            <p className="text-center text-sm text-red-500">
              Failed to load messages.
            </p>
          )}

          {messages?.map((message: Message) => (
            <article key={message.id} className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                {(message.user?.name ?? "?").charAt(0).toUpperCase()}
              </div>

              <div className="max-w-[85%]">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    {message.user?.name ?? "Unknown user"}
                  </span>

                  <time className="text-xs text-slate-400">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>

                <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <p className="whitespace-pre-wrap break-words text-sm leading-6">
                    {message.content}
                  </p>
                </div>
              </div>
            </article>
          ))}
          {!isLoading && !error && messages?.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-400">
              No messages yet. Start the conversation!
            </p>
          )}
        </div>
        {/* Composer - UI only for now */}
        <form
          onSubmit={(event) => event.preventDefault()}
          className="border-t border-slate-200 bg-white p-4"
        >
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-indigo-400">
            <input
              type="text"
              placeholder="Type a message..."
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400"
              disabled
            />

            <button
              type="submit"
              disabled
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white opacity-50"
            >
              Send
            </button>
          </div>

          <p className="mt-2 text-center text-xs text-slate-400">
            Message sending will be enabled in the next step.
          </p>
        </form>
      </section>
    </main>
  );
}
