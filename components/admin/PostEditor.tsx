"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Node, mergeAttributes } from "@tiptap/core";
import { useEffect, useCallback, useRef, useState } from "react";

// ─── Custom Video Node extension ─────────────────────────────────────────────

const VideoNode = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "video[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(HTMLAttributes, {
        controls: "controls",
        playsinline: "playsinline",
        class: "max-w-full rounded-lg my-6 w-full",
      }),
    ];
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  value: string;
  onChange: (html: string) => void;
};

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-2.5 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${
        active
          ? "bg-white text-neutral-900"
          : "text-neutral-300 hover:bg-neutral-700 hover:text-white"
      } disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

// ─── SVG icons ────────────────────────────────────────────────────────────────

function IconImage() {
  return (
    <svg className="w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function IconVideo() {
  return (
    <svg className="w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

// ─── Editor component ─────────────────────────────────────────────────────────

export default function PostEditor({ value, onChange }: Props) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "underline text-blue-400" },
      }),
      Image.configure({
        HTMLAttributes: { class: "max-w-full rounded-lg my-4" },
      }),
      VideoNode,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[360px] px-4 py-3 text-sm text-white focus:outline-none prose prose-invert max-w-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Sync external value on first mount only
  useEffect(() => {
    if (editor && value && editor.isEmpty) {
      editor.commands.setContent(value);
    }
  }, [editor]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Link ──────────────────────────────────────────────────────────────────

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  // ── Image upload ──────────────────────────────────────────────────────────

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor) return;
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        alert(data.error ?? "Image upload failed");
        return;
      }

      const { url } = (await res.json()) as { url: string };
      editor.chain().focus().setImage({ src: url }).run();
    },
    [editor]
  );

  const onImageFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleImageUpload(file);
      e.target.value = "";
    },
    [handleImageUpload]
  );

  // ── Video upload ──────────────────────────────────────────────────────────

  const handleVideoUpload = useCallback(
    async (file: File) => {
      if (!editor) return;
      setUploadingVideo(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      setUploadingVideo(false);

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        alert(data.error ?? "Video upload failed");
        return;
      }

      const { url } = (await res.json()) as { url: string };

      // Insert custom video node
      editor
        .chain()
        .focus()
        .insertContent({ type: "video", attrs: { src: url } })
        .run();
    },
    [editor]
  );

  const onVideoFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleVideoUpload(file);
      e.target.value = "";
    },
    [handleVideoUpload]
  );

  // ── Paste image from clipboard ────────────────────────────────────────────

  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = Array.from(e.clipboardData.items);
      const imageItem = items.find((item) => item.type.startsWith("image/"));
      if (!imageItem) return;
      const file = imageItem.getAsFile();
      if (file) {
        e.preventDefault();
        handleImageUpload(file);
      }
    },
    [handleImageUpload]
  );

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-neutral-700 bg-neutral-800 overflow-hidden focus-within:ring-2 focus-within:ring-white/20">

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        className="hidden"
        onChange={onImageFileChange}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm"
        className="hidden"
        onChange={onVideoFileChange}
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-neutral-700 bg-neutral-900">

        {/* Text formatting */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")} title="Bold">
          <strong>B</strong>
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")} title="Italic">
          <em>I</em>
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")} title="Strikethrough">
          <s>S</s>
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")} title="Inline code">
          {"<>"}
        </ToolbarButton>

        <span className="w-px h-5 bg-neutral-700 mx-1" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })} title="Heading 2">
          H2
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })} title="Heading 3">
          H3
        </ToolbarButton>

        <span className="w-px h-5 bg-neutral-700 mx-1" />

        {/* Lists & blocks */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")} title="Bullet list">
          • List
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")} title="Numbered list">
          1. List
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")} title="Blockquote">
          ❝
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")} title="Code block">
          {"{ }"}
        </ToolbarButton>

        <span className="w-px h-5 bg-neutral-700 mx-1" />

        {/* Link */}
        <ToolbarButton onClick={setLink} active={editor.isActive("link")} title="Link">
          Link
        </ToolbarButton>

        {/* Image upload */}
        <ToolbarButton
          onClick={() => imageInputRef.current?.click()}
          title="Insert image (or paste from clipboard)"
        >
          <span className="flex items-center gap-1">
            <IconImage />
            <span>Image</span>
          </span>
        </ToolbarButton>

        {/* Video upload */}
        <ToolbarButton
          onClick={() => !uploadingVideo && videoInputRef.current?.click()}
          disabled={uploadingVideo}
          title="Insert MP4 video (max 20 MB)"
        >
          <span className="flex items-center gap-1">
            <IconVideo />
            <span>{uploadingVideo ? "Uploading…" : "Video"}</span>
          </span>
        </ToolbarButton>

        <span className="w-px h-5 bg-neutral-700 mx-1" />

        {/* Undo / Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()} title="Undo">
          ↩
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()} title="Redo">
          ↪
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <div onPaste={onPaste}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
