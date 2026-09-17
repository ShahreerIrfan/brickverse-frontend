import type { BlogBlock } from "@/lib/blogTypes";

function toEmbedSrc(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.replace("/", "");
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return null;
  } catch {
    return null;
  }
}

export default function EmbedBlock({ block }: { block: BlogBlock }) {
  const url: string = block.data?.url || "";
  if (!url) return null;
  const embedSrc = toEmbedSrc(url);

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-0">
      {embedSrc ? (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-md">
          <iframe
            src={embedSrc}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full p-4 rounded-2xl border border-[#EAE3F7] bg-white text-[#7B5CFF] font-semibold text-xs sm:text-sm break-all hover:bg-[#FAF8FE] transition-colors"
        >
          {url}
        </a>
      )}
    </div>
  );
}
