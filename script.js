// ---------- Data: placeholder projects ----------
// Swap these arrays with real content — the card markup is generated automatically.

const projects = [
  {
    name: "AI Product Videos & Commercials",
    category: "AI Video",
    description: "Creative product advertising, beauty and lifestyle visuals, food and beverage content, cinematic product showcases, and commercial-style AI videos.",
    role: "Concept & AI Production",
    tools: "Kling, Seedance, CapCut",
    image: "assets/project-ai-video.webp",
    videoRatio: "9 / 16",
    videos: [
      "https://player.cloudinary.com/embed/?cloud_name=r1vxjwuh&public_id=copy_969529AA-CD62-4A28-B31F-077529CE8452&controls=true&autoplay=false&muted=false",
      "https://player.cloudinary.com/embed/?cloud_name=r1vxjwuh&public_id=copy_D0926403-F0E1-42FC-AF56-7AA3FFE7FA82&controls=true&autoplay=false&muted=false",
      "https://player.cloudinary.com/embed/?cloud_name=r1vxjwuh&public_id=copy_662E45E4-D93C-4B48-A93F-74BADB25BD8E&controls=true&autoplay=false&muted=false",
    ],
  },
  {
    name: "AI Images & Product Photography",
    category: "AI Photography",
    description: "Commercial-style product photography, branded visuals, lifestyle images, and campaign concepts created with AI.",
    role: "Creative Direction",
    tools: "Midjourney, GPT Image",
    image: "assets/project-ai-photography.webp",
    imageFit: "contain",
    gallery: [
      "assets/projects/ai-photography/gallery-1.webp",
      "assets/projects/ai-photography/gallery-2.jpg",
    ],
  },
  {
    name: "AI Characters & Avatars",
    category: "AI Characters",
    description: "Consistent AI characters, brand mascots, avatars, and digital presenters that can be used across different scenes and content formats.",
    role: "Character Design",
    tools: "Midjourney, HeyGen",
    image: "assets/project-ai-characters.webp",
    gallery: [
      "assets/projects/ai-characters/gallery-1.webp",
      "assets/projects/ai-characters/gallery-2.webp",
      "assets/projects/ai-characters/gallery-3.webp",
    ],
  },
  {
    name: "AI Animated Series & Storytelling",
    category: "AI Animation",
    description: "Development of short AI-generated animated series, including concept creation, character development, storyboards, keyframes, scene consistency, animation, and final editing.",
    role: "Story & Animation",
    tools: "Midjourney, Kling, CapCut",
    image: "assets/project-ai-animation.webp",
    imageFit: "contain",
  },
];

function renderProjects() {
  const grid = document.getElementById("projectGrid");
  grid.innerHTML = projects
    .map(
      (p, i) => `
    <article class="project-card reveal">
      <div class="project-media"${
        p.image
          ? ` style="background-image:url('${p.image}');background-size:${p.imageFit || "cover"};"`
          : ""
      }>
        <span class="project-cat">${p.category}</span>
        ${p.image ? "" : `<span class="project-placeholder-label">Add image</span>`}
      </div>
      <div class="project-body">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="project-meta">
          <span>${p.role} · ${p.tools}</span>
          <a href="#" class="project-link" data-project-index="${i}">View
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </a>
        </div>
      </div>
    </article>`
    )
    .join("");
}

renderProjects();

// ---------- Project lightbox ----------
const lightbox = document.getElementById("lightbox");
const lightboxPanel = document.getElementById("lightboxPanel");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxCat = document.getElementById("lightboxCat");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDesc = document.getElementById("lightboxDesc");
const lightboxGallery = document.getElementById("lightboxGallery");

function openLightbox(index) {
  const p = projects[index];
  if (!p) return;

  const videos = p.videos || [];
  const images = videos.length
    ? p.gallery || []
    : p.gallery && p.gallery.length
    ? p.gallery
    : [p.image].filter(Boolean);
  const totalItems = videos.length + images.length;
  const isSingle = totalItems === 1;

  lightboxCat.textContent = p.category;
  lightboxTitle.textContent = p.name;
  lightboxDesc.textContent = p.description;

  const videoRatio = p.videoRatio || "16 / 9";
  const isVertical = videoRatio.trim().startsWith("9");
  const videoItems = videos
    .map(
      (src) => `
      <div class="lightbox-item lightbox-item-video${isSingle ? " single" : ""}${isVertical ? " vertical" : ""}">
        <div class="lightbox-video-wrap" style="aspect-ratio:${videoRatio};">
          <iframe
            src="${src}"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowfullscreen
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            frameborder="0"
            loading="lazy"
            title="${p.name}"
          ></iframe>
        </div>
      </div>`
    )
    .join("");

  const imageItems = images
    .map(
      (src, i) => `
      <div class="lightbox-item${isSingle ? " single" : ""}">
        <img src="${src}" alt="${p.name}" loading="lazy" data-preview-index="${i}" />
      </div>`
    )
    .join("");

  lightboxGallery.innerHTML = videoItems + imageItems;
  currentGalleryImages = images;

  lightbox.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  document.body.style.overflow = "";
}

document.getElementById("projectGrid").addEventListener("click", (e) => {
  const link = e.target.closest(".project-link");
  if (!link) return;
  e.preventDefault();
  openLightbox(Number(link.dataset.projectIndex));
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (preview.classList.contains("is-open")) closePreview();
    else if (lightbox.classList.contains("is-open")) closeLightbox();
  }
  if (preview.classList.contains("is-open")) {
    if (e.key === "ArrowRight") showPreview(previewIndex + 1);
    if (e.key === "ArrowLeft") showPreview(previewIndex - 1);
  }
});

// ---------- Image preview (zoom) ----------
const preview = document.getElementById("preview");
const previewImg = document.getElementById("previewImg");
const previewClose = document.getElementById("previewClose");
const previewPrev = document.getElementById("previewPrev");
const previewNext = document.getElementById("previewNext");
let currentGalleryImages = [];
let previewIndex = 0;

function showPreview(index) {
  if (!currentGalleryImages.length) return;
  previewIndex = (index + currentGalleryImages.length) % currentGalleryImages.length;
  previewImg.src = currentGalleryImages[previewIndex];
  const hasMultiple = currentGalleryImages.length > 1;
  previewPrev.style.display = hasMultiple ? "flex" : "none";
  previewNext.style.display = hasMultiple ? "flex" : "none";
}

function openPreview(index) {
  showPreview(index);
  preview.classList.add("is-open");
}

function closePreview() {
  preview.classList.remove("is-open");
}

lightboxGallery.addEventListener("click", (e) => {
  const img = e.target.closest("img[data-preview-index]");
  if (!img) return;
  openPreview(Number(img.dataset.previewIndex));
});

previewClose.addEventListener("click", closePreview);
previewPrev.addEventListener("click", () => showPreview(previewIndex - 1));
previewNext.addEventListener("click", () => showPreview(previewIndex + 1));
preview.addEventListener("click", (e) => {
  if (e.target === preview) closePreview();
});

// ---------- Nav scroll state ----------
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 20);
});

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  })
);

// ---------- Scroll reveal ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
