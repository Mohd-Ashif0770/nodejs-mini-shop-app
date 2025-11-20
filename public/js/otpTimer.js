// OTP input UX: move focus, handle paste
(function () {
  const inputs = Array.from(document.querySelectorAll(".otp-input"));
  const otpHidden = document.getElementById("otpHidden");
  inputs[0].focus();

  inputs.forEach((input, idx) => {
    input.addEventListener("input", (e) => {
      const val = e.target.value.replace(/[^0-9]/g, "");
      e.target.value = val;
      if (val && idx < inputs.length - 1) inputs[idx + 1].focus();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && idx > 0) {
        inputs[idx - 1].focus();
      }
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData)
        .getData("text")
        .trim();
      const digits = paste.replace(/\D/g, "").slice(0, inputs.length).split("");
      digits.forEach((d, i) => (inputs[i].value = d));
      const next =
        digits.length >= inputs.length
          ? inputs[inputs.length - 1]
          : inputs[digits.length];
      if (next) next.focus();
    });
  });

  // On submit, combine
  document.getElementById("otpForm").addEventListener("submit", function (e) {
    const code = inputs.map((i) => i.value || "").join("");
    otpHidden.value = code;
    if (code.length < inputs.length) {
      e.preventDefault();
      alert("Please enter the full 6-digit code");
    }
  });
})();

// Timer for resend (uses existing otpTimer.js if available, fallback implemented)
(function () {
  let seconds = 60;
  const secondsEl = document.getElementById("seconds");
  const resendBtn = document.getElementById("resendBtn");
  const timerText = document.getElementById("timerText");

  function tick() {
    if (!secondsEl) return;
    if (seconds > 0) {
      secondsEl.textContent = seconds;
      resendBtn.disabled = true;
      seconds--;
      setTimeout(tick, 1000);
    } else {
      secondsEl.parentElement.textContent = "";
      resendBtn.disabled = false;
    }
  }
  tick();
})();
