'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { ResizableImage } from 'tiptap-extension-resizable-image';
import MenuBar from './MenuBar';
import { Button } from '../ui/button';
import 'tiptap-extension-resizable-image/styles.css';
import ImageInsert from './ImageInsert';
import { useState } from 'react';
import TitleInput from './TitleInput';

interface TiptapProps {
  handleSubmit: (content: string, title: string) => Promise<boolean>;
  content?: string;
  titleInput?: string;
}

const Tiptap = ({ handleSubmit, content, titleInput }: TiptapProps) => {
  const [title, setTitle] = useState(titleInput || '');

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
      ResizableImage.configure({
        defaultWidth: 200,
      }),
    ],
    content: content || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[100px] border rounded-md bg-primary py-2 px-3'
      }
    }
  }); 

  const handleSend = async () => {
    if (!editor) return;
    const content = editor.getHTML();
    const isSuccess = await handleSubmit(content, title);

    if (isSuccess) {
      editor.commands.clearContent();
      setTitle('');
      // TODO: reset the image component
    }
  }; 


  return (
    <div>
      <TitleInput title={title} setTitle={setTitle} />
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className='mb-5' />
      <ImageInsert editor={editor} />
      
      <Button 
        className='mt-5 text-text-primary'
        onClick={handleSend}
      >
        Lähetä
      </Button>
    </div>
  );
};

export default Tiptap;