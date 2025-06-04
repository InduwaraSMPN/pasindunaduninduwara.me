'use client'

import MarkdownPreview from '@uiw/react-markdown-preview';

interface MarkdownPreviewComponentProps {
  content: string;
  className?: string;
}

export default function MarkdownPreviewComponent({
  content,
  className = ""
}: MarkdownPreviewComponentProps) {
  return (
    <div className={`markdown-preview ${className}`}>
      <MarkdownPreview
        source={content}
        style={{
          backgroundColor: 'transparent',
          color: 'inherit',
        }}
        wrapperElement={{
          'data-color-mode': 'light'
        }}
        data-color-mode="light"
        rehypeRewrite={(node, index, parent) => {
          // Ensure proper styling for dark/light mode
          if (node.type === 'element' && node.tagName === 'pre') {
            node.properties = {
              ...node.properties,
              style: 'background-color: hsl(var(--muted)); border-radius: 0.375rem; padding: 1rem;'
            };
          }
          if (node.type === 'element' && node.tagName === 'code' && parent?.type === 'element' && parent.tagName !== 'pre') {
            node.properties = {
              ...node.properties,
              style: 'background-color: hsl(var(--muted)); padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875em;'
            };
          }
          if (node.type === 'element' && node.tagName === 'blockquote') {
            node.properties = {
              ...node.properties,
              style: 'border-left: 4px solid hsl(var(--primary)); padding-left: 1rem; margin: 1rem 0; font-style: italic;'
            };
          }
        }}
      />
    </div>
  );
}