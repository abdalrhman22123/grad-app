(function () {
  "use strict";

  var KEY = "otovision_settings";
  var menuBtn = document.getElementById("stMenuBtn");
  var menu = document.getElementById("stMenu");
  var backdrop = document.getElementById("stMenuBackdrop");
  var closeBtn = document.getElementById("stMenuClose");
  var themeBtns = document.querySelectorAll(".st-theme");
  var switches = document.querySelectorAll(".st-switch");
  var units = document.getElementById("stUnits");
  var navApp = document.getElementById("stNavApp");
  var regen = document.getElementById("stRegen");
  var checkUpdates = document.getElementById("stCheckUpdates");
  var backupNow = document.getElementById("stBackupNow");
  var resetPrefs = document.getElementById("stResetPrefs");
  var dockBtns = document.querySelectorAll(".st-dock__btn");

  function setMenuOpen(open) {
    if (!menu || !menuBtn) return;
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("st-menu-open", open);
  }

  if (menuBtn) menuBtn.addEventListener("click", function () { setMenuOpen(!menu.classList.contains("is-open")); });
  if (backdrop) backdrop.addEventListener("click", function () { setMenuOpen(false); });
  if (closeBtn) closeBtn.addEventListener("click", function () { setMenuOpen(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu && menu.classList.contains("is-open")) setMenuOpen(false);
  });

  if (menu) {
    var links = menu.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) links[i].addEventListener("click", function () { setMenuOpen(false); });
  }

  function applyTheme(mode) {
    var m = mode === "light" || mode === "auto" || mode === "dark" ? mode : "dark";
    document.documentElement.setAttribute("data-theme", m);
    for (var i = 0; i < themeBtns.length; i++) {
      var sel = themeBtns[i].getAttribute("data-theme") === m;
      themeBtns[i].classList.toggle("is-active", sel);
      themeBtns[i].setAttribute("aria-checked", sel ? "true" : "false");
    }
  }

  for (var t = 0; t < themeBtns.length; t++) {
    themeBtns[t].addEventListener("click", function () {
      applyTheme(this.getAttribute("data-theme"));
      save();
    });
  }

  for (var s = 0; s < switches.length; s++) {
    switches[s].addEventListener("click", function () {
      var on = this.classList.contains("is-on");
      this.classList.toggle("is-on", !on);
      this.setAttribute("aria-checked", on ? "false" : "true");
      save();
    });
  }

  if (units) units.addEventListener("change", save);
  if (navApp) navApp.addEventListener("change", save);

  function save() {
    try {
      var activeTheme = document.querySelector(".st-theme.is-active");
      var values = [];
      for (var i = 0; i < switches.length; i++) values.push(switches[i].classList.contains("is-on"));
      localStorage.setItem(
        KEY,
        JSON.stringify({
          theme: activeTheme ? activeTheme.getAttribute("data-theme") : "dark",
          units: units ? units.value : "metric",
          nav: navApp ? navApp.value : "maps",
          switches: values
        })
      );
    } catch (e) {
      /* ignore */
    }
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (data.theme) applyTheme(data.theme);
      if (units && data.units) units.value = data.units;
      if (navApp && data.nav) navApp.value = data.nav;
      if (Array.isArray(data.switches)) {
        for (var i = 0; i < switches.length && i < data.switches.length; i++) {
          switches[i].classList.toggle("is-on", !!data.switches[i]);
          switches[i].setAttribute("aria-checked", data.switches[i] ? "true" : "false");
        }
      }
      if (regen) {
        var on = regen.classList.contains("is-on");
        regen.setAttribute("aria-checked", on ? "true" : "false");
      }
    } catch (e2) {
      /* ignore */
    }
  }
  load();

  if (checkUpdates) checkUpdates.addEventListener("click", function () { console.log("Checking for updates"); });
  if (backupNow) backupNow.addEventListener("click", function () { console.log("Backup started"); });
  if (resetPrefs) {
    resetPrefs.addEventListener("click", function () {
      try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
      location.reload();
    });
  }

  for (var d = 0; d < dockBtns.length; d++) {
    dockBtns[d].addEventListener("click", function () {
      if (this.classList.contains("st-dock__btn--avatar")) return;
      for (var k = 0; k < dockBtns.length; k++) {
        dockBtns[k].classList.remove("st-dock__btn--active");
        dockBtns[k].removeAttribute("aria-current");
      }
      this.classList.add("st-dock__btn--active");
      this.setAttribute("aria-current", "page");
    });
  }
})();
(function () {
  "use strict";

  var THEME_KEY = "otovision_dashboard_theme";

  var menuToggle = document.getElementById("menuToggle");
  var menuDrawer = document.getElementById("menuDrawer");
  var menuBackdrop = document.getElementById("menuBackdrop");
  var menuClose = document.getElementById("menuClose");
  var heroWire = document.getElementById("heroWire");
  var heroWireImg = document.getElementById("heroWireImg");
  var tempSlider = document.getElementById("tempSlider");
  var tempMinus = document.getElementById("tempMinus");
  var tempPlus = document.getElementById("tempPlus");
  var targetTemp = document.getElementById("targetTemp");
  var currentTempDisplay = document.getElementById("currentTempDisplay");
  var themeButtons = document.querySelectorAll(".theme-option[data-theme]");
  var engineChip = document.getElementById("engineChip");
  var securityChip = document.getElementById("securityChip");
  var engineState = document.getElementById("engineState");
  var securityState = document.getElementById("securityState");
  var confirmLoc = document.getElementById("confirmLoc");
  var cancelLoc = document.getElementById("cancelLoc");
  var dockBtns = document.querySelectorAll(".dock__btn");

  function setMenuOpen(open) {
    if (!menuDrawer || !menuToggle) return;
    menuDrawer.classList.toggle("is-open", open);
    menuDrawer.setAttribute("aria-hidden", open ? "false" : "true");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("menu-open", open);
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      setMenuOpen(!menuDrawer.classList.contains("is-open"));
    });
  }
  if (menuBackdrop) menuBackdrop.addEventListener("click", function () {
    setMenuOpen(false);
  });
  if (menuClose) menuClose.addEventListener("click", function () {
    setMenuOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menuDrawer && menuDrawer.classList.contains("is-open")) {
      setMenuOpen(false);
    }
  });

  if (menuDrawer) {
    var links = menuDrawer.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        setMenuOpen(false);
      });
    }
  }

  if (heroWireImg && heroWire) {
    heroWireImg.addEventListener("error", function () {
      heroWire.classList.add("hero-wire--missing");
    });
    if (heroWireImg.complete && heroWireImg.naturalWidth === 0) {
      heroWire.classList.add("hero-wire--missing");
    }
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function setTemp(value) {
    if (!tempSlider || !targetTemp || !currentTempDisplay) return;
    var v = clamp(Math.round(Number(value)), 60, 85);
    tempSlider.value = String(v);
    targetTemp.textContent = String(v);
    currentTempDisplay.textContent = v + "° F";
  }

  if (tempSlider) {
    tempSlider.addEventListener("input", function () {
      setTemp(tempSlider.value);
    });
  }
  if (tempMinus) {
    tempMinus.addEventListener("click", function () {
      setTemp(Number(tempSlider.value) - 1);
    });
  }
  if (tempPlus) {
    tempPlus.addEventListener("click", function () {
      setTemp(Number(tempSlider.value) + 1);
    });
  }

  function applyTheme(mode) {
    var m = mode === "light" || mode === "auto" || mode === "dark" ? mode : "dark";
    document.documentElement.setAttribute("data-theme", m);
    try {
      localStorage.setItem(THEME_KEY, m);
    } catch (e) {
      /* ignore */
    }
    for (var i = 0; i < themeButtons.length; i++) {
      var btn = themeButtons[i];
      var isSel = btn.getAttribute("data-theme") === m;
      btn.classList.toggle("is-selected", isSel);
      btn.setAttribute("aria-checked", isSel ? "true" : "false");
    }
  }

  for (var j = 0; j < themeButtons.length; j++) {
    themeButtons[j].addEventListener("click", function () {
      var mode = this.getAttribute("data-theme");
      if (mode) applyTheme(mode);
    });
  }

  try {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark" || saved === "auto") {
      applyTheme(saved);
    }
  } catch (e2) {
    /* ignore */
  }

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function () {
      if (document.documentElement.getAttribute("data-theme") === "auto") {
        applyTheme("auto");
      }
    });
  }

  var engineOn = false;
  if (engineChip && engineState) {
    engineChip.addEventListener("click", function () {
      engineOn = !engineOn;
      engineState.textContent = engineOn ? "On" : "Off";
      engineChip.setAttribute("aria-pressed", engineOn ? "true" : "false");
    });
  }

  var securityLocked = true;
  if (securityChip && securityState) {
    securityChip.addEventListener("click", function () {
      securityLocked = !securityLocked;
      securityState.textContent = securityLocked ? "Locked" : "Unlocked";
      securityChip.setAttribute("aria-pressed", securityLocked ? "true" : "false");
    });
  }

  if (confirmLoc) {
    confirmLoc.addEventListener("click", function () {
      console.log("Location confirmed");
    });
  }
  if (cancelLoc) {
    cancelLoc.addEventListener("click", function () {
      console.log("Location cancelled");
    });
  }

  for (var k = 0; k < dockBtns.length; k++) {
    dockBtns[k].addEventListener("click", function () {
      for (var d = 0; d < dockBtns.length; d++) {
        dockBtns[d].classList.remove("dock__btn--active");
        dockBtns[d].removeAttribute("aria-current");
      }
      this.classList.add("dock__btn--active");
      if (!this.classList.contains("dock__btn--avatar")) {
        this.setAttribute("aria-current", "page");
      }
    });
  }
})();
