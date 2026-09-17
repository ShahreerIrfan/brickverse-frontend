import type { BlogBlock } from "@/lib/blogTypes";
import { getMediaUrl } from "@/lib/api";

type GalleryImage = { url: string; caption?: string };

export default function GalleryBlock({ block }: { block: BlogBlock }) {
  const images: GalleryImage[] = Array.isArray(block.data?.images) ? block.data.images : [];
  const valid = images.filter((img) => img?.url);
  if (valid.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-0">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
        {valid.map((img, i) => (
          <figure key={i} className="rounded-xl sm:rounded-2xl overflow-hidden bg-[#F6F1FF]">
            <div className="relative w-full aspect-square">
              <img src={getMediaUrl(img.url)} alt={img.caption || ""} className="w-full h-full object-cover" />
            </div>
            {img.caption && (
              <figcaption className="px-2 py-1.5 text-[10px] sm:text-[11px] text-[#736E9B] truncate">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
