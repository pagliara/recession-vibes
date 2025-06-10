import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { BlogPost } from "@/lib/blog-utils"
import { cn } from "@/lib/utils"

export function BlogPostLayout({ post }: { post: BlogPost }) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to all articles
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{post.title}</h1>
          <div className="flex items-center text-gray-600 text-sm">
            <span>By {post.author}</span>
            <span className="mx-2">•</span>
            <time>{post.date}</time>
          </div>
        </div>
      </div>

      {post.contentHtml && (
        <div 
          className={cn(
            'prose prose-lg max-w-none',
            'prose-headings:font-bold prose-headings:text-gray-900',
            'prose-h1:text-4xl prose-h1:mb-6',
            'prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4',
            'prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3',
            'prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-4',
            'prose-ul:list-disc prose-ol:list-decimal prose-li:my-2',
            'prose-strong:text-gray-900 prose-strong:font-semibold',
            'prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-a:no-underline hover:prose-a:underline',
            'prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:bg-gray-50 prose-blockquote:text-gray-700',
            'prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
            'prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto',
            'prose-table:border-collapse prose-table:w-full prose-table:my-6',
            'prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-gray-300',
            'prose-td:p-3 prose-td:border prose-td:border-gray-200',
            'prose-img:rounded-lg prose-img:shadow-md prose-img:my-6',
            'dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-gray-300 dark:prose-strong:text-white dark:prose-blockquote:bg-gray-800 dark:prose-blockquote:text-gray-300 dark:prose-code:bg-gray-800 dark:prose-pre:bg-gray-900 dark:prose-th:bg-gray-800 dark:prose-th:border-gray-700 dark:prose-td:border-gray-700',
            'prose' // Ensures base prose styles are applied
          )}
          dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
        />
      )}
    </article>
  )
}
