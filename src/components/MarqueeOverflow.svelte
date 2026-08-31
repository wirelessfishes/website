<script>
  let { style = "", text = "", speed = 40 } = $props();

  let container, content;
  let distance = $state(0);

  $effect(() => {
    text; // track dependency
    // wait for DOM update from text change before measuring
    queueMicrotask(() => {
      distance = Math.max(0, content.scrollWidth - container.clientWidth);
    });
  });

  let duration = $derived(distance / speed || 1);
</script>

<div class="marquee" {style} bind:this={container}>
  <span bind:this={content} style="--dist:{distance}px; --dur:{duration}s">
    {text}
  </span>
</div>

<style>
  .marquee {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
  }
  span {
    display: inline-block;
    animation: scroll var(--dur) linear infinite alternate;
  }
  @keyframes scroll {
    0%,
    10% {
      transform: translateX(0);
    }
    90%,
    100% {
      transform: translateX(calc(-1 * var(--dist)));
    }
  }
</style>
