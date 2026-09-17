import type { BlogBlock } from "@/lib/blogTypes";

export default function DividerBlock({ block }: { block: BlogBlock }) {
  const style: string = block.data?.style || "line";

  if (style === "dots") {
    return (
      <div className="flex items-center justify-center gap-2 py-2 sm:py-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D9CEEE]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#D9CEEE]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#D9CEEE]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-0">
      <hr className="border-t border-[#EAE3F7]" />
    </div>
  );
}
