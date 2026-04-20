(function () {
  "use strict";

  var KEY = "otovision_lang";

  function getLang() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "ar" ? "ar" : "en";
    } catch (e) {
      return "en";
    }
  }

  function setLang(lang) {
    try {
      localStorage.setItem(KEY, lang);
    } catch (e) {
      /* ignore */
    }
  }

  function setDir(lang) {
    var isAr = lang === "ar";
    document.documentElement.lang = isAr ? "ar" : "en";
    document.documentElement.dir = isAr ? "rtl" : "ltr";
  }

  function injectMenuToggle(lang) {
    var lists = document.querySelectorAll(
      ".menu-drawer__list, .nav-panel__list, .ins-drawer__list, .cs-drawer__list, .pf-drawer__list, .vc-drawer__list, .om-drawer__list, .rd-drawer__list, .bt-drawer__list, .tm-drawer__list, .st-drawer__list, .arh-drawer__list"
    );
    if (!lists.length) return;

    if (!document.getElementById("menuLangToggleStyle")) {
      var st = document.createElement("style");
      st.id = "menuLangToggleStyle";
      st.textContent =
        ".menu-lang-toggle{font-weight:700 !important;color:#60a5fa !important}.menu-lang-toggle:hover{background:rgba(59,130,246,.14) !important;color:#93c5fd !important}";
      document.head.appendChild(st);
    }

    for (var i = 0; i < lists.length; i++) {
      if (lists[i].querySelector(".menu-lang-toggle")) continue;
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#";
      a.className = "menu-lang-toggle";
      a.textContent = lang === "ar" ? "English" : "العربية";
      a.setAttribute("aria-label", "Switch language");
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var next = getLang() === "ar" ? "en" : "ar";
        setLang(next);
        window.location.reload();
      });
      li.appendChild(a);
      lists[i].appendChild(li);
    }
  }

  function init() {
    var lang = getLang();
    setDir(lang);
    injectMenuToggle(lang);
    if (lang === "ar" && typeof window.applyArabicTranslations === "function") {
      window.applyArabicTranslations();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
