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
