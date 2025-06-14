import Link from "next/link"
import type { Metadata } from "next"
import { getAllBlogPosts } from "@/app/api/blog/blog-server"

export const metadata: Metadata = {
  title: "Recession Vibes Blog",
  description: "Analysis and insights on economic indicators and recession risks",
}

// Force static pages
export const dynamic = "force-static";

// CDN cache currently only works on nodejs runtime
export const runtime = "nodejs";

// Revalidate in seconds (1 day = 86400 seconds)
export const revalidate = 86400;

export default async function BlogIndexPage() {
  // Get all posts from the server-side function
  const sortedPosts = await getAllBlogPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recession Analysis Blog</h1>

      <div className="grid gap-8">
        {sortedPosts.map((post) => (
          <div key={post.id} className="border-b pb-8">
            <h2 className="text-2xl font-bold mb-2">
              <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800">
                {post.title}
              </Link>
            </h2>
            <div className="flex items-center text-gray-600 text-sm mb-3">
              <span>By {post.author}</span>
              <span className="mx-2">•</span>
              <time>{post.date}</time>
            </div>
            <p className="text-gray-700 mb-4">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
              Read more →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
