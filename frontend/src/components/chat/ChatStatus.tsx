"use client";

import {
  LoaderCircle,
  MessageCircle,
  AlertCircle,
  MessagesSquare,
  LockKeyhole,
} from "lucide-react";

type ChatStatusProps = {
  title: string;
  description?: string;
  type?: "loading" | "empty" | "error" | "info" | "locked";
};

const icons = {
  loading: LoaderCircle,
  empty: MessageCircle,
  error: AlertCircle,
  info: MessagesSquare,
  locked: LockKeyhole,
};

export default function ChatStatus({
  title,
  description,
  type = "info",
}: ChatStatusProps) {
  const Icon = icons[type];
  const isLoading = type === "loading";
  const isError = type === "error";

  return (
    <div className="flex min-h-[240px] flex-1 items-center justify-center overflow-hidden bg-[#0B0D12] px-5 py-8">
      <div className="relative flex max-w-sm flex-col items-center text-center">
        {/* Decorative glow */}
        <div className="absolute top-2 h-24 w-24 rounded-full bg-violet-600/20 blur-3xl" />

        {/* Icon container */}
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 to-indigo-500/5 shadow-[0_0_40px_rgba(139,92,246,0.12)]">
          {isLoading && (
            <div className="absolute inset-1 rounded-[22px] border border-dashed border-violet-400/30 animate-[spin_8s_linear_infinite]" />
          )}

          <Icon
            className={`h-9 w-9 ${
              isLoading
                ? "animate-spin text-violet-300"
                : isError
                  ? "text-red-400"
                  : "text-violet-300"
            }`}
            strokeWidth={1.6}
          />
        </div>

        <h3 className="mb-3 text-base font-semibold tracking-tight text-gray-100">
          {title}
        </h3>

        {description && (
          <p className="max-w-xs text-sm leading-7 text-gray-400">
            {description}
          </p>
        )}

        {isLoading && (
          <div className="mt-6 flex items-center gap-1.5">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse"
                style={{ animationDelay: `${dot * 200}ms` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}