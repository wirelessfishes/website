<script lang="ts">
  import "javascript-time-ago/locale/en";
  import TimeAgo, { type FormatStyleName } from "javascript-time-ago";
  let timeAgo = new TimeAgo("en");

  interface Props {
    date: Date;
    format: FormatStyleName;
  }

  const { date, format }: Props = $props();
</script>

<span>{timeAgo.format(date, format)}</span>
