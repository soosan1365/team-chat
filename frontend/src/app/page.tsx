
"use client";

import { useEffect, useState } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export default function Home() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth-user");

    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser) as AuthUser);
      } catch {
        localStorage.removeItem("auth-user");
      }
    }
  }, []);

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#0B0D12] p-3 md:p-4">
      <Navbar />

      <div className="mt-4 flex min-h-0 flex-1 overflow-hidden rounded-2xl">
        <Sidebar
          selectedRoomId={selectedRoomId}
          onSelectRoom={setSelectedRoomId}
        />

        <div className="hidden min-h-0 min-w-0 flex-1 md:flex">
          {currentUser ? (
            <ChatWindow
              selectedRoomId={selectedRoomId}
              currentUserId={currentUser.id}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
              Please log in to access the chat.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
