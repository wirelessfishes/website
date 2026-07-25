export default async function (eleventyConfig) {
  eleventyConfig.setInputDirectory("src");
  eleventyConfig.setOutputDirectory("dist");

  eleventyConfig.addPassthroughCopy({ public: "/" });
  eleventyConfig.addPassthroughCopy({ "LICENSE.txt": "LICENSE.txt" });
  eleventyConfig.addPassthroughCopy({ "MIT-LICENSE.txt": "MIT-LICENSE.txt" });

  eleventyConfig.addFilter("utcDate", (date) => {
    return new Date(date).toLocaleDateString("en-CA");
  });

  eleventyConfig.addCollection("shark_pages", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/shark/*.md");
  });

  return {
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
}
