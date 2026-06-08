/* =========================================================
   Shaik Harun Yahya — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const progress = document.getElementById("scrollProgress");

  /* ---------- Nav: frosted state + scroll progress ---------- */
  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    nav.classList.toggle("is-scrolled", y > 40);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (y / docH) * 100 : 0;
    progress.style.width = pct + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  function closeMenu() {
    navToggle.classList.remove("is-open");
    navLinks.classList.remove("is-open");
  }
  navToggle.addEventListener("click", function () {
    const open = navToggle.classList.toggle("is-open");
    navLinks.classList.toggle("is-open", open);
  });

  /* ---------- Smooth scroll for in-page links ---------- */
  document.querySelectorAll("[data-scroll]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      const id = link.getAttribute("href");
      if (!id || id.charAt(0) !== "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      const top = target.getBoundingClientRect().top + window.scrollY - 10;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ---------- Scroll reveals (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-line");

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.getAttribute("data-delay") || "0", 10);
        setTimeout(function () {
          el.classList.add("is-in");
        }, delay);
        revealObserver.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* Stagger the big-statement lines automatically */
  document.querySelectorAll(".big-statement").forEach(function (block) {
    block.querySelectorAll(".reveal-line").forEach(function (line, i) {
      if (!line.hasAttribute("data-delay")) {
        line.setAttribute("data-delay", String(i * 110));
      }
    });
  });

  /* ---------- Animated number counters ---------- */
  function animateCount(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll(".stat__num[data-count]");
  const countObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(function (c) {
    countObserver.observe(c);
  });

  /* ---------- Subtle parallax on hero orbs (mouse) ---------- */
  const orbs = document.querySelectorAll(".hero .orb");
  if (orbs.length && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener(
      "mousemove",
      function (e) {
        const cx = (e.clientX / window.innerWidth - 0.5) * 2;
        const cy = (e.clientY / window.innerHeight - 0.5) * 2;
        orbs.forEach(function (orb, i) {
          const depth = (i + 1) * 14;
          orb.style.transform =
            "translate(" + cx * depth + "px," + cy * depth + "px)";
        });
      },
      { passive: true }
    );
  }

  /* ---------- Active nav link highlight ---------- */
  const sections = ["about", "skills", "work", "education", "contact"]
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  const linkMap = {};
  document.querySelectorAll(".nav__links a[href^='#']").forEach(function (a) {
    linkMap[a.getAttribute("href").slice(1)] = a;
  });

  const spyObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        const link = linkMap[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.values(linkMap).forEach(function (l) {
            l.style.color = "";
          });
          if (!link.classList.contains("nav__cta")) {
            link.style.color = "#fff";
          }
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach(function (s) {
    spyObserver.observe(s);
  });
})();
