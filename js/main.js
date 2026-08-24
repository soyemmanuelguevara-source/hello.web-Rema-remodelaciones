const loadingScreen = document.getElementById("loading-screen");
const siteHeader = document.getElementById("site-header");
const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");
const navLinks = document.querySelectorAll(".nav-link");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loadingScreen?.classList.add("is-hidden");
  }, 450);
});

const syncHeader = () => {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 20);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  siteHeader?.classList.toggle("nav-active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    siteHeader?.classList.remove("nav-active");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll("[data-reveal]").forEach((element) => {
  revealObserver.observe(element);
});

const sections = [...document.querySelectorAll("main section[id]")];
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

sections.forEach((section) => activeObserver.observe(section));

const typewriter = document.getElementById("typewriter");

if (typewriter) {
  const words = (typewriter.dataset.words || "").split(",").filter(Boolean);
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    const word = words[wordIndex] || "";
    typewriter.textContent = deleting ? word.slice(0, charIndex - 1) : word.slice(0, charIndex + 1);
    charIndex += deleting ? -1 : 1;

    if (!deleting && charIndex === word.length) {
      deleting = true;
      window.setTimeout(type, 1300);
      return;
    }

    if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }

    window.setTimeout(type, deleting ? 42 : 82);
  };

  type();
}

const canvas = document.getElementById("particles-canvas");
const context = canvas?.getContext("2d");
let particles = [];
let animationFrame;

const resizeCanvas = () => {
  if (!canvas || !context) return;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(canvas.offsetWidth * ratio);
  canvas.height = Math.floor(canvas.offsetHeight * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.min(76, Math.max(32, Math.floor(canvas.offsetWidth / 18)));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.offsetWidth,
    y: Math.random() * canvas.offsetHeight,
    radius: Math.random() * 1.8 + .6,
    speed: Math.random() * .32 + .12,
    opacity: Math.random() * .48 + .16
  }));
};

const drawParticles = () => {
  if (!canvas || !context) return;
  context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  particles.forEach((particle) => {
    particle.y -= particle.speed;
    particle.x += Math.sin(particle.y * .01) * .16;

    if (particle.y < -8) {
      particle.y = canvas.offsetHeight + 8;
      particle.x = Math.random() * canvas.offsetWidth;
    }

    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(245, 222, 188, ${particle.opacity})`;
    context.fill();
  });

  animationFrame = window.requestAnimationFrame(drawParticles);
};

if (canvas && context && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  resizeCanvas();
  drawParticles();
  window.addEventListener("resize", resizeCanvas);
}

window.addEventListener("beforeunload", () => {
  if (animationFrame) window.cancelAnimationFrame(animationFrame);
});
