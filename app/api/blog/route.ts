import { NextRequest, NextResponse } from 'next/server'
import { getAllBlogPosts, getBlogPostBySlugWithHtml } from './blog-server'

// API route to get all blog posts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  
  if (slug) {
    // Get a specific blog post if slug is provided
    const post = await getBlogPostBySlugWithHtml(slug)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(post)
  } else {
    // Get all blog posts
    const posts = await getAllBlogPosts()
    return NextResponse.json(posts)
  }
}
