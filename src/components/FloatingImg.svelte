<script>
  const { src, alt, top, left, width } = $props();
</script>

<div class="wrapper" style:width>
  <img {alt} {src} style:top style:left />
</div>

<style>
  .wrapper {
    position: relative;
    pointer-events: none;
  }

  img {
    position: absolute;
  }
</style>
