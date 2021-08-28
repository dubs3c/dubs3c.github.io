// author: https://github.com/rpearce/parse-md

import pkg from 'js-yaml';
const { load: load$3 } = pkg;
import type {Post} from '$lib/posts'

const findMetadataIndices = (mem, item, i) => {
  if (/^---/.test(item)) {
    mem.push(i)
  }
  return mem
}

const parseMetadata = ({ lines, metadataIndices }) => {
  if (metadataIndices.length > 0) {
    let metadata = lines.slice(metadataIndices[0] + 1, metadataIndices[1])
    return load$3(metadata.join('\n'))
  }
  return {}
}

const parseContent = ({ lines, metadataIndices }) => {
  if (metadataIndices.length > 0) {
    lines = lines.slice(metadataIndices[1] + 1, lines.length)
  }
  return lines.join('\n')
}

const parseMD = contents => {
  const lines = contents.split('\n')
  const metadataIndices = lines.reduce(findMetadataIndices, [])
  const frontmatter = parseMetadata({ lines, metadataIndices })
  let metadata: Post = {
    title: frontmatter.title,
    author: frontmatter.author,
    date: frontmatter.date,
    slug: frontmatter.slug,
    summary: frontmatter.summary,
    tags: frontmatter.tags,
    thumbnail: frontmatter.thumbnail
  }
  const content = parseContent({ lines, metadataIndices })
  return { metadata, content }
}

export default parseMD
