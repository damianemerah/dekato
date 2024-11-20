import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
} from "lucide-react";
import { useEffect } from "react";

const Tiptap = ({ value, onChange }) => {
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Underline,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        TextStyle,
        Color,
        BulletList,
        OrderedList,
        ListItem,
        Image,
        Link.configure({
          openOnClick: false,
        }),
      ],
      content: value,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 prose-strong:font-bold prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-700 prose-img:rounded-lg prose-img:shadow-md focus:outline-none",
        },
      },
    },
    [value],
  );

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const url = window.prompt("URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="rounded-md border">
      <div className="flex flex-wrap gap-2 border-b p-2">
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("paragraph") ? "bg-gray-200" : ""
          }`}
          type="button"
        >
          Normal
        </button>
        <button
          onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
          }`}
          type="button"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
          }`}
          type="button"
        >
          H3
        </button>
        <div className="mx-2 w-px bg-gray-200" />
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
          type="button"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
          type="button"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("underline") ? "bg-gray-200" : ""
          }`}
          type="button"
        >
          <UnderlineIcon size={16} />
        </button>
        <div className="mx-2 w-px bg-gray-200" />
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
          }`}
          type="button"
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
          }`}
          type="button"
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
          }`}
          type="button"
        >
          <AlignRight size={16} />
        </button>
        <div className="mx-2 w-px bg-gray-200" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("bulletList") ? "bg-gray-200" : ""
          }`}
          type="button"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
          type="button"
        >
          <ListOrdered size={16} />
        </button>
        <div className="mx-2 w-px bg-gray-200" />
        <button
          onClick={setLink}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("link") ? "bg-gray-200" : ""
          }`}
          type="button"
        >
          {editor.isActive("link") ? (
            <Unlink size={16} />
          ) : (
            <LinkIcon size={16} />
          )}
        </button>
        <button
          onClick={addImage}
          className="rounded p-2 hover:bg-gray-100"
          type="button"
        >
          <ImageIcon size={16} />
        </button>
        <div className="mx-2 w-px bg-gray-200" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`rounded p-2 hover:bg-gray-100 ${
            !editor.can().undo() ? "opacity-50" : ""
          }`}
          type="button"
          aria-label="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`rounded p-2 hover:bg-gray-100 ${
            !editor.can().redo() ? "opacity-50" : ""
          }`}
          type="button"
          aria-label="Redo"
        >
          <Redo size={16} />
        </button>
      </div>
      <EditorContent editor={editor} className="p-4" />
    </div>
  );
};

export default Tiptap;
