'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ReactMarkdown, { Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { cn } from '@/lib/utils';
import { ReferencesSection } from './references-section';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  references?: string[];
}

const ImageWithCaption = ({
  src: srcProp,
  alt = '',
  caption,
  ...props
}: {
  src?: string | null;
  caption?: string;
  [key: string]: any;
}) => {
  // Convert Blob to string if needed
  const src = typeof srcProp === 'string' ? srcProp : '';
  if (!src) return null;

  // For local images, use Next/Image
  if (src.startsWith('/') || src.startsWith('./')) {
    return (
      <div className="my-6 flex flex-col items-center">
        <Image 
            src={src}
            alt={alt || ''}
            width={320}
            height={240}
            style={{ objectFit: 'contain', position: 'relative' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            className="rounded-lg"
            {...props}
          />
        {caption && (
          <div className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {caption}
          </div>
        )}
      </div>
    );
  }

  // For external images, use regular img tag
  return (
    <div className="my-6">
      <img 
        src={src}
        alt={alt || ''} 
        className="rounded-lg shadow-md w-full h-auto"
        {...props}
      />
      {caption && (
        <div className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {caption}
        </div>
      )}
    </div>
  );
};

export function MarkdownRenderer({ content, className, references = [] }: MarkdownRendererProps) {
  const [processedContent, setProcessedContent] = useState('');
  const [referenceLinks, setReferenceLinks] = useState<{id: string, ref: string}[]>([]);

  useEffect(() => {
    // Only process if we have content and haven't processed it yet
    if (!content || processedContent) return;
    
    // Process content to extract and replace reference links
    let refIndex = 0;
    const refMap = new Map<string, number>();
    
    // First pass: find all reference links and replace them with superscript numbers
    const processed = content.replace(
      /\[\^([^\]]+)\]/g, 
      (match, refId) => {
        // Use consistent numbering - if we've seen this refId before, use the same number
        if (!refMap.has(refId)) {
          refIndex++;
          refMap.set(refId, refIndex);
        }
        const refNum = refMap.get(refId);
        return `<sup id="ref-link-${refNum}" class="reference-link"><a href="#ref-${refNum}" className="no-underline hover:underline">${refNum}</a></sup>`;
      }
    );
    
    // Convert refMap to array for rendering
    const refs = Array.from(refMap.entries()).map(([id, num]) => {
      // If we have a numeric id, and references array exists, use it as an index
      let ref: string;
      if (references && references.length > 0) {
        if (!isNaN(Number(id))) {
          // If id is numeric, use it as a direct index
          const index = Number(id) - 1;
          ref = index >= 0 && index < references.length ? references[index] : `Reference ${id} not found`;
        } else {
          // Otherwise, use the position in the refMap as an index
          const index = num - 1;
          ref = index >= 0 && index < references.length ? references[index] : `Reference ${id} not found`;
        }
      } else {
        ref = `Reference ${id} not found`;
      }
      
      return {
        id: `ref-${num}`,
        ref
      };
    });
    
    setReferenceLinks(refs);
    setProcessedContent(processed || content);
  }, [content, processedContent, references]);
  // Handle images with captions in markdown
  const finalProcessedContent = processedContent.replace(
    /!\[(.*?)\]\((.*?)\)\s*\*\*(.*?)\*\*/g,
    (match, alt, src, caption) => {
      return `![${alt}](${src} "${caption}")`;
    }
  );

  const components: Components = {
    // @ts-ignore - We need to ignore the type error here
    p: (paragraph: { node?: any; children?: any }) => {
      // Check if the paragraph only contains an image
      const { node } = paragraph;
      if (node?.children?.length === 1) {
        const child = node.children[0];
        if (child.tagName === 'img') {
          const { src, alt, title } = child.properties;
          return (
            <ImageWithCaption 
              src={src} 
              alt={alt} 
              caption={title}
            />
          );
        }
      }
      return <p>{paragraph.children}</p>;
    },
    img: (props) => {
      const { src, alt, title, ...rest } = props as any;
      return (
        <ImageWithCaption
          src={src}
          alt={alt}
          caption={title}
          {...rest}
        />
      );
    },
  };

  return (
    <div className={cn('prose dark:prose-invert max-w-none', className)}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
        skipHtml={false}
      >
        {finalProcessedContent}
      </ReactMarkdown>
      {referenceLinks.length > 0 && (
        <ReferencesSection 
          references={referenceLinks.map(ref => ref.ref)} 
          className="mt-12"
        />
      )}
    </div>
  );
}
