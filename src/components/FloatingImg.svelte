<script>
  const { src, alt, top, left, width, hover_fade = true, desktop_only = true } = $props();
</script>

<div class="wrapper" style:width>
  <img {alt} {src} style:top style:left />
</div>

{#if hover_fade}
  <style>
    .wrapper:hover {
      opacity: 40%;
    }
  </style>
{/if}

{#if desktop_only}
  <style>
    @media (max-width: 1000px) {
      .wrapper {
        display: none;
      }
    }
  </style>
{/if}

<style>
  .wrapper {
    transition: 100ms;
    position: relative;
    height: fit-content;
  }

  img {
    position: absolute;
  }
</style>
