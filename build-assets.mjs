// Run from the repository root with Node 18 or newer: node build-assets.mjs
// Keep assets/eslam-yasser.png cropped and below 300 KB before rebuilding.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";

const FA = "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.5.2/svgs";
const ICON_COLOR = "#0284c7";

const icons = [
  ["solid", "globe", ICON_COLOR],
  ["brands", "linkedin", "#0a66c2"],
  ["brands", "github", ICON_COLOR],
  ["solid", "chart-simple", ICON_COLOR],
  ["solid", "envelope", "#dc2626"],
  ["solid", "location-dot", "#047857"],
  ["solid", "bolt", "#b45309"],
  ["solid", "graduation-cap", ICON_COLOR],
  ["solid", "laptop-code", ICON_COLOR],
  ["solid", "chalkboard-user", ICON_COLOR],
  ["solid", "trophy", ICON_COLOR],
  ["solid", "terminal", ICON_COLOR],
  ["solid", "screwdriver-wrench", ICON_COLOR],
  ["solid", "display", ICON_COLOR],
  ["solid", "server", ICON_COLOR],
  ["solid", "database", ICON_COLOR],
  ["solid", "gears", ICON_COLOR],
  ["solid", "rocket", ICON_COLOR],
  ["solid", "building", ICON_COLOR],
  ["solid", "book-open-reader", ICON_COLOR],
  ["solid", "utensils", ICON_COLOR],
  ["solid", "id-card", ICON_COLOR],
  ["solid", "briefcase", ICON_COLOR],
  ["solid", "lightbulb", ICON_COLOR],
  ["solid", "bullseye", ICON_COLOR],
  ["solid", "users", ICON_COLOR],
  ["brands", "react", "#0ea5e9"],
  ["solid", "award", ICON_COLOR],
  ["solid", "satellite", ICON_COLOR],
  ["solid", "shield-halved", ICON_COLOR],
  ["solid", "flask", ICON_COLOR],
  ["solid", "code", ICON_COLOR],
  ["solid", "chart-line", ICON_COLOR],
  ["solid", "handshake", ICON_COLOR],
];

const photoPath = "assets/eslam-yasser.png";
if (!existsSync(photoPath)) {
  throw new Error(`Missing ${photoPath}; add your portrait before building assets.`);
}
const photoSize = statSync(photoPath).size;
if (photoSize > 300 * 1024) {
  throw new Error(`${photoPath} is ${photoSize} bytes; crop/re-encode it below 300 KB first.`);
}

const downloadedIcons = [];
for (const [style, name, color] of icons) {
  const url = `${FA}/${style}/${name}.svg`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Font Awesome download failed for ${name}: HTTP ${response.status} (${url})`);
  }

  const source = await response.text();
  const openingTag = source.match(/<svg\b[^>]*>/)?.[0];
  const viewBox = openingTag?.match(/\bviewBox="([^"]+)"/)?.[1];
  if (!openingTag || !viewBox || !/<path\b/.test(source)) {
    throw new Error(`Unexpected Font Awesome SVG format for ${name} (${url})`);
  }
  if (/<(?:script|image|foreignObject)\b|\b(?:href|url)\s*=/i.test(source)) {
    throw new Error(`Unexpected external or active SVG content for ${name} (${url})`);
  }

  const icon = source
    .replace(/<svg\b[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="${viewBox}">`)
    .replace(/<path\b([^>]*)>/g, (_match, attributes) => {
      const cleanAttributes = attributes
        .replace(/\s+fill="[^"]*"/g, "")
        .replace(/\/\s*$/, "");
      return `<path${cleanAttributes} fill="${color}"/>`;
    });
  downloadedIcons.push([`assets/icons/${name}.svg`, icon]);
}

await mkdir("assets/icons", { recursive: true });
for (const [file, contents] of downloadedIcons) {
  await writeFile(file, contents);
  console.log(`icon  ${file}`);
}

const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1220"/>
      <stop offset="1" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="text-gradient" x1="0" x2="1">
      <stop offset="0" stop-color="#38bdf8"/>
      <stop offset="1" stop-color="#a78bfa"/>
    </linearGradient>
    <radialGradient id="glow-blue"><stop offset="0" stop-color="#0ea5e9" stop-opacity=".55"/><stop offset="1" stop-color="#0ea5e9" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow-purple"><stop offset="0" stop-color="#6366f1" stop-opacity=".55"/><stop offset="1" stop-color="#6366f1" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow-green"><stop offset="0" stop-color="#10b981" stop-opacity=".4"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity=".05"/>
    </pattern>
  </defs>
  <style>
    .hello { font: 500 20px monospace; fill: #cbd5e1; }
    .name { font: 800 66px sans-serif; }
    .line { font: 600 24px monospace; fill: #7dd3fc; opacity: 0; }
    .l1 { animation: cycle 12s infinite; }
    .l2 { animation: cycle 12s infinite 3s; }
    .l3 { animation: cycle 12s infinite 6s; }
    .l4 { animation: cycle 12s infinite 9s; }
    @keyframes cycle {
      0% { opacity: 0; transform: translateY(10px); }
      4%, 22% { opacity: 1; transform: translateY(0); }
      26%, 100% { opacity: 0; transform: translateY(-10px); }
    }
    .f1 { animation: float 6s ease-in-out infinite; }
    .f2 { animation: float 8s ease-in-out infinite 1s; }
    .f3 { animation: float 7s ease-in-out infinite 2s; }
    @keyframes float { 50% { transform: translateY(-16px); } }
    .glyph { font: 700 34px monospace; fill: #ffffff; fill-opacity: .12; }
    .cursor { animation: blink 1s steps(2) infinite; }
    @keyframes blink { 50% { opacity: 0; } }
  </style>
  <rect width="1200" height="300" fill="url(#background)"/>
  <rect width="1200" height="300" fill="url(#grid)"/>
  <circle class="f1" cx="180" cy="90" r="150" fill="url(#glow-blue)"/>
  <circle class="f2" cx="1020" cy="220" r="170" fill="url(#glow-purple)"/>
  <circle class="f3" cx="640" cy="290" r="130" fill="url(#glow-green)"/>
  <text class="glyph f2" x="90" y="240">&lt;/&gt;</text>
  <text class="glyph f1" x="1040" y="90">{ }</text>
  <text class="glyph f3" x="940" y="270">=&gt;</text>
  <text class="glyph f1" x="260" y="60">[ ]</text>
  <text class="hello" x="600" y="78" text-anchor="middle">&gt; hello, world. I'm<tspan class="cursor">_</tspan></text>
  <text class="name" x="600" y="150" text-anchor="middle" fill="url(#text-gradient)">Eslam Yasser</text>
  <text class="line l1" x="600" y="205" text-anchor="middle">Full-Stack Engineer · MEAN Stack &amp; React</text>
  <text class="line l2" x="600" y="205" text-anchor="middle">Crafting high-performance web systems</text>
  <text class="line l3" x="600" y="205" text-anchor="middle">Web Development Instructor</text>
  <text class="line l4" x="600" y="205" text-anchor="middle">Clean Architecture · Robust APIs</text>
  <rect y="238" height="3" rx="2" fill="url(#text-gradient)">
    <animate attributeName="x" values="600;450;600" dur="4s" repeatCount="indefinite"/>
    <animate attributeName="width" values="0;300;0" dur="4s" repeatCount="indefinite"/>
  </rect>
</svg>`;
await writeFile("assets/banner.svg", banner);
console.log("built assets/banner.svg");

const divider = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="24" viewBox="0 0 1200 24">
  <defs>
    <linearGradient id="divider-gradient" x1="0" x2="1">
      <stop offset="0" stop-color="#0ea5e9" stop-opacity="0"/>
      <stop offset=".5" stop-color="#6366f1"/>
      <stop offset="1" stop-color="#10b981" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="2" x="0" y="11" fill="url(#divider-gradient)"/>
  <circle r="5" cy="12" fill="#0284c7">
    <animate attributeName="cx" values="0;1200" dur="5s" repeatCount="indefinite"/>
  </circle>
</svg>`;
await writeFile("assets/divider.svg", divider);
console.log("built assets/divider.svg");

const photo = (await readFile(photoPath)).toString("base64");
const avatar = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
  <defs>
    <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0284c7"/>
      <stop offset=".5" stop-color="#4f46e5"/>
      <stop offset="1" stop-color="#047857"/>
    </linearGradient>
    <clipPath id="avatar-clip"><circle cx="120" cy="120" r="100"/></clipPath>
  </defs>
  <circle cx="120" cy="120" r="112" fill="none" stroke="url(#ring-gradient)" stroke-width="5" stroke-linecap="round" stroke-dasharray="70 18 12 18">
    <animateTransform attributeName="transform" type="rotate" from="0 120 120" to="360 120 120" dur="8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="120" cy="120" r="116" fill="none" stroke="#0284c7" stroke-opacity=".55" stroke-width="1">
    <animate attributeName="r" values="114;119;114" dur="3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="120" cy="120" r="104" fill="#f8fafc"/>
  <image href="data:image/png;base64,${photo}" x="20" y="20" width="200" height="200" preserveAspectRatio="xMidYMin slice" clip-path="url(#avatar-clip)"/>
</svg>`;
await writeFile("assets/avatar.svg", avatar);
console.log("built assets/avatar.svg");

console.log(`\nBuilt ${downloadedIcons.length} Font Awesome Free 6.5.2 icons and 3 SVG assets.`);
