"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "selectedRoomId";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("selectedRoomChange", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("selectedRoomChange", callback);
  };
}

function getSnapshot() {
  return sessionStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot() {
  return null;
}

export function useSelectedRoom() {
  const selectedRoomId = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  function selectRoom(roomId: string | null) {
    if (roomId) {
      sessionStorage.setItem(STORAGE_KEY, roomId);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }

    window.dispatchEvent(new Event("selectedRoomChange"));
  }

  return {
    selectedRoomId,
    isRoomRestored: true,
    selectRoom,
  };
}
