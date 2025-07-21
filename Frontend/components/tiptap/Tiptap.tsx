'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { ResizableImage } from 'tiptap-extension-resizable-image';
import MenuBar from './MenuBar';
import { Button } from '../ui/button';
import 'tiptap-extension-resizable-image/styles.css';
import ImageInsert from './ImageInsert';
import Fetch from "@/utils/fetch";
import Cookies from "js-cookie";
import { useToast } from "@/context/ToastContext";
import { useState } from 'react';
import TitleInput from './TitleInput';

const Tiptap = () => {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');

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
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[100px] border rounded-md bg-primary py-2 px-3'
      }
    }
  }); 

  const handleSubmit = async () => {
    if (!editor) return;

    try {
      const content = editor.getHTML();    
      const response = await Fetch.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/history-posts`,
        { content, title },
        {
          Authorization: `Bearer ${Cookies.get('token')}`,
        }
      ); 

      const data = await response.json;
      console.log(data);
      
      // store the data in the blogs list
      
      editor.commands.clearContent();
      setTitle(''); 
      showToast('success', 'Postaus lisätty onnistuneesti', '');
    } catch (error) {
      showToast('error', 'Postauksen lähetys epäonnistui', 'Yritä uudelleen');
      console.error('Error submitting content:', error);
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
        onClick={handleSubmit}
      >
        Lähetä
      </Button>
    </div>
  );
};

export default Tiptap;