(function () {
  "use strict";

  var STORAGE = "otovision_carscreen";

  var menuBtn = document.getElementById("csMenuBtn");
  var menu = document.getElementById("csMenu");
  var menuBackdrop = document.getElementById("csMenuBackdrop");
  var menuClose = document.getElementById("csMenuClose");
  var themeTiles = document.querySelectorAll(".cs-theme-tile[data-theme]");
  var brightRange = document.getElementById("brightRange");
  var brightVal = document.getElementById("brightVal");
  var volRange = document.getElementById("volRange");
  var volVal = document.getElementById("volVal");
  var swAutoBright = document.getElementById("swAutoBright");
  var swClock = document.getElementById("swClock");
  var swNotify = document.getElementById("swNotify");
  var chips = document.querySelectorAll(".cs-chip[data-timeout]");
  var btnFullScreen = document.getElementById("btnFullScreen");
  var btnTestSound = document.getElementById("btnTestSound");
  var btnUpdates = document.getElementById("btnUpdates");
  var btnReset = document.getElementById("btnReset");
  var btnRestart = document.getElementById("btnRestart");

  function setMenuOpen(open) {
    if (!menu || !menuBtn) return;
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("cs-menu-open", open);
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      setMenuOpen(!menu.classList.contains("is-open"));
    });
  }
  if (menuBackdrop) menuBackdrop.addEventListener("click", function () {
    setMenuOpen(false);
  });
  if (menuClose) menuClose.addEventListener("click", function () {
    setMenuOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu && menu.classList.contains("is-open")) setMenuOpen(false);
  });
  if (menu) {
    var la = menu.querySelectorAll("a");
    for (var a = 0; a < la.length; a++) la[a].addEventListener("click", function () {
      setMenuOpen(false);
    });
  }

  function applyTheme(mode) {
    var m = mode === "light" || mode === "auto" || mode === "dark" ? mode : "dark";
    document.documentElement.setAttribute("data-theme", m);
    for (var i = 0; i < themeTiles.length; i++) {
      var t = themeTiles[i];
      var sel = t.getAttribute("data-theme") === m;
      t.classList.toggle("is-selected", sel);
      t.setAttribute("aria-checked", sel ? "true" : "false");
    }
  }

  for (var j = 0; j < themeTiles.length; j++) {
    themeTiles[j].addEventListener("click", function () {
      var mode = this.getAttribute("data-theme");
      if (mode) {
        applyTheme(mode);
        saveState();
      }
    });
  }

  function syncRangeFill(input) {
    if (!input) return;
    var row = input.closest(".cs-slider-row");
    if (row) row.style.setProperty("--fill-pct", input.value + "%");
  }

  function wireRange(input, labelEl) {
    if (!input) return;
    function upd() {
      syncRangeFill(input);
      if (labelEl) labelEl.textContent = input.value + "%";
      saveState();
    }
    input.addEventListener("input", upd);
    syncRangeFill(input);
  }

  wireRange(brightRange, brightVal);
  wireRange(volRange, volVal);

  function setSwitch(el, on) {
    if (!el) return;
    el.classList.toggle("is-on", on);
    el.setAttribute("aria-checked", on ? "true" : "false");
  }

  function wireSwitch(el) {
    if (!el) return;
    el.addEventListener("click", function () {
      setSwitch(el, !el.classList.contains("is-on"));
      saveState();
    });
  }

  wireSwitch(swAutoBright);
  wireSwitch(swClock);
  wireSwitch(swNotify);

  for (var c = 0; c < chips.length; c++) {
    chips[c].addEventListener("click", function () {
      for (var k = 0; k < chips.length; k++) {
        chips[k].classList.remove("is-selected");
        chips[k].setAttribute("aria-checked", "false");
      }
      this.classList.add("is-selected");
      this.setAttribute("aria-checked", "true");
      saveState();
    });
  }

  function saveState() {
    try {
      var data = {
        theme: document.documentElement.getAttribute("data-theme") || "dark",
        brightness: brightRange ? brightRange.value : "75",
        volume: volRange ? volRange.value : "60",
        autoBright: swAutoBright && swAutoBright.classList.contains("is-on"),
        clock: swClock && swClock.classList.contains("is-on"),
        notify: swNotify && swNotify.classList.contains("is-on"),
        timeout: (function () {
          var s = document.querySelector(".cs-chip.is-selected");
          return s ? s.getAttribute("data-timeout") : null;
        })(),
      };
      localStorage.setItem(STORAGE, JSON.stringify(data));
    } catch (e) {
      /* ignore */
    }
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (data.theme) applyTheme(data.theme);
      if (data.brightness && brightRange) {
        brightRange.value = data.brightness;
        if (brightVal) brightVal.textContent = data.brightness + "%";
        syncRangeFill(brightRange);
      }
      if (data.volume && volRange) {
        volRange.value = data.volume;
        if (volVal) volVal.textContent = data.volume + "%";
        syncRangeFill(volRange);
      }
      if (typeof data.autoBright === "boolean" && swAutoBright) setSwitch(swAutoBright, data.autoBright);
      if (typeof data.clock === "boolean" && swClock) setSwitch(swClock, data.clock);
      if (typeof data.notify === "boolean" && swNotify) setSwitch(swNotify, data.notify);
      if (data.timeout != null) {
        for (var i = 0; i < chips.length; i++) {
          var ch = chips[i];
          if (ch.getAttribute("data-timeout") === String(data.timeout)) {
            for (var k = 0; k < chips.length; k++) {
              chips[k].classList.remove("is-selected");
              chips[k].setAttribute("aria-checked", "false");
            }
            ch.classList.add("is-selected");
            ch.setAttribute("aria-checked", "true");
          }
        }
      }
      saveState();
    } catch (e2) {
      /* ignore */
    }
  }

  loadState();

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function () {
      if (document.documentElement.getAttribute("data-theme") === "auto") applyTheme("auto");
    });
  }

  if (btnFullScreen) {
    btnFullScreen.addEventListener("click", function () {
      var on = this.textContent.trim() === "Enable";
      this.textContent = on ? "Disable" : "Enable";
      console.log("Full screen:", on ? "enabled" : "disabled");
    });
  }

  if (btnTestSound) {
    btnTestSound.addEventListener("click", function () {
      try {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) {
          console.log("Test sound (no Web Audio)");
          return;
        }
        var ctx = new Ctx();
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = 880;
        g.gain.setValueAtTime(0.15, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        o.start(ctx.currentTime);
        o.stop(ctx.currentTime + 0.2);
      } catch (err) {
        console.log("Test sound");
      }
    });
  }

  if (btnUpdates) btnUpdates.addEventListener("click", function () {
    console.log("Check for updates");
  });
  if (btnReset) btnReset.addEventListener("click", function () {
    console.log("Reset to defaults");
  });
  if (btnRestart) btnRestart.addEventListener("click", function () {
    console.log("Restart display");
  });
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
