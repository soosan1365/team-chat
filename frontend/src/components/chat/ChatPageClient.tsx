"use client";
import { useRouter } from "next/navigation";
import ChatWindow from "./ChatWindow";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import ChatStatus from "./ChatStatus";
import { useCurrentUser } from "../../hooks/auth/useCurrentUse";
import { useSelectedRoom } from "../../hooks/rooms/useSelectedRoom";

export default function ChatPageClient() {
  const router = useRouter();
  const { selectedRoomId, isRoomRestored, selectRoom } = useSelectedRoom();

  const { data, isPending } = useCurrentUser();
  const currentUser = data?.user ?? null;

  function handleSelectRoom(roomId: string | null) {
    if (!currentUser && roomId !== null) {
      router.push("/login");
      return;
    }
    selectRoom(roomId);
  }

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-[#0B0D12] p-2 sm:p-3 lg:p-4">
      <Navbar />

      <div className="mt-2 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden sm:mt-3 sm:gap-3 md:flex-row md:gap-0">
        {/* Sidebar */}

        <div className="flex h-[62%] min-h-0 w-full shrink-0 overflow-hidden rounded-xl md:h-full md:w-[320px] md:rounded-none">
          <Sidebar
            selectedRoomId={selectedRoomId}
            onSelectRoom={handleSelectRoom}
          />
        </div>

        {/* Chat */}
        <section className="flex min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl md:rounded-l-none md:rounded-r-xl">
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
            <ChatStatus
              type="empty"
              title="Start the conversation"
              description="Please log in to access the chat.!"
            />
          )}
        </section>
      </div>
    </main>
  );
}
