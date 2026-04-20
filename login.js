const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const rememberInput = document.getElementById("remember");

const signInButton = document.getElementById("signInButton");
const googleButton = document.getElementById("googleButton");
const facebookButton = document.getElementById("facebookButton");
const appleButton = document.getElementById("appleButton");

const forgotPassword = document.getElementById("forgotPassword");
const signUpLink = document.getElementById("signUpLink");

function pressButton(button) {
  if (!button) return;
  button.classList.add("pressed");
  window.setTimeout(() => button.classList.remove("pressed"), 180);
}

function safeStorage(action) {
  try {
    action();
  } catch (error) {
    console.warn("Storage unavailable", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  safeStorage(() => {
    const savedEmail = localStorage.getItem("otovision_login_email");
    if (savedEmail && emailInput && rememberInput) {
      emailInput.value = savedEmail;
      rememberInput.checked = true;
    }
  });
});

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput?.value.trim() || "";
    const shouldRemember = Boolean(rememberInput?.checked);

    safeStorage(() => {
      if (shouldRemember) {
        localStorage.setItem("otovision_login_email", email);
      } else {
        localStorage.removeItem("otovision_login_email");
      }
    });

    pressButton(signInButton);
    window.setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 200);
    
  });
}

function wireAction(button, label) {
  if (!button) return;

  button.addEventListener("click", (event) => {
    event.preventDefault();
    pressButton(button);
    console.log(label);
  });
}

wireAction(googleButton, "Google sign in clicked");
wireAction(facebookButton, "Facebook sign in clicked");
wireAction(appleButton, "Apple sign in clicked");
wireAction(forgotPassword, "Forgot password clicked");
wireAction(signUpLink, "Sign up clicked");
