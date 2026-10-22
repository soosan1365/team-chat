"use client";

import { useCurrentUser } from "@/src/hooks/auth/useCurrentUse";
import { useLogout } from "@/src/hooks/auth/useLogout";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, MessageCircle, LogOut } from "lucide-react";
import { useUnreadMessagesCount } from "@/src/hooks/messages/useUnreadMessagesCount";

export default function Navbar() {
  const router = useRouter();
  const { data, isPending } = useCurrentUser();
  const { data: unreadCount = 0 } = useUnreadMessagesCount();
  const logout = useLogout();

  const user = data?.user ?? null;

  async function handleLogout() {
    try {
      await logout.mutateAsync();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

 

  return (
    <header className="relative z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-700/70 bg-[#0D1726] px-3 shadow-[0_4px_24px_rgba(0,0,0,0.18)] sm:px-6">
      {/* Brand */}
      <button
        type="button"
        onClick={() => router.push("/")}
        className="group flex shrink-0 items-center gap-2.5 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-teal-400 sm:gap-3"
        aria-label="TeamFlow home"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-300 to-cyan-500 shadow-lg shadow-teal-500/20 transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105 sm:h-10 sm:w-10">
          <MessageCircle className="h-5 w-5 text-[#0D1726]" />
        </div>

        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-100 sm:text-lg">
            Team<span className="text-teal-300">Flow</span>
          </h1>
          <p className="hidden text-[11px] tracking-wide text-slate-400 sm:block">
            YOUR WORKSPACE
          </p>
        </div>
      </button>

      {/* Actions and profile */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Notifications, ${unreadCount} unread messages`}
          className="relative h-9 w-9 rounded-xl text-slate-400 transition-all hover:bg-teal-400/10 hover:text-teal-300 focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <Bell className="h-[18px] w-[18px]" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#0D1726]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>

        <div className="hidden h-8 w-px bg-slate-700 sm:block" />

        {isPending ? (
          <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-800" />
        ) : user ? (
          <>
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-teal-300/50 bg-gradient-to-br from-teal-300/25 via-[#12343B] to-[#172B45] text-sm font-bold text-teal-200 shadow-[0_0_14px_rgba(45,212,191,0.12)]">
                {user?.name?.trim()?.charAt(0).toUpperCase() ?? "U"}
              </div>

              <div className="hidden min-w-0 sm:block">
                <p className="max-w-36 truncate text-sm font-medium text-slate-100">
                  {user.name ?? "User"}
                </p>
                <p className="max-w-36 truncate text-xs text-slate-400">
                  {user.email}
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleLogout}
              disabled={logout.isPending}
              variant="outline"
              aria-label="Log out"
              className="h-9 gap-2 rounded-xl border-slate-700 bg-slate-800/40 px-2.5 text-slate-300 transition-all duration-200 hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-300 focus-visible:ring-2 focus-visible:ring-rose-400 sm:px-3"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="hidden text-sm sm:inline">
                {logout.isPending ? "Logging out..." : "Log out"}
              </span>
            </Button>
          </>
        ) : (
          <Button
            type="button"
            onClick={() => router.push("/login")}
            className="h-9 rounded-xl bg-teal-300 px-3 font-semibold text-[#0D1726] shadow-md shadow-teal-500/10 transition-all hover:bg-teal-200 hover:shadow-teal-400/20 focus-visible:ring-2 focus-visible:ring-teal-400 sm:px-4"
          >
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}
