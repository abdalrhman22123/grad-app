(function () {
  "use strict";

  var form = document.getElementById("signupForm");
  var remember = document.getElementById("remember");
  var signInLink = document.getElementById("signInLink");

  if (!form) return;

  function clearInvalid(inputs) {
    inputs.forEach(function (el) {
      el.classList.remove("invalid");
    });
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  }

  function validatePhone(value) {
    var digits = String(value).replace(/\D/g, "");
    return digits.length >= 10;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var firstName = document.getElementById("firstName");
    var surname = document.getElementById("surname");
    var phone = document.getElementById("phone");
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    var fields = [firstName, surname, phone, email, password];
    clearInvalid(fields);

    var ok = true;

    if (!firstName.value.trim()) {
      firstName.classList.add("invalid");
      ok = false;
    }
    if (!surname.value.trim()) {
      surname.classList.add("invalid");
      ok = false;
    }
    if (!validatePhone(phone.value)) {
      phone.classList.add("invalid");
      ok = false;
    }
    if (!validateEmail(email.value)) {
      email.classList.add("invalid");
      ok = false;
    }
    if (!password.value || password.value.length < 8) {
      password.classList.add("invalid");
      ok = false;
    }

    if (!ok) {
      console.warn("Sign up validation failed.");
      return;
    }

    console.log("Sign up submitted", {
      firstName: firstName.value.trim(),
      surname: surname.value.trim(),
      phone: phone.value.trim(),
      email: email.value.trim(),
      rememberMe: remember ? remember.checked : false,
    });

    if (remember && remember.checked) {
      try {
        localStorage.setItem("otovision_remember", "1");
      } catch (err) {
        /* ignore */
      }
    } else {
      try {
        localStorage.removeItem("otovision_remember");
      } catch (err2) {
        /* ignore */
      }
    }

    window.setTimeout(function () {
      window.location.href = "dashboard.html";
    }, 200);
  });

  if (remember) {
    try {
      remember.checked = localStorage.getItem("otovision_remember") === "1";
    } catch (e) {
      remember.checked = false;
    }

    remember.addEventListener("change", function () {
      console.log("Remember Me:", remember.checked);
    });
  }

  if (signInLink) {
    signInLink.addEventListener("click", function () {
      console.log("Navigate to Sign In");
    });
  }
})();
