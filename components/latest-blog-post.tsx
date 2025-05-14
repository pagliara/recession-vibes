import Link from "next/link"
import { getLatestBlogPost } from "@/lib/blog-data"

export function LatestBlogPost() {
  const latestPost = getLatestBlogPost()

  return (
    <div className="bg-white rounded-lg">
      <div className="flex items-center gap-2 mb-2">
      <h2 className="text-xl font-bold">Latest Analysis</h2>
      <Link href="/blog" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
        View all articles →
      </Link>
      </div>
      <div className="mb-2">
        <h3 className="text-sm font-semibold mb-1">
          <Link href={`/blog/${latestPost.slug}`} className="text-blue-600 hover:text-blue-800">
            {latestPost.title}
          </Link>
          <div className="flex items-center font-normal text-muted-foreground text-gray-600 text-xs">
          <span>By {latestPost.author}</span>
          <span className="mx-2">•</span>
          <time>{latestPost.date}</time>
        </div>
        </h3>
        <p className="text-muted-foreground text-sm mb-3">{latestPost.excerpt}</p>
        
      </div>
      
    </div>
  )
}
