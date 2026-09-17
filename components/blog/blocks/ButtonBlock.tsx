import Link from "next/link";
import type { BlogBlock } from "@/lib/blogTypes";
import { IconArrowRight } from "@/components/icons";

export default function ButtonBlock({ block }: { block: BlogBlock }) {
  const text: string = block.data?.text || "";
  const url: string = block.data?.url || "#";
  const style: string = block.data?.style || "primary";
  if (!text.trim()) return null;

  const isExternal = /^https?:\/\//.test(url);
  const className =
    style === "outline"
      ? "border-2 border-[#FF4D6D] text-[#FF4D6D] hover:bg-[#FFF1F4]"
      : "bg-[#FF4D6D] text-white hover:bg-[#ff3358] shadow-md";

  const content = (
    <span className={`inline-flex items-center gap-2 rounded-full px-5 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold transition-colors ${className}`}>
      {text}
      <IconArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </span>
  );

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-0 text-center">
      {isExternal ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        <Link href={url}>{content}</Link>
      )}
    </div>
  );
}
