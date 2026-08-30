<script lang="ts">
  import Reply from "./Reply.svelte";
  import AeroButton from "@components/AeroButton.svelte";

  import type { GuestbookEntry } from "@scripts/types/guestbook";
  import { colors } from "@scripts/colors";

  import { format } from "date-fns";

  interface Props {
    guestbook_entry: GuestbookEntry;
  }

  const { guestbook_entry }: Props = $props();
</script>

<div class="comment_element">
  <div class="comment">
    <div>
      <div class="comment_content">
        {guestbook_entry.content}
      </div>

      <div class="comment_info">
        <span class="comment_name">{guestbook_entry.name}</span>
        <span class="comment_date">{format(new Date(guestbook_entry.created), "yyyy/MM/dd")}</span>
        {#if guestbook_entry.site}
          <a href={guestbook_entry.site} target="_blank">{new URL(guestbook_entry.site).hostname} 🡕</a>
        {/if}
      </div>
    </div>

    <AeroButton color={colors.blue}>Reply</AeroButton>
  </div>

  <div class="comment_replies">
    {#each guestbook_entry.replies as reply}
      <Reply guestbook_entry={reply} />
    {/each}
  </div>
</div>

<style>
  .comment {
    background-color: var(--darkgrey);
    padding: 2px 8px;
    border-radius: 2px;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .comment_replies {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .comment_replies > :global(:first-child) {
    margin-top: 4px;
  }

  .comment_replies > :global(*) {
    background-color: var(--grey);
  }

  .comment_content {
    font-size: 16px;
  }

  .comment_info {
    display: flex;
    gap: 1em;

    color: var(--lightgrey);
    font-style: italic;
  }
</style>
