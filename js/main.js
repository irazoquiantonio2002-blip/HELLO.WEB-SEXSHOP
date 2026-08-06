(function () {
  const whatsappNumber = "522291598953";
  const loadingScreen = document.getElementById("loading-screen");
  const startedAt = Date.now();

  document.body.classList.add("is-loading");

  window.addEventListener("load", () => {
    const elapsed = Date.now() - startedAt;
    const wait = Math.max(0, 2100 - elapsed);
    window.setTimeout(() => {
      loadingScreen?.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
    }, wait);
  });

  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  const setHeaderState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  navToggle?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
    document.body.classList.toggle("menu-open", Boolean(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll("[data-reveal]").forEach((item) => revealObserver.observe(item));

  const words = ["placer consciente", "bienestar sexual", "compras discretas", "explorar sin juicio"];
  const typeTarget = document.getElementById("typewriter");
  let wordIndex = 0;
  let letterIndex = 0;
  let deleting = false;

  const type = () => {
    if (!typeTarget) return;
    const word = words[wordIndex];
    typeTarget.textContent = word.slice(0, letterIndex);

    if (!deleting && letterIndex < word.length) {
      letterIndex += 1;
      window.setTimeout(type, 78);
      return;
    }

    if (!deleting && letterIndex === word.length) {
      deleting = true;
      window.setTimeout(type, 1250);
      return;
    }

    if (deleting && letterIndex > 0) {
      letterIndex -= 1;
      window.setTimeout(type, 38);
      return;
    }

    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    window.setTimeout(type, 260);
  };

  type();

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    });
  }, { threshold: 0.48 });

  sections.forEach((section) => activeObserver.observe(section));

  const animateCount = (node) => {
    const target = Number(node.dataset.count || "0");
    const duration = 1450;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = Math.round(target * eased).toString();
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.65 });

  document.querySelectorAll("[data-count]").forEach((item) => statObserver.observe(item));

  const form = document.getElementById("contact-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const interest = String(data.get("interest") || "").trim();
    const message = String(data.get("message") || "").trim();
    const text = [
      "Hola Sex Shop, quiero informacion.",
      name ? `Nombre: ${name}` : "",
      interest ? `Interes: ${interest}` : "",
      message ? `Mensaje: ${message}` : ""
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });

  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas?.getContext("2d");
  let particles = [];
  let rafId;

  const colors = ["#ff0099", "#ffff00", "#00ff00", "#00bfff"];

  const resizeCanvas = () => {
    if (!canvas || !ctx) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(canvas.offsetWidth * ratio);
    canvas.height = Math.floor(canvas.offsetHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(96, Math.max(42, Math.floor(canvas.offsetWidth / 18)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: Math.random() * 1.9 + 0.55,
      dx: (Math.random() - 0.5) * 0.34,
      dy: (Math.random() - 0.5) * 0.28,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.52 + 0.22
    }));
  };

  const drawParticles = () => {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    particles.forEach((particle, index) => {
      particle.x += particle.dx;
      particle.y += particle.dy;

      if (particle.x < -10) particle.x = canvas.offsetWidth + 10;
      if (particle.x > canvas.offsetWidth + 10) particle.x = -10;
      if (particle.y < -10) particle.y = canvas.offsetHeight + 10;
      if (particle.y > canvas.offsetHeight + 10) particle.y = -10;

      ctx.beginPath();
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 14;
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fill();

      for (let j = index + 1; j < particles.length; j += 1) {
        const other = particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 116) {
          ctx.beginPath();
          ctx.globalAlpha = (1 - distance / 116) * 0.16;
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 1;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    rafId = requestAnimationFrame(drawParticles);
  };

  if (canvas && ctx && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    resizeCanvas();
    drawParticles();
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        drawParticles();
      }
    });
  }
})();
