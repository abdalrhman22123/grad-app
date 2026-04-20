(function () {
  "use strict";

  var menuBtn = document.getElementById("tmMenuBtn");
  var menu = document.getElementById("tmMenu");
  var backdrop = document.getElementById("tmMenuBackdrop");
  var closeBtn = document.getElementById("tmMenuClose");
  var tiresGrid = document.getElementById("tmTiresGrid");
  var modeBtns = document.querySelectorAll(".tm-mode");
  var reminderBtn = document.getElementById("tmSetReminder");
  var scheduleBtn = document.getElementById("tmScheduleRotation");
  var recalibrateBtn = document.getElementById("tmRecalibrate");
  var dockBtns = document.querySelectorAll(".tm-dock__btn");

  function setMenuOpen(open) {
    if (!menu || !menuBtn) return;
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("tm-menu-open", open);
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

  // Simulate small live pressure changes for a dashboard-like feel.
  function nudgePressure() {
    if (!tiresGrid) return;
    var vals = tiresGrid.querySelectorAll(".tm-tire__val");
    for (var i = 0; i < vals.length; i++) {
      var current = parseInt(vals[i].textContent, 10) || 34;
      var delta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
      var next = Math.max(30, Math.min(38, current + delta));
      vals[i].textContent = String(next);
    }
  }
  setInterval(nudgePressure, 5000);

  for (var m = 0; m < modeBtns.length; m++) {
    modeBtns[m].addEventListener("click", function () {
      for (var k = 0; k < modeBtns.length; k++) {
        modeBtns[k].classList.remove("is-active");
        modeBtns[k].setAttribute("aria-checked", "false");
      }
      this.classList.add("is-active");
      this.setAttribute("aria-checked", "true");
      console.log("Pressure mode:", this.getAttribute("data-mode"));
    });
  }

  if (reminderBtn) reminderBtn.addEventListener("click", function () { console.log("Tire inflation reminder set"); });
  if (scheduleBtn) scheduleBtn.addEventListener("click", function () { console.log("Rotation scheduling opened"); });
  if (recalibrateBtn) recalibrateBtn.addEventListener("click", function () {
    recalibrateBtn.disabled = true;
    recalibrateBtn.textContent = "Recalibrating...";
    setTimeout(function () {
      recalibrateBtn.disabled = false;
      recalibrateBtn.textContent = "Recalibrate TPMS";
    }, 1400);
  });

  for (var d = 0; d < dockBtns.length; d++) {
    dockBtns[d].addEventListener("click", function () {
      if (this.classList.contains("tm-dock__btn--avatar")) return;
      for (var i = 0; i < dockBtns.length; i++) {
        dockBtns[i].classList.remove("tm-dock__btn--active");
        dockBtns[i].removeAttribute("aria-current");
      }
      this.classList.add("tm-dock__btn--active");
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
