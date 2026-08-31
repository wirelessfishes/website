<script lang="ts">
  import { getNekowebStats, type NekowebStats } from "@scripts/nw_stats";
  import "javascript-time-ago/locale/en";
  import TimeAgo from "javascript-time-ago";

  let timeAgo = new TimeAgo("en");
  let nw_stats: NekowebStats | undefined = $state();
  let backend_alive: boolean | undefined = $state();

  async function getBackendStatus() {
    try {
      let response = await fetch("https://api.wireless.fish/", { signal: AbortSignal.timeout(5000) });
      return response.ok;
    } catch {
      return false;
    }
  }

  getNekowebStats("wireless.fish").then((data) => (nw_stats = data));
  getBackendStatus().then((state) => (backend_alive = state));
</script>

<div class="site-stats">
  <h3>Statistics</h3>

  <div class="stats-container">
    {#if nw_stats}
      <div>Hits</div>
      <div>{nw_stats.views}</div>

      <div>Followers</div>
      <div>{nw_stats.followers}</div>

      <div>Updates</div>
      <div>{nw_stats.updates}</div>

      <div>Last updated</div>
      <div>{timeAgo.format(nw_stats.updated_at, "mini")} ago</div>
    {:else}
      <div>Hits</div>
      <div>0000</div>

      <div>Followers</div>
      <div>0000</div>

      <div>Updates</div>
      <div>0000</div>

      <div>Last updated</div>
      <div>0000 ago</div>
    {/if}

    <div>Backend</div>
    <div>
      {#if backend_alive === true}
        <span style="color: var(--green)">online</span>
      {:else if backend_alive === false}
        <span style="color: var(--red)">offline</span>
      {:else}
        Loading...
      {/if}
    </div>
  </div>
</div>

<style>
  .stats-container {
    display: grid;
    grid-template-columns: 3fr 2fr;
  }
</style>
