"use client";

import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";

type RichTextEditorProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

type ToolbarButtonProps = {
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
};

function ToolbarButton({ label, onClick, isActive, disabled }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md border px-2.5 py-1 text-xs transition ${
        isActive
          ? "border-white bg-white text-black"
          : "border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-neutral-500"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {label}
    </button>
  );
}

export default function RichTextEditor({ id, value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        id,
        class:
          "min-h-[240px] rounded-b-lg border border-t-0 border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white outline-none focus:border-neutral-400",
      },
    },
  });

  return (
    <div>
      <div className="flex flex-wrap gap-2 rounded-t-lg border border-neutral-700 bg-neutral-950/80 p-2">
        <ToolbarButton label="Bold" onClick={() => editor?.chain().focus().toggleBold().run()} isActive={editor?.isActive("bold")} />
        <ToolbarButton label="Italic" onClick={() => editor?.chain().focus().toggleItalic().run()} isActive={editor?.isActive("italic")} />
        <ToolbarButton label="H2" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor?.isActive("heading", { level: 2 })} />
        <ToolbarButton label="H3" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor?.isActive("heading", { level: 3 })} />
        <ToolbarButton label="• List" onClick={() => editor?.chain().focus().toggleBulletList().run()} isActive={editor?.isActive("bulletList")} />
        <ToolbarButton label="1. List" onClick={() => editor?.chain().focus().toggleOrderedList().run()} isActive={editor?.isActive("orderedList")} />
        <ToolbarButton label="Quote" onClick={() => editor?.chain().focus().toggleBlockquote().run()} isActive={editor?.isActive("blockquote")} />
        <ToolbarButton
          label="Link"
          onClick={() => {
            if (!editor) return;
            const previousUrl = editor.getAttributes("link").href as string | undefined;
            const url = window.prompt("Enter URL", previousUrl ?? "https://");
            if (url === null) return;
            if (url.trim() === "") {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
          }}
          isActive={editor?.isActive("link")}
        />
        <ToolbarButton label="Undo" onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().chain().focus().undo().run()} />
        <ToolbarButton label="Redo" onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().chain().focus().redo().run()} />
      </div>

      <EditorContent editor={editor} />
      <input type="hidden" name={`${id}-required`} value={editor?.isEmpty ? "" : "ok"} required />
    </div>
  );
}
