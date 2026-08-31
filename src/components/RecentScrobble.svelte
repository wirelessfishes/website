<script lang="ts">
  import MarqueeOverflow from "@components/MarqueeOverflow.svelte";
  import { getRecentTracks, getScrobbleCover, type Scrobble } from "@scripts/module/lastfm";
  import TimeAgo from "javascript-time-ago";

  let timeAgo = new TimeAgo("en");

  let scrobble: Scrobble | undefined = $state();

  getRecentTracks(1).then((data) => (scrobble = data.recenttracks.track[0]));
</script>

<div>
  <h3>Recent scrobble</h3>

  {#if !scrobble}
    <div class="scrobble">
      <div class="img-container">
        <a href="/">
          <img class="placeholder-img" alt="music track cover" src="" loading="lazy" />
        </a>
      </div>

      <div class="details">
        <div class="scrobble-status">Loading...</div>

        <MarqueeOverflow style="font-weight: bold; font-size: 16px;" text="Loading..." />
        <MarqueeOverflow style="font-style: italic;" text="Loading..." />
        <div>By: Loading...</div>
      </div>
    </div>
  {:else}
    <div class="scrobble">
      <div class="img-container">
        <a href={scrobble.url} target="_blank">
          <img alt="music track cover" src={getScrobbleCover(scrobble, "large")} loading="lazy" />
        </a>
      </div>

      <div class="details">
        <div class="scrobble-status">
          {#if scrobble["@attr"]?.nowplaying}
            [ Now playing ]
          {:else if scrobble.date}
            [ {timeAgo.format(new Date(scrobble.date["#text"]))} ]
          {:else}
            [ Some time ago ]
          {/if}
        </div>

        <MarqueeOverflow style="font-weight: bold; font-size: 16px;" text={scrobble.name} />
        <MarqueeOverflow style="font-style: italic;" text={"Album: " + scrobble.album["#text"]} />
        <div>By: {scrobble.artist["#text"]}</div>
      </div>
    </div>
  {/if}
</div>

<style>
  .scrobble {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .img-container {
    display: flex;
    justify-content: center;
  }

  .img-container > a > img {
    width: 180px;
    height: 180px;
  }

  .img-container > a > img,
  .placeholder-img {
    background: url("/assets/placeholder.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 64px;
    font-size: 0;
  }

  a:hover {
    background: transparent;
  }

  .scrobble-status {
    text-align: center;
    font-weight: bold;
    background: linear-gradient(to bottom, var(--red), var(--darkred));
  }
</style>
