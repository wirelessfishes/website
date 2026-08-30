<script lang="ts">
  import type { TopTracks } from "../../scripts/types/lastfm";

  interface Props {
    top_tracks: TopTracks;
  }

  let { top_tracks }: Props = $props();
</script>

<section>
  {#each top_tracks.toptracks.track as track, rank}
    <div>
      #{rank + 1} <b>{track.name}</b> - {track.artist.name} ({track.playcount})
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
