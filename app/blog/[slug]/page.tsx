import { BlogPostLayout } from "@/components/blog-post-layout"
import { getBlogPostSlugs, getBlogPostBySlugWithHtml } from "@/app/api/blog/blog-server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

// Force static pages
export const dynamic = "force-static"

// CDN cache currently only works on nodejs runtime
export const runtime = "nodejs"

// Revalidate in seconds (1 day = 86400 seconds)
export const revalidate = 86400

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  // read route params
  const { slug } = await params;
  
  // fetch data
  const post = await getBlogPostBySlugWithHtml(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  // Extract references from the post frontmatter if they exist
  const references = post.references || [];

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    other: {
      references: references.join('\n'),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlugWithHtml(slug)

  if (!post) {
    notFound()
  }

  return <BlogPostLayout post={post} />
}
