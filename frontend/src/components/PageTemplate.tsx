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
    <div className="min-h-screen flex flex-col bg-clr1 dark:bg-dclr1 transition-colors">
      <SecondaryHeader />
      <main className="flex-grow max-w-[1080px] mx-auto px-2 py-32 w-full">
        <div className="bg-clr1 dark:bg-dclr1 p-6 rounded-[3rem] shadow-2xl border border-clr7 dark:border-dclr7 animate-in fade-in zoom-in duration-700">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageTemplate;
