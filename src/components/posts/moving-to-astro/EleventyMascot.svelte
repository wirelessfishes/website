<script lang="ts">
</script>

<div class="container">
  <img
    alt="Eleventy mascot (opossum) floating with a baloon strapped to them"
    src="/assets/post/moving-to-astro/eleventy.svg"
  />
  <div class="title">The 11ty mascot (2026)</div>
  <div>"Awesome Possum"</div>
  <div class="note">It's actually spelled<br />"Opossum" but whatever...</div>
</div>

<style>
  .container {
    float: right;
    display: flex;
    align-items: center;
    flex-direction: column;

    background: linear-gradient(to bottom, var(--darkgrey), var(--grey), var(--darkgrey));
    padding: 8px;
    border-radius: 2px;

    text-shadow: 1px 1px 4px var(--black);

    margin-top: 1em;
    margin-left: 1em;
  }

  .title {
    font-weight: bold;
  }

  .note {
    opacity: 70%;
    font-size: smaller;
    text-align: center;
  }

  img {
    width: 100px;
    margin-top: 8px;
    margin-bottom: 16px;
    filter: drop-shadow(3px 3px 5px var(--black));
  }
</style>
