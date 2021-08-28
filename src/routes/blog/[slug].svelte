<script context="module" lang="ts">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
    export async function load({ page, fetch }) {
      const slug = page.params.slug;
      const response = await fetch(`${slug}.json`)

      if(response.ok) {
        return {
          props: {
            post: await response.json()
          }
        } 
      }

      return {
			  status: response.status,
			  error: new Error("shit aint working")
		  };
    }
</script>


<script lang="ts">
import type {Post} from '$lib/posts'

export let post

export const article: Post = {
    title: post.metadata.title,
    author: post.metadata.author,
    date: post.metadata.date,
    slug: post.metadata.slug,
    summary: post.metadata.summary,
    tags: post.metadata.tags,
    thumbnail: post.metadata.thumbnail
}
</script>


<svelte:head>
    <title>dubell.io | {article.title}</title>
</svelte:head>

<div class="aricle-header">
    <div class="container">
      <div class="row">
        <div class="col">
          <h1>{article.title}</h1>
          <p>By <strong>{article.author === "undefined" ? article.author : "Author" }</strong> on July 26, 2021</p>
          <div class="tags">
            {#each article.tags as tag}
              <div class="tag">
                <a href={"/tags/" + tag}>{tag}</a>
              </div>
            {/each}
          </div>
          {#if article.summary }
            <p class="desc">{article.summary}</p>
          {/if}
        </div>
        {#if article.thumbnail}
          <div class="col article-image">
            <img src={"/thumbnails/" + article.thumbnail} max-width="256" height="256" alt="article" />
          </div>
        {/if}
      </div>
        
      
  </div>
</div>
  
<main>
  <article>
    {@html post.html}
  </article>
</main>