const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const rememberInput = document.getElementById("remember");

const signInBtn = document.getElementById("signInBtn");
const googleBtn = document.getElementById("googleBtn");
const facebookBtn = document.getElementById("facebookBtn");
const appleBtn = document.getElementById("appleBtn");

const forgotLink = document.getElementById("forgotLink");
const signUpLink = document.getElementById("signUpLink");

function setPressed(btn) {
  if (!btn) return;
  btn.classList.add("pressed");
  window.setTimeout(() => btn.classList.remove("pressed"), 180);
}

// Restore remembered email (optional UX improvement).
document.addEventListener("DOMContentLoaded", () => {
  try {
    const remembered = localStorage.getItem("otovision_remembered_email");
    if (remembered && emailInput && rememberInput) {
      emailInput.value = remembered;
      rememberInput.checked = true;
    }
  } catch (e) {
    // Ignore storage errors (privacy mode, blocked storage, etc.)
  }
});

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput?.value?.trim() || "";
    const remember = rememberInput?.checked;

    try {
      if (remember) localStorage.setItem("otovision_remembered_email", email);
      else localStorage.removeItem("otovision_remembered_email");
    } catch (err) {
      // Ignore storage errors
    }

    setPressed(signInBtn);
    console.log("Sign In clicked:", { email });
  });
}

function wireSocial(btn, provider) {
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    setPressed(btn);
    console.log(`Social sign-in: ${provider}`);
  });
}

wireSocial(googleBtn, "google");
wireSocial(facebookBtn, "facebook");
wireSocial(appleBtn, "apple");

if (forgotLink) {
  forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    setPressed(signInBtn);
    console.log("Forgot Password clicked");
  });
}

if (signUpLink) {
  signUpLink.addEventListener("click", (e) => {
    e.preventDefault();
    setPressed(signInBtn);
    console.log("Sign up clicked");
  });
}
