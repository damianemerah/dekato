'use client';

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Focus from '@tiptap/extension-focus';
import Typography from '@tiptap/extension-typography';
import { uploadFiles } from '@/app/lib/s3Func';
import { SmallSpinner } from './spinner';
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List as ListIcon,
  ListOrdered as ListOrderedIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
  Quote,
  Code,
  Plus,
  Type,
  Minus,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Upload, Button, Dropdown, ColorPicker } from 'antd';

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      display: {
        default: 'inline',
        rendered: false,
      },
    };
  },
});

const Tiptap = ({ value, onChange, preview = false }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        dropcursor: false,
      }),
      TextStyle,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      CustomImage.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800',
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return "What's the title?";
          }
          return 'Tell your story...';
        },
      }),
      Focus.configure({
        className: 'has-focus',
        mode: 'all',
      }),
      Typography,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !preview,
    editorProps: {
      attributes: {
        class:
          'prose max-w-none min-h-[120px] focus:outline-none' +
          ' prose-headings:font-bold prose-headings:text-gray-800' +
          ' prose-p:text-base prose-p:text-gray-600 prose-p:leading-normal' +
          ' prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700' +
          ' prose-strong:font-bold prose-strong:text-gray-800' +
          ' prose-ul:list-disc prose-ol:list-decimal' +
          ' prose-li:text-gray-600 prose-li:my-0' +
          ' prose-li:p:my-0' +
          ' prose-img:rounded-lg prose-img:shadow-md max-w-full' +
          ' prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic' +
          ' prose-hr:border-gray-200' +
          ' prose-pre:bg-gray-50 prose-pre:rounded prose-pre:p-4' +
          ' [&>*]:my-2' +
          ' forced-colors-mode:prose-img:border forced-colors-mode:prose-img:border-solid',
      },
    },
    enableCoreExtensions: true,
    enableInputRules: true,
    enablePasteRules: true,
    editable: true,
    injectCSS: true,
    immediatelyRender: false,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  const setLink = useCallback(() => {
    if (!editor) return;

    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const url = window.prompt('URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const handleImageUpload = useCallback(
    async (file) => {
      if (!editor) return;
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const [imageUrl] = await uploadFiles(formData, 'blog-images');

        if (imageUrl) {
          editor
            .chain()
            .focus()
            .setImage({
              src: imageUrl,
              display: 'block',
            })
            .run();
        }
      } catch (error) {
        console.error('Failed to upload image:', error);
      } finally {
        setIsUploading(false);
      }
    },
    [editor]
  );

  const defaultColors = ['#000000', '#666666', '#ff0000', '#0000ff', '#00ff00'];

  if (!editor || !isMounted || preview) {
    return (
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: value }} />
      </div>
    );
  }

  return (
    <div className="relative border border-gray-300 p-2">
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          shouldShow={({ editor }) => {
            return !editor.isActive('image') && !editor.state.selection.empty;
          }}
        >
          <div className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 shadow-lg">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`rounded p-1 hover:bg-gray-100 ${
                editor.isActive('bold') ? 'bg-gray-200' : ''
              }`}
              type="button"
              aria-label="Bold"
            >
              <Bold size={14} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`rounded p-1 hover:bg-gray-100 ${
                editor.isActive('italic') ? 'bg-gray-200' : ''
              }`}
              type="button"
              aria-label="Italic"
            >
              <Italic size={14} />
            </button>
            <button
              onClick={setLink}
              className={`rounded p-1 hover:bg-gray-100 ${
                editor.isActive('link') ? 'bg-gray-200' : ''
              }`}
              type="button"
              aria-label={editor.isActive('link') ? 'Remove link' : 'Add link'}
            >
              {editor.isActive('link') ? (
                <Unlink size={14} />
              ) : (
                <LinkIcon size={14} />
              )}
            </button>
            <div className="mx-1 h-4 w-px bg-gray-200" />
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`rounded p-1 hover:bg-gray-100 ${
                editor.isActive('bulletList') ? 'bg-gray-200' : ''
              }`}
              type="button"
              aria-label="Bullet list"
            >
              <ListIcon size={14} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`rounded p-1 hover:bg-gray-100 ${
                editor.isActive('orderedList') ? 'bg-gray-200' : ''
              }`}
              type="button"
              aria-label="Numbered list"
            >
              <ListOrderedIcon size={14} />
            </button>
            <div className="mx-1 h-4 w-px bg-gray-200" />
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`rounded p-1 hover:bg-gray-100 ${
                editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
              }`}
              type="button"
              aria-label="Align left"
            >
              <AlignLeft size={14} />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign('center').run()
              }
              className={`rounded p-1 hover:bg-gray-100 ${
                editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
              }`}
              type="button"
              aria-label="Align center"
            >
              <AlignCenter size={14} />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`rounded p-1 hover:bg-gray-100 ${
                editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
              }`}
              type="button"
              aria-label="Align right"
            >
              <AlignRight size={14} />
            </button>
          </div>
        </BubbleMenu>
      )}

      {!preview && (
        <div className="sticky top-0 z-10 mb-2 flex flex-wrap items-center gap-2 border-b bg-white p-2">
          <Dropdown
            menu={{
              items: [
                {
                  key: 'p',
                  label: 'Normal',
                  onClick: () => editor.chain().focus().setParagraph().run(),
                },
                {
                  key: 'h1',
                  label: 'Heading 1',
                  onClick: () =>
                    editor.chain().focus().setHeading({ level: 1 }).run(),
                },
                {
                  key: 'h2',
                  label: 'Heading 2',
                  onClick: () =>
                    editor.chain().focus().setHeading({ level: 2 }).run(),
                },
              ],
            }}
          >
            <Button icon={<Type size={16} />}>Style</Button>
          </Dropdown>

          <div className="h-6 w-px bg-gray-200" />

          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`rounded p-2 hover:bg-gray-100 ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
            }`}
            type="button"
            aria-label="Align left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`rounded p-2 hover:bg-gray-100 ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
            }`}
            type="button"
            aria-label="Align center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`rounded p-2 hover:bg-gray-100 ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
            }`}
            type="button"
            aria-label="Align right"
          >
            <AlignRight size={16} />
          </button>

          <div className="h-6 w-px bg-gray-200" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`rounded p-2 hover:bg-gray-100 ${
              editor.isActive('bulletList') ? 'bg-gray-200' : ''
            }`}
            type="button"
            aria-label="Bullet list"
          >
            <ListIcon size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`rounded p-2 hover:bg-gray-100 ${
              editor.isActive('orderedList') ? 'bg-gray-200' : ''
            }`}
            type="button"
            aria-label="Numbered list"
          >
            <ListOrderedIcon size={16} />
          </button>

          <div className="h-6 w-px bg-gray-200" />

          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              handleImageUpload(file);
              return false;
            }}
            accept="image/*"
          >
            <Button
              icon={isUploading ? <SmallSpinner /> : <ImageIcon size={16} />}
              disabled={isUploading}
            >
              Image
            </Button>
          </Upload>

          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`rounded p-2 hover:bg-gray-100 ${
              editor.isActive('blockquote') ? 'bg-gray-200' : ''
            }`}
            type="button"
            aria-label="Quote"
          >
            <Quote size={16} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`rounded p-2 hover:bg-gray-100 ${
              editor.isActive('codeBlock') ? 'bg-gray-200' : ''
            }`}
            type="button"
            aria-label="Code block"
          >
            <Code size={16} />
          </button>

          <div className="h-6 w-px bg-gray-200" />

          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="rounded p-2 hover:bg-gray-100"
            type="button"
            aria-label="Add horizontal line"
          >
            <Minus size={16} />
          </button>
          <div className="h-6 w-px bg-gray-200" />

          <ColorPicker
            presets={[
              {
                label: 'Default Colors',
                colors: defaultColors,
              },
            ]}
            onChange={(color) => {
              editor.chain().focus().setColor(color.toHexString()).run();
            }}
            defaultValue={editor.getAttributes('textStyle').color || '#000000'}
          />

          <div className="h-6 w-px bg-gray-200" />

          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={`rounded p-2 hover:bg-gray-100 ${
              !editor.can().undo() ? 'opacity-50' : ''
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
              !editor.can().redo() ? 'opacity-50' : ''
            }`}
            type="button"
            aria-label="Redo"
          >
            <Redo size={16} />
          </button>
        </div>
      )}

      <div className="group relative">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Tiptap;
