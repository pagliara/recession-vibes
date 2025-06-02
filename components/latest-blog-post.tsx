import Link from "next/link"
import { blogPosts } from "@/lib/blog-data"
import "./ticker.css"

export function LatestBlogPost() {
  // Get the three most recent blog posts
  const recentPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  return (
    <div className="h-10 flex items-center overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-md z-50 shadow-md mb-4">
      <div className="flex items-center px-3 font-semibold">
        <span className="mr-2 text-yellow-300">HEADLINES:</span>
      </div>
      <div className="ticker-container">
        <div className="ticker-wrapper">
          <div className="ticker-text">
            {/* First set of headlines */}
            {recentPosts.map((post, index) => (
              <span key={`first-${post.id}`} className="ticker-headline">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
                <span className="ticker-separator">•</span>
              </span>
            ))}
            
            {/* Duplicate set to ensure continuous flow */}
            {recentPosts.map((post, index) => (
              <span key={`second-${post.id}`} className="ticker-headline">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
                <span className="ticker-separator">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
