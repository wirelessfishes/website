<script lang="ts">
  import { AeroButtonColors } from "../scripts/aerobutton";

  const { children, color = "#000", id = "", text_color = "#fff" } = $props();

  const buttonc = $derived(AeroButtonColors(color));
</script>

<button
  style:--color={buttonc.regular.base}
  style:--color_lighter={buttonc.regular.lighter}
  style:--color_border={buttonc.border}
  style:--color_hover={buttonc.hover.base}
  style:--color_hover_lighter={buttonc.hover.lighter}
  {id}
>
  {@render children()}
</button>

<style>
  button {
    background: linear-gradient(to bottom, var(--color_lighter), var(--color_lighter), var(--color), var(--color));
    box-shadow: inset 0 0 0 1px var(--color_border);
    border-radius: 2px;
    border: 0px;
    cursor: pointer;
    font-family: "Stack Sans Text";
    outline: 0px solid transparent;

    color: var(--text_color);
    text-shadow: 0px 0px 4px var(--black);
    padding: 2px 1em;

    text-decoration: none;
    text-align: center;
  }

  button:hover {
    background: linear-gradient(
      to bottom,
      var(--color_hover_lighter),
      var(--color_hover_lighter),
      var(--color_hover),
      var(--color_hover)
    );
  }
</style>
