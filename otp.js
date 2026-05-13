const otpInput =
  document.getElementById("otpInput");

const verifyBtn =
  document.getElementById("verifyBtn");

const errorEl =
  document.getElementById("error");

const tempUser =
  JSON.parse(localStorage.getItem("tempUser"));

const email =
  sessionStorage.getItem("otp_email");

const storedOtp =
  localStorage.getItem("login_otp");

const expiry =
  parseInt(
    localStorage.getItem("login_otp_expiry")
  );

if (!tempUser || !email) {

  window.location.href = "login.html";
}

/* =========================
   VERIFY OTP
========================= */

verifyBtn.addEventListener("click", async () => {

  const otp = otpInput.value.trim();

  if (!otp) {

    errorEl.textContent = "Enter OTP";
    return;
  }

  if (Date.now() > expiry) {

  errorEl.textContent = "OTP expired";
  return;
}

if (otp !== storedOtp) {

  errorEl.textContent = "Incorrect OTP";
  return;
}

    /* SUCCESS LOGIN */

    localStorage.setItem(
      "currentUser",
      JSON.stringify(tempUser)
    );

    localStorage.removeItem("tempUser");
    localStorage.removeItem("login_otp");
    localStorage.removeItem("login_otp_expiry");
    
    sessionStorage.removeItem("otp_email");

    if (tempUser.role === "Doctor") {

      window.location.href =
        "doctor/patients.html";

    } else {

      window.location.href =
        "patient/patient.html";
    }

  }
);
