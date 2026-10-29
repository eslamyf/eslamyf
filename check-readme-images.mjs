import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const readme = await readFile(path.join(root, "README.md"), "utf8");
const tags = readme.match(/<[^>]+>/gs) ?? [];
const localPaths = new Set();

for (const tag of tags) {
  const attributes = tag.matchAll(/\b(src|srcset)\s*=\s*(["'])(.*?)\2/gi);
  for (const [, attribute, , value] of attributes) {
    const sources = attribute.toLowerCase() === "srcset"
      ? value.split(",").map((candidate) => candidate.trim().split(/\s+/, 1)[0])
      : [value.trim()];

    for (const source of sources) {
      if (!source || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(source)) {
        continue;
      }
      const localPath = source.split(/[?#]/, 1)[0];
      if (localPath) {
        localPaths.add(localPath);
      }
    }
  }
}

async function existsWithExactCase(relativePath) {
  let current = root;
  for (const segment of relativePath.replace(/\\/g, "/").split("/")) {
    if (!segment || segment === ".") {
      continue;
    }
    if (segment === "..") {
      return false;
    }

    const entries = await readdir(current, { withFileTypes: true });
    const entry = entries.find((candidate) => candidate.name === segment);
    if (!entry) {
      return false;
    }
    current = path.join(current, entry.name);
  }
  return true;
}

const missing = [];
for (const localPath of localPaths) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(localPath);
  } catch (error) {
    throw new Error(`Invalid URI encoding in README image path "${localPath}".`, { cause: error });
  }
  if (!(await existsWithExactCase(decodedPath))) {
    missing.push(localPath);
  }
}

if (missing.length > 0) {
  console.error("Missing local README image path(s):");
  for (const localPath of missing) {
    console.error(`  ${localPath}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Checked ${localPaths.size} local README image path(s): all exist with exact case.`);
}
