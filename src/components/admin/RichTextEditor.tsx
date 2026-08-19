'use client';

import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';

/* ── Extended Image with alignment attribute ─────────────────────────────── */

const AlignableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'full',
        parseHTML: (el) => el.getAttribute('data-align') || 'full',
        renderHTML: ({ align }) => {
          const styles: Record<string, string> = {
            full:   'display:block;max-width:100%;border-radius:8px;margin:1.25rem 0',
            center: 'display:block;max-width:80%;border-radius:8px;margin:1.25rem auto',
            left:   'display:block;max-width:55%;border-radius:8px;margin:1.25rem auto 1.25rem 0',
            right:  'display:block;max-width:55%;border-radius:8px;margin:1.25rem 0 1.25rem auto',
          };
          return { style: styles[align as string] ?? styles.full, 'data-align': align };
        },
      },
    };
  },
});

/* ── Component ───────────────────────────────────────────────────────────── */

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
      AlignableImage,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (!initialised.current) { initialised.current = true; return; }
    const current = editor.getHTML();
    if (current !== value) editor.commands.setContent(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const isActive = (name: string, attrs?: Record<string, unknown>) =>
    editor.isActive(name, attrs);

  const btn = (label: string, action: () => void, active = false, title?: string) => (
    <button
      key={label + (title ?? '')}
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
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setImageAlign = (align: string) =>
    editor.chain().focus().updateAttributes('image', { align }).run();

  const imageSelected = isActive('image');
  const currentAlign  = (['full', 'center', 'left', 'right'] as const).find(a =>
    editor.isActive('image', { align: a })
  ) ?? 'full';

  const ALIGN_ICONS: Record<string, string> = {
    full: '↔ Full', left: '← Trái', center: '↕ Giữa', right: '→ Phải',
  };

  return (
    <div className="border border-gray-200 rounded overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
        {/* Text style */}
        {btn('B', () => editor.chain().focus().toggleBold().run(),     isActive('bold'),      'Bold')}
        {btn('I', () => editor.chain().focus().toggleItalic().run(),   isActive('italic'),    'Italic')}
        {btn('U', () => editor.chain().focus().toggleUnderline().run(),isActive('underline'), 'Underline')}

        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        {/* Headings */}
        {btn('H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive('heading', { level: 2 }), 'Heading 2')}
        {btn('H3', () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive('heading', { level: 3 }), 'Heading 3')}
        {btn('¶',  () => editor.chain().focus().setParagraph().run(), isActive('paragraph'), 'Paragraph')}

        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        {/* Text alignment */}
        {btn('≡L', () => editor.chain().focus().setTextAlign('left').run(),    editor.isActive({ textAlign: 'left' }),    'Căn trái')}
        {btn('≡C', () => editor.chain().focus().setTextAlign('center').run(),  editor.isActive({ textAlign: 'center' }),  'Căn giữa')}
        {btn('≡R', () => editor.chain().focus().setTextAlign('right').run(),   editor.isActive({ textAlign: 'right' }),   'Căn phải')}
        {btn('≡J', () => editor.chain().focus().setTextAlign('justify').run(), editor.isActive({ textAlign: 'justify' }), 'Căn đều')}

        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        {/* Lists */}
        {btn('•',  () => editor.chain().focus().toggleBulletList().run(),  isActive('bulletList'),  'Danh sách')}
        {btn('1.', () => editor.chain().focus().toggleOrderedList().run(), isActive('orderedList'), 'Danh sách số')}

        <span className="w-px bg-gray-200 mx-1 self-stretch" />

        {/* Image */}
        <button type="button" title="Chèn ảnh" onClick={handleInsertImage} className={TB_BTN}>
          📷
        </button>

        {/* Image alignment — only shown when image is selected */}
        {imageSelected && (
          <>
            <span className="w-px bg-gray-200 mx-1 self-stretch" />
            <span className="text-[10px] text-gray-400 self-center px-1 font-semibold uppercase tracking-wider">Ảnh:</span>
            {(['full', 'left', 'center', 'right'] as const).map(align =>
              btn(
                ALIGN_ICONS[align],
                () => setImageAlign(align),
                currentAlign === align,
                `Ảnh ${ALIGN_ICONS[align]}`
              )
            )}
          </>
        )}

        <span className="w-px bg-gray-200 mx-1 self-stretch" />
        {btn('—', () => editor.chain().focus().setHorizontalRule().run(), false, 'Đường kẻ ngang')}
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="min-h-[300px] p-3 text-sm leading-relaxed focus-within:outline-none
          [&_.ProseMirror]:min-h-[280px] [&_.ProseMirror]:outline-none
          [&_.ProseMirror_p]:mb-3
          [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mb-2
          [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mb-2
          [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ml-5
          [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ml-5
          [&_.ProseMirror_hr]:border-gray-300 [&_.ProseMirror_hr]:my-4
          [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded-lg [&_.ProseMirror_img]:cursor-pointer
          [&_.ProseMirror_img.ProseMirror-selectednode]:outline [&_.ProseMirror_img.ProseMirror-selectednode]:outline-2 [&_.ProseMirror_img.ProseMirror-selectednode]:outline-sage"
      />
    </div>
  );
}
