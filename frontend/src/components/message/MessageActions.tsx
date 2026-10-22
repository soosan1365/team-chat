"use client";

import { Copy, Reply, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type MessageActionsProps = {
  isMe: boolean;
  onCopy: () => void;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function MessageActions({
  isMe,
  onCopy,
  onReply,
  onEdit,
  onDelete,
}: MessageActionsProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-[#111827] p-1">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        title="Copy"
        onClick={onCopy}
        className="h-8 w-8 text-slate-300 hover:bg-slate-700 hover:text-white"
      >
        <Copy className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        size="icon"
        variant="ghost"
        title="Reply"
        onClick={onReply}
        className="h-8 w-8 text-slate-300 hover:bg-slate-700 hover:text-white"
      >
        <Reply className="h-4 w-4" />
      </Button>

      {isMe && (
        <>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            title="Edit"
            onClick={onEdit}
            className="h-8 w-8 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            title="Delete"
            onClick={onDelete}
            className="h-8 w-8 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
