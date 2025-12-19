
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

interface TypewriterMarkdownProps {
  content: string;
  speed?: number;
}

/**
 * TypewriterMarkdown component handles both typing effect and robust math/special char rendering.
 * It uses remarkMath for parsing and rehypeKatex for high-quality mathematical typesetting.
 * It now uses remarkGfm for proper table support and custom components for table styling.
 */
const TypewriterMarkdown: React.FC<TypewriterMarkdownProps> = ({ content, speed = 15 }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const indexRef = useRef(0);
  const timerRef = useRef<any>(null);

  // Common components configuration to ensure consistent styling
  const markdownComponents = {
    // Ensure special symbols and math have enough space
    p: ({ children }: any) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
    
    // Enhanced Table Styling
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-6 rounded-2xl border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-slate-50">
        {children}
      </thead>
    ),
    tbody: ({ children }: any) => (
      <tbody className="divide-y divide-slate-100 bg-white">
        {children}
      </tbody>
    ),
    tr: ({ children }: any) => (
      <tr className="transition-colors hover:bg-slate-50/50">
        {children}
      </tr>
    ),
    th: ({ children }: any) => (
      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="whitespace-pre-wrap px-6 py-4 text-slate-600 leading-relaxed">
        {children}
      </td>
    ),

    // Code block styling
    code: ({ inline, className, children, ...props }: any) => {
      return (
        <code 
          className={`${className} ${inline ? 'bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded text-[0.9em] font-mono' : 'block bg-slate-900 text-indigo-300 p-4 rounded-xl my-4 text-xs leading-relaxed overflow-x-auto'}`} 
          {...props}
        >
          {children}
        </code>
      );
    }
  };

  // If speed is 0, render instantly without effect logic
  if (speed === 0) {
    return (
      <div className="typewriter-container overflow-x-auto custom-scrollbar">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          className="prose prose-indigo max-w-none prose-sm sm:prose-base dark:prose-invert"
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  useEffect(() => {
    // Reset state on content change
    indexRef.current = 0;
    setDisplayedContent('');
    
    if (timerRef.current) clearInterval(timerRef.current);

    if (!content) return;

    // Adaptive speed: faster for longer content
    const step = content.length > 1000 ? 8 : (content.length > 300 ? 4 : 2);

    timerRef.current = setInterval(() => {
      if (indexRef.current < content.length) {
        const nextChunk = content.slice(indexRef.current, indexRef.current + step);
        setDisplayedContent((prev) => prev + nextChunk);
        indexRef.current += step;
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [content, speed]);

  // If math blocks are in process of being typed, we might get incomplete LaTeX syntax.
  // We try to render as much as possible, but ReactMarkdown handles it gracefully.
  return (
    <div className="typewriter-container overflow-x-auto custom-scrollbar">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        className="animate-fade prose prose-indigo max-w-none prose-sm sm:prose-base dark:prose-invert"
        components={markdownComponents}
      >
        {displayedContent}
      </ReactMarkdown>
      {indexRef.current < content.length && (
        <span className="inline-block w-1.5 h-4 bg-indigo-500 ml-1 animate-pulse align-middle"></span>
      )}
    </div>
  );
};

export default TypewriterMarkdown;
