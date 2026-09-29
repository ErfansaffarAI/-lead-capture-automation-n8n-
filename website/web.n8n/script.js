(function () {
  "use strict";

  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  const form = document.getElementById("enquiryForm");
  const submitBtn = document.getElementById("submitBtn");
  const statusBox = document.getElementById("formStatus");
  const serviceSelect = document.getElementById("service");
  const messageBox = document.getElementById("message");

  // Header shadow / solid background on scroll
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  }
  menuToggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  // Buttons/links with data-service preselect the form's service
  document.querySelectorAll("[data-service]").forEach((el) => {
    el.addEventListener("click", (e) => {
      serviceSelect.value = el.dataset.service;
      if (el.dataset.note && !messageBox.value.trim()) {
        messageBox.value = "I'm interested in the " + el.dataset.note + ".";
      }
      if (el.tagName === "BUTTON") {
        e.preventDefault();
        document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ---- Validation ----
  const rules = {
    full_name: (v) => (v.trim().length < 2 ? "Please enter your full name." : ""),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email address."),
    service: (v) => (v ? "" : "Please choose how we can help."),
    message: (v) => (v.trim().length < 10 ? "Please tell us a little more (at least 10 characters)." : ""),
  };

  function setError(name, msg) {
    const field = form.elements[name];
    const holder = field.closest(".field");
    document.getElementById(name + "_error").textContent = msg;
    holder.classList.toggle("has-error", Boolean(msg));
    field.setAttribute("aria-invalid", msg ? "true" : "false");
  }

  function validate() {
    let firstInvalid = null;
    Object.keys(rules).forEach((name) => {
      const msg = rules[name](form.elements[name].value);
      setError(name, msg);
      if (msg && !firstInvalid) firstInvalid = form.elements[name];
    });
    const consent = form.elements.consent;
    const consentMsg = consent.checked ? "" : "Please confirm you agree to be contacted.";
    setError("consent", consentMsg);
    if (consentMsg && !firstInvalid) firstInvalid = consent;
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  Object.keys(rules).forEach((name) => {
    form.elements[name].addEventListener("blur", () => setError(name, rules[name](form.elements[name].value)));
  });

  function showStatus(type, text) {
    statusBox.className = "form-status " + type;
    statusBox.textContent = text;
  }

  function setLoading(on) {
    submitBtn.disabled = on;
    submitBtn.classList.toggle("is-loading", on);
    submitBtn.querySelector(".btn-label").textContent = on ? "Sending..." : "Send enquiry";
  }

  // ---- Submit to n8n webhook ----
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusBox.className = "form-status";
    statusBox.textContent = "";
    if (!validate()) return;

    // The webhook URL comes from config.js (never commit that file)
    const url = window.N8N_WEBHOOK_URL;
    if (!url || url.includes("PASTE_YOUR")) {
      showStatus("error", "The form endpoint has not been configured yet. Please add your n8n webhook URL to config.js.");
      return;
    }

    // Exactly the fields the n8n workflow expects (consent is NOT sent)
    const payload = {
      full_name: form.elements.full_name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      service: form.elements.service.value,
      message: form.elements.message.value.trim(),
    };

    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed: " + res.status);
      showStatus("success", "Thank you — your enquiry has been received. A member of our team will be in touch shortly.");
      form.reset();
    } catch (err) {
      showStatus("error", "We could not send your enquiry right now. Please try again or contact us directly.");
    } finally {
      setLoading(false);
    }
  });
})();
