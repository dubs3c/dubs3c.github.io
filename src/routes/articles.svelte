
<script context="module">
    import { base } from '$app/paths';
  
    export async function load({ fetch }) {
      const posts = await fetch(`${base}/index.json`)
          .then((r) => r.json());
      return {
        props: { posts }
      }
    }
  </script>
  
  <script>
    import dayjs from 'dayjs';
    export let posts;
     
    let mylist = new Array();
    let lol = {}

    /*
      {
        "year": 2015,
        "posts": [posts],
        "tags": [tags]
      }

    */

    posts.forEach(post => {
        let d = String(dayjs(post.metadata.date).format("YYYY"))
        if(lol[d]) {
            lol[d].push(post)
        } else {
            lol[d] = []
            lol[d].push(post)
        }
    });
    mylist.push(lol)

  </script>
  
  <svelte:head>
      <title>dubell.io</title>
  </svelte:head>
  
  <div class="article-header">
    <div class="container">
      <div class="row">
        <div class="col">
          <h1>Articles</h1>
          <p class="subtitle">Posts, tutorials, notes, bypasses, ideas, rambles and everything in between.</p>
      </div>
    </div>
  </div>
</div>

<main>

    {#each Object.entries(mylist[0]).reverse() as [date, posts] }
    <h2 class="menlo-h2">{date}</h2>
    <div class="hr"></div>
    <br />
        {#each posts as post}
          <div class="post">
            <a href={`${base}/${post.slug}`}>
              <time>{dayjs(post.metadata.date).format("MMM D")}</time><h3>{post.metadata.title}</h3>
            </a>
          </div>
        {/each}
    {/each}
</main>
  