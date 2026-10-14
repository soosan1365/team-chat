
"use client";

import { useEffect, useState } from "react";
import { Bell, Search, MessageCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth-user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as AuthUser);
      } catch {
        localStorage.removeItem("auth-user");
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
    setUser(null);
    router.push("/login");
  }

  const initials =
    user?.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#111318] px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>

        <div>
          <h1 className="text-lg font-bold text-white">TeamFlow</h1>
          <p className="text-xs text-gray-500">Workspace</p>
        </div>
      </div>

      <div className="relative hidden w-full max-w-md md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search messages, people..."
          className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-500 focus-visible:ring-violet-500"
        />
      </div>

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

        {user ? (
          <>
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-violet-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-white">
                  {user.name}
                </p>
                <p className="max-w-36 truncate text-xs text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
              className="text-gray-400 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <Button
            onClick={() => router.push("/login")}
            className="bg-violet-600 text-white hover:bg-violet-500"
          >
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}