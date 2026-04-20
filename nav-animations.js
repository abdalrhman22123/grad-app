(function () {
  "use strict";

  function injectStyles() {
    if (document.getElementById("navAnimationsStyle")) return;
    var style = document.createElement("style");
    style.id = "navAnimationsStyle";
    style.textContent = [
      ".nav-item-anim{opacity:0;transform:translateX(8px)}",
      ".nav-item-anim.nav-item-anim--in{opacity:1;transform:translateX(0);transition:opacity .22s ease,transform .22s ease}",
      ".nav-pop{animation:navPop .22s ease}",
      "@keyframes navPop{0%{transform:scale(1)}50%{transform:scale(1.08)}100%{transform:scale(1)}}",
      "a.menu-logout{color:#ef4444 !important;font-weight:700}",
      "a.menu-logout:hover{background:rgba(239,68,68,.14) !important;color:#fca5a5 !important}"
    ].join("");
    document.head.appendChild(style);
  }

  function animateDrawerItems(drawer) {
    var listItems = drawer.querySelectorAll("ul li");
    for (var i = 0; i < listItems.length; i++) {
      (function (idx) {
        var item = listItems[idx];
        item.classList.remove("nav-item-anim--in");
        item.classList.add("nav-item-anim");
        window.setTimeout(function () {
          item.classList.add("nav-item-anim--in");
        }, 20 + idx * 35);
      })(i);
    }
  }

  function wireDrawerAnimation(drawer) {
    if (!drawer) return;
    var observer = new MutationObserver(function () {
      var open = drawer.classList.contains("is-open") || drawer.getAttribute("aria-hidden") === "false";
      if (open) animateDrawerItems(drawer);
    });
    observer.observe(drawer, { attributes: true, attributeFilter: ["class", "aria-hidden"] });
  }

  function wireDockAnimation() {
    var clickable = document.querySelectorAll(
      ".dock__btn, .st-dock__btn, .tm-dock__btn, .om-dock__btn, .rd-dock__btn, .bt-dock__btn, .arh-dock__btn, .vc-dock__btn, .pf-dock__btn, .cs-dock__btn, .ins-dock__btn"
    );
    for (var i = 0; i < clickable.length; i++) {
      clickable[i].addEventListener("click", function () {
        var el = this;
        el.classList.remove("nav-pop");
        void el.offsetWidth;
        el.classList.add("nav-pop");
      });
    }
  }

  function init() {
    injectStyles();
    var drawers = document.querySelectorAll(
      ".menu-drawer, .nav-panel, .ins-drawer, .cs-drawer, .pf-drawer, .vc-drawer, .om-drawer, .rd-drawer, .bt-drawer, .tm-drawer, .st-drawer, .arh-drawer"
    );
    for (var i = 0; i < drawers.length; i++) wireDrawerAnimation(drawers[i]);
    wireDockAnimation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
