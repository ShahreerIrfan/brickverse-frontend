"use client";

import { useState } from "react";
import type { Product } from "../productData";

interface ProductTabsProps {
  product: Product;
}

type DescriptionBlock =
  | { type: "heading"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "paragraph"; text: string };

function parseDescription(text: string): DescriptionBlock[] {
  const blocks: DescriptionBlock[] = [];
  let bulletBuffer: string[] = [];
  let paraBuffer: string[] = [];

  const flushBullets = () => {
    if (bulletBuffer.length) {
      blocks.push({ type: "bullets", items: bulletBuffer });
      bulletBuffer = [];
    }
  };
  const flushPara = () => {
    if (paraBuffer.length) {
      blocks.push({ type: "paragraph", text: paraBuffer.join(" ") });
      paraBuffer = [];
    }
  };

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) {
      // A blank line ends a paragraph, but not a bullet list - product
      // descriptions from the admin editor often have a blank line between
      // individual bullets, which should still render as one list.
      flushPara();
      continue;
    }
    const bulletMatch = line.match(/^[•\-*]\s+(.*)/);
    if (bulletMatch) {
      flushPara();
      bulletBuffer.push(bulletMatch[1]);
      continue;
    }
    flushBullets();
    const isHeading = line.length <= 60 && line === line.toUpperCase() && /[A-Z]/.test(line);
    if (isHeading) {
      flushPara();
      blocks.push({ type: "heading", text: line });
    } else {
      paraBuffer.push(line);
    }
  }
  flushBullets();
  flushPara();

  return blocks;
}

function FormattedDescription({ text }: { text: string }) {
  const blocks = parseDescription(text);

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <h3
              key={i}
              className="font-[family-name:var(--font-display)] font-bold text-sm sm:text-base text-[#171136] tracking-wide"
            >
              {block.text}
            </h3>
          );
        }
        if (block.type === "bullets") {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1.5">
              {block.items.map((item, j) => (
                <li key={j} className="text-xs sm:text-sm text-[#3B3468] leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-xs sm:text-sm text-[#3B3468] leading-relaxed">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "shipping">("description");

  return (
    <div className="mt-10 sm:mt-14">
      {/* ------------------------------------------------------------- */}
      {/* Tab Header Controls */}
      {/* ------------------------------------------------------------- */}
      <div className="flex border-b border-[#EAE3F7] gap-4 sm:gap-8 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab("description")}
          className={`pb-3.5 font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-base transition-all relative cursor-pointer ${
            activeTab === "description" ? "text-[#171136]" : "text-[#736E9B] hover:text-[#171136]"
          }`}
        >
          Description
          {activeTab === "description" && (
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF4D6D] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("shipping")}
          className={`pb-3.5 font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-base transition-all relative cursor-pointer ${
            activeTab === "shipping" ? "text-[#171136]" : "text-[#736E9B] hover:text-[#171136]"
          }`}
        >
          Shipping & Returns
          {activeTab === "shipping" && (
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF4D6D] rounded-full" />
          )}
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: DESCRIPTION */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "description" && (
        <div className="pt-6 sm:pt-8 space-y-6 animate-in fade-in">
          <div>
            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-xl sm:text-2xl text-[#171136] tracking-tight mb-3">
              About this product
            </h2>
            <div className="max-w-4xl font-normal">
              <FormattedDescription
                text={
                  product.description ||
                  `${product.name} is crafted with precision and premium quality materials. Each piece is thoroughly inspected to ensure top-notch finish and durability before delivery.`
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: SHIPPING & RETURNS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "shipping" && (
        <div className="pt-6 sm:pt-8 animate-in fade-in space-y-4 max-w-3xl text-xs sm:text-sm text-[#3B3468]">
          <h2 className="font-[family-name:var(--font-display)] font-extrabold text-xl text-[#171136]">
            Shipping & Return Guarantee
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#FFF6EE] border border-[#FFE3CC]">
              <h3 className="font-bold text-sm text-[#171136] mb-1">🚀 Fast 48-Hour Dispatch</h3>
              <p className="text-xs text-[#736E9B]">
                All in-stock collector items ship within 48 hours with signature on delivery and custom bubble corner protection.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFF6EE] border border-[#FFE3CC]">
              <h3 className="font-bold text-sm text-[#171136] mb-1">🛡️ 7-Day Collector Guarantee</h3>
              <p className="text-xs text-[#736E9B]">
                Unopened mint condition box returns accepted within 7 days. Full refunds or replacements guaranteed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
