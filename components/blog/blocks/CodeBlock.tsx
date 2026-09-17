import type { BlogBlock } from "@/lib/blogTypes";

export default function CodeBlock({ block }: { block: BlogBlock }) {
  const code: string = block.data?.code || "";
  const language: string = block.data?.language || "";
  if (!code.trim()) return null;

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-0">
      <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-[#171136] shadow-md">
        {language && (
          <div className="px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-bold tracking-wide text-[#A79FD1] border-b border-white/10 uppercase">
            {language}
          </div>
        )}
        <pre className="px-3 sm:px-5 py-3 sm:py-4 overflow-x-auto text-[11px] sm:text-xs leading-relaxed text-[#F0EBF8]">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
