(function () {
  "use strict";

  var menuBtn = document.getElementById("menuBtn");
  var insMenu = document.getElementById("insMenu");
  var insMenuBackdrop = document.getElementById("insMenuBackdrop");
  var insMenuClose = document.getElementById("insMenuClose");
  var quickBtns = document.querySelectorAll(".ins-quick__btn");
  var dockBtns = document.querySelectorAll(".ins-dock__btn");
  var btnSchedule = document.getElementById("btnSchedule");
  var btnNewTrip = document.getElementById("btnNewTrip");
  var viewAllTrips = document.getElementById("viewAllTrips");

  function setMenuOpen(open) {
    if (!insMenu || !menuBtn) return;
    insMenu.classList.toggle("is-open", open);
    insMenu.setAttribute("aria-hidden", open ? "false" : "true");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("ins-menu-open", open);
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      setMenuOpen(!insMenu.classList.contains("is-open"));
    });
  }
  if (insMenuBackdrop) insMenuBackdrop.addEventListener("click", function () {
    setMenuOpen(false);
  });
  if (insMenuClose) insMenuClose.addEventListener("click", function () {
    setMenuOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && insMenu && insMenu.classList.contains("is-open")) {
      setMenuOpen(false);
    }
  });

  if (insMenu) {
    var links = insMenu.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        setMenuOpen(false);
      });
    }
  }

  for (var q = 0; q < quickBtns.length; q++) {
    quickBtns[q].addEventListener("click", function () {
      var action = this.getAttribute("data-action");
      for (var j = 0; j < quickBtns.length; j++) {
        quickBtns[j].classList.remove("is-active");
      }
      this.classList.add("is-active");
      console.log("Quick action:", action);
    });
  }

  for (var d = 0; d < dockBtns.length; d++) {
    dockBtns[d].addEventListener("click", function () {
      if (this.classList.contains("ins-dock__btn--avatar")) return;
      for (var k = 0; k < dockBtns.length; k++) {
        var b = dockBtns[k];
        if (!b.classList.contains("ins-dock__btn--home")) {
          b.classList.remove("is-active");
        }
      }
      if (!this.classList.contains("ins-dock__btn--home")) {
        this.classList.add("is-active");
      }
    });
  }

  if (btnSchedule) {
    btnSchedule.addEventListener("click", function () {
      console.log("Schedule Service");
    });
  }
  if (btnNewTrip) {
    btnNewTrip.addEventListener("click", function () {
      console.log("Start New Trip");
    });
  }
  if (viewAllTrips) {
    viewAllTrips.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("View All trips");
    });
  }
})();
(function () {
  "use strict";

  var menuBtn = document.getElementById("menuBtn");
  var navPanel = document.getElementById("navPanel");
  var navBackdrop = document.getElementById("navBackdrop");
  var navClose = document.getElementById("navClose");
  var unlockBtn = document.getElementById("unlockBtn");
  var actionLabel = document.getElementById("actionLabel");
  var profileLink = document.getElementById("profileLink");
  var heroBlock = document.getElementById("heroBlock");
  var heroImg = heroBlock ? heroBlock.querySelector(".hero__img") : null;

  var locked = true;

  if (heroImg && heroBlock) {
    heroImg.addEventListener("error", function () {
      heroImg.style.display = "none";
      heroBlock.classList.add("hero--missing");
    });
  }

  function setNavOpen(open) {
    if (!navPanel || !menuBtn) return;
    navPanel.classList.toggle("is-open", open);
    navPanel.setAttribute("aria-hidden", open ? "false" : "true");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open);
    if (navClose) navClose.tabIndex = open ? 0 : -1;
  }

  function openNav() {
    setNavOpen(true);
  }

  function closeNav() {
    setNavOpen(false);
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      if (navPanel && navPanel.classList.contains("is-open")) closeNav();
      else openNav();
    });
  }

  if (navBackdrop) navBackdrop.addEventListener("click", closeNav);
  if (navClose) navClose.addEventListener("click", closeNav);

  var navLinks = navPanel ? navPanel.querySelectorAll(".nav-panel__list a") : [];
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function () {
      closeNav();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navPanel && navPanel.classList.contains("is-open")) {
      closeNav();
    }
  });

  function setLocked(next) {
    locked = next;
    if (!unlockBtn) return;
    unlockBtn.classList.remove(locked ? "is-unlocked" : "is-locked");
    unlockBtn.classList.add(locked ? "is-locked" : "is-unlocked");
    unlockBtn.setAttribute("aria-pressed", locked ? "false" : "true");
    unlockBtn.setAttribute("aria-label", locked ? "Unlock vehicle" : "Lock vehicle");
    if (actionLabel) {
      actionLabel.textContent = locked ? "Unlock your car" : "Your car is unlocked";
    }
    console.log(locked ? "Vehicle locked" : "Vehicle unlocked");
  }

  if (unlockBtn) {
    unlockBtn.addEventListener("click", function () {
      setLocked(!locked);
    });
  }

  if (profileLink) {
    profileLink.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Profile");
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
