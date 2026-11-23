"use strict";

const videos = [
  {
    title: "Spreadsheet · 4K",
    label: "4K spreadsheet",
    file: "spreadsheet-4k",
    meta: "Pro-4B · 3840 × 2160 · 4/4 verified clicks",
    summary: "A 12 × 13-pixel checkbox in a 48-project workbook, followed by cell formatting and a team-level forecast. The business data is fictional, with distinct projects and delivery notes.",
  },
  {
    title: "Three Suns · English · 2K",
    label: "Three Suns · EN",
    file: "three-suns-en-2k",
    meta: "Pro-35B-A3B · 2560 × 1440 · 8/8 verified clicks",
    summary: "Eight clicks through an original browser game, from observing the sky to reviving a civilization. Mean model inference is 511 ms; mean screenshot-to-click time is 1.78 s.",
  },
  {
    title: "Three Suns · 中文 · 2K",
    label: "Three Suns · 中文",
    file: "three-suns-zh-2k",
    meta: "Pro-35B-A3B · 2560 × 1440 · 8/8 verified clicks",
    summary: "Chinese instructions with a different interface layout. Mean model inference is 472 ms; mean screenshot-to-click time is 1.71 s.",
  },
  {
    title: "Vector editor · 2K",
    label: "Vector editor",
    file: "svg-editor-2k",
    meta: "Pro-4B · 2560 × 1440 · 5/5 verified clicks",
    summary: "Select a shape, change its fill with a small palette control, and undo the changes in SVG-Edit.",
  },
  {
    title: "Browser navigation · 2K",
    label: "Browser",
    file: "browser-navigation",
    meta: "Pro-4B · 2560 × 1440 · 4/4 verified clicks",
    summary: "Navigate Wikipedia: choose English, open the menu, visit About Wikipedia, and focus the search field.",
  },
];

const collections = {
  high: {
    title: "High resolution",
    note: "Saved model predictions on original screenshots. Pink boxes mark targets. Enlarged crops are for display only.",
    cases: [
      { title: "Color picker", file: "h1", height: 2256 },
      { title: "Window control", file: "h2", height: 1446 },
      { title: "Clone stamp", file: "h3", height: 2190 },
      { title: "Gradient tool", file: "h4", height: 1446 },
    ],
  },
  everyday: {
    title: "Everyday UI",
    note: "Selected successful predictions across everyday interfaces. Expand a comparison to see all four models on the same crop.",
    cases: [
      { title: "Pencil tool", file: "l2", height: 2256 },
      { title: "Customize", file: "l1", height: 2190 },
      { title: "Calendar", file: "l3", height: 2190 },
      { title: "Favorites", file: "l4", height: 2190 },
    ],
  },
  mechanism: {
    title: "Token → pixel",
    note: "Saved token and pixel scores from one forward pass. Teal shows token probabilities and amber shows pixel probabilities, normalized independently for display. Target boxes are annotations, not model inputs.",
    cases: [
      { title: "Pencil tool", file: "l2-readout", height: 1470 },
      { title: "Color picker", file: "h1-readout", height: 1470 },
      { title: "Window control", file: "h2-readout", height: 1470 },
    ],
  },
};

const player = document.getElementById("demo-video");
const videoTitle = document.getElementById("video-title");
const metadata = document.getElementById("video-meta");
const counter = document.getElementById("video-count");
const videoError = document.getElementById("video-error");
const tabs = document.getElementById("video-tabs");
const previous = document.getElementById("previous-video");
const next = document.getElementById("next-video");
let selectedVideo = 0;

videos.forEach((demo, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "video-tab";
  button.textContent = demo.label;
  button.setAttribute("aria-label", `Show video ${index + 1}: ${demo.title}`);
  button.setAttribute("aria-controls", "demo-video");
  button.setAttribute("aria-pressed", String(index === selectedVideo));
  button.addEventListener("click", () => selectVideo(index));
  tabs.append(button);
});

function selectVideo(index) {
  const requested = (index + videos.length) % videos.length;
  if (requested === selectedVideo) return;
  selectedVideo = requested;
  const demo = videos[selectedVideo];
  player.pause();
  videoError.hidden = true;
  player.poster = `assets/demos/${demo.file}.png`;
  player.querySelector("source").src = `assets/demos/${demo.file}.mp4`;
  player.load();
  player.setAttribute("aria-label", `${demo.title}, original-resolution recording`);
  videoTitle.textContent = demo.title;
  metadata.textContent = demo.meta;
  document.getElementById("video-summary").textContent = demo.summary;
  document.getElementById("video-original").href = `assets/demos/${demo.file}.mp4`;
  counter.textContent = `${String(selectedVideo + 1).padStart(2, "0")} / ${String(videos.length).padStart(2, "0")}`;
  counter.setAttribute("aria-label", `Video ${selectedVideo + 1} of ${videos.length}`);
  [...tabs.children].forEach((button, position) => {
    button.setAttribute("aria-pressed", String(position === selectedVideo));
  });
}

previous.addEventListener("click", () => selectVideo(selectedVideo - 1));
next.addEventListener("click", () => selectVideo(selectedVideo + 1));
document.querySelector(".video-card").addEventListener("keydown", event => {
  if (!event.target.closest(".carousel-buttons, .video-tabs")) return;
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  selectVideo(selectedVideo + (event.key === "ArrowLeft" ? -1 : 1));
});
player.addEventListener("error", () => { videoError.hidden = false; });
player.querySelector("source").addEventListener("error", () => { videoError.hidden = false; });

function linkedImage(filename, label, height) {
  const link = document.createElement("a");
  link.href = `assets/cases/${filename}.png`;
  link.target = "_blank";
  link.rel = "noopener";
  link.setAttribute("aria-label", `Open ${label} at full resolution`);
  const image = document.createElement("img");
  image.src = link.href;
  image.alt = label;
  image.width = 4320;
  if (height) image.height = height;
  image.loading = "lazy";
  image.decoding = "async";
  link.append(image);
  return link;
}

function selectCollection(key) {
  const collection = collections[key];
  const fragment = document.createDocumentFragment();
  collection.cases.forEach((item, index) => {
    const figure = document.createElement("figure");
    figure.className = "case-card";
    const caption = document.createElement("figcaption");
    const number = document.createElement("span");
    number.className = "case-number";
    number.textContent = String(index + 1).padStart(2, "0");
    const heading = document.createElement("h3");
    heading.textContent = item.title;
    const category = document.createElement("span");
    category.className = "case-type";
    category.textContent = collection.title;
    caption.append(number, heading, category);
    const label = key === "mechanism"
      ? `${item.title}: saved token selection, within-token pixel scores, and final click.`
      : `${item.title}: original screenshot and enlarged saved PixelOne-Pro prediction.`;
    figure.append(caption, linkedImage(item.file, label, item.height));
    if (key !== "mechanism") {
      const details = document.createElement("details");
      details.className = "comparison";
      const summary = document.createElement("summary");
      summary.textContent = "Compare model predictions";
      details.append(summary);
      details.addEventListener("toggle", () => {
        if (details.open && !details.querySelector("img")) {
          details.append(linkedImage(`${item.file}-comparison`, `${item.title}: four models on the same display crop.`));
        }
      });
      figure.append(details);
    }
    fragment.append(figure);
  });
  document.getElementById("case-list").replaceChildren(fragment);
  const scrollPanel = document.getElementById("case-scroll");
  scrollPanel.scrollTop = 0;
  scrollPanel.setAttribute("aria-label", `${collection.title} cases. Scroll vertically inside this panel.`);
  document.getElementById("case-count").textContent = `${collection.cases.length} cases`;
  document.getElementById("case-note").textContent = collection.note;
  document.querySelectorAll("[data-collection]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.collection === key));
  });
}

document.querySelectorAll("[data-collection]").forEach(button => {
  button.addEventListener("click", () => selectCollection(button.dataset.collection));
});
selectCollection("high");

const copyButton = document.getElementById("copy-citation");
copyButton.hidden = false;
copyButton.addEventListener("click", async () => {
  const status = document.getElementById("copy-status");
  const citation = document.getElementById("bibtex");
  try {
    await navigator.clipboard.writeText(citation.textContent);
    status.textContent = "BibTeX copied.";
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(citation);
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = "Citation selected. Press Ctrl+C or ⌘C to copy.";
  }
});
