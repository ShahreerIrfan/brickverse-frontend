"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

function ToolbarButton({
  active,
  disabled,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`min-w-[30px] h-[30px] px-1.5 rounded-lg flex items-center justify-center text-xs font-bold transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? "bg-[#FF4D6D] text-white" : "bg-transparent text-[#3B3468] hover:bg-[#F0EBF8]"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  name,
  initialValue,
  placeholder,
}: {
  name: string;
  initialValue?: string;
  placeholder?: string;
}) {
  const [html, setHtml] = useState(initialValue || "");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Write a detailed product description...",
      }),
    ],
    content: initialValue || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[140px] px-4 py-3 text-xs text-[#171136] focus:outline-none [&_h2]:font-[family-name:var(--font-display)] [&_h2]:font-extrabold [&_h2]:text-base [&_h2]:mt-3 [&_h2]:mb-1 [&_h3]:font-[family-name:var(--font-display)] [&_h3]:font-bold [&_h3]:text-sm [&_h3]:mt-2.5 [&_h3]:mb-1 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_li]:mb-0.5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#FF4D6D] [&_blockquote]:pl-3 [&_blockquote]:text-[#736E9B] [&_blockquote]:italic",
      },
    },
  });

  return (
    <div className="rounded-2xl border border-[#EAE3F7] bg-[#FAF8FD] focus-within:border-[#FF4D6D] focus-within:bg-white transition-all overflow-hidden">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-[#EAE3F7] bg-white/70 flex-wrap">
        <ToolbarButton
          label="Bold"
          active={editor?.isActive("bold")}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <span className="font-black">B</span>
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor?.isActive("italic")}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <span className="italic">I</span>
        </ToolbarButton>
        <span className="w-px h-5 bg-[#EAE3F7] mx-1" />
        <ToolbarButton
          label="Section heading"
          active={editor?.isActive("heading", { level: 3 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          label="Big heading"
          active={editor?.isActive("heading", { level: 2 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <span className="w-px h-5 bg-[#EAE3F7] mx-1" />
        <ToolbarButton
          label="Bullet list"
          active={editor?.isActive("bulletList")}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          •≡
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor?.isActive("orderedList")}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>
        <ToolbarButton
          label="Quote"
          active={editor?.isActive("blockquote")}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          &ldquo;&rdquo;
        </ToolbarButton>
        <span className="w-px h-5 bg-[#EAE3F7] mx-1" />
        <ToolbarButton
          label="Undo"
          disabled={!editor?.can().undo()}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          ↺
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          disabled={!editor?.can().redo()}
          onClick={() => editor?.chain().focus().redo().run()}
        >
          ↻
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
