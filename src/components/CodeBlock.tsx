import React, { useMemo } from 'react';
import './CodeTheme.css';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

/**
 * A simple code block component with syntax highlighting using CSS
 */
const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'javascript', showLineNumbers = false }) => {
  // Convert language for CSS class (e.g., 'javascript' -> 'language-javascript')
  const languageClass = `language-${language}`;
  
  // Split code into lines for line numbers
  const codeLines = useMemo(() => code ? code.split('\n') : [], [code]);
  
  // Simple syntax highlighting function
  const highlightedCode = useMemo((): string[] => {
    if (!code) return [];
    
    return codeLines.map((line: string): string => {
      // Very basic highlighting - in a real app you might want to use a tokenizer library
      // But for our purposes, we'll just use some basic regex
      
      // This is a simplified version - a production app would use a proper tokenizer
      let highlightedLine = line;
      
      if (language === 'javascript' || language === 'jsx' || language === 'typescript' || language === 'tsx') {
        // Keywords
        highlightedLine = highlightedLine.replace(
          /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|extends|async|await)\b/g,
          '<span class="token keyword">$1</span>'
        );
        
        // Strings
        highlightedLine = highlightedLine.replace(
          /(["'`])(.*?)\1/g,
          '<span class="token string">$1$2$1</span>'
        );
        
        // Comments
        highlightedLine = highlightedLine.replace(
          /(\/\/.*)/g,
          '<span class="token comment">$1</span>'
        );
        
        // Numbers
        highlightedLine = highlightedLine.replace(
          /\b(\d+)\b/g,
          '<span class="token number">$1</span>'
        );
      } else if (language === 'html' || language === 'xml') {
        // Tags
        highlightedLine = highlightedLine.replace(
          /(&lt;[\/\w\s]*&gt;)/g,
          '<span class="token tag">$1</span>'
        );
      }
      
      return highlightedLine;
    });
  }, [codeLines, language, code]);
  
  if (!code) return null;
  
  return (
    <div className="overflow-hidden font-mono text-sm rounded-lg code-block-wrapper">
      <div className="flex">
        {/* Line numbers column */}
        {showLineNumbers && (
          <div className="px-2 py-3 text-right text-gray-500 bg-gray-800 select-none line-numbers">
            {codeLines.map((_, i) => (
              <div key={i} className="line-number">
                {i + 1}
              </div>
            ))}
          </div>
        )}
        
        {/* Code content */}
        <pre className="overflow-x-auto flex-1 p-3 text-gray-200 bg-gray-900">
          <code className={languageClass}>
            {highlightedCode.map((line, i) => (
              <div key={i} className="code-line" dangerouslySetInnerHTML={{ __html: line || ' ' }} />
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;