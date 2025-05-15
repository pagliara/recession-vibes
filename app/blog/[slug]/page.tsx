import { BlogPostLayout } from "@/components/blog-post-layout"
import { blogPosts, getBlogPostBySlug } from "@/lib/blog-data"
import { notFound } from "next/navigation"
import type { Metadata, ResolvingMetadata } from "next"

type Props = {
  params: { slug: string }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

// Force static pages
export const dynamic = "force-static";

// CDN cache currently only works on nodejs runtime
export const runtime = "nodejs";

// Revalidate in seconds (1 day = 86400 seconds)
export const revalidate = 86400;

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const post = await getBlogPostBySlug((await params).slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug((await params).slug)

  if (!post) {
    notFound()
  }

  return <BlogPostLayout post={post} />
}
