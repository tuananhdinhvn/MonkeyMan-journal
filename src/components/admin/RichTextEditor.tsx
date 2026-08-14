'use client';

import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';

interface Props {
  value: string;
  onChange: (html: string) => void;
  onImageUpload: () => Promise<string | null>;
}

const TB_BTN =
  'px-2 py-1 text-sm rounded border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
const TB_ACTIVE = 'bg-gray-800 text-white border-gray-800 hover:bg-gray-700';

export default function RichTextEditor({ value, onChange, onImageUpload }: Props) {
  const initialised = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes (e.g. switching language tabs) only on first mount
  useEffect(() => {
    if (!editor) return;
    if (!initialised.current) {
      initialised.current = true;
      return;
    }
    // When value changes externally (tab switch), update the editor content
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const isActive = (name: string, attrs?: Record<string, unknown>) =>
    editor.isActive(name, attrs);

  const btn = (
    label: string,
    action: () => void,
    active = false,
    title?: string
  ) => (
    <button
      type="button"
      title={title ?? label}
      onClick={action}
      className={`${TB_BTN} ${active ? TB_ACTIVE : ''}`}
    >
      {label}
    </button>
  );

  const handleInsertImage = async () => {
    const url = await onImageUpload();
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-gray-200 rounded overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
        {/* Text style */}
        {btn('B', () => editor.chain().focus().toggleBold().run(), isActive('bold'), 'Bold')}
        {btn('I', () => editor.chain().focus().toggleItalic().run(), isActive('italic'), 'Italic')}
        {btn('U', () => editor.chain().focus().toggleUnderline().run(), isActive('underline'), 'Underline')}

        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        {/* Headings */}
        {btn('H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive('heading', { level: 2 }), 'Heading 2')}
        {btn('H3', () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive('heading', { level: 3 }), 'Heading 3')}
        {btn('¶', () => editor.chain().focus().setParagraph().run(), isActive('paragraph'), 'Paragraph')}

        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        {/* Alignment */}
        {btn('Left', () => editor.chain().focus().setTextAlign('left').run(), editor.isActive({ textAlign: 'left' }), 'Align Left')}
        {btn('Center', () => editor.chain().focus().setTextAlign('center').run(), editor.isActive({ textAlign: 'center' }), 'Align Center')}
        {btn('Right', () => editor.chain().focus().setTextAlign('right').run(), editor.isActive({ textAlign: 'right' }), 'Align Right')}
        {btn('Justify', () => editor.chain().focus().setTextAlign('justify').run(), editor.isActive({ textAlign: 'justify' }), 'Justify')}

        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        {/* Lists */}
        {btn('•', () => editor.chain().focus().toggleBulletList().run(), isActive('bulletList'), 'Bullet List')}
        {btn('1.', () => editor.chain().focus().toggleOrderedList().run(), isActive('orderedList'), 'Ordered List')}

        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        {/* Image */}
        <button
          type="button"
          title="Insert Image"
          onClick={handleInsertImage}
          className={TB_BTN}
        >
          📷
        </button>

        {/* Horizontal rule */}
        {btn('—', () => editor.chain().focus().setHorizontalRule().run(), false, 'Horizontal Rule')}
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="min-h-[300px] p-3 text-sm leading-relaxed focus-within:outline-none [&_.ProseMirror]:min-h-[280px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:mb-3 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ml-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ml-5 [&_.ProseMirror_hr]:border-gray-300 [&_.ProseMirror_hr]:my-4 [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded"
      />
    </div>
  );
}
