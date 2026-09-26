import React, { useState, useMemo } from 'react';
import Prism from 'prismjs';

// Required Prism language extensions
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-css';

export interface CodeBlockProps {
  code: string;
  language?: string;
  isRtl?: boolean;
}

const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  cs: 'C#',
  csharp: 'C#',
  dotnet: '.NET',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'JSX',
  tsx: 'TSX',
  json: 'JSON',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  sql: 'SQL',
  html: 'HTML',
  xml: 'XML',
  markup: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  ps: 'PowerShell',
  ps1: 'PowerShell',
  powershell: 'PowerShell',
  text: 'Text',
  plaintext: 'Text',
  plain: 'Text',
};

const PRISM_LANGUAGE_MAP: Record<string, string> = {
  cs: 'csharp',
  csharp: 'csharp',
  dotnet: 'csharp',
  ts: 'typescript',
  typescript: 'typescript',
  js: 'javascript',
  javascript: 'javascript',
  jsx: 'jsx',
  tsx: 'tsx',
  json: 'json',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  sql: 'sql',
  html: 'markup',
  xml: 'markup',
  markup: 'markup',
  css: 'css',
  ps: 'powershell',
  ps1: 'powershell',
  powershell: 'powershell',
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, isRtl = false }) => {
  const [copied, setCopied] = useState(false);

  // Normalize code (trim trailing newline common in fenced markdown)
  const cleanCode = useMemo(() => {
    return code.replace(/\r\n/g, '\n').replace(/\n$/, '');
  }, [code]);

  const normalizedLang = (language || '').trim().toLowerCase();
  const displayLang = normalizedLang
    ? LANGUAGE_DISPLAY_NAMES[normalizedLang] || normalizedLang.toUpperCase()
    : 'Code';

  const lineCount = useMemo(() => {
    return cleanCode.split('\n').length;
  }, [cleanCode]);

  const isShort = lineCount <= 3;

  const highlightedHtml = useMemo(() => {
    const prismLangName = PRISM_LANGUAGE_MAP[normalizedLang] || normalizedLang;
    const grammar = Prism.languages[prismLangName];
    if (grammar) {
      try {
        return Prism.highlight(cleanCode, grammar, prismLangName);
      } catch (err) {
        console.error('Prism highlighting error:', err);
      }
    }
    return null;
  }, [cleanCode, normalizedLang]);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(cleanCode);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = cleanCode;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy code', e);
    }
  };

  const copyLabel = copied ? (isRtl ? 'تم النسخ' : 'Copied') : isRtl ? 'نسخ' : 'Copy';
  const ariaLabel = isRtl
    ? copied
      ? 'تم نسخ الكود للحافظة'
      : 'نسخ الكود البرمجي'
    : copied
      ? 'Code copied to clipboard'
      : 'Copy code';

  return (
    <div
      className={`code-block ${isShort ? 'code-block--short' : ''}`}
      dir="ltr"
    >
      <div className="code-block-header">
        <span className="code-block-lang">{displayLang}</span>
        <button
          type="button"
          className={`code-block-copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          aria-label={ariaLabel}
        >
          <i
            className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}
            aria-hidden="true"
          />
          <span>{copyLabel}</span>
        </button>
      </div>
      <pre className="code-block-pre">
        {highlightedHtml ? (
          <code
            className={normalizedLang ? `language-${normalizedLang}` : ''}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <code className={normalizedLang ? `language-${normalizedLang}` : ''}>
            {cleanCode}
          </code>
        )}
      </pre>
    </div>
  );
};
