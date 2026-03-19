const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function isValidEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function createErrorElem(message) {
  const el = document.createElement("div");
  el.className = "input-error";
  el.textContent = message;
  return el;
}

function clearErrors(container) {
  qsa(".input-error", container).forEach((e) => e.remove());
  qsa(".inputbox", container).forEach((box) =>
    box.classList.remove("has-error")
  );
}

function showError(inputElem, message) {
  const box = inputElem.closest(".inputbox") ?? inputElem.parentElement;
  box.classList.add("has-error");

  const prev = box.querySelector(".input-error");
  if (prev) prev.remove();
  box.appendChild(createErrorElem(message));
}


function showFormMessage(container, message, isError = false) {
  let m = qs(".form-message", container);
  if (!m) {
    m = document.createElement("div");
    m.className = "form-message";
    container.appendChild(m);
  }
  m.textContent = message;
  m.classList.toggle("error", isError);
  m.classList.toggle("success", !isError);

  setTimeout(() => {
    if (m) m.remove();
  }, 3000);
}


const openBtn = qs("#open");
const loginPopup = qs("#login-form");
const signupPopup = qs("#signup-form");
const closeBtns = qsa(".close-bn");


function openPopup(popup) {
  document.body.classList.add("popup-active");
  popup.classList.add("visible");
}
function closePopup(popup) {
  popup.classList.remove("visible");

  clearErrors(popup);
  const fm = qs(".form-message", popup);
  if (fm) fm.remove();
}
function closeAll() {
  [loginPopup, signupPopup].forEach((p) => p && p.classList.remove("visible"));
  document.body.classList.remove("popup-active");
  [loginPopup, signupPopup].forEach((p) => {
    if (p) clearErrors(p);
    const m = qs(".form-message", p);
    if (m) m.remove();
  });
}

if (openBtn) openBtn.addEventListener("click", () => openPopup(loginPopup));


closeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {

    closeAll();
  });
});

const loginToSignup = qs("#login-form .signup");
if (loginToSignup)
  loginToSignup.addEventListener("click", (e) => {
    e.preventDefault();
    clearErrors(loginPopup);
    closePopup(loginPopup);
    openPopup(signupPopup);
  });


const signupToLogin = qs("#goto-login");
if (signupToLogin)
  signupToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    clearErrors(signupPopup);
    closePopup(signupPopup);
    openPopup(loginPopup);
  });


document.addEventListener("click", (e) => {

  const visible = qs(".popup-form.visible");
  if (!visible) return;
  if (!visible.contains(e.target) && !e.target.matches("#open")) {
    closeAll();
  }
});



function storeUser(email, password) {

  const users = JSON.parse(localStorage.getItem("demo_users") || "{}");
  users[email.toLowerCase()] = { email: email.toLowerCase(), password };
  localStorage.setItem("demo_users", JSON.stringify(users));
}

function getUser(email) {
  const users = JSON.parse(localStorage.getItem("demo_users") || "{}");
  return users[email.toLowerCase()] ?? null;
}

if (signupPopup) {
  const signupBtn = qs(".button button", signupPopup);
  signupBtn &&
    signupBtn.addEventListener("click", (e) => {
      e.preventDefault();
      clearErrors(signupPopup);

     
      const emailInput =
        qs('input[type="text"], input[name="email"]', signupPopup) ||
        qs("#email", signupPopup);
      const passInput = qs('input[type="password"]', signupPopup);

      const confirmInput =
        qs("#comfirm-password, #confirm-password", signupPopup) ||
        qsa('input[type="password"]', signupPopup)[1];

      let valid = true;

      const email = emailInput ? emailInput.value.trim() : "";
      const password = passInput ? passInput.value : "";
      const confirm = confirmInput ? confirmInput.value : "";

      if (!email) {
        valid = false;
        showError(emailInput, "Email is required.");
      } else if (!isValidEmail(email)) {
        valid = false;
        showError(emailInput, "Enter a valid email (example@domain.com).");
      }

      if (!password) {
        valid = false;
        showError(passInput, "Password is required.");
      } else if (password.length < 6) {
        valid = false;
        showError(passInput, "Password must be at least 6 characters.");
      }

      if (!confirm) {
        valid = false;
        showError(confirmInput, "Please confirm your password.");
      } else if (password !== confirm) {
        valid = false;
        showError(confirmInput, "Passwords do not match.");
      }

      if (!valid) {
        showFormMessage(signupPopup, "Please fix the errors above.", true);
        return;
      }

      if (getUser(email)) {
        showError(emailInput, "This email is already registered.");
        showFormMessage(
          signupPopup,
          "Please use another email or log in.",
          true
        );
        return;
      }

      storeUser(email, password);
      showFormMessage(
        signupPopup,
        "Sign up successful! Please log in.",
        false
      );

      setTimeout(() => {
        clearErrors(signupPopup);
        closePopup(signupPopup);
        openPopup(loginPopup);
        showFormMessage(loginPopup, "Please enter your credentials to log in.");
      }, 1100);
    });
}

if (loginPopup) {
  const loginBtn = qs(".button button", loginPopup);
  loginBtn &&
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      clearErrors(loginPopup);

      const emailInput =
        qs('input[type="text"], input[name="email"]', loginPopup) ||
        qs("#email", loginPopup);
      const passInput = qs('input[type="password"]', loginPopup);

      let valid = true;
      const email = emailInput ? emailInput.value.trim() : "";
      const password = passInput ? passInput.value : "";

      if (!email) {
        valid = false;
        showError(emailInput, "Email is required.");
      } else if (!isValidEmail(email)) {
        valid = false;
        showError(emailInput, "Enter a valid email.");
      }

      if (!password) {
        valid = false;
        showError(passInput, "Password is required.");
      }

      if (!valid) {
        showFormMessage(loginPopup, "Please fix the errors above.", true);
        return;
      }

      const user = getUser(email);
      if (!user) {
        showError(emailInput, "No account found with this email.");
        showFormMessage(loginPopup, "Please sign up first.", true);
        return;
      }

      if (user.password !== password) {
        showError(passInput, "Incorrect password.");
        showFormMessage(
          loginPopup,
          "Login failed. Check your credentials.",
          true
        );
        return;
      }

      showFormMessage(loginPopup, `Welcome back, ${user.email}!`, false);
      setTimeout(() => {
        window.location.href = "/HTML/dashboard.html";
      }, 1000);
      setTimeout(() => {
        clearErrors(loginPopup);
        closeAll();
        localStorage.setItem("demo_logged_in", user.email);
      }, 900);
    });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const active = qs(".popup-form.visible");
    if (!active) return;
    e.preventDefault();
    const btn = qs(".button button", active);
    if (btn) btn.click();
  }
});