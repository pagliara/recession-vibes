"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { BlogPost } from "@/lib/blog-utils"
import "./ticker.css"

export function LatestBlogPost() {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/blog')
        if (response.ok) {
          const posts = await response.json()
          // Get only the three most recent posts
          setRecentPosts(posts.slice(0, 3))
        } else {
          console.error('Failed to fetch blog posts')
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [])
  
  // Show a placeholder while loading
  if (loading) {
    return (
      <div className="h-10 flex items-center overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-md z-50 shadow-md mb-4">
        <div className="flex items-center px-3 font-semibold">
          <span className="mr-2 text-yellow-300">HEADLINES:</span>
        </div>
        <div className="ticker-container">
          <div className="ticker-wrapper">
            <div className="ticker-text">
              <span className="ticker-headline">Loading latest headlines...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-10 flex items-center overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-md z-50 shadow-md mb-4">
      <div className="flex items-center px-3 font-semibold">
        <span className="mr-2 text-yellow-300">HEADLINES:</span>
      </div>
      <div className="ticker-container">
        <div className="ticker-wrapper">
          <div className="ticker-text">
            {/* First set of headlines */}
            {recentPosts.map((post: BlogPost, index: number) => (
              <span key={`first-${post.id}`} className="ticker-headline">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
                <span className="ticker-separator">•</span>
              </span>
            ))}
            
            {/* Duplicate set to ensure continuous flow */}
            {recentPosts.map((post: BlogPost, index: number) => (
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
