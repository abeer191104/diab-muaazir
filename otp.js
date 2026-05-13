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

  try {

    const response = await fetch(
      "/api/verify-otp",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email,
          otp
        })
      }
    );

    const result = await response.json();

    if (!result.success) {

      errorEl.textContent =
        result.error || "Invalid OTP";

      return;
    }

    /* SUCCESS LOGIN */

    localStorage.setItem(
      "currentUser",
      JSON.stringify(tempUser)
    );

    localStorage.removeItem("tempUser");

    sessionStorage.removeItem("otp_email");

    if (tempUser.role === "Doctor") {

      window.location.href =
        "doctor/patients.html";

    } else {

      window.location.href =
        "patient/patient.html";
    }

  } catch (err) {

    console.error(err);

    errorEl.textContent =
      "Verification failed";
  }
});
