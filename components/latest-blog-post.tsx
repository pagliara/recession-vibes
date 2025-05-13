import Link from "next/link"
import { getLatestBlogPost } from "@/lib/blog-data"

export function LatestBlogPost() {
  const latestPost = getLatestBlogPost()

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-2">Latest Analysis</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">
          <Link href={`/blog/${latestPost.slug}`} className="text-blue-600 hover:text-blue-800">
            {latestPost.title}
          </Link>
        </h3>
        <p className="text-gray-700 text-sm mb-3">{latestPost.excerpt}</p>
        <div className="flex items-center text-gray-600 text-xs">
          <span>By {latestPost.author}</span>
          <span className="mx-2">•</span>
          <time>{latestPost.date}</time>
        </div>
      </div>
      <Link href="/blog" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
        View all articles →
      </Link>
    </div>
  )
}
