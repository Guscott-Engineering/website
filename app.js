/* ============================================================
   GUSCOTT ENGINEERING — interactivity
   Ported from the design's DCLogic state class to vanilla JS:
   thumbnail galleries, smooth-scroll CTA, and Lucide icons.
   ============================================================ */
(function () {
  "use strict";

  // ---- Thumbnail galleries ------------------------------------------------
  // Clicking a thumbnail swaps its machine's main <img> and moves the active
  // ring. Each machine is keyed by the thumb's data-machine ("m1" / "m2"),
  // and the source URL is read straight off the thumbnail image.
  document.querySelectorAll(".ge-thumb").forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      var machine = thumb.getAttribute("data-machine");
      var main = document.getElementById(machine + "-main");
      var img = thumb.querySelector("img");
      if (main && img) main.src = img.src;

      document
        .querySelectorAll('.ge-thumb[data-machine="' + machine + '"]')
        .forEach(function (t) {
          t.setAttribute("data-active", t === thumb ? "true" : "false");
        });
    });
  });

  // ---- Smooth-scroll CTA --------------------------------------------------
  // "See What's Available" scrolls to #available with a 64px header offset
  // (same behavior as the prototype's goAvailable). The href keeps it working
  // even if JS fails to load.
  document.querySelectorAll("[data-scroll]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var el = document.getElementById(link.getAttribute("data-scroll"));
      if (!el) return;
      e.preventDefault();
      var top = el.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  // ---- Lucide icons -------------------------------------------------------
  // The CDN script may still be loading; retry briefly until it's ready
  // (mirrors the prototype's icon-init guard).
  var tries = 0;
  (function icons() {
    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons();
    } else if (++tries < 25) {
      setTimeout(icons, 250);
    }
  })();
})();
