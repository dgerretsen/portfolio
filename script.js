// ---------- Project media ----------
// Card texts live in index.html (so search engines can read them). Here we only keep
// what the "View" window shows, in the same order as the cards.
// A { title, images: [...] } gallery entry is one carousel frame; a plain string is a single image.

const projects = [
  {
    videoRatio: "9 / 16",
    videos: [
      "https://player.cloudinary.com/embed/?cloud_name=r1vxjwuh&public_id=copy_969529AA-CD62-4A28-B31F-077529CE8452&controls=true&autoplay=false&muted=false",
      "https://player.cloudinary.com/embed/?cloud_name=r1vxjwuh&public_id=copy_D0926403-F0E1-42FC-AF56-7AA3FFE7FA82&controls=true&autoplay=false&muted=false",
      "https://player.cloudinary.com/embed/?cloud_name=r1vxjwuh&public_id=copy_662E45E4-D93C-4B48-A93F-74BADB25BD8E&controls=true&autoplay=false&muted=false",
      "https://player.cloudinary.com/embed/?cloud_name=r1vxjwuh&public_id=48840DDA-FD6F-4B77-91A1-E0AED5BDF040&controls=true&autoplay=false&muted=false",
      "https://player.cloudinary.com/embed/?cloud_name=r1vxjwuh&public_id=copy_04F072D9-1B1B-44B4-BE35-2329C281E2E0&controls=true&autoplay=false&muted=false",
    ],
  },
  {
    gallery: [
      "assets/projects/ai-photography/gallery-1.webp",
      "assets/projects/ai-photography/gallery-2.jpg",
      {
        title: "Dress Ad",
        images: [
          "assets/projects/ai-photography/dress-ad/01.jpg",
          "assets/projects/ai-photography/dress-ad/02.jpg",
          "assets/projects/ai-photography/dress-ad/03.jpg",
          "assets/projects/ai-photography/dress-ad/04.jpg",
          "assets/projects/ai-photography/dress-ad/05.jpg",
          "assets/projects/ai-photography/dress-ad/06.jpg",
          "assets/projects/ai-photography/dress-ad/07.jpg",
        ],
      },
    ],
  },
  {
    gallery: [
      {
        title: "KOMETA-7",
        images: [
          "assets/projects/ai-characters/kometa-7/captain-zoryan.webp",
          "assets/projects/ai-characters/kometa-7/atom.webp",
        ],
      },
      {
        title: "AI-Avatar (Tory)",
        images: [
          "assets/projects/ai-characters/tory/01.jpg",
          "assets/projects/ai-characters/tory/02.jpg",
          "assets/projects/ai-characters/tory/03.jpg",
          "assets/projects/ai-characters/tory/04.jpg",
          "assets/projects/ai-characters/tory/05.jpg",
          "assets/projects/ai-characters/tory/06.jpg",
          "assets/projects/ai-characters/tory/07.jpg",
        ],
      },
    ],
  },
  {
    videos: [
      "https://player.cloudinary.com/embed/?cloud_name=r1vxjwuh&public_id=copy_compressed&controls=true&autoplay=false&muted=false",
    ],
  },
];

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
  const card = document.querySelectorAll(".project-card")[index];
  if (!p || !card) return;

  const videos = p.videos || [];
  const entries = p.gallery || [];
  const totalItems = videos.length + entries.length;
  const isSingle = totalItems === 1;

  const name = card.querySelector("h3").textContent;
  lightboxCat.textContent = card.querySelector(".project-cat").textContent;
  lightboxTitle.textContent = name;
  lightboxDesc.textContent = card.querySelector(".project-body p").textContent;

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
            title="${name}"
          ></iframe>
        </div>
      </div>`
    )
    .join("");

  // Zoom groups: all single images share group 0 (so they page through each other);
  // every carousel is its own group, so zoom only pages through that avatar's photos.
  previewGroups = [entries.filter((e) => typeof e === "string")];
  let plainIndex = 0;

  const imageItems = entries
    .map((entry) => {
      if (typeof entry === "string") {
        return `
      <div class="lightbox-item${isSingle ? " single" : ""}">
        <img src="${entry}" alt="${name}" loading="lazy" data-group="0" data-preview-index="${plainIndex++}" />
      </div>`;
      }

      const group = previewGroups.push(entry.images) - 1;
      const many = entry.images.length > 1;
      const slides = entry.images
        .map(
          (src, i) => `
          <div class="carousel-slide">
            <img src="${src}" alt="${name}" ${i ? 'loading="lazy"' : ""} data-group="${group}" data-preview-index="${i}" />
          </div>`
        )
        .join("");
      const dots = entry.images
        .map((_, i) => `<button class="carousel-dot${i ? "" : " active"}" data-slide="${i}" aria-label="Photo ${i + 1}"></button>`)
        .join("");

      return `
      <div class="lightbox-item carousel${isSingle ? " single" : ""}">
        ${
          entry.title
            ? `<div class="carousel-caption">
                 <span class="carousel-title">${entry.title}</span>
                 ${many ? `<span class="carousel-count">${entry.images.length} photos</span>` : ""}
               </div>`
            : ""
        }
        <div class="carousel-stage">
          <div class="carousel-track">${slides}</div>
          ${
            many
              ? `<button class="carousel-nav carousel-prev" aria-label="Previous photo" disabled>
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>
                 </button>
                 <button class="carousel-nav carousel-next" aria-label="Next photo">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
                 </button>`
              : ""
          }
        </div>
        ${many ? `<div class="carousel-dots">${dots}</div>` : ""}
      </div>`;
    })
    .join("");

  lightboxGallery.innerHTML = videoItems + imageItems;

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
let previewGroups = [];
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
  currentGalleryImages = previewGroups[Number(img.dataset.group)] || [];
  openPreview(Number(img.dataset.previewIndex));
});

// ---------- Carousel (one frame, several photos) ----------
function slideTo(track, index) {
  index = Math.max(0, Math.min(track.children.length - 1, index));
  track.dataset.target = index; // remembered while the smooth scroll is still travelling
  track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
}

lightboxGallery.addEventListener("click", (e) => {
  const item = e.target.closest(".carousel");
  if (!item) return;
  const track = item.querySelector(".carousel-track");
  // fast double-clicks must build on where the scroll is heading, not where it currently is
  const current =
    track.dataset.target !== undefined
      ? Number(track.dataset.target)
      : Math.round(track.scrollLeft / track.clientWidth);
  if (e.target.closest(".carousel-prev")) slideTo(track, current - 1);
  if (e.target.closest(".carousel-next")) slideTo(track, current + 1);
  const dot = e.target.closest(".carousel-dot");
  if (dot) slideTo(track, Number(dot.dataset.slide));
});

// scroll events don't bubble, so listen in the capture phase
lightboxGallery.addEventListener(
  "scroll",
  (e) => {
    const track = e.target;
    if (!track.classList || !track.classList.contains("carousel-track")) return;
    clearTimeout(track._settle);
    track._settle = setTimeout(() => delete track.dataset.target, 150);
    const item = track.closest(".carousel");
    const index = Math.round(track.scrollLeft / track.clientWidth);
    const last = track.children.length - 1;
    item.querySelectorAll(".carousel-dot").forEach((d, i) => d.classList.toggle("active", i === index));
    const prev = item.querySelector(".carousel-prev");
    const next = item.querySelector(".carousel-next");
    if (prev) prev.disabled = index <= 0;
    if (next) next.disabled = index >= last;
  },
  true
);

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
