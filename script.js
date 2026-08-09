/* ============================================================
   RAM Landscaping — demo site scripts
   Vanilla JS, no dependencies. Runs from file://.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile nav drawer ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (navToggle && mobileNav) {
    var closeEls = mobileNav.querySelectorAll("[data-close-nav]");
    var openNav = function () {
      mobileNav.classList.add("open");
      document.body.style.overflow = "hidden";
      navToggle.setAttribute("aria-expanded", "true");
    };
    var closeNav = function () {
      mobileNav.classList.remove("open");
      document.body.style.overflow = "";
      navToggle.setAttribute("aria-expanded", "false");
    };
    navToggle.addEventListener("click", openNav);
    mobileNav.addEventListener("click", function (e) {
      if (e.target === mobileNav) closeNav();
    });
    closeEls.forEach(function (el) { el.addEventListener("click", closeNav); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("open")) closeNav();
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver, one-shot) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px 12% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });

    var sweepTimer = null;
    var sweep = function () {
      sweepTimer = null;
      var vh = window.innerHeight;
      revealEls = revealEls.filter(function (el) {
        if (el.classList.contains("in")) return false;
        if (el.getBoundingClientRect().top < vh) {
          el.classList.add("in");
          io.unobserve(el);
          return false;
        }
        return true;
      });
    };
    window.addEventListener("scroll", function () {
      if (!sweepTimer) sweepTimer = setTimeout(sweep, 90);
    }, { passive: true });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
