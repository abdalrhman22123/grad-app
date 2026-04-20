(function () {
  "use strict";

  var menuBtn = document.getElementById("arhMenuBtn");
  var menu = document.getElementById("arhMenu");
  var backdrop = document.getElementById("arhMenuBackdrop");
  var closeBtn = document.getElementById("arhMenuClose");
  var warningsTab = document.getElementById("arhWarningsTab");
  var accidentsTab = document.getElementById("arhAccidentsTab");
  var allTab = document.getElementById("arhAllTab");
  var warningsPanel = document.getElementById("arhWarningsPanel");
  var accidentsPanel = document.getElementById("arhAccidentsPanel");
  var allPanel = document.getElementById("arhAllPanel");
  var refreshBtn = document.getElementById("arhRefreshBtn");
  var lastSync = document.getElementById("arhLastSync");
  var exportBtn = document.getElementById("arhExportBtn");
  var reminderBtn = document.getElementById("arhSetReminder");
  var scheduleBtn = document.getElementById("arhScheduleRotation");
  var dockBtns = document.querySelectorAll(".arh-dock__btn");

  function setMenuOpen(open) {
    if (!menu || !menuBtn) return;
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("arh-menu-open", open);
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

  function setActiveTab(tab) {
    var mapping = [
      { btn: warningsTab, panel: warningsPanel, key: "warnings" },
      { btn: accidentsTab, panel: accidentsPanel, key: "accidents" },
      { btn: allTab, panel: allPanel, key: "all" }
    ];
    for (var i = 0; i < mapping.length; i++) {
      var active = mapping[i].key === tab;
      if (mapping[i].btn) {
        mapping[i].btn.classList.toggle("is-active", active);
        mapping[i].btn.setAttribute("aria-selected", active ? "true" : "false");
      }
      if (mapping[i].panel) mapping[i].panel.hidden = !active;
    }
  }

  if (warningsTab) warningsTab.addEventListener("click", function () { setActiveTab("warnings"); });
  if (accidentsTab) accidentsTab.addEventListener("click", function () { setActiveTab("accidents"); });
  if (allTab) allTab.addEventListener("click", function () { setActiveTab("all"); });

  if (refreshBtn) {
    refreshBtn.addEventListener("click", function () {
      refreshBtn.disabled = true;
      refreshBtn.textContent = "Refreshing...";
      setTimeout(function () {
        if (lastSync) lastSync.textContent = "Just now";
        refreshBtn.disabled = false;
        refreshBtn.textContent = "Refresh";
      }, 1200);
    });
  }

  if (reminderBtn) reminderBtn.addEventListener("click", function () { console.log("Reminder set for pressure warning"); });
  if (scheduleBtn) scheduleBtn.addEventListener("click", function () { console.log("Rotation scheduler opened"); });
  if (exportBtn) exportBtn.addEventListener("click", function () { console.log("Export AR history"); });

  for (var d = 0; d < dockBtns.length; d++) {
    dockBtns[d].addEventListener("click", function () {
      if (this.classList.contains("arh-dock__btn--avatar")) return;
      for (var k = 0; k < dockBtns.length; k++) {
        dockBtns[k].classList.remove("arh-dock__btn--active");
        dockBtns[k].removeAttribute("aria-current");
      }
      this.classList.add("arh-dock__btn--active");
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
