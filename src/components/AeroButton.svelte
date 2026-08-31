<script lang="ts">
  import { AeroButtonColors } from "../scripts/aerobutton";

  const { onclick, disabled = false, children, color = "#000", id = "", text_color = "#fff" } = $props();

  const buttonc = $derived(AeroButtonColors(color));
</script>

<button
  style:--color={buttonc.regular.base}
  style:--color_lighter={buttonc.regular.lighter}
  style:--color_border={buttonc.border}
  style:--color_hover={buttonc.hover.base}
  style:--color_hover_lighter={buttonc.hover.lighter}
  {id}
  {disabled}
  onclick={(e) => onclick?.(e)}
>
  {@render children()}
</button>

<style>
  button {
    background: linear-gradient(to bottom, var(--color_lighter), var(--color_lighter), var(--color), var(--color));
    box-shadow: inset 0 0 0 1px var(--color_border);
    border-radius: 2px;
    border: 0px;
    font-family: "Stack Sans Text";
    outline: 0px solid transparent;
    width: fit-content;

    color: var(--text_color);
    text-shadow: 0px 0px 4px var(--black);
    padding: 0.2em 1em;

    text-decoration: none;
    text-align: center;
  }

  button:hover:not(:disabled) {
    cursor: pointer;
    background: linear-gradient(
      to bottom,
      var(--color_hover_lighter),
      var(--color_hover_lighter),
      var(--color_hover),
      var(--color_hover)
    );
  }

  button:disabled {
    filter: saturate(50%);
    opacity: 70%;
    cursor: not-allowed;
  }
</style>
