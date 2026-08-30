<script lang="ts">
  import type { TopArtists } from "../../scripts/types/lastfm";

  interface Props {
    top_artists: TopArtists;
  }

  let { top_artists }: Props = $props();
</script>

<section>
  {#each top_artists.topartists.artist as artist, rank}
    <div>
      #{rank + 1}
      {artist.name} ({artist.playcount})
    </div>
  {/each}
</section>

<style>
  section {
    background-color: var(--darkgrey);
    border-radius: 6px;
    display: grid;
    gap: 8px;
    max-height: 290px;
    overflow-x: scroll;
    padding: 2px 4px;
  }
</style>
