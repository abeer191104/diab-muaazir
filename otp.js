const otpInput = document.getElementById("otpInput");
const verifyBtn = document.getElementById("verifyBtn");
const errorEl = document.getElementById("error");
const timerEl = document.getElementById("timer");

// 🔥 Load stored data
const storedOtp = localStorage.getItem("login_otp");
const expiry = parseInt(localStorage.getItem("login_otp_expiry"));
const tempUser = JSON.parse(localStorage.getItem("tempUser"));

// 🚫 Safety checks
if (!storedOtp || !expiry || !tempUser) {
  window.location.href = "login.html";
}

// ===============================
// ⏳ TIMER
// ===============================
function updateTimer() {
  const remaining = expiry - Date.now();

  if (remaining <= 0) {
    timerEl.textContent = "OTP expired";
    localStorage.removeItem("login_otp");
    return;
  }

  const seconds = Math.floor(remaining / 1000);
  timerEl.textContent = "Expires in: " + seconds + "s";
}

setInterval(updateTimer, 1000);
updateTimer();

// ===============================
// ✅ VERIFY OTP
// ===============================
verifyBtn.addEventListener("click", () => {
  const entered = otpInput.value.trim();

  // expired check
  if (Date.now() > expiry) {
    errorEl.textContent = "OTP expired. Please login again.";
    return;
  }

  // match check
  if (entered !== storedOtp) {
    errorEl.textContent = "Incorrect OTP";
    return;
  }

  // ✅ SUCCESS → promote tempUser → currentUser
  localStorage.setItem("currentUser", JSON.stringify(tempUser));

  // cleanup
  localStorage.removeItem("tempUser");
  localStorage.removeItem("login_otp");
  localStorage.removeItem("login_otp_expiry");

  // redirect by role
  if (tempUser.role === "Doctor") {
    window.location.href = "doctor/patients.html";
  } else {
    window.location.href = "patient/patient.html";
  }
});
