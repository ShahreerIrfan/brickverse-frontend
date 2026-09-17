import Link from "next/link";
import type { BlogPost } from "@/lib/blogTypes";
import { getMediaUrl } from "@/lib/api";
import { IconPhoto } from "@/components/icons";

function formatDate(value?: string | null) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

export default function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white border border-[#EAE3F7] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_0_-6px_rgba(23,17,54,0.09)] flex flex-col transition-transform hover:-translate-y-1"
    >
      <div className="relative w-full aspect-[16/10] bg-[#F6F1FF] overflow-hidden">
        {post.featuredImage ? (
          <img
            src={getMediaUrl(post.featuredImage)}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#C7C0E8]">
            <IconPhoto className="w-8 h-8" />
          </div>
        )}
        {post.category && (
          <span className="absolute left-2.5 sm:left-4 top-2.5 sm:top-4 bg-white/95 text-[#FF4D6D] text-[9px] sm:text-[10.5px] font-extrabold tracking-wide rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1">
            {post.category.name.toUpperCase()}
          </span>
        )}
      </div>
      <div className="p-3 sm:p-6 flex flex-col flex-1">
        <p className="text-[10px] sm:text-[11.5px] font-semibold text-[#736E9B]">{formatDate(post.publishedAt || post.createdAt)}</p>
        <h3 className="font-[family-name:var(--font-display)] font-extrabold text-[13.5px] sm:text-lg text-[#171136] mt-1 sm:mt-1.5 line-clamp-2 group-hover:text-[#FF4D6D] transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-[11.5px] sm:text-sm text-[#736E9B] mt-1.5 sm:mt-2 line-clamp-2 sm:line-clamp-3">{post.excerpt}</p>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2.5 sm:pt-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 rounded-full bg-[#F6F1FF] text-[#7B5CFF] text-[9.5px] sm:text-[10.5px] font-bold"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
