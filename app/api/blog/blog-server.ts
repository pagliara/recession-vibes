import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost } from '@/lib/blog-utils'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export async function getBlogPostSlugs() {
  return fs.readdirSync(postsDirectory)
    .filter(filename => filename.endsWith('.md'))
    .map(filename => filename.replace(/\.md$/, ''))
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return undefined
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      author: data.author,
      content,
      slug: data.slug,
      references: data.references || []
    }
  } catch (error) {
    console.error(`Error getting blog post by slug ${slug}:`, error)
    return undefined
  }
}

export async function getBlogPostBySlugWithHtml(slug: string): Promise<BlogPost | undefined> {
  const post = await getBlogPostBySlug(slug)
  
  if (!post) {
    return undefined
  }

  return post
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const slugs = await getBlogPostSlugs()
  const postsPromises = slugs.map(slug => getBlogPostBySlug(slug))
  const posts = await Promise.all(postsPromises)
  
  // Filter out any undefined posts and sort by date
  return posts
    .filter((post): post is BlogPost => post !== undefined)
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1
      } else {
        return -1
      }
    })
}
