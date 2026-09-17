import type { BlogBlock } from "@/lib/blogTypes";
import TextBlock from "./blocks/TextBlock";
import HeadingBlock from "./blocks/HeadingBlock";
import ImageBlock from "./blocks/ImageBlock";
import GalleryBlock from "./blocks/GalleryBlock";
import QuoteBlock from "./blocks/QuoteBlock";
import CodeBlock from "./blocks/CodeBlock";
import EmbedBlock from "./blocks/EmbedBlock";
import ButtonBlock from "./blocks/ButtonBlock";
import ProductGridBlock from "./blocks/ProductGridBlock";
import DividerBlock from "./blocks/DividerBlock";

function BlockSwitch({ block }: { block: BlogBlock }) {
  switch (block.blockType) {
    case "text":
      return <TextBlock block={block} />;
    case "heading":
      return <HeadingBlock block={block} />;
    case "image":
      return <ImageBlock block={block} />;
    case "gallery":
      return <GalleryBlock block={block} />;
    case "quote":
      return <QuoteBlock block={block} />;
    case "code":
      return <CodeBlock block={block} />;
    case "embed":
      return <EmbedBlock block={block} />;
    case "button":
      return <ButtonBlock block={block} />;
    case "product_grid":
      return <ProductGridBlock block={block} />;
    case "divider":
      return <DividerBlock block={block} />;
    default:
      return null;
  }
}

export default function BlockRenderer({ blocks }: { blocks: BlogBlock[] }) {
  const ordered = [...(blocks || [])].sort((a, b) => a.order - b.order);
  return (
    <div className="space-y-6 sm:space-y-10">
      {ordered.map((block) => (
        <BlockSwitch key={block.id ?? `${block.blockType}-${block.order}`} block={block} />
      ))}
    </div>
  );
}
