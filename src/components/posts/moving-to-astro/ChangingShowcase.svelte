<script lang="ts">
  import { sleep } from "@scripts/module/util";
  let words = ["I can", "make these", "words change", "very easily", "with svelte!"];
  let current_word: number = $state(0);

  async function loop() {
    while (true) {
      current_word += 1;

      if (current_word >= words.length) {
        current_word = 0;
      }

      await sleep(1500);
    }
  }

  loop();
</script>

<div>
  {words[current_word]}
</div>

<style>
  div {
    color: var(--orange);
    font-weight: bold;

    background-color: var(--grey);
    width: 150px;
    text-align: center;
    padding: 8px;
  }
</style>
