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

  // ---- Adaptive header tone -----------------------------------------------
  // The fixed header floats over sections of alternating brightness. Flip it
  // to a light frosted bar whenever the section directly behind it is light, so
  // it never reads as a heavy dark slab over pale content. Sections declare
  // their brightness with data-tone="dark" / "light".
  var header = document.querySelector(".ge-header");
  var toned = Array.prototype.slice.call(document.querySelectorAll("[data-tone]"));
  if (header && toned.length) {
    var ticking = false;
    var updateHeaderTone = function () {
      ticking = false;
      var probe = header.offsetHeight / 2; // a point inside the bar
      var tone = "dark"; // default (e.g. above the first section)
      for (var i = 0; i < toned.length; i++) {
        var r = toned[i].getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          tone = toned[i].getAttribute("data-tone");
          break;
        }
      }
      header.classList.toggle("ge-header--light", tone === "light");
    };
    var onScroll = function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateHeaderTone);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateHeaderTone(); // set the correct state on load
  }
})();
