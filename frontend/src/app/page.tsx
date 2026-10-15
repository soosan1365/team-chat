"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatWindow from "../components/chat/ChatWindow";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useCurrentUser } from "../hooks/useCurrentUse";

export default function Home() {
  const router = useRouter();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isRoomRestored, setIsRoomRestored] = useState(false);

  useEffect(() => {
    const savedRoomId = sessionStorage.getItem("selectedRoomId");

    if (savedRoomId) {
      setSelectedRoomId(savedRoomId);
    }

    setIsRoomRestored(true);
  }, []);
  const { data, isPending } = useCurrentUser();

  const currentUser = data?.user ?? null;

  function handleSelectRoom(roomId: string | null) {
    if (!currentUser && roomId !== null) {
      router.push("/login");
      return;
    }

    setSelectedRoomId(roomId);

    if (roomId) {
      sessionStorage.setItem("selectedRoomId", roomId);
    } else {
      sessionStorage.removeItem("selectedRoomId");
    }
  }
  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#0B0D12] p-3 md:p-4">
      <Navbar />

      <div className="mt-4 flex min-h-0 flex-1 overflow-hidden rounded-2xl">
        <Sidebar
          selectedRoomId={selectedRoomId}
          onSelectRoom={handleSelectRoom}
        />

        <div className="hidden min-h-0 min-w-0 flex-1 md:flex">
          {isPending || !isRoomRestored ? (
            <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
              Checking your session...
            </div>
          ) : currentUser ? (
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
