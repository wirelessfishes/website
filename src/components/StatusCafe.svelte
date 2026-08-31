<script lang="ts">
  import { getSCafeData, type StatusCafe } from "@scripts/statuscafe.ts";

  let scafe: StatusCafe | undefined = $state();

  getSCafeData().then((data) => (scafe = data));
</script>

<div>
  <h3>status.cafe</h3>

  {#if !scafe}
    <div>Loading...</div>

    <div class="user">
      [
      <span>Loading...</span>
      <span>Loading...</span>
      ]
    </div>
  {:else}
    <div>{scafe.content}</div>

    <div class="user">
      [
      <a href="https://status.cafe/users/sharky" target="_blank">{scafe.author}</a>
      <span>{scafe.timeAgo}</span>
      ]
    </div>
  {/if}
</div>

<style>
  .user {
    display: flex;
    gap: 2px;
  }

  .user > span {
    color: var(--lightergrey);
    font-style: italic;
  }
</style>
