<script lang="ts">
  import type { GuestbookResponse } from "../../scripts/types/guestbook";
  import { getGuestbook } from "../../scripts/module/guestbook";
  import Comment from "./Comment.svelte";

  let guestbook_data: GuestbookResponse | undefined = $state();

  getGuestbook().then((data) => (guestbook_data = data));
</script>

<div class="content-padding comment-container">
  {#if !guestbook_data}
    <span>Loading guestbook data...</span>
  {:else}
    {#each guestbook_data.entries as entry}
      <Comment guestbook_entry={entry} />
    {/each}
  {/if}
</div>

<style>
  .comment-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
