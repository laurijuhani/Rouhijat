/* eslint-disable @typescript-eslint/no-explicit-any */
import parse, { domToReact, DOMNode } from 'html-react-parser';
import Image from 'next/image';

const RenderPost = ({ content }: { content: string }) => {
  const backendUrl = process.env.PRIVATE_BACKEND_URL || '';

  const recursiveReplace = (domNode: DOMNode, parentAlign?: string) => {
    if (
      domNode.type === 'tag' &&
      'name' in domNode &&
      domNode.name === 'img' &&
      domNode.attribs?.src
    ) {
      let alignClass = 'inline-block';
      if (parentAlign === 'center') alignClass = 'mx-auto inline-block';
      else if (parentAlign === 'right') alignClass = 'ml-auto inline-block';
      else if (parentAlign === 'left') alignClass = 'mr-auto inline-block';

      const src = backendUrl + domNode.attribs.src;
      return (
          <Image
            src={src}
            alt={domNode.attribs.alt || ''}
            width={domNode.attribs.width ? Number(domNode.attribs.width) : 200}
            height={domNode.attribs.height ? Number(domNode.attribs.height) : 200}
            className={alignClass}
          />
      );
    }

    if (
      domNode.type === 'tag' &&
      'name' in domNode &&
      domNode.name === 'p'
    ) {
      let alignClass = '';
      let alignValue = '';
      const style = domNode.attribs?.style || '';
      if (style.includes('text-align: center')) {
        alignClass = 'text-center';
        alignValue = 'center';
      } else if (style.includes('text-align: right')) {
        alignClass = 'text-right';
        alignValue = 'right';
      } else if (style.includes('text-align: left')) {
        alignClass = 'text-left';
        alignValue = 'left';
      }
      
      return (
        <p className={`text-xs md:text-sm font-normal mb-8 ${alignClass}`}>
          {domToReact((domNode as any).children as any[], { replace: (node) => recursiveReplace(node, alignValue) })}
        </p>
      );
    }

    if (
      domNode.type === 'tag' &&
      'name' in domNode &&
      (domNode.name === 'span' || domNode.name === 'div')
    ) {
      return (
        <span className={domNode.attribs?.class || ''}>
          {domToReact((domNode as any).children as any[], { replace: (node) => recursiveReplace(node, parentAlign) })}
        </span>
      );
    }
  };
  return (
    <div>
      {parse(content, { replace: (node) => recursiveReplace(node) })}
    </div>
  );
};

export default RenderPost;
