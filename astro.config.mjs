import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import { satteri } from "@astrojs/markdown-satteri";

export default defineConfig({
  integrations: [svelte(), mdx()],
  markdown: {
    processor: satteri({ features: { directive: true } }),
  },
});
