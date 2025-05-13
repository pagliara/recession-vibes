import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { BlogPost } from "@/lib/blog-data"

export function BlogPostLayout({ post }: { post: BlogPost }) {
  // Convert markdown-like content to HTML (very simplified)
  const formatContent = (content: string) => {
    const lines = content.split("\n")
    const formattedContent = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.startsWith("# ")) {
        formattedContent.push(
          <h1 key={i} className="text-3xl font-bold mt-6 mb-4">
            {line.substring(2)}
          </h1>,
        )
      } else if (line.startsWith("## ")) {
        formattedContent.push(
          <h2 key={i} className="text-2xl font-semibold mt-6 mb-3">
            {line.substring(3)}
          </h2>,
        )
      } else if (line.startsWith("### ")) {
        formattedContent.push(
          <h3 key={i} className="text-xl font-semibold mt-5 mb-2">
            {line.substring(4)}
          </h3>,
        )
      } else if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ")) {
        // This is a very simplified approach for ordered lists
        formattedContent.push(
          <li key={i} className="ml-6 list-decimal my-1">
            {line.substring(3)}
          </li>,
        )
      } else if (line === "") {
        formattedContent.push(<div key={i} className="my-4"></div>)
      } else {
        formattedContent.push(
          <p key={i} className="my-3 text-gray-700 leading-relaxed">
            {line}
          </p>,
        )
      }
    }

    return formattedContent
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/blog" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to all articles
      </Link>

      <div className="border-b pb-4 mb-6">
        <h1 className="text-4xl font-bold mb-3">{post.title}</h1>
        <div className="flex items-center text-gray-600 text-sm">
          <span>By {post.author}</span>
          <span className="mx-2">•</span>
          <time>{post.date}</time>
        </div>
      </div>

      <div className="prose max-w-none">{formatContent(post.content)}</div>
    </article>
  )
}
