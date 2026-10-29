/* Landing Page Trio — working order / trial widgets.
   Event page: ticket tier buttons pre-fill an order form whose total
   updates live and which ends in a reservation confirmation.
   SaaS page: plan buttons pre-fill a free-trial form with a live
   per-month total and a success state. Demo only — nothing is
   sold, started, or sent anywhere. */
(function () {
  "use strict";

  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
  function flag(input, bad) {
    input.classList.toggle("invalid", bad);
    input.setAttribute("aria-invalid", String(bad));
    return !bad;
  }

  /* ---------- Neon Meadow Fest ticket order ---------- */
  function initEvent() {
    var form = document.getElementById("ticket-order");
    if (!form) return;
    var PRICES = { day: 79, weekend: 189, camping: 259 };
    var NAMES = { day: "Day Pass", weekend: "3-Day Weekend", camping: "Weekend + Camping" };
    var tier = document.getElementById("t-tier");
    var qty = document.getElementById("t-qty");
    var name = document.getElementById("t-name");
    var email = document.getElementById("t-email");
    var totalEl = document.getElementById("t-total");
    var btn = document.getElementById("t-btn");

    function render() {
      var t = PRICES[tier.value] * (parseInt(qty.value, 10) || 1);
      totalEl.textContent = "$" + t;
      btn.textContent = "Reserve — $" + t + " total";
    }
    document.querySelectorAll("[data-tier]").forEach(function (a) {
      a.addEventListener("click", function () {
        tier.value = a.getAttribute("data-tier");
        render();
      });
    });
    [tier, qty].forEach(function (el) { el.addEventListener("change", render); });
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var ok = true;
      ok = flag(name, name.value.trim().length < 2) && ok;
      ok = flag(email, !isEmail(email.value)) && ok;
      if (!ok) { var f = form.querySelector(".invalid"); if (f) f.focus(); return; }
      var q = parseInt(qty.value, 10) || 1;
      document.getElementById("t-conf-ref").textContent = "NMF-" + (1000 + Math.floor(Math.random() * 9000));
      document.getElementById("t-conf-detail").textContent =
        NAMES[tier.value] + " × " + q + " for " + name.value.trim() + " — $" + (PRICES[tier.value] * q) +
        " total. Your passes would be emailed to " + email.value.trim() + ".";
      form.hidden = true;
      var conf = document.getElementById("t-confirmation");
      conf.hidden = false;
      conf.setAttribute("tabindex", "-1");
      conf.focus();
    });
    render();
  }

  /* ---------- SaaS free-trial signup ---------- */
  function initSaas() {
    var form = document.getElementById("trial-form");
    if (!form) return;
    var PRICES = { starter: 4, team: 8, ops: 14 };
    var NAMES = { starter: "Starter", team: "Team", ops: "Operations" };
    var plan = document.getElementById("s-plan");
    var seats = document.getElementById("s-seats");
    var email = document.getElementById("s-email");
    var totalEl = document.getElementById("s-total");
    var btn = document.getElementById("s-btn");

    function render() {
      var n = Math.max(1, parseInt(seats.value, 10) || 1);
      totalEl.textContent = "$" + (PRICES[plan.value] * n) + " / month after the trial";
      btn.textContent = "Start " + NAMES[plan.value] + " free for 14 days";
    }
    document.querySelectorAll("[data-plan]").forEach(function (a) {
      a.addEventListener("click", function () {
        plan.value = a.getAttribute("data-plan");
        render();
      });
    });
    plan.addEventListener("change", render);
    seats.addEventListener("input", render);
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var ok = flag(email, !isEmail(email.value));
      if (!ok) { email.focus(); return; }
      var n = Math.max(1, parseInt(seats.value, 10) || 1);
      document.getElementById("s-conf-detail").textContent =
        "Your 14-day " + NAMES[plan.value] + " trial for " + n + (n === 1 ? " seat" : " seats") +
        " would be set up for " + email.value.trim() + " — $" + (PRICES[plan.value] * n) +
        "/month only if you keep it after day 14. No card required.";
      form.hidden = true;
      var conf = document.getElementById("s-confirmation");
      conf.hidden = false;
      conf.setAttribute("tabindex", "-1");
      conf.focus();
    });
    render();
  }

  document.addEventListener("DOMContentLoaded", function () { initEvent(); initSaas(); });
})();
