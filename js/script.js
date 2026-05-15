console.log(document.querySelectorAll(".lang-option"));
console.log("SCRIPT LOADED");
console.log("FULL PATH:", window.location.href);
const isArabic = document.documentElement.lang === "ar";
const NOTIF_KEY = "dm_notifications";

import { db, auth } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


function loadNotifications() {
  try {
    return JSON.parse(localStorage.getItem(NOTIF_KEY)) || [];
  } catch {
    return [];
  }
}

function saveNotifications(list) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
}

function updateNotificationBadge() {
  const badge = document.getElementById("notificationBadge");
  if (!badge) return;

  const notifications = loadNotifications();
  const seen = localStorage.getItem("dm_notifications_seen") === "true";

  if (notifications.length > 0 && !seen) {
    badge.style.display = "block";
    badge.textContent = notifications.length > 9 ? "9+" : notifications.length;
  } else {
    badge.style.display = "none";
  }
}

function addNotification(type, textEn, textAr,time) {

  localStorage.removeItem("dm_notifications_seen");
  const notifications = loadNotifications();

    const newNotif = {
    id: new Date(time).getTime(), // safer
    type,
    textEn,
    textAr,
    time
  };

  notifications.unshift(newNotif);
  saveNotifications(notifications);

  updateNotificationBadge();

if (typeof renderNotifications === "function") {
  renderNotifications();
}
}
let savedUser = JSON.parse(localStorage.getItem("currentUser"));
let values = [];
const saved = localStorage.getItem("glucoseHistory");
if (saved) {
  values = JSON.parse(saved).map(v => ({
    glucose: v.glucose,
    time: new Date(v.time) 
  }));
}
document.addEventListener("DOMContentLoaded", async function () {
  // Helpers
  const $ = (id) => document.getElementById(id);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));
let pendingChanges = {};

savedUser = JSON.parse(localStorage.getItem("currentUser"));

const protectedPages = [
  "patient.html",
  "profile.html",
  "settings.html",
  "sugar-history.html",
  "contact-doctor.html",
  "notifications.html",
  "carbcalc.html",

  "patient-dashboard-ar.html",
  "profile-ar.html",
  "settings-ar.html",
  "sugar-history-ar.html",
  "contact-doctor-ar.html",
  "notifications-ar.html",
  "carbcalc-ar.html"
];

const isProtected = protectedPages.some(page =>
  window.location.pathname.includes(page)
);

if (isProtected) {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    window.location.href = isArabic ? "login-ar.html" : "login.html";
    return;
  }
}
  function showError(input, errorEl, message) {
    if (!input || !errorEl) return;
    input.classList.add("input-error");
    errorEl.textContent = message;
    errorEl.classList.add("active");
  }

  function clearError(input, errorEl) {
    if (!input || !errorEl) return;
    input.classList.remove("input-error");
    errorEl.textContent = "";
    errorEl.classList.remove("active");
  }
  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
  
    let age = today.getFullYear() - birthDate.getFullYear();
  
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
  
    return age;
  }

  (function loadProfilePage() {

  const fullNameEl = document.getElementById("fullName");
  if (!fullNameEl) return; // not profile page

  if (!savedUser) return;

  const { firstName, lastName, email, age, uid } = savedUser;

  fullNameEl.value = `${firstName} ${lastName}` || "-";
  document.getElementById("age").value = age || "-";
  document.getElementById("profileEmail").value = email || "-";
const fallback = document.getElementById("profilePicFallback");

if (fallback && firstName) {
  fallback.textContent = firstName.charAt(0).toUpperCase();
}
  async function fetchUserData() {

    let userDoc = await getDoc(doc(db, "Patient", uid));

    if (!userDoc.exists()) {
      userDoc = await getDoc(doc(db, "Doctor", uid));
    }

    if (!userDoc.exists()) {
      userDoc = await getDoc(doc(db, "Parent", uid));
    }

    if (!userDoc.exists()) return;

    const data = userDoc.data();

    document.getElementById("gender").value = data.gender || "-";
    document.getElementById("profileDob").value = data.dob || "-";
    document.getElementById("profilePhone").value = data.phone || "-";
    document.getElementById("address").value = data.address || "-";
  }

  fetchUserData();

})();

  (function slideMenu() {
    const menuToggle = $("menuToggle");
    const sideMenu = $("sideMenu");
    const menuOverlay = $("menuOverlay");

    if (!menuToggle || !sideMenu || !menuOverlay) return;

    function openMenu() {
      sideMenu.classList.add("active");
      menuOverlay.style.display = "block";
    }

    function closeMenu() {
      sideMenu.classList.remove("active");
      menuOverlay.style.display = "none";
    }

    menuToggle.addEventListener("click", openMenu);
    menuOverlay.addEventListener("click", closeMenu);

    sideMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  })();
(function languageDropdownUI() {
  const toggle = document.getElementById("langToggle");
  const dropdown = document.getElementById("langDropdown");

  if (!toggle || !dropdown) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("active");
  });

  // Close when clicking outside
  document.addEventListener("click", () => {
    dropdown.classList.remove("active");
  });
})();

  (function backButtons() {
    const goBackBtn = $("goBackBtn");
    if (!goBackBtn) return;

    goBackBtn.addEventListener("click", function () {
      window.history.back();
    });
  })();


(function setMenuUserDefault() {
  const menuUserName = $("menuUserName");
  const menuUserAge = $("menuUserAge");
  const menuUserEmail = $("menuUserEmail");
  const userProfilePic = $("userProfilePic");
  const userAvatarFallback = $("userAvatarFallback");

  if (!menuUserName && !menuUserAge && !menuUserEmail) return;

if (!savedUser) return;

  const user = {
    name: savedUser
      ? `${savedUser.firstName} ${savedUser.lastName}`.trim()
      : (isArabic ? "زائر" : "Guest"),

      age: savedUser
      ? savedUser.age || "--"
      : "--",

    email: savedUser
      ? savedUser.email
      : (isArabic ? "غير مسجل الدخول" : "Not signed in"),

    photo: "../images/profile icon.png"
  };

  menuUserName.textContent = user.name;
  menuUserAge.textContent = isArabic
    ? "العمر: " + user.age
    : "Age: " + user.age;

  menuUserEmail.textContent = user.email;

  const letter = (user.name || "?").trim().charAt(0).toUpperCase();

  if (userProfilePic && userAvatarFallback) {
    if (user.photo) {
      userProfilePic.src = user.photo;
      userProfilePic.style.display = "block";
      userAvatarFallback.style.display = "none";
    } else {
      userProfilePic.style.display = "none";
      userAvatarFallback.style.display = "flex";
      userAvatarFallback.textContent = letter;
    }
  }
})();


  (function roleSelection() {
    const roles = qsa('input[name="role"]');
    const doctorField = $("doctorField");
    if (!roles.length || !doctorField) return;

    roles.forEach((role) => {
      role.addEventListener("change", function () {
        if (this.value === "Doctor") doctorField.classList.remove("hidden");
        else doctorField.classList.add("hidden");
      });
    });
  })();


  (function dobMaxDate() {
    const dobInput = $("dob");
    if (!dobInput) return;

    const today = new Date().toISOString().split("T")[0];
    dobInput.setAttribute("max", today);
  })();

(function togglePassword() {
  const toggle = document.getElementById("togglePassword");
  if (!toggle) return;

  const passwordInput =
    document.getElementById("password") || document.getElementById("loginPassword");

  if (!passwordInput) return;

  toggle.addEventListener("click", function () {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    toggle.textContent = isHidden ? "Hide" : "Show";
  });
})();

(function registerValidation() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const firstNameInput = document.getElementById("firstName"); 
  const lastNameInput = document.getElementById("lastName");  
  const emailInput = document.getElementById("email");         
  const phoneInput = document.getElementById("phone");
  const phoneError = document.getElementById("phoneError");

  const passwordInput = document.getElementById("password");
  const passwordError = document.getElementById("passwordError");

  const confirmPassword = document.getElementById("confirmPassword");
  const confirmPasswordError = document.getElementById("confirmPasswordError");

  const dobInput = document.getElementById("dob");
  const dobError = document.getElementById("dobError");

  const addressInput = document.getElementById("address");
  const addressError = document.getElementById("addressError");

  const genderError = document.getElementById("genderError");
  const roleError = document.getElementById("roleError");

  const doctorField = document.getElementById("doctorField");
  const doctorLicense = document.getElementById("doctorLicense");
  const doctorLicenseError = document.getElementById("doctorLicenseError");

  const saudiPhoneRegex = /^05\d{8}$/;

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }
function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^\w\s]/.test(password)) score++;

  if (/^(.)\1+$/.test(password)) score -= 2;
  if (/1234|abcd|password/i.test(password)) score -= 2;

  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
}

  function selectedValue(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : "";
  }

  function showError(input, errorEl, msg) {
    if (input) input.classList.add("input-error");
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.add("active");
    }
  }

  function clearError(input, errorEl) {
    if (input) input.classList.remove("input-error");
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.remove("active");
    }
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      phoneInput.value = phoneInput.value.replace(/\D/g, "");
      clearError(phoneInput, phoneError);
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      if (passwordInput.value.length >= 8) clearError(passwordInput, passwordError);
    });
  }

  if (confirmPassword) {
    confirmPassword.addEventListener("input", () => {
      if (passwordInput && passwordInput.value === confirmPassword.value) {
        clearError(confirmPassword, confirmPasswordError);
      }
    });
  }

  if (dobInput) dobInput.addEventListener("input", () => clearError(dobInput, dobError));
  if (addressInput) addressInput.addEventListener("input", () => clearError(addressInput, addressError));
  if (emailInput) emailInput.addEventListener("input", () => emailInput.classList.remove("input-error"));
  if (firstNameInput) {firstNameInput.addEventListener("input", () => clearError(firstNameInput, document.getElementById("firstNameError"))  );}
if (lastNameInput) {  lastNameInput.addEventListener("input", () =>  clearError(lastNameInput, document.getElementById("lastNameError"))  );}
  document.querySelectorAll('input[name="gender"]').forEach((r) =>
    r.addEventListener("change", () => {
      if (genderError) { genderError.textContent = ""; genderError.classList.remove("active"); }
    })
  );

  document.querySelectorAll('input[name="role"]').forEach((r) =>
    r.addEventListener("change", () => {
      if (roleError) { roleError.textContent = ""; roleError.classList.remove("active"); }
    })
  );

  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // ✅ we fully control submission
    let valid = true;


const firstNameError = document.getElementById("firstNameError");

if (!firstNameInput || !firstNameInput.value.trim()) {
  showError(
    firstNameInput,
    firstNameError,
    isArabic ? "الاسم الأول مطلوب" : "First name is required"
  );
  valid = false;
} else {
  clearError(firstNameInput, firstNameError);
}

const lastNameError = document.getElementById("lastNameError");

if (!lastNameInput || !lastNameInput.value.trim()) {
  showError(
    lastNameInput,
    lastNameError,
    isArabic ? "اسم العائلة مطلوب" : "Last name is required"
  );
  valid = false;
} else {
  clearError(lastNameInput, lastNameError);
}

const emailError = document.getElementById("emailError");

if (!emailInput.value.trim()) {
  showError(
    emailInput,
    emailError,
    isArabic ? "البريد الإلكتروني مطلوب" : "Email is required"
  );
  valid = false;

} else if (!emailInput.checkValidity()) {
  showError(
    emailInput,
    emailError,
    isArabic ? "صيغة البريد الإلكتروني غير صحيحة" : "Invalid email format"
  );
  valid = false;

} else {
  clearError(emailInput, emailError);
}

    if (phoneInput) {
      const v = phoneInput.value.trim();
      if (!saudiPhoneRegex.test(v)) {
showError(phoneInput, phoneError,
  isArabic
    ? "يجب أن يتكون رقم الهاتف من 10 أرقام ويبدأ بـ 05"
    : "Phone number must be 10 digits and start with 05."
);        valid = false;
      } else clearError(phoneInput, phoneError);
    }

    if (dobInput) {
      if (!dobInput.value) {
showError(dobInput, dobError,
  isArabic
    ? "تاريخ الميلاد مطلوب"
    : "Date of birth is required."
);        valid = false;
      } else clearError(dobInput, dobError);
    }

    if (addressInput) {
      if (!addressInput.value.trim()) {
showError(addressInput, addressError,
  isArabic
    ? "العنوان مطلوب"
    : "Address is required."
);        valid = false;
      } else clearError(addressInput, addressError);
    }

    const gender = selectedValue("gender");
    if (!gender) {
      if (genderError) {
genderError.textContent = isArabic
  ? "يرجى اختيار الجنس"
  : "Please select a gender.";        genderError.classList.add("active");
      }
      valid = false;
    } else {
      if (genderError) { genderError.textContent = ""; genderError.classList.remove("active"); }
    }

    const role = selectedValue("role");
    if (!role) {
      if (roleError) {
roleError.textContent = isArabic
  ? "يرجى اختيار الدور"
  : "Please select a role.";        roleError.classList.add("active");
      }
      valid = false;
    } else {
      if (roleError) { roleError.textContent = ""; roleError.classList.remove("active"); }
    }

    if (role === "Doctor" && doctorField && !doctorField.classList.contains("hidden")) {
      if (!doctorLicense || !doctorLicense.files || doctorLicense.files.length === 0) {
showError(doctorLicense, doctorLicenseError,
  isArabic
    ? "يرجى رفع ترخيص الطبيب"
    : "Doctor license is required."
);        valid = false;
      } else clearError(doctorLicense, doctorLicenseError);
    } else {
      if (doctorLicenseError) { doctorLicenseError.textContent = ""; doctorLicenseError.classList.remove("active"); }
      if (doctorLicense) doctorLicense.classList.remove("input-error");
    }

   if (passwordInput) {   
  const password = passwordInput.value;
  const fill = document.getElementById("passwordStrengthFill");

   if (!password) {
  fill.style.width = "0%";
  return;
}

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^\w\s]/.test(password);

  if (
    password.length < 8 ||
    !hasUpper ||
    !hasLower ||
    !hasNumber ||
    !hasSpecial
  ) {
    showError(
      passwordInput,
      passwordError,
      isArabic
        ? "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص"
        : "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
    );
    valid = false;
  } else {
    clearError(passwordInput, passwordError);
  }
    const strength = getPasswordStrength(password);

  if (!fill) return;

  if (strength === "weak") {
    fill.style.width = "33%";
    fill.style.background = "red";
  } 
  else if (strength === "medium") {
    fill.style.width = "66%";
    fill.style.background = "orange";
  } 
  else {
    fill.style.width = "100%";
    fill.style.background = "green";
  }
}

    if (passwordInput && confirmPassword && passwordInput.value !== confirmPassword.value) {
showError(confirmPassword, confirmPasswordError,
  isArabic
    ? "كلمتا المرور غير متطابقتين"
    : "Passwords do not match."
);      valid = false;
    } else if (confirmPassword) {
      clearError(confirmPassword, confirmPasswordError);
    }

    if (!valid) return;

    const email = normalizeEmail(emailInput.value);

try {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    passwordInput.value
  );

const firebaseUser = userCredential.user;

console.log("saving user to firestore...");
  
let collectionName = "Patient";

if (role === "Doctor") {
  collectionName = "Doctor";
} else if (role === "Parent") {
  collectionName = "Parent";
}
const age = calculateAge(dobInput.value);

let certificateName = "";

if (role === "Doctor" && doctorLicense.files.length > 0) {
  certificateName = doctorLicense.files[0].name;
}

await setDoc(doc(db, collectionName, firebaseUser.uid), {
    firstName: firstNameInput ? firstNameInput.value.trim() : "",
    lastName: lastNameInput ? lastNameInput.value.trim() : "",
    email: email,
    age: age,
    role: role,
    gender: gender,
    dob: dobInput ? dobInput.value : "",
    phone: phoneInput ? phoneInput.value.trim() : "",
    address: addressInput ? addressInput.value.trim() : "",
    ...(role === "Doctor" && { certificateName }),
    createdAt: new Date()
  });

  alert(
    isArabic
      ? "تم إنشاء الحساب بنجاح"
      : "Account created successfully"
  );

  window.location.href = isArabic
    ? "login-ar.html"
    : "login.html";

} catch (error) {
  if (error.code === "auth/email-already-in-use") {
    alert(
      isArabic
        ? "هذا البريد الإلكتروني مستخدم بالفعل"
        : "This email is already registered"
    );
  } else {
    alert(error.message);
  }
}});
})();

  let lastAlertEmailTime = 0;
  
  (async function listenToPump() {

  const pumpRef = doc(db, "pump_live_data", "live");

  let lastStatus = null; // 🔥 prevents duplicate notifications

  onSnapshot(pumpRef, async (snapshot) => {
    if (!snapshot.exists()) return;

    const data = snapshot.data();
let time = data.timestamp;

if (time && typeof time.toDate === "function") {
  time = time.toDate();
}

else if (typeof time === "string") {
  time = new Date(time);
}

if (!(time instanceof Date) || isNaN(time)) {
  console.warn("Invalid timestamp, skipping...");
  return; // 🔥 skip instead of faking time
}
    const sugarEl = document.getElementById("sugarValue");
    const insulinEl = document.getElementById("insulinValue");
    const batteryEl = document.getElementById("batteryValue");
    const insulinBar = document.getElementById("insulinBar");
    const batteryBar = document.getElementById("batteryBar");
    const alertBox = document.getElementById("alertBox");

    if (!data.cgm || !data.pump) return;

    const battery = data.pump.batteryPercent;

const disconnected =
  data.pump.connected === false;

    const glucose = data.cgm.glucoseValue;

const currentHour = time.getHours();

if (window.lastHour !== currentHour) {
  values.push({
    glucose: Math.round(glucose),
    time: new Date(time)
  });

  window.lastHour = currentHour;

  localStorage.setItem("glucoseHistory", JSON.stringify(values));
}

if (values.length > 24) {
  values.shift();
}

if (typeof draw === "function") {
  draw();
}  

    if (sugarEl) {
      const unit = isArabic ? "ملغم/دل" : "mg/dL";
      sugarEl.textContent = glucose + " " + unit;
    }

    if (insulinEl) {
      const unitInsulin = isArabic ? "وحدة" : "units";
      insulinEl.textContent = data.pump.reservoirUnits + " " + unitInsulin;

      if (insulinBar) {
        insulinBar.style.width =
          (data.pump.reservoirUnits / 300 * 100) + "%";
      }
    }

    if (batteryEl) {
      batteryEl.textContent = data.pump.batteryPercent + "%";

      if (batteryBar) {
        batteryBar.style.width =
          data.pump.batteryPercent + "%";
      }
    }

    let status = "normal";

    if (glucose < 70) status = "low";
    else if (glucose > 180) status = "high";

if (savedUser && savedUser.uid && savedUser.role === "Patient") {

   setDoc(
    doc(db, "Patient", savedUser.uid),
    {
      currentGlucose: glucose,
      status: status,
      lastUpdated: new Date().toISOString()
    },
    { merge: true }
  );

}

    if (alertBox) {

      if (status === "low") {
        alertBox.innerHTML = isArabic
          ? `⚠️ انخفاض في السكر (${glucose})`
          : `⚠️ Low glucose (${glucose})`;

        alertBox.style.display = "block";
      }

      else if (status === "high") {
        alertBox.innerHTML = isArabic
          ? `⚠️ ارتفاع في السكر (${glucose})`
          : `⚠️ High glucose (${glucose})`;

        alertBox.style.display = "block";
      }

      else {
        alertBox.style.display = "none";
      }
    }


    if (status !== "normal" && status !== lastStatus) {

      if (status === "low") {
        addNotification(
          "low",
          `Low glucose detected (${glucose})`,
          `تم اكتشاف انخفاض في السكر (${glucose})`,
          time.toISOString()
        );
      }

      if (status === "high") {
        addNotification(
          "high",
          `High glucose detected (${glucose})`,
          `تم اكتشاف ارتفاع في السكر (${glucose})`,
           time.toISOString()
        );
      }

      const now = Date.now();

const fifteenMinutes = 15 * 60 * 1000;

if (
  savedUser &&
  savedUser.email &&
  now - lastAlertEmailTime > fifteenMinutes
) {

  try {

    await fetch("/api/send-alert", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email: savedUser.email,
        glucose,
        status
      })
    });

    lastAlertEmailTime = now;

    console.log("Alert email sent");

  } catch (err) {

    console.error(
      "Failed to send alert email",
      err
    );
  }
}
      
    }

// DEVICE ALERT EMAILS

const now = Date.now();

const tenMinutes = 10 * 60 * 1000;

// LOW BATTERY ALERT

const lastBatteryAlert =
  localStorage.getItem("lastBatteryAlert") || 0;

if (
  battery <= 20 &&
  savedUser &&
  savedUser.email &&
  now - lastBatteryAlert > tenMinutes
) {

  try {

    await fetch("/api/send-device-alert", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email: savedUser.email,
        type: "battery",
        battery: battery
      })
    });

    localStorage.setItem(
      "lastBatteryAlert",
      now
    );

    console.log(
      "Low battery email sent"
    );

  } catch (err) {

    console.error(
      "Battery email failed",
      err
    );
  }
}

// DEVICE DISCONNECTED ALERT

const lastDisconnectAlert =
  localStorage.getItem("lastDisconnectAlert") || 0;

if (
  disconnected &&
  savedUser &&
  savedUser.email &&
  now - lastDisconnectAlert > tenMinutes
) {

  try {

    await fetch("/api/send-device-alert", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email: savedUser.email,
        type: "disconnect"
      })
    });

    localStorage.setItem(
      "lastDisconnectAlert",
      now
    );

    console.log(
      "Disconnect email sent"
    );

  } catch (err) {

    console.error(
      "Disconnect email failed",
      err
    );
  }
}

    if (status === "normal") {
      lastStatus = null;
    } else {
      lastStatus = status;
    }

  });

})();

  (function carbsNavigation() {
    const carbMain = $("carbMain");
    const carbInsert = $("carbInsert");
    const carbResult = $("carbResult");

    if (!carbMain && !carbInsert && !carbResult) return;

    const insertBtn = $("insertBtn");
    const calculateBtn = $("calculateBtn");
    const backBtn1 = $("backBtn1");
    const backBtn2 = $("backBtn2");

    if (insertBtn && carbMain && carbInsert) {
      insertBtn.addEventListener("click", () => {
        carbMain.classList.remove("active");
        carbInsert.classList.add("active");
      });
    }

    if (calculateBtn && carbMain && carbResult) {
      calculateBtn.addEventListener("click", () => {
        carbMain.classList.remove("active");
        carbResult.classList.add("active");
      });
    }

    if (backBtn1 && carbInsert && carbMain) {
      backBtn1.addEventListener("click", () => {
        carbInsert.classList.remove("active");
        carbMain.classList.add("active");
      });
    }

    if (backBtn2 && carbResult && carbMain) {
      backBtn2.addEventListener("click", () => {
        carbResult.classList.remove("active");
        carbMain.classList.add("active");
      });
    }
  })();


function parseLine(line) {
  let words = line.split(" ");
let food = words.slice(0, -1).join(" ") || words[0];  let amount = 100;

  words.forEach(word => {
    if (!isNaN(word)) amount = parseInt(word);
  });

  return { food, amount };
}

function suggestFood(input) {
  return Object.keys(carbDatabase)
    .filter(food => food.includes(input))
    .slice(0, 5);
}

if (document.getElementById("foodInput")) {

  const inputBox = document.getElementById("foodInput");
  const suggestionBox = document.getElementById("suggestions");
  const resultBox = document.getElementById("result");
  const calcBtn = document.getElementById("calcBtn");

  inputBox.addEventListener("input", function () {
    let text = inputBox.value.split("\n").pop().trim();

    if (!text) {
      suggestionBox.style.display = "none";
      return;
    }

    let suggestions = suggestFood(text);

    suggestionBox.innerHTML = "";
    suggestionBox.style.display = suggestions.length ? "block" : "none";

    suggestions.forEach(food => {
      let div = document.createElement("div");
      div.innerText = food;

      div.onclick = () => {
        let lines = inputBox.value.split("\n");
        lines[lines.length - 1] = food;
        inputBox.value = lines.join("\n");
        suggestionBox.style.display = "none";
      };

      suggestionBox.appendChild(div);
    });
  });

  calcBtn.addEventListener("click", async function () {
    const lines = inputBox.value.toLowerCase().split("\n");

    let total = 0;
    let unknown = [];

    lines.forEach(line => {
      if (!line.trim()) return;

      let { food, amount } = parseLine(line);

    if (carbDatabase.hasOwnProperty(food)) {
        total += (carbDatabase[food] * amount) / 100;
      } else {
        let suggestions = suggestFood(food);
        unknown.push(`${food} (${suggestions.join(", ")})`);
      }
    });


let resultText = isArabic
  ? `إجمالي الكربوهيدرات: ${total.toFixed(1)} جم`
  : `Total Carbs: ${total.toFixed(1)} g`;

    if (unknown.length) {
resultText += isArabic
  ? `\nغير معروف: ${unknown.join(", ")}`
  : `\nUnknown: ${unknown.join(", ")}`;    }

resultBox.innerText = resultText;

await setDoc(
  doc(db, "pump_live_data", "live"),
  {
    pump: {
      carbsOnBoard: total
    }
  },
  { merge: true }
);

const insulin = total / 10;

const insulinOutput3 = document.getElementById("insulinOutput3");
if (insulinOutput3) {
insulinOutput3.textContent = isArabic
  ? insulin.toFixed(1) + " وحدة"
  : insulin.toFixed(1) + " units";
}  });
}

const analyzeMealBtn =
  document.getElementById("analyzeMealBtn");

if (analyzeMealBtn) {

  analyzeMealBtn.addEventListener("click", async () => {

    const mealText =
      document.getElementById("mealText").value.trim();
      function translateArabicFood(text){

  const map = {
    "برجر":"burger",
    "برجر دجاج":"chicken burger",
    "رز":"rice",
    "خبز":"bread",
    "موز":"banana",
    "تفاح":"apple",
    "بيتزا":"pizza",
    "شاورما":"shawarma",
    "كولا":"cola",
    "عصير":"juice"
  };

  let result = text;

  for(const ar in map){
    result = result.replaceAll(ar, map[ar]);
  }

  return result;
}

const translatedMeal =
  translateArabicFood(mealText);

    const resultBox =
      document.getElementById("mealAnalysisResult");

    if (!mealText) return;

    resultBox.innerHTML = "Analyzing meal...";

    try {

      const response =  await fetch(
        `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(translatedMeal)}`,
        {
          method: "GET",

          headers: {
            "X-Api-Key": "SkWXTJ1aL4EI175pNkfGWQ==9dZk4jDFl2oMBqXG"
          }
        }
      );


      const data = await response.json();


      console.log(data);

      if (!data.items || data.items.length === 0) {

        resultBox.innerHTML =
          "Could not analyze this meal.";

        return;
      }

      let carbs = 0;
      let sugar = 0;
      let fat = 0;
      let protein = 0;
      let calories = 0;
      

      data.items.forEach(food => {

        carbs += food.carbohydrates_total_g || 0;

        sugar += food.sugar_g || 0;

        fat += food.fat_total_g || 0;

        protein += food.protein_g || 0;

        calories += food.calories || 0;

      });

      function calculateGISpeed() {

        if (sugar >= 25)
          return 2.0;

        if (fat >= 20)
          return 0.6;

        return 1.0;
      }

      const glycemicSpeed =
        calculateGISpeed();

      const estimatedInsulin = Math.round((carbs / 10) * 10) /10;

      resultBox.innerHTML = `

  <p><strong>${isArabic ? "الكربوهيدرات" : "Carbs"}:</strong>
  ${carbs.toFixed(1)} g</p>

  <p><strong>${isArabic ? "الأنسولين المتوقع" : "Estimated Insulin"}:</strong>
  ${estimatedInsulin.toFixed(1)}
  ${isArabic ? "وحدة" : "units"}</p>

  <p><strong>${isArabic ? "السكر" : "Sugar"}:</strong>
  ${sugar.toFixed(1)} g</p>

  <p><strong>${isArabic ? "البروتين" : "Protein"}:</strong>
  ${protein.toFixed(1)} g</p>

  <p><strong>${isArabic ? "الدهون" : "Fat"}:</strong>
  ${fat.toFixed(1)} g</p>

  <p><strong>${isArabic ? "السعرات الحرارية" : "Calories"}:</strong>
  ${calories.toFixed(0)}</p>

  <p><strong>${isArabic ? "سرعة الهضم" : "Digestion Speed"}:</strong>
  ${glycemicSpeed}x</p>
`;

      await setDoc(
        doc(db, "meal_events", "latest"),
        {

          mealText,
          carbs,
          sugar,
          fat,
          protein,
          calories,
        estimatedInsulin: estimatedInsulin,
          glycemicSpeed,

          createdAt:
            new Date().toISOString(),

          processed: false
        }
      );


      console.log(
        "Meal sent to simulator"
      );

    } catch (err) {

      console.error(err);

      resultBox.innerHTML =
        "Failed to analyze meal.";

    }

  });

}

  (function loadSettingsPage() {

  const fullNameEl = document.getElementById("setFullName");
  if (!fullNameEl) return; // not settings page

  if (!savedUser) return;

  const { firstName, lastName, age, uid } = savedUser;

  fullNameEl.textContent = `${firstName} ${lastName}`;
  document.getElementById("setAge").textContent = age || "-";

  async function fetchUserData() {

    let userDoc = await getDoc(doc(db, "Patient", uid));

    if (!userDoc.exists()) {
      userDoc = await getDoc(doc(db, "Doctor", uid));
    }

    if (!userDoc.exists()) {
      userDoc = await getDoc(doc(db, "Parent", uid));
    }

    if (!userDoc.exists()) return;

    const data = userDoc.data();

    document.getElementById("setDob").textContent = data.dob || "-";
    document.getElementById("setPhone").textContent = data.phone || "-";
    document.getElementById("setAddress").textContent = data.address || "-";
  }

  fetchUserData();

})();

  (function settingsInlineEdit() {
    const boxes = qsa(".settings-page .editable-box");
    if (!boxes.length) return;

    boxes.forEach((box) => {
      const valueEl = box.querySelector(".edit-value");
      const inputEl = box.querySelector(".edit-input");
      if (!valueEl || !inputEl) return;

      box.addEventListener("click", () => {
        if (box.classList.contains("editing")) return;
        box.classList.add("editing");
        inputEl.value = valueEl.textContent.trim() === "-" ? "" : valueEl.textContent.trim();
        inputEl.focus();
      });

      inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          inputEl.blur();
        }
      });


inputEl.addEventListener("blur", async () => {

  const newValue = inputEl.value.trim();
  valueEl.textContent = newValue ? newValue : "-";
  box.classList.remove("editing");

  const fieldId = inputEl.id;

  if (!newValue) return;

  if (!savedUser) return;

  const { uid, role } = savedUser;

  let collectionName = "Patient";
  if (role === "Doctor") collectionName = "Doctor";
  else if (role === "Parent") collectionName = "Parent";

  let field = {};

  if (valueEl.id === "setFullName") {
    const parts = newValue.split(" ");
    field = {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || ""
    };
  }

  else if (valueEl.id === "setDob") {
    const age = calculateAge(newValue);

    field = {
      dob: newValue,
      age: age
    };

    document.getElementById("setAge").textContent = age;
  }

  else if (valueEl.id === "setPhone") field = { phone: newValue };
  else if (valueEl.id === "setAddress") field = { address: newValue };

  try {

    console.log("Saved:", field);

  } catch (err) {
    console.error("Save failed:", err);
  }
pendingChanges[fieldId] = newValue;
});
    });
  })();

  (function changePassword() {

  const btn = document.getElementById("changePasswordBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {

    if (!savedUser || !savedUser.email) return;

    try {
      await sendPasswordResetEmail(auth, savedUser.email);

      alert(
        isArabic
          ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
          : "Password reset email sent"
      );

    } catch (err) {
      console.error(err);
      alert("Failed to send reset email");
    }

  });

})();

(function saveSettings() {

  const btn = document.getElementById("saveSettingsBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {

    if (!savedUser) return;

    const { uid, role } = savedUser;

    let collectionName = "Patient";
    if (role === "Doctor") collectionName = "Doctor";
    else if (role === "Parent") collectionName = "Parent";

    if (Object.keys(pendingChanges).length === 0) {
      alert("No changes to save");
      return;
    }

    try {
      await setDoc(doc(db, collectionName, uid), pendingChanges, { merge: true });

      alert(isArabic ? "تم حفظ التغييرات" : "Changes saved successfully");

      const updatedUser = {
        ...savedUser,
        ...pendingChanges
      };

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      Object.keys(pendingChanges).forEach(k => delete pendingChanges[k]);

    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    }

  });

})();
const saveBtn = document.getElementById("saveBtn");

if (saveBtn) {
  saveBtn.addEventListener("click", async () => {

    if (Object.keys(pendingChanges).length === 0) {
      alert("No changes to save");
      return;
    }

if (!savedUser) return;
    const updateData = {};

    if (pendingChanges.inpFullName) {
      const names = pendingChanges.inpFullName.split(" ");
      updateData.firstName = names[0] || "";
      updateData.lastName = names.slice(1).join(" ") || "";
    }

    if (pendingChanges.inpDob) {
      updateData.dob = pendingChanges.inpDob;
      updateData.age = calculateAge(pendingChanges.inpDob);
    }

    if (pendingChanges.inpPhone) {
      updateData.phone = pendingChanges.inpPhone;
    }

    if (pendingChanges.inpAddress) {
      updateData.address = pendingChanges.inpAddress;
    }

    let collectionName = "Patient";

if (savedUser.role === "Doctor") {
  collectionName = "Doctor";
} else if (savedUser.role === "Parent") {
  collectionName = "Parent";
}

    try {
      await updateDoc(
        doc(db, collectionName, savedUser.uid),
        updateData
      );

      alert("Changes saved successfully");

      pendingChanges = {}; // clear after save

    } catch (err) {
      console.error(err);
      alert("Error saving changes");
    }
  });
}

  (function sugarHistoryChart() {
    const sugarCanvas = $("sugarChart");
    if (!sugarCanvas) return;

    const ctx = sugarCanvas.getContext("2d");

    function resizeCanvas() {
      const parent = sugarCanvas.parentElement;
      if (!parent) return;
      sugarCanvas.width = parent.clientWidth;
      sugarCanvas.height = 360;
    }

    function pad2(n) { return String(n).padStart(2, "0"); }

    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
    function gaussianLikeNoise() { return (Math.random() - 0.5) + (Math.random() - 0.5); }
    function mealSpike(hour, center, width, height) {
      const x = (hour - center) / width;
      return height * Math.exp(-0.5 * x * x);
    }

    function generateHourlyGlucose() {
      const arr = [];
      let current = 105 + Math.random() * 15;

      const hasHighEvent = Math.random() < 0.6;
      const hasLowEvent = Math.random() < 0.45;

      const highHour = hasHighEvent ? (12 + Math.floor(Math.random() * 8)) : null;
      const lowHour = hasLowEvent ? (2 + Math.floor(Math.random() * 6)) : null;

      for (let h = 0; h < 24; h++) {
        current += gaussianLikeNoise() * 4;

        const lunchBoost = Math.random() < 0.35 ? 35 : 0;
        const spike =
          mealSpike(h, 8, 1.3, 35) +
          mealSpike(h, 13, 1.5, 60 + lunchBoost) +
          mealSpike(h, 19, 1.6, 45);

        const nightDrop = (h >= 22 || h <= 4) ? -8 : 0;

        const extraHigh = (hasHighEvent && highHour !== null)
          ? mealSpike(h, highHour, 0.9, 70)
          : 0;

        const extraLow = (hasLowEvent && lowHour !== null)
          ? -mealSpike(h, lowHour, 0.8, 55)
          : 0;

        const value = clamp(current + spike + nightDrop + extraHigh + extraLow, 55, 240);
        arr.push(Math.round(value));
      }
      return arr;
    }


    const yMin = 0, yMax = 250;
    const normalLow = 100, normalHigh = 150;

    function mapX(i, w, pad, n) {
      const innerW = w - pad * 2;
      return pad + (innerW * (i / (n - 1)));
    }
    function mapY(v, h, pad) {
      const innerH = h - pad * 2;
      return pad + innerH * (1 - (v - yMin) / (yMax - yMin));
    }

    let hoverIndex = null;

    function getMousePos(e) {
      const rect = sugarCanvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function nearestPointIndex(mouseX, w, pad, n) {
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < n; i++) {
        const px = mapX(i, w, pad, n);
        const d = Math.abs(mouseX - px);
        if (d < bestDist) { bestDist = d; best = i; }
      }
      return best;
    }

    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        const min = Math.min(w, h) / 2;
        r = Math.min(r, min);
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
      };
    }

    function drawTooltip(x, y, top, bottom) {
      ctx.save();
      ctx.font = "12px Arial";
      const pad = 8;
      const boxW = Math.max(ctx.measureText(top).width, ctx.measureText(bottom).width) + pad * 2;
      const boxH = 44;

      let bx = x + 12;
      let by = y - boxH - 12;
      if (bx + boxW > sugarCanvas.width - 10) bx = x - boxW - 12;
      if (by < 10) by = y + 12;

      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      ctx.beginPath();
      ctx.roundRect(bx, by, boxW, boxH, 8);
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.fillText(top, bx + pad, by + 18);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillText(bottom, bx + pad, by + 34);
      ctx.restore();
    }

    function updateLowNote() {
      const low = Math.min(...values.map(v => v.glucose));      const noteEl = $("historyNote");
      const lowEl = $("lowValue");
      if (!noteEl || !lowEl) return;

      if (low < 70) {
        lowEl.textContent = low;
        noteEl.innerHTML = `⚠ Low Glucose Detected: <span id="lowValue">${low}</span> mg/dL`;
        noteEl.style.color = "#b00020";
        noteEl.style.fontWeight = "600";
      } else {
        noteEl.textContent = "System operating normally.";
        noteEl.style.color = "#047857";
        noteEl.style.fontWeight = "600";
      }
    }

    function draw() {
      if (values.length < 2) return;
     const labels = values.map(point => {
  const d = new Date(point.time);
  return d.getHours().toString().padStart(2, "0") + ":00";
});
      resizeCanvas();

      const w = sugarCanvas.width;
      const h = sugarCanvas.height;
      const pad = 50;
      const n = labels.length;

      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      const y1 = mapY(normalHigh, h, pad);
      const y2 = mapY(normalLow, h, pad);
      ctx.fillStyle = "rgba(80, 180, 120, 0.15)";
      ctx.fillRect(pad, y1, w - pad * 2, y2 - y1);

      ctx.strokeStyle = "#e6e6e6";
      ctx.lineWidth = 1;
      ctx.fillStyle = "#555";
      ctx.font = "12px Arial";

      [0, 50, 100, 150, 200, 250].forEach(step => {
        const yy = mapY(step, h, pad);
        ctx.beginPath();
        ctx.moveTo(pad, yy);
        ctx.lineTo(w - pad, yy);
        ctx.stroke();
        ctx.fillText(String(step), 12, yy + 4);
      });

      ctx.strokeStyle = "#444";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(pad, pad);
      ctx.lineTo(pad, h - pad);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pad, h - pad);
      ctx.lineTo(w - pad, h - pad);
      ctx.stroke();

      ctx.fillStyle = "#555";
      ctx.font = "12px Arial";
     const step = Math.ceil(n / 8); // show ~6 labels max

labels.forEach((lab, i) => {
  if (i % step !== 0) return; // skip most labels

  const x = mapX(i, w, pad, n);
  ctx.fillText(lab, x - 18, h - pad + 22);
});


ctx.strokeStyle = "#3aa0e6";
ctx.lineWidth = 3;
ctx.beginPath();

values.forEach((point, i) => {
  const v = point.glucose;
  const x = mapX(i, w, pad, n);
  const y = mapY(v, h, pad);

  if (i === 0) ctx.moveTo(x, y);
  else ctx.lineTo(x, y);
});

ctx.stroke();


ctx.fillStyle = "#3aa0e6";

values.forEach((point, i) => {
  const v = point.glucose;
  const x = mapX(i, w, pad, n);
  const y = mapY(v, h, pad);

  ctx.beginPath();
  ctx.arc(x, y, 3.2, 0, Math.PI * 2);
  ctx.fill();
});

      ctx.fillStyle = "#3aa0e6";
      values.forEach((v, i) => {
        const x = mapX(i, w, pad, n);
        const y = mapY(v, h, pad);
        ctx.beginPath();
        ctx.arc(x, y, 3.2, 0, Math.PI * 2);
        ctx.fill();
      });

      
      if (hoverIndex !== null) {
        const hx = mapX(hoverIndex, w, pad, n);
        const val = values[hoverIndex].glucose ?? 0;
        const hy = mapY(val, h, pad);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(hx, hy, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#3aa0e6";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(hx, hy, 6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(hx, pad);
        ctx.lineTo(hx, h - pad);
        ctx.stroke();

        const status =
          values[hoverIndex].glucose < 70 ? "Status: LOW" :
          values[hoverIndex].glucose > 180 ? "Status: HIGH" :
          "Status: OK";

const unit = isArabic ? "ملغم/دل" : "mg/dL";

drawTooltip(
  hx,
  hy,
`${labels[hoverIndex]} • ${val} ${unit}`,
  status
);
      }
    }
if (values.length === 0) {
  for (let i = 0; i < 10; i++) {
values.push({
  glucose: Math.round(100 + Math.random() * 20),
  time: new Date()
});
  }
}
   sugarCanvas.addEventListener("mousemove", (e) => {
  const { x } = getMousePos(e);

  const w = sugarCanvas.width;
  const pad = 50;

  const n = values.length; // ✅ FIX: use values instead

  hoverIndex = nearestPointIndex(x, w, pad, n);

  draw();
});

    sugarCanvas.addEventListener("mouseleave", () => {
      hoverIndex = null;
      draw();
    });

    updateLowNote();
    draw();
    window.addEventListener("resize", draw);
  })();

  const pageMap = {
  "patient.html": "ar/patient-dashboard-ar.html",
  "profile.html": "ar/profile-ar.html",
  "contact-doctor.html": "ar/contact-doctor-ar.html",
"sugar-history.html":  "ar/sugar-history-ar.html",
  "settings.html": "ar/settings-ar.html",
"carbcalc.html" : "ar/carbcalc-ar.html"

};
const reverseMap = {
  "patient-dashboard-ar.html": "../patient.html",
  "profile-ar.html": "../profile.html",
  "sugar-history-ar.html": "../sugar-history.html",
  "settings-ar.html": "../settings.html",
  "contact-doctor-ar.html": "../contact-doctor.html",
"carbcalc-ar.html" : "../carbcalc.html",


};
document.querySelectorAll(".lang-option").forEach(option => {
  option.addEventListener("click", () => {

    const lang = option.dataset.lang;

    const path = window.location.pathname;
    const current = path.substring(path.lastIndexOf("/") + 1);

    const isArabicPage = current.includes("-ar");

    if ((lang === "ar" && isArabicPage) || (lang === "en" && !isArabicPage)) {
      return;
    }

    let target;

    if (lang === "ar") {
      target = pageMap[current];
    } else {
      target = reverseMap[current];
    }

    if (!target) return;

    window.location.href = target;
  });
});

window.openfindpump = function () {

  const currentLang =
    document.documentElement.lang || "en";

  localStorage.setItem("lang", currentLang);
  localStorage.setItem("pumpBackPage","patient");

  if (currentLang === "ar") {
    window.location.href = "../../find-my-pump.html";
  } else {
    window.location.href = "../find-my-pump.html";
  }
};

const calculateBtn2 = document.getElementById("calculateBtn2");
const carbInput = document.getElementById("carbInput");
const insulinOutput = document.getElementById("insulinOutput");

if (calculateBtn2 && carbInput && insulinOutput) {
  calculateBtn2.addEventListener("click", () => {

    const carbs = parseFloat(carbInput.value);

    if (!carbs || carbs <= 0) {
      insulinOutput.textContent = "--";
      return;
    }

    const insulin = carbs / 10;

insulinOutput.textContent = isArabic
  ? insulin.toFixed(1) + " وحدة"
  : insulin.toFixed(1) + " units";  });
}

const notificationBtn = document.getElementById("notificationBtn");
function formatTimeLabel(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString(isArabic ? "ar-SA" : "en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });

  if (isToday) {
    return isArabic ? `اليوم • ${time}` : `Today • ${time}`;
  }

  if (isYesterday) {
    return isArabic ? `أمس • ${time}` : `Yesterday • ${time}`;
  }

  return date.toLocaleDateString(isArabic ? "ar-SA" : "en-US");
}

if (notificationBtn) {
  notificationBtn.addEventListener("click", () => {

    const badge = document.getElementById("notificationBadge");
    localStorage.setItem("dm_notifications_seen", "true");
    updateNotificationBadge();
    window.location.href = isArabic
      ? "../../notifications-ar.html"
      : "../notifications.html";
  });
}


const isNotificationsPage = window.location.pathname.includes("notifications");

if (isNotificationsPage) {

  const clearBtn = document.getElementById("clearBtn");

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {

      const confirmMsg = isArabic
        ? "هل تريد حذف جميع الإشعارات؟"
        : "Clear all notifications?";

      if (!confirm(confirmMsg)) return;

      localStorage.removeItem("dm_notifications");
      localStorage.removeItem("dm_notifications_seen");

      renderNotifications();
      updateNotificationBadge();
    });
  }

  renderNotifications();
}

function renderNotifications() {
  const list = loadNotifications();
  const container = document.getElementById("notificationsList");

  if (!container) return;

  container.innerHTML = "";

  if (list.length === 0) {
  container.innerHTML = isArabic
    ? "<p class='empty-msg'>لا توجد إشعارات</p>"
    : "<p class='empty-msg'>No notifications yet</p>";
  return;
}

  list.forEach((notif) => {
    const div = document.createElement("div");
    div.className = `notification-card ${notif.type}`;

    let icon = "💬";
    if (notif.type === "high") icon = "⚠️";
    else if (notif.type === "low") icon = "🩸";
    else if (notif.type === "normal") icon = "💉";

    div.innerHTML = `
      <span class="icon">${icon}</span>
      <div>
<p>${
  isArabic
    ? (notif.textAr || notif.text)
    : (notif.textEn || notif.text)
}</p>
<small>${formatTimeLabel(notif.time)}</small>
      </div>
    `;

    container.appendChild(div);
  });
}

if (isNotificationsPage) {
  renderNotifications();
}
window.renderNotifications = renderNotifications;
updateNotificationBadge();
window.addNotification = addNotification;

(function mockAuth() {
  const $ = (id) => document.getElementById(id);


  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

function redirectByRole(role) {

  if (isArabic) {
    if (role === "Patient") window.location.href = "patient/ar/patient-dashboard-ar.html";
    else if (role === "Doctor") window.location.href = "doctor/patients.html";
    else if (role === "Parent") window.location.href = "patient/ar/patient-dashboard-ar.html";
    else window.location.href = "patient/ar/patient-dashboard-ar.html";
  } else {
    if (role === "Patient") window.location.href = "patient/patient.html";
    else if (role === "Doctor") window.location.href = "doctor/patients.html";
    else if (role === "Parent") window.location.href = "patient/patient.html";
    else window.location.href = "patient/patient.html";
  }
}

  const loginForm = $("loginForm");
  if (!loginForm) return;

  const loginEmail = $("loginEmail");
  const loginPassword = $("loginPassword");
  const loginError = $("loginError");

  function showLoginError(msg) {
    if (!loginError) return;
    loginError.textContent = msg;
    loginError.classList.add("active");
  }

  function clearLoginError() {
    if (!loginError) return;
    loginError.textContent = "";
    loginError.classList.remove("active");
  }

  loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  clearLoginError();

  const email = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value;

  if (!email || !password) {
    showLoginError(
      isArabic ? "أدخل البريد وكلمة المرور" : "Enter email and password"
    );
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );


const firebaseUser = userCredential.user;

let userDoc = null;
let role = null;

const doctorDoc = await getDoc(doc(db, "Doctor", firebaseUser.uid));

if (doctorDoc.exists()) {
  userDoc = doctorDoc;
  role = "Doctor";
} else {

  const patientDoc = await getDoc(doc(db, "Patient", firebaseUser.uid));

  if (patientDoc.exists()) {
    userDoc = patientDoc;
    role = "Patient";
  } else {

    const parentDoc = await getDoc(doc(db, "Parent", firebaseUser.uid));

    if (parentDoc.exists()) {
      userDoc = parentDoc;
      role = "Parent";
    }
  }
}

if (!userDoc) {
  showLoginError("User data not found");
  return;
}

const userData = userDoc.data();

localStorage.setItem("tempUser", JSON.stringify({
  uid: firebaseUser.uid,
  firstName: userData.firstName,
  lastName: userData.lastName,
  email: userData.email,
  role:role,
  age: userData.age
}));

sessionStorage.setItem(
  "otp_email",
  userData.email
);

const response = await fetch("/api/send-otp", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email: userData.email
  })
});

const data = await response.json();

console.log(data);

      localStorage.setItem(
  "login_otp",
  data.otp
);

localStorage.setItem(
  "login_otp_expiry",
  Date.now() + 2 * 60 * 1000
);

alert(
  isArabic
    ? "تم إرسال رمز التحقق إلى بريدك الإلكتروني"
    : "OTP has been sent to your email"
);

window.location.href = "otp.html";

  } catch (error) {
  console.error( error);
  showLoginError(error.message);
}
});
})();


console.log("chat:", document.getElementById("cmdChat"));
console.log("input:", document.getElementById("cmdMessage"));
console.log("button:", document.getElementById("cmdSendBtn"));
;(function contactMyDoctorSmart() {


  const chat = document.getElementById("cmdChat");
  const form = document.getElementById("cmdForm");
  const input = document.getElementById("cmdMessage");
  const sendBtn = document.getElementById("cmdSendBtn");
  const closeBtn = document.getElementById("cmdCloseBtn");
if(!chat)return;
if (!savedUser) return;

const patientId = savedUser.uid;
const doctorId = "QXhRZlxhpOfTpn3SvML66Vkl5F72";
const chatId = patientId + "_" + doctorId;
console.log({patientId, doctorId});
const doctorNameEl = document.getElementById("cmdDoctorName");

async function loadDoctorName() {

  try {

    const doctorSnap = await getDoc(
      doc(db, "Doctor", doctorId)
    );

    if (!doctorSnap.exists()) return;

    const doctorData = doctorSnap.data();

    const fullName =
      `${doctorData.firstName || ""} ${doctorData.lastName || ""}`.trim();

    if (doctorNameEl) {

      doctorNameEl.textContent = isArabic
        ? `د. ${fullName}`
        : `Dr. ${fullName}`;

    }

  } catch (err) {
    console.error(err);
  }
}

loadDoctorName();

const q = query(
  collection(db, "Messages"),
  orderBy("time", "asc")
);

onSnapshot(q, (snapshot) => {

  chat.innerHTML = "";

  snapshot.forEach((docSnap) => {

    const msg = docSnap.data();

    if (
      msg.patientId !== patientId ||
      msg.doctorId !== doctorId
    ) {
      return;
    }

    const side =
  msg.sender === "patient"
    ? "right"
    : "left";

if (msg.sender === "ai") {
  addBubble("🤖 AI Assistant: " + msg.text, side);
} else {
  addBubble(msg.text, side);
}
return;
  });
});


  if (!chat || !input || !form) return;

  if (closeBtn) {
    closeBtn.addEventListener("click", () => window.history.back());
  }

function isArabicText(text) {
  // Arabic letters
  if (/[\u0600-\u06FF]/.test(text)) return true;

  // Arabic numbers (١٢٣)
  if (/[\u0660-\u0669]/.test(text)) return true;

  // Only digits → use page language
  if (/^\d+$/.test(text.trim())) {
    return document.documentElement.lang === "ar";
  }

  return false;
}
  ;function extractGlucoseMgdl(text) {
    const matches = text.match(/\b(\d{2,3})\b/g);
    if (!matches) return null;

    const candidates = matches.map(Number).filter(n => n >= 40 && n <= 350);
    return candidates.length ? candidates[candidates.length - 1] : null;
  }

  ;function hasAny(text, words) {
    const t = text.toLowerCase();
    return words.some(w => t.includes(w));
  }

  ;function addBubble(text, side) {
    const bubble = document.createElement("div");
    bubble.className = `cmd-bubble ${side === "left" ? "cmd-left" : "cmd-right"}`;
    bubble.textContent = text;
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
  }

  ;function addTyping(text) {
    const typing = document.createElement("div");
    typing.className = "cmd-typing";

    typing.textContent = isArabicText(text)
      ? "الطبيب يكتب..."
      : "Doctor is typing...";

    chat.appendChild(typing);
    chat.scrollTop = chat.scrollHeight;
    return typing;
  }


  ;function buildDoctorReply(patientText) {
    const t = patientText.trim();
    const isAr = isArabicText(t);

    const glucose = extractGlucoseMgdl(t);

    const lowSymptoms = hasAny(t, [
      "dizzy","shaky","sweat","weak","confused","faint","blur",
      "دوخة","تعب","تعرق","ضعف","تشوش","اغماء"
    ]);

    const highSymptoms = hasAny(t, [
      "thirst","thirsty","urinate","dry mouth","nausea","vomit","headache",
      "عطش","تبول","جفاف","غثيان","استفراغ","صداع"
    ]);

    const deviceWords = hasAny(t, [
      "battery","disconnected","connection","pump","device","alarm","alert",
      "بطارية","منفصل","اتصال","مضخة","جهاز","تنبيه"
    ]);

    const foodWords = hasAny(t, [
      "ate","eat","meal","carb","carbs","bread","rice","snack",
      "اكلت","طعام","وجبة","كربوهيدرات","خبز","رز"
    ]);

    /* ===== GLUCOSE ===== */
    if (glucose !== null) {

      if (glucose < 70) {
        return isAr
          ? `قراءة ${glucose} منخفضة. تناول سكريات سريعة الآن وأعد القياس بعد 15 دقيقة. إذا كانت الأعراض شديدة، اطلب مساعدة طبية فورًا.`
          : `Thanks. ${glucose} mg/dL is LOW. Take fast-acting carbs now and recheck in 15 minutes. If symptoms are severe, seek urgent help.`;
      }

      if (glucose <= 140) {
        return isAr
          ? `جيد — ${glucose} ضمن المعدل الطبيعي. ${foodWords ? "إذا أكلت مؤخرًا، أعد القياس بعد ساعة أو ساعتين." : "استمر في المتابعة."}`
          : `Good — ${glucose} mg/dL is in a normal range. ${foodWords ? "If you ate recently, check again in 1–2 hours." : "Keep monitoring."}`;
      }

      if (glucose <= 180) {
        return isAr
          ? `${glucose} مرتفع قليلًا. هل تناولت طعامًا مؤخرًا؟ راقب القراءة مرة أخرى قريبًا.`
          : `${glucose} mg/dL is slightly high. Did you eat in the last 2 hours? Monitor again soon.`;
      }

      if (glucose <= 250) {
        return isAr
          ? `${glucose} مرتفع. تحقق من المضخة والأنسولين واشرب ماء وأعد القياس خلال 30–60 دقيقة.`
          : `${glucose} mg/dL is HIGH. Check pump connection and insulin delivery, drink water, and recheck in 30–60 minutes.`;
      }

      return isAr
        ? `${glucose} مرتفع جدًا. تحقق من المضخة وموقع الحقن، وإذا شعرت بتعب شديد أو استفراغ اطلب مساعدة طبية فورًا.`
        : `${glucose} mg/dL is VERY HIGH. Check pump/infusion site and seek urgent care if needed.`;
    }

    /* ===== SYMPTOMS ===== */

    if (lowSymptoms) {
      return isAr
        ? `هذه الأعراض قد تدل على انخفاض السكر. يرجى إرسال قراءة السكر الحالية.`
        : `Those symptoms can match low glucose. Please send your current reading (mg/dL).`;
    }

    if (highSymptoms) {
      return isAr
        ? `قد تكون هذه أعراض ارتفاع السكر. أرسل القراءة الحالية وهل تناولت طعامًا.`
        : `Those symptoms can happen with high glucose. Please send your reading and if you ate recently.`;
    }

    if (deviceWords) {
      return isAr
        ? `تحقق من الاتصال أو البطارية وأخبرني إذا ظهر أي تنبيه.`
        : `Please check connection/battery and tell me what alerts you see.`;
    }

    if (foodWords) {
      return isAr
        ? `ما كمية الكربوهيدرات التي تناولتها؟ وما قراءة السكر الحالية؟`
        : `What was your total carbs, and what is your glucose reading?`;
    }

    /* ===== DEFAULT ===== */
    return isAr
      ? `يرجى إرسال قراءة السكر الحالية وأي أعراض لديك.`
      : `Please share your current glucose reading (mg/dL) and any symptoms.`;
  };


  async function sendMessage() {
  console.log("sending message...");
  const text = input.value.trim();
  if (!text) return;

  input.value = "";

  await addDoc(
    collection(db, "Messages"),
    {
  doctorId: doctorId,
  patientId: patientId,
  text: text,
  sender: "patient",
  time: new Date().toISOString()
   }
  );

  // 🔥 optional AI doctor reply
  setTimeout(async () => {
    const reply = buildDoctorReply(text);

    await addDoc(
      collection(db, "Messages"),
      {
  doctorId: doctorId,
  patientId: patientId,
  text: reply,
  sender: "ai",
  time: new Date().toISOString()

      }
    );
  }, 800);
  console.log("message sent");
}


  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      sendMessage();
    });
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

})()
;

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("tempUser");    

    await signOut(auth);

    window.location.href = isArabic
      ? "../../index-ar.html"
      : "../index.html";
  });
}

})
