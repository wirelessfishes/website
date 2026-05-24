import fs from "fs";
import path from "path";

export default function () {
  const dirPath = path.join(process.cwd(), "public/assets/stamps");

  try {
    const files = fs.readdirSync(dirPath);

    return files.filter((file) => !file.startsWith("."));
  } catch (err) {
    console.error("Directory reading failed:", err);
    return [];
  }
}
