<script lang="ts">
  import Track from "./Track.svelte";
  import LastfmProfile from "./LastfmProfile.svelte";
  import TopTracksComponent from "./TopTracksComponent.svelte";
  import TopArtistsComponent from "./TopArtistsComponent.svelte";

  import {
    getRecentTracks,
    getTopArtists,
    getTopTracks,
    getUserInfo,
    type RecentTracks,
    type UserInfo,
  } from "../../scripts/module/lastfm";
  import type { TopArtists, TopTracks } from "../../scripts/types/lastfm";

  let recent_tracks: RecentTracks | undefined = $state();
  let user_data: UserInfo | undefined = $state();
  let top_tracks: TopTracks | undefined = $state();
  let top_artists: TopArtists | undefined = $state();

  getRecentTracks(16).then((tracks) => (recent_tracks = tracks));
  getUserInfo().then((data) => (user_data = data));
  getTopTracks(10).then((tracks) => (top_tracks = tracks));
  getTopArtists(10).then((artists) => (top_artists = artists));
</script>

<section style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px" id="scrobbles-section">
  <div>
    <!-- LISTENING ACTIVITY -->
    <section>
      <h3 id="scrobbles-activity_title">Latest activity</h3>
    </section>

    <!-- RECENT TRACKS -->
    <section>
      <h3>Recent tracks</h3>
      <div class="recent-tracks">
        {#if !recent_tracks}
          <span>Loading recent tracks...</span>
        {:else}
          {#each recent_tracks.recenttracks.track as track}
            <Track {track} dynamic_bg={false} />
          {/each}
        {/if}
      </div>
    </section>
  </div>

  <section>
    <!-- PROFILE -->
    <h3>User info</h3>
    <div class="recent-tracks">
      {#if !user_data}
        <span>Loading user data...</span>
      {:else}
        <LastfmProfile user={user_data}></LastfmProfile>
      {/if}
    </div>

    <!-- TOP TRACKS -->
    <h3>Top tracks (90 days)</h3>
    {#if !top_tracks}
      <span>Loading top tracks...</span>
    {:else}
      <TopTracksComponent {top_tracks} />
    {/if}

    <!-- TOP ARTISTS -->
    <h3>Top artists (90 days)</h3>
    {#if !top_artists}
      <span>Loading top artists...</span>
    {:else}
      <TopArtistsComponent {top_artists} />
    {/if}
  </section>
</section>

<style>
  .recent-tracks {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
</style>
