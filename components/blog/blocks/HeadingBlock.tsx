import type { BlogBlock } from "@/lib/blogTypes";

export default function HeadingBlock({ block }: { block: BlogBlock }) {
  const text: string = block.data?.text || "";
  const level = Number(block.data?.level) || 2;
  if (!text.trim()) return null;

  const sizeByLevel: Record<number, string> = {
    2: "text-xl sm:text-3xl",
    3: "text-lg sm:text-2xl",
    4: "text-base sm:text-xl",
  };
  const sizeClass = sizeByLevel[level] || sizeByLevel[2];

  const commonClass = `font-[family-name:var(--font-display)] font-extrabold text-[#171136] tracking-tight ${sizeClass}`;
  const content = (
    <div className="max-w-2xl mx-auto px-3 sm:px-0">
      {level === 4 ? (
        <h4 className={commonClass}>{text}</h4>
      ) : level === 3 ? (
        <h3 className={commonClass}>{text}</h3>
      ) : (
        <h2 className={commonClass}>{text}</h2>
      )}
    </div>
  );

  return content;
}
