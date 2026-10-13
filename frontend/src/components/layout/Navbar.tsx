
"use client";

import { Bell, Search, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="h-16 border-b border-white/10 bg-[#111318] px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>

        <div>
          <h1 className="text-lg font-bold text-white">
            TeamFlow
          </h1>
          <p className="text-xs text-gray-500">
            Workspace
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative hidden w-full max-w-md md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search messages, people..."
          className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-500 focus-visible:ring-violet-500"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-400 hover:bg-white/10 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-500 ring-2 ring-[#111318]" />
        </Button>

        <div className="h-8 w-px bg-white/10" />

        <button className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-white/5">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" alt="Your profile" />
            <AvatarFallback className="bg-violet-600 text-white">
              SA
            </AvatarFallback>
          </Avatar>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-white">
              Soosan
            </p>
            <p className="text-xs text-emerald-400">
              ● Online
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}