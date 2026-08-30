<script lang="ts">
  import { getUserAvatar } from "../../scripts/module/lastfm";
  import type { UserInfo } from "../../scripts/types/lastfm";

  interface Props {
    user: UserInfo;
  }

  const { user }: Props = $props();
</script>

<div class="scrobble-user">
  <img alt="lastfm avatar" src={getUserAvatar(user, "large")} loading="lazy" class="scrobble-user_img" />

  <div class="scrobble-user_info">
    <a href={user.user.url} class="scrobble-user_name">{user.user.name} 🡕</a>
    <div>{user.user.playcount} total scrobbles</div>
  </div>
</div>

<style>
  .scrobble-user_img {
    aspect-ratio: 1;
    border-radius: 100%;
    object-fit: cover;
    overflow: hidden;
    width: 100px;
  }

  .scrobble-user {
    display: flex;
    justify-content: center;
    margin: 16px 0px;
  }

  .scrobble-user_info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 4px 8px;
  }

  .scrobble-user_name {
    width: fit-content;
  }
</style>
