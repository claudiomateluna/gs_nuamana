'use client';

import React from 'react';
import SecondaryHeader from './SecondaryHeader';

interface PageTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-clr4 transition-colors">
      <SecondaryHeader />
      <main className="flex-grow max-w-[1080px] mx-auto px-2 py-32 w-full">
        <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-[3rem] shadow-2xl border border-clr10 dark:border-clr4 animate-in fade-in zoom-in duration-700">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageTemplate;
