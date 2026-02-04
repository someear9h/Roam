import React from 'react';

/**
 * Parses markdown-like text and converts it to React elements
 * Supports: bold (**text**), italic (*text*), bullet points, numbered lists
 */
export function parseMarkdown(text) {
  if (!text) return null;
  
  // Split by lines
  const lines = text.split('\n');
  const elements = [];
  let currentList = [];
  let listType = null;
  
  const processInlineFormatting = (line) => {
    // Process bold and italic
    const parts = [];
    let remaining = line;
    let key = 0;
    
    // Process bold (**text**) and italic (*text*)
    const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(remaining)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(remaining.substring(lastIndex, match.index));
      }
      
      if (match[2]) {
        // Bold and italic (***text***)
        parts.push(<strong key={key++} className="font-bold italic">{match[2]}</strong>);
      } else if (match[3]) {
        // Bold (**text**)
        parts.push(<strong key={key++} className="font-semibold">{match[3]}</strong>);
      } else if (match[4]) {
        // Italic (*text*)
        parts.push(<em key={key++} className="italic">{match[4]}</em>);
      } else if (match[5]) {
        // Code (`text`)
        parts.push(
          <code key={key++} className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-coral-600">
            {match[5]}
          </code>
        );
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < remaining.length) {
      parts.push(remaining.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : remaining;
  };
  
  const flushList = () => {
    if (currentList.length > 0) {
      if (listType === 'ul') {
        elements.push(
          <ul key={elements.length} className="list-disc list-inside space-y-1 my-2 ml-2">
            {currentList.map((item, i) => (
              <li key={i} className="text-gray-700">{processInlineFormatting(item)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={elements.length} className="list-decimal list-inside space-y-1 my-2 ml-2">
            {currentList.map((item, i) => (
              <li key={i} className="text-gray-700">{processInlineFormatting(item)}</li>
            ))}
          </ol>
        );
      }
      currentList = [];
      listType = null;
    }
  };
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Empty line
    if (!trimmedLine) {
      flushList();
      elements.push(<div key={elements.length} className="h-2" />);
      return;
    }
    
    // Headers
    if (trimmedLine.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={elements.length} className="font-bold text-gray-800 text-base mt-3 mb-1">
          {processInlineFormatting(trimmedLine.slice(4))}
        </h4>
      );
      return;
    }
    if (trimmedLine.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={elements.length} className="font-bold text-gray-800 text-lg mt-3 mb-1">
          {processInlineFormatting(trimmedLine.slice(3))}
        </h3>
      );
      return;
    }
    if (trimmedLine.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={elements.length} className="font-bold text-gray-900 text-xl mt-3 mb-2">
          {processInlineFormatting(trimmedLine.slice(2))}
        </h2>
      );
      return;
    }
    
    // Bullet points (-, *, •)
    const bulletMatch = trimmedLine.match(/^[-*•]\s+(.+)/);
    if (bulletMatch) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      currentList.push(bulletMatch[1]);
      return;
    }
    
    // Numbered lists
    const numberMatch = trimmedLine.match(/^(\d+)[.)]\s+(.+)/);
    if (numberMatch) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      currentList.push(numberMatch[2]);
      return;
    }
    
    // Regular paragraph
    flushList();
    elements.push(
      <p key={elements.length} className="text-gray-700 leading-relaxed">
        {processInlineFormatting(trimmedLine)}
      </p>
    );
  });
  
  // Flush any remaining list
  flushList();
  
  return elements;
}

/**
 * Component wrapper for parsed markdown
 */
export default function MarkdownRenderer({ content, className = '' }) {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      {parseMarkdown(content)}
    </div>
  );
}
