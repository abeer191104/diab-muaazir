import {
  auth
} from "./firebase-config.js";

import {
  PhoneAuthProvider,
  signInWithCredential
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const otpInput = document.getElementById("otpInput");
const verifyBtn = document.getElementById("verifyBtn");
const errorEl = document.getElementById("error");

// ===============================
// LOAD STORED DATA
// ===============================

const tempUser =
  JSON.parse(localStorage.getItem("tempUser"));

const verificationId =
  sessionStorage.getItem("verificationId");

// ===============================
// SAFETY CHECKS
// ===============================

if (!tempUser || !verificationId) {

  window.location.href = "login.html";

}

// ===============================
// VERIFY OTP
// ===============================

verifyBtn.addEventListener("click", async () => {

  errorEl.textContent = "";

  const code = otpInput.value.trim();

  // empty input
  if (!code) {

    errorEl.textContent =
      "Please enter the verification code";

    return;

  }

  try {

    // create credential
    const credential =
      PhoneAuthProvider.credential(
        verificationId,
        code
      );

    // verify code
    await signInWithCredential(
      auth,
      credential
    );

    // promote temp user → current user
    localStorage.setItem(
      "currentUser",
      JSON.stringify(tempUser)
    );

    // cleanup
    localStorage.removeItem("tempUser");

    sessionStorage.removeItem("verificationId");

    // redirect by role
    if (tempUser.role === "Doctor") {

      window.location.href =
        "doctor/patients.html";

    }

    else if (tempUser.role === "Parent") {

      window.location.href =
        "patient/patient.html";

    }

    else {

      window.location.href =
        "patient/patient.html";

    }

  }

  catch (err) {

    console.error(err);

    errorEl.textContent =
      "Invalid or expired verification code";

  }

});
