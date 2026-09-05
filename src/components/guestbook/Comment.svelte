<script lang="ts">
  import Reply from "./Reply.svelte";
  import AeroButton from "@components/AeroButton.svelte";

  import type { GuestbookEntry } from "@scripts/types/guestbook";
  import { colors } from "@scripts/colors";

  import { format } from "date-fns";

  interface Props {
    onreplyclick: (reply_entry: GuestbookEntry) => void;
    oncancelreply: () => void;
    guestbook_entry: GuestbookEntry;
    replying_to: boolean;
  }

  const { onreplyclick, oncancelreply, guestbook_entry, replying_to = false }: Props = $props();
</script>

<div class="comment_element">
  <div class="comment">
    <div>
      <div class="comment_content">
        {guestbook_entry.content}
      </div>

      <div class="comment_info">
        <span class="comment_name">
          {guestbook_entry.name}
          {#if guestbook_entry.verified}
            <img class="verified-img" title="Webmaster" alt="verified icon" loading="lazy" src="/assets/shield.svg" />
          {/if}
        </span>

        <span class="comment_date">{format(new Date(guestbook_entry.created), "yyyy/MM/dd")}</span>
        {#if guestbook_entry.site}
          <a href={guestbook_entry.site} target="_blank">{new URL(guestbook_entry.site).hostname} 🡕</a>
        {/if}
      </div>
    </div>

    <div class="control">
      {#if !replying_to}
        <AeroButton onclick={() => onreplyclick?.(guestbook_entry)} color={colors.blue}>Reply</AeroButton>
      {:else}
        <AeroButton onclick={() => oncancelreply?.()} color={colors.red}>Cancel</AeroButton>
      {/if}
    </div>
  </div>

  <div class="comment_replies">
    {#each guestbook_entry.replies as reply}
      <Reply guestbook_entry={reply} />
    {/each}
  </div>
</div>

<style>
  .control {
    text-wrap: nowrap;
  }

  .comment {
    background-color: var(--grey);
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
    padding-right: 1em;
  }

  .comment_info {
    display: flex;
    gap: 1em;

    color: var(--lightgrey);
    font-style: italic;
  }

  .comment_name {
    display: flex;
    align-items: center;
  }

  .verified-img {
    margin-left: 6px;
    display: inline;
    width: 1em;
  }

  @media (max-width: 500px) {
    .comment {
      display: block;
    }

    .control {
      display: flex;
      justify-content: end;
      padding: 4px;
    }
  }
</style>
