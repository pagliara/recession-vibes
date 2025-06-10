import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

export type BlogPost = {
  id: string
  title: string
  excerpt: string
  date: string
  author: string
  content: string
  slug: string
  contentHtml?: string
}
