'use client';

import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  let rawHtml = marked(content) as string;
  const cleanHtml = typeof window !== 'undefined' ? DOMPurify.sanitize(rawHtml) : rawHtml;

  return (
    <div className="blog-content prose max-w-none dark:prose-invert">
      <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
    </div>
  );
};

export default MarkdownRenderer;
