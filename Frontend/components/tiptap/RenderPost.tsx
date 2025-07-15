/* eslint-disable @typescript-eslint/no-explicit-any */
import parse, { domToReact, DOMNode } from 'html-react-parser';
import Image from 'next/image';

const RenderPost = ({ content }: { content: string }) => {
  const backendUrl = process.env.PRIVATE_BACKEND_URL || '';

  // The recursive replace function

  const recursiveReplace = (domNode: DOMNode) => {
    if (
      domNode.type === 'tag' &&
      'name' in domNode &&
      domNode.name === 'img' &&
      domNode.attribs?.src
    ) {
      const src = backendUrl + domNode.attribs.src;
      return (
        <Image
          src={src}
          alt={domNode.attribs.alt || ''}
          width={domNode.attribs.width ? Number(domNode.attribs.width) : 200}
          height={domNode.attribs.height ? Number(domNode.attribs.height) : 200}
          className=''
        />
      );
    }

    if (
      domNode.type === 'tag' &&
      'name' in domNode &&
      domNode.name === 'p'
    ) {
      return (
        <p className='text-xs md:text-sm font-normal mb-8'>
          {domToReact((domNode as any).children as any[], { replace: recursiveReplace })}
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
          {domToReact((domNode as any).children as any[], { replace: recursiveReplace })}
        </span>
      );
    }
  };
  return (
    <div>
      {parse(content, { replace: recursiveReplace })}
    </div>
  );
};

export default RenderPost;
