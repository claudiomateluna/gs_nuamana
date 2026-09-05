'use client';

import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MarkdownRendererProps {
  content: string;
  format?: 'markdown' | 'html';
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, format }) => {
  if (!content) return null;

  let html: string;

  // Auto-detect format if not specified
  const isHtml = format === 'html' || (format === undefined && /^\s*<(?:p|div|h[1-6]|ul|ol|li|table|tr|td|th|blockquote|pre|img|a|strong|em)\b/i.test(content));

  if (isHtml) {
    html = content;
  } else {
    html = marked(content) as string;
  }

  const cleanHtml = typeof window !== 'undefined' ? DOMPurify.sanitize(html) : html;

  return (
    <div className="blog-content prose max-w-none dark:prose-invert">
      <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
    </div>
  );
};

export default MarkdownRenderer;
