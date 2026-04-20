(function () {
  "use strict";

  var menuBtn = document.getElementById("rdMenuBtn");
  var menu = document.getElementById("rdMenu");
  var backdrop = document.getElementById("rdMenuBackdrop");
  var closeBtn = document.getElementById("rdMenuClose");
  var bandFm = document.getElementById("rdBandFm");
  var bandAm = document.getElementById("rdBandAm");
  var slider = document.getElementById("rdFreqSlider");
  var tunerFreq = document.getElementById("rdTunerFreq");
  var nowFreq = document.getElementById("rdNowFreq");
  var stationName = document.getElementById("rdStationName");
  var seekDown = document.getElementById("rdSeekDown");
  var seekUp = document.getElementById("rdSeekUp");
  var searchBtn = document.getElementById("rdSearch");
  var presetGrid = document.getElementById("rdPresetGrid");
  var sliderMin = document.getElementById("rdSliderMin");
  var sliderMax = document.getElementById("rdSliderMax");
  var signal = document.querySelector(".rd-signal");
  var likeBtn = document.getElementById("rdLike");
  var shareBtn = document.getElementById("rdShare");
  var srcBtns = document.querySelectorAll(".rd-src");
  var dockBtns = document.querySelectorAll(".rd-dock__btn");

  var band = "fm";

  function setMenuOpen(open) {
    if (!menu || !menuBtn) return;
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("rd-menu-open", open);
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
    var la = menu.querySelectorAll("a");
    for (var i = 0; i < la.length; i++) {
      la[i].addEventListener("click", function () {
        setMenuOpen(false);
      });
    }
  }

  function fmtFmTenths(tenths) {
    return (tenths / 10).toFixed(1) + " MHz";
  }

  function getFmTenths() {
    return parseInt(slider.value, 10) || 987;
  }

  function setBand(next, keepSliderValue) {
    band = next;
    if (bandFm) bandFm.classList.toggle("is-active", band === "fm");
    if (bandAm) bandAm.classList.toggle("is-active", band === "am");
    if (!slider) return;
    if (band === "fm") {
      slider.min = "875";
      slider.max = "1080";
      slider.step = "1";
      if (!keepSliderValue) slider.value = "987";
      if (sliderMin) sliderMin.textContent = "87.5";
      if (sliderMax) sliderMax.textContent = "108.0";
    } else {
      slider.min = "530";
      slider.max = "1710";
      slider.step = "10";
      if (!keepSliderValue) slider.value = "680";
      if (sliderMin) sliderMin.textContent = "530";
      if (sliderMax) sliderMax.textContent = "1710";
    }
    syncFromSlider();
    updatePresetDisabled();
  }

  function updatePresetDisabled() {
    if (!presetGrid) return;
    var presets = presetGrid.querySelectorAll(".rd-preset");
    for (var i = 0; i < presets.length; i++) {
      presets[i].disabled = band !== "fm";
    }
  }

  function findPresetName() {
    if (band !== "fm" || !presetGrid) return null;
    var mhz = (getFmTenths() / 10).toFixed(1);
    var presets = presetGrid.querySelectorAll(".rd-preset");
    for (var i = 0; i < presets.length; i++) {
      var p = presets[i];
      if (p.getAttribute("data-fm") === mhz) return p.getAttribute("data-name");
    }
    return null;
  }

  function syncFromSlider() {
    if (!slider || !tunerFreq || !nowFreq) return;
    if (band === "fm") {
      var t = getFmTenths();
      var s = fmtFmTenths(t);
      tunerFreq.textContent = s;
      nowFreq.textContent = s;
      var name = findPresetName();
      if (stationName) stationName.textContent = name || "Scanning…";
      if (signal) signal.classList.toggle("is-strong", !!name);
    } else {
      var k = parseInt(slider.value, 10);
      var label = k + " kHz";
      tunerFreq.textContent = label;
      nowFreq.textContent = label;
      if (stationName) stationName.textContent = "AM Band";
      if (signal) signal.classList.remove("is-strong");
    }
  }

  if (bandFm) {
    bandFm.addEventListener("click", function () {
      setBand("fm");
    });
  }
  if (bandAm) {
    bandAm.addEventListener("click", function () {
      setBand("am");
    });
  }
  if (slider) {
    slider.addEventListener("input", syncFromSlider);
  }

  function seek(delta) {
    if (!slider) return;
    if (band === "fm") {
      var t = getFmTenths() + delta * 2;
      t = Math.max(875, Math.min(1080, t));
      slider.value = String(t);
    } else {
      var k = parseInt(slider.value, 10) + delta * 10;
      k = Math.max(530, Math.min(1710, k));
      slider.value = String(k);
    }
    syncFromSlider();
    clearPresetActive();
  }

  if (seekDown) seekDown.addEventListener("click", function () {
    seek(-1);
  });
  if (seekUp) seekUp.addEventListener("click", function () {
    seek(1);
  });
  if (searchBtn) searchBtn.addEventListener("click", function () {
    console.log("Search stations");
  });

  function clearPresetActive() {
    if (!presetGrid) return;
    var presets = presetGrid.querySelectorAll(".rd-preset");
    for (var i = 0; i < presets.length; i++) {
      presets[i].classList.remove("is-active");
      presets[i].setAttribute("aria-selected", "false");
    }
  }

  function activatePreset(btn) {
    clearPresetActive();
    btn.classList.add("is-active");
    btn.setAttribute("aria-selected", "true");
    var mhz = btn.getAttribute("data-fm");
    if (mhz && slider) {
      var tenths = Math.round(parseFloat(mhz, 10) * 10);
      slider.value = String(Math.max(875, Math.min(1080, tenths)));
      setBand("fm", true);
    }
    syncFromSlider();
  }

  if (presetGrid) {
    presetGrid.addEventListener("click", function (e) {
      var btn = e.target.closest(".rd-preset");
      if (!btn || btn.disabled) return;
      activatePreset(btn);
    });
  }

  if (likeBtn) {
    likeBtn.addEventListener("click", function () {
      var on = likeBtn.getAttribute("aria-pressed") === "true";
      likeBtn.setAttribute("aria-pressed", on ? "false" : "true");
      likeBtn.querySelector("span").textContent = on ? "♡" : "♥";
    });
  }
  if (shareBtn) {
    shareBtn.addEventListener("click", function () {
      console.log("Share");
    });
  }

  for (var s = 0; s < srcBtns.length; s++) {
    srcBtns[s].addEventListener("click", function () {
      for (var j = 0; j < srcBtns.length; j++) {
        srcBtns[j].classList.remove("is-active");
        srcBtns[j].setAttribute("aria-checked", "false");
      }
      this.classList.add("is-active");
      this.setAttribute("aria-checked", "true");
    });
  }

  for (var d = 0; d < dockBtns.length; d++) {
    dockBtns[d].addEventListener("click", function () {
      if (this.classList.contains("rd-dock__btn--avatar")) return;
      for (var k = 0; k < dockBtns.length; k++) {
        dockBtns[k].classList.remove("rd-dock__btn--active");
        dockBtns[k].removeAttribute("aria-current");
      }
      this.classList.add("rd-dock__btn--active");
      this.setAttribute("aria-current", "page");
    });
  }

  var editPresets = document.getElementById("rdEditPresets");
  var addPreset = document.getElementById("rdAddPreset");
  if (editPresets) editPresets.addEventListener("click", function () {
    console.log("Edit presets");
  });
  if (addPreset) addPreset.addEventListener("click", function () {
    console.log("Add preset");
  });

  setBand("fm");
  syncFromSlider();
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
