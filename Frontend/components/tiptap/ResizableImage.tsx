import { Node, mergeAttributes } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { useState } from 'react';

const ResizableImage = Node.create({
  name: 'resizableImage',
  group: 'block',
  inline: false,
  draggable: false,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: '300px' },
      height: { default: 'auto' },
    };
  },

  parseHTML() {
    return [{ tag: 'img[src]', }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(({ node, updateAttributes }) => {
      const [width, setWidth] = useState(node.attrs.width);

      const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = parseInt(width, 10);

        const onMouseMove = (moveEvent: MouseEvent) => {
          const newWidth = startWidth + (moveEvent.clientX - startX);
          setWidth(`${newWidth}px`);
          updateAttributes({ width: `${newWidth}px` });
        };

        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };

      return (
        <NodeViewWrapper className="resizable-image-wrapper" style={{ display: 'inline-block', position: 'relative' }}>
          <img
            src={node.attrs.src}
            style={{ width, height: node.attrs.height, display: 'block' }}
            alt=""
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: '10px',
              height: '100%',
              cursor: 'ew-resize',
              background: 'rgba(0,0,0,0.1)',
            }}
            onMouseDown={handleResize}
          />
        </NodeViewWrapper>
      );
    });
  },
});

export default ResizableImage;