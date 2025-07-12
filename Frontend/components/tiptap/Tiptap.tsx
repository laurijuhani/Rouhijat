'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import ResizableImage from './ResizableImage';
import MenuBar from './MenuBar';
import { Button } from '../ui/button';

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-4',
          },
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      ResizableImage,
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[100px] border rounded-md bg-primary py-2 px-3'
      }
    }
  }); 

  const handleSubmit = () => {
    if (editor) {
      const content = editor.getHTML();
      console.log('Submitted content:\n', content);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        editor.chain().focus().insertContent({
        type: 'resizableImage',
        attrs: { src: imageUrl, width: '300px', height: 'auto' },
      }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <MenuBar editor={editor} /> 
      <EditorContent editor={editor} />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mt-2"
      />
      <Button 
        className='mt-2 text-text-primary'
        onClick={handleSubmit}
      >
        Lähetä
      </Button>
    </div>
  );
};

export default Tiptap;