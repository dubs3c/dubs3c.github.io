
export const PostsLocation = "src/posts"

export interface Post {
    author: string
    title: string
    date: Date
    summary?: string
    tags?: []
    slug: string
    html?: string
    thumbnail?: string
}