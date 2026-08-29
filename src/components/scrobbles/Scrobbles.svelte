<script lang="ts">
  import Track from "./Track.svelte";
  import { getRecentTracks, type RecentTracks } from "../../scripts/module/lastfm";

  let recent_tracks: RecentTracks | undefined = $state();

  async function FetchRecentTracks() {
    return await getRecentTracks(16);
  }

  FetchRecentTracks().then((tracks) => (recent_tracks = tracks));
</script>

<!-- Recent tracks -->
<div>
  {#if !recent_tracks}
    <span>Loading recent tracks...</span>
  {:else}
    {#each recent_tracks.recenttracks.track as track}
      <Track {track} dynamic_bg={false} />
    {/each}
  {/if}
</div>
<!-- Profile -->
<!-- Top tracks -->
<!-- Top Artists -->
