<script lang="ts">
  import type { GuestbookEntry } from "@scripts/types/guestbook";

  import { format } from "date-fns";

  interface Props {
    guestbook_entry: GuestbookEntry;
  }

  const { guestbook_entry }: Props = $props();
</script>

<div>
  <div class="comment">
    <div>
      <div class="comment_content">
        {guestbook_entry.content}
      </div>

      <div class="comment_info">
        <span class="comment_name">{guestbook_entry.name}</span>
        <span class="comment_date">{format(new Date(guestbook_entry.created), "yyyy/MM/dd")}</span>
      </div>
    </div>
  </div>
</div>

<style>
  .comment {
    background-color: var(--grey);
    padding: 2px 8px;
    border-radius: 2px;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .comment_content {
    font-size: 16px;
  }

  .comment_info {
    display: flex;
    gap: 1em;

    opacity: 70%;
    font-style: italic;
  }
</style>
