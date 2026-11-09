const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover)").matches;

function playPreview(poster, video) {
  video.preload = "auto";
  video.play().then(() => poster.classList.add("is-playing")).catch(() => {});
}

function stopPreview(poster, video) {
  poster.classList.remove("is-playing");
  video.pause();
}

if (!reduceMotion) {
  const cards = [...document.querySelectorAll(".work-link")]
    .map((link) => {
      const poster = link.querySelector(".poster");
      const video = poster && poster.querySelector(".poster-video");
      return video ? { link, poster, video } : null;
    })
    .filter(Boolean);

  if (canHover) {
    cards.forEach(({ link, poster, video }) => {
      link.addEventListener("mouseenter", () => playPreview(poster, video));
      link.addEventListener("mouseleave", () => stopPreview(poster, video));
      link.addEventListener("focus", () => playPreview(poster, video));
      link.addEventListener("blur", () => stopPreview(poster, video));
    });
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const card = cards.find((c) => c.link === entry.target);
        if (entry.isIntersecting) playPreview(card.poster, card.video);
        else stopPreview(card.poster, card.video);
      });
    }, { threshold: 0.6 });
    cards.forEach(({ link }) => observer.observe(link));
  }
}
