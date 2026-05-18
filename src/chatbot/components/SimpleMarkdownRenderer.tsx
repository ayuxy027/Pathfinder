interface MarkdownRendererProps {
  content: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderMarkdown(text: string): string {
  const escaped = escapeHtml(text);

  const withCodeBlocks = escaped.replace(/```(\S*)\n?([\s\S]*?)```/g, (_match: string, _lang: string, code: string) => {
    return `<pre class="overflow-x-auto p-3 my-2 bg-gray-100 rounded-lg"><code class="text-sm">${code}</code></pre>`;
  });

  const withInlineCode = withCodeBlocks.replace(/`(.*?)`/g, '<code class="px-1 py-0.5 text-sm bg-gray-100 rounded">$1</code>');

  const html = withInlineCode
    .replace(/^### (.*)$/gm, '<h3 class="mb-2 text-lg font-bold text-teal-700">$1</h3>')
    .replace(/^## (.*)$/gm, '<h2 class="mb-3 text-xl font-bold text-teal-700">$1</h2>')
    .replace(/^# (.*)$/gm, '<h1 class="mb-4 text-2xl font-bold text-teal-700">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-teal-600">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/^- (.*)$/gm, '<li class="mb-1 ml-4">$1</li>')
    .replace(/^\d+\. (.*)$/gm, '<li class="mb-1 ml-4">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/\n/g, '<br>');

  return `<div class="max-w-none prose prose-sm"><p class="mb-2">${html}</p></div>`;
}

export function SimpleMarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div
      className="text-sm leading-relaxed sm:text-base"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}