import type { BlogBlock } from "@/lib/blogTypes";

export default function TextBlock({ block }: { block: BlogBlock }) {
  const text: string = block.data?.text || "";
  if (!text.trim()) return null;

  const paragraphs = text.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-0 space-y-3 sm:space-y-4">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-sm sm:text-base leading-relaxed text-[#3A3560] whitespace-pre-line">
          {p}
        </p>
      ))}
    </div>
  );
}
