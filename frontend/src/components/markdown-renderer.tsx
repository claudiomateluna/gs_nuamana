'use client';

import React from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Simple sanitization by removing dangerous tags
  let rawHtml = marked(content) as string;
  rawHtml = rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');

  return (
    <div className="blog-content prose max-w-none dark:prose-invert">
      <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
    </div>
  );
};

export default MarkdownRenderer;
