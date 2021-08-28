import fs from "fs"
import parseMD from '$lib/prasemd'
import type {Post} from '$lib/posts'

export async function get() {
	const markdown_posts = "src/posts/"

	let posts: Post[]

	fs.readdirSync(markdown_posts).forEach(file => {

		if(file.endsWith(".md")) {
			const fileContents = fs.readFileSync(`${markdown_posts}${file}`, 'utf8')
			const { metadata } = parseMD(fileContents)
			posts.push({
				title: metadata.title,
				author: metadata.author,
				date: new Date(metadata.date),
				summary: metadata.summary,
				tags: metadata.tags,
				slug: metadata.slug
			})
		}
	});

	// Sort posts by descending date
	posts.sort((a, b) => (a.date > b.date ? -1 : 1))

	return {
		body: { posts }
	}
}