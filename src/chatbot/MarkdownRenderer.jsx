import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h1 className="mb-2 text-2xl font-bold" {...props} />,
        h2: ({ node, ...props }) => <h2 className="mb-2 text-xl font-bold" {...props} />,
        h3: ({ node, ...props }) => <h3 className="mb-2 text-lg font-bold" {...props} />,
        p: ({ node, ...props }) => <p className="mb-2" {...props} />,
        ul: ({ node, ...props }) => <ul className="mb-2 ml-4 list-disc" {...props} />,
        ol: ({ node, ...props }) => <ol className="mb-2 ml-4 list-decimal" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote className="pl-4 my-2 italic border-l-4 border-gray-300" {...props} />
        ),
        code: ({ node, inline, ...props }) =>
          inline ? (
            <code className="px-1 bg-gray-100 rounded" {...props} />
          ) : (
            <pre className="p-2 overflow-x-auto bg-gray-100 rounded">
              <code {...props} />
            </pre>
          ),
        hr: ({ node, ...props }) => <hr className="my-4 border-t border-gray-300" {...props} />,
        img: ({ node, ...props }) => <img className="h-auto max-w-full my-2" {...props} />,
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto">
            <table className="min-w-full my-2 divide-y divide-gray-300" {...props} />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th className="px-3 py-2 font-bold text-left bg-gray-100" {...props} />
        ),
        td: ({ node, ...props }) => <td className="px-3 py-2 border-t" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer
