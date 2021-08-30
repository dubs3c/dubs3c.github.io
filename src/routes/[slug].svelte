<script context="module">
  import { base } from '$app/paths';

  export async function load({ page, fetch }) {
    const slug = page.params.slug;
    const post = await fetch(`${base}/${slug}.json`)
        .then((r) => r.json());
    return {
      props: { post }
    };
  }
</script>

<script>
  export let post;
  let date = post.metadata.date.toUpperCase();
</script>

<svelte:head>
    <title>dubell.io | {post.metadata.title}</title>
</svelte:head>

<div class="article-header">
    <div class="container">
      <div class="row">
        <div class="col">
          <h1 class="article-h1">{post.metadata.title}</h1>
          <p class="meta-info">By <strong>{post.metadata.author ? post.metadata.author : "Author" }</strong> on July 26, 2021</p>
          <div class="tags">
            {#each post.metadata.tags as tag}
              <div class="tag">
                <a href="/">{tag}</a>
              </div>
            {/each}
          </div>
          {#if post.metadata.summary }
            <p class="desc">{post.metadata.summary}</p>
          {/if}
        </div>
        {#if post.metadata.thumbnail}
          <div class="article-image">
            <img src={"/thumbnails/" + post.metadata.thumbnail} width="150" height="150" alt="article" />
          </div>
        {/if}
      </div>
        
      
  </div>
</div>
  
<main>
  <article>
    {@html post.content}
  </article>
</main>