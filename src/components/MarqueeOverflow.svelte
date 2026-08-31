<script>
  let { text = "", speed = 16, class: className = "", style = "" } = $props();

  let container, content;
  let distance = $state(0);

  $effect(() => {
    text;
    queueMicrotask(() => {
      distance = Math.max(0, content.scrollWidth - container.clientWidth);
    });
  });

  let duration = $derived(distance / speed || 1);
</script>

<div class="marquee {className}" {style} bind:this={container}>
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
  .marquee span {
    display: inline-block;
    animation: scroll var(--dur) linear infinite alternate;
  }
  @keyframes scroll {
    0%,
    30% {
      transform: translateX(0);
    }
    70%,
    100% {
      transform: translateX(calc(-1 * var(--dist)));
    }
  }
</style>
