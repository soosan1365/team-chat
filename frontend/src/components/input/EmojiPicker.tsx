"use client";

type EmojiPickerProps = {
  onSelect: (emoji: string) => void;
};

const emojis = [
  "😀", "😂", "😍", "🥰", "😊", "👍",
  "❤️", "🎉", "🔥", "😭", "🙏", "👏",
];

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  return (
    <div className="absolute bottom-14 right-12 z-50 flex max-w-64 flex-wrap gap-2 rounded-xl border border-white/10 bg-[#191C24] p-3">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onSelect(emoji)}
          className="rounded p-1 text-xl hover:bg-white/10"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}