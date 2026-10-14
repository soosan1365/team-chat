"use client";

import { useState } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function Home() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#0B0D12] p-3 md:p-4">
      <Navbar />
      <div className="mt-4 flex min-h-0 flex-1 overflow-hidden rounded-2xl">
        <Sidebar
          selectedRoomId={selectedRoomId}
          onSelectRoom={setSelectedRoomId}
        />
        <div className="hidden min-h-0 min-w-0 flex-1 md:flex">
          <ChatWindow
            selectedRoomId={selectedRoomId}
            currentUserId="test-user-001"
          />
        </div>
      </div>
    </main>
  );
}
