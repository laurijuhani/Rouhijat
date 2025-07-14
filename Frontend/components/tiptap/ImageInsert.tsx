'use client';

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import {
  formatBytes,
  useFileUpload,
} from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { FileWithPreview } from "@/hooks/use-file-upload";


export interface ImageFileWithPreview extends FileWithPreview {
  actualSrc?: string; 
}

const ImageInsert = ({ editor }: { editor: Editor | null}) => {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB default
  const maxFiles = 6;

  
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
    maxSize,
    multiple: true,
    maxFiles,
  });
  
  
  const prevFiles = useRef<string[]>([]);
  
  useEffect(() => {
    if (!editor) return;
    const newFiles = files.filter(file => !prevFiles.current.includes(file.id));
    newFiles.forEach(file => {
      if (file.file instanceof File) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result as string;
          editor.commands.setResizableImage({
            src: imageUrl,
            alt: file.file.name,
            width: 200,
          });
          (file as ImageFileWithPreview).actualSrc = imageUrl; 
        };
        reader.readAsDataURL(file.file);
      }
    });
    prevFiles.current = files.map(file => file.id);
  }, [files, editor]);
  
  if (!editor) return null; 

  const deleteImageFromEditor = (src: string | undefined) => {
    if (!editor || !src) return;
    editor.state.doc.descendants((node, pos) => {      
      if (
        node.type.name === "imageComponent" &&
        node.attrs.src === src
      ) {        
        editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run();
      }
    }); 
  };


  return (
    <div className="flex flex-col gap-2">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
        />
        <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
          <div
            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <ImageIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Tiputa kuvat tähän</p>
          <p className="text-muted-foreground text-xs">
            SVG, PNG, JPG tai GIF (max. {maxSizeMB}MB)
          </p>
          <Button variant="outline" className="mt-4" onClick={openFileDialog}>
            <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
            Valitse kuvat
          </Button>
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-accent aspect-square shrink-0 rounded">
                  {/*eslint-disable-next-line @next/next/no-img-element*/ }
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="size-10 rounded-[inherit] object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="truncate text-[13px] font-medium">
                    {file.file.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatBytes(file.file.size)}
                  </p>
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                onClick={() => {
                  removeFile(file.id);
                  deleteImageFromEditor((file as ImageFileWithPreview).actualSrc);
                }}
                aria-label="Remove file"
              >
                <XIcon aria-hidden="true" />
              </Button>
            </div>
          ))}

          {files.length > 1 && (
            <div>
              <Button size="sm" variant="outline" onClick={clearFiles}>
                Poista kaikki
              </Button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ImageInsert;
