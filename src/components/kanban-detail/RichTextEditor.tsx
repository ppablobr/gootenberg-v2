import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon,
  Undo, 
  Redo 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const toggleHeading = (level: 1 | 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-50 p-2 border-b flex flex-wrap items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-200' : ''}
          title="Bold"
        >
          <Bold size={16} />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-200' : ''}
          title="Italic"
        >
          <Italic size={16} />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toggleHeading(1)}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toggleHeading(2)}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toggleHeading(3)}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
          title="Bullet List"
        >
          <List size={16} />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
          title="Quote"
        >
          <Quote size={16} />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = window.prompt('URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={editor.isActive('link') ? 'bg-gray-200' : ''}
          title="Link"
        >
          <LinkIcon size={16} />
        </Button>
        
        <div className="flex-grow"></div>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo size={16} />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo size={16} />
        </Button>
      </div>
      
      <EditorContent 
        editor={editor} 
        className="p-3 min-h-32 prose prose-sm max-w-none focus:outline-none"
      />
    </div>
  );
};

export default RichTextEditor;
