"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type LeaveRoomDialogProps = {
  roomName: string;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export default function LeaveRoomDialog({
  roomName,
  open,
  isPending,
  onOpenChange,
  onConfirm,
}: LeaveRoomDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-slate-700 bg-[#111827] text-white border-2 border-b-teal-300">
        <AlertDialogHeader>
          <AlertDialogTitle>Leave this group?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave &quot;{roomName}&quot;? You can join
            the group again later.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="text-black">
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
            className="bg-rose-600 text-white hover:bg-rose-700"
          >
            {isPending ? "Leaving..." : "Leave group"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
