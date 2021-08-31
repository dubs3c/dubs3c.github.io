
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
</script>

<svelte:head>
	<title>dubell.io</title>
</svelte:head>

<main>
    <br />
    <h2 class="menlo-h2">⚡️ Writings</h2>
    <div class="hr"></div>
    <br />
    {#each posts.slice(0,7) as post}
      <div class="post">
        <a href={`${base}/${post.slug}`}>
            <time>{dayjs(post.metadata.date).format("YYYY MMM")}</time><h3>{post.metadata.title}</h3>
        </a>
      </div>
    {/each}

    <br />
    <h2 class="menlo-h2">🔥 Some Projects</h2>
    <div class="hr"></div>
    <br />
    <div class="row projects">
        <div class="col-4">
            <a href="https://github.com/dubs3c/SANDLADA"><h4>🏝 SANLADA</h4></a>
            <p>Dynamic Malware Analsysis Sandbox, built with Go</p>
        </div>
        <div class="col-4">
            <a href="https://github.com/BountyStrike/Emissary"><h4>⚡️ Emissary </h4></a>
            <p>Send notifications on different channels such as Slack, Telegram, Discord etc </p>
        </div>
        <div class="col-4">
            <a href="https://github.com/dubs3c/sudo_sniff"><h4>👃 sudo_sniff</h4></a>
            <p>Steal user's password when running sudo for post-exploitation purposes</p>
        </div>
        <div class="col-4">
            <a href="https://github.com/dubs3c/SANDLADA"><h4>📖 SAMLA</h4></a>
            <p>Collect all your bookmarks in one place. Send your bookmark from any device and read it later!</p>
        </div>
        <div class="col-4">
            <a href="https://gist.github.com/dubs3c/fb1c438954e18b880ea516a91d78a4ec"><h4>💾 backup.sh</h4></a>
            <p>Database backup and data verification using Docker</p>
        </div>
    </div>

 

</main>
