(function () {
  "use strict";

  var menuBtn = document.getElementById("vcMenuBtn");
  var menu = document.getElementById("vcMenu");
  var backdrop = document.getElementById("vcMenuBackdrop");
  var closeBtn = document.getElementById("vcMenuClose");
  var heroImg = document.querySelector(".vc-hero__img");
  var heroEngine = document.getElementById("vcHeroEngine");
  var heroSecurity = document.getElementById("vcHeroSecurity");
  var engStatusText = document.getElementById("vcEngStatusText");
  var engDot = document.getElementById("vcEngDot");
  var startBtn = document.getElementById("vcStartEngine");
  var startLabel = document.getElementById("vcStartEngineLabel");
  var lockGrid = document.getElementById("vcLockGrid");
  var btnLocked = document.getElementById("vcBtnLocked");
  var btnUnlockAll = document.getElementById("vcUnlockAll");
  var winGrid = document.getElementById("vcWinGrid");
  var btnCloseAllWin = document.getElementById("vcCloseAllWin");
  var btnOpenAllWin = document.getElementById("vcOpenAllWin");
  var dockBtns = document.querySelectorAll(".vc-dock__btn");

  var engineOn = false;
  var allLocked = true;
  var windowPct = { fl: 0, fr: 0, rl: 0, rr: 0 };

  function setMenuOpen(open) {
    if (!menu || !menuBtn) return;
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("vc-menu-open", open);
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      setMenuOpen(!menu.classList.contains("is-open"));
    });
  }
  if (backdrop) backdrop.addEventListener("click", function () {
    setMenuOpen(false);
  });
  if (closeBtn) closeBtn.addEventListener("click", function () {
    setMenuOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu && menu.classList.contains("is-open")) setMenuOpen(false);
  });
  if (menu) {
    var links = menu.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        setMenuOpen(false);
      });
    }
  }

  if (heroImg) {
    heroImg.addEventListener("error", function () {
      this.src = "images/car.svg";
    });
  }

  function syncEngineUI() {
    if (heroEngine) {
      heroEngine.textContent = engineOn ? "On" : "Off";
      heroEngine.classList.toggle("vc-hero__val--ok", engineOn);
    }
    if (engStatusText) engStatusText.textContent = engineOn ? "On" : "Off";
    if (engDot) engDot.classList.toggle("is-on", engineOn);
    if (startLabel) startLabel.textContent = engineOn ? "Stop Engine" : "Start Engine";
  }

  if (startBtn) {
    startBtn.addEventListener("click", function () {
      engineOn = !engineOn;
      syncEngineUI();
      console.log("Engine:", engineOn ? "on" : "off");
    });
  }
  syncEngineUI();

  function updateLockCells() {
    if (!lockGrid) return;
    var cells = lockGrid.querySelectorAll(".vc-lock-cell");
    for (var c = 0; c < cells.length; c++) {
      var cell = cells[c];
      var st = cell.querySelector(".vc-lock-cell__st");
      var ic = cell.querySelector(".vc-lock-cell__ic");
      if (allLocked) {
        cell.classList.remove("is-unlocked");
        if (st) st.textContent = "Locked";
        if (ic) ic.textContent = "🔒";
      } else {
        cell.classList.add("is-unlocked");
        if (st) st.textContent = "Unlocked";
        if (ic) ic.textContent = "🔓";
      }
    }
    if (heroSecurity) {
      heroSecurity.textContent = allLocked ? "Locked" : "Unlocked";
      heroSecurity.classList.toggle("vc-hero__val--ok", allLocked);
    }
    if (btnLocked) {
      btnLocked.disabled = allLocked;
      btnLocked.classList.toggle("vc-btn-secondary--disabled", allLocked);
      btnLocked.setAttribute("aria-disabled", allLocked ? "true" : "false");
    }
    if (btnUnlockAll) {
      btnUnlockAll.disabled = !allLocked;
      btnUnlockAll.classList.toggle("vc-btn-secondary--disabled", !allLocked);
      btnUnlockAll.classList.toggle("vc-btn-secondary--active", allLocked);
    }
  }

  if (btnUnlockAll) {
    btnUnlockAll.addEventListener("click", function () {
      if (!allLocked) return;
      allLocked = false;
      updateLockCells();
      console.log("All doors unlocked");
    });
  }
  if (btnLocked) {
    btnLocked.addEventListener("click", function () {
      if (allLocked) return;
      allLocked = true;
      updateLockCells();
      console.log("All locked");
    });
  }
  updateLockCells();

  function getWinKey(cell) {
    return cell.getAttribute("data-win");
  }

  function syncWinPctDisplay() {
    if (!winGrid) return;
    var cells = winGrid.querySelectorAll(".vc-win-cell");
    for (var i = 0; i < cells.length; i++) {
      var key = getWinKey(cells[i]);
      var val = cells[i].querySelector(".vc-pct-val");
      if (val && key && windowPct[key] != null) {
        val.textContent = String(windowPct[key]);
      }
    }
    var sum = windowPct.fl + windowPct.fr + windowPct.rl + windowPct.rr;
    var allOpen = sum === 400;
    var allClosed = sum === 0;
    if (btnCloseAllWin) {
      btnCloseAllWin.disabled = allClosed;
      btnCloseAllWin.classList.toggle("vc-btn-secondary--disabled", allClosed);
    }
    if (btnOpenAllWin) {
      btnOpenAllWin.disabled = allOpen;
      btnOpenAllWin.classList.toggle("vc-btn-secondary--disabled", allOpen);
      btnOpenAllWin.classList.toggle("vc-btn-secondary--active", !allOpen);
    }
  }

  if (winGrid) {
    winGrid.addEventListener("click", function (e) {
      var btn = e.target.closest(".vc-sqbtn");
      if (!btn) return;
      var cell = btn.closest(".vc-win-cell");
      if (!cell) return;
      var key = getWinKey(cell);
      var d = parseInt(btn.getAttribute("data-delta"), 10) || 0;
      if (!key || !windowPct.hasOwnProperty(key)) return;
      windowPct[key] = Math.max(0, Math.min(100, windowPct[key] + d * 10));
      syncWinPctDisplay();
    });
  }

  if (btnOpenAllWin) {
    btnOpenAllWin.addEventListener("click", function () {
      windowPct.fl = windowPct.fr = windowPct.rl = windowPct.rr = 100;
      syncWinPctDisplay();
    });
  }
  if (btnCloseAllWin) {
    btnCloseAllWin.addEventListener("click", function () {
      windowPct.fl = windowPct.fr = windowPct.rl = windowPct.rr = 0;
      syncWinPctDisplay();
    });
  }
  syncWinPctDisplay();

  for (var d = 0; d < dockBtns.length; d++) {
    dockBtns[d].addEventListener("click", function () {
      if (this.classList.contains("vc-dock__btn--avatar")) return;
      for (var k = 0; k < dockBtns.length; k++) {
        dockBtns[k].classList.remove("vc-dock__btn--active");
        dockBtns[k].removeAttribute("aria-current");
      }
      this.classList.add("vc-dock__btn--active");
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
