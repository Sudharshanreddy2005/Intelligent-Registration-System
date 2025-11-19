/* main.js - updated: location data, password eye (SVG), phone country code, validation, selenium support */

/* ---------------------------
   LOCATION DATA (embedded)
   You can extend this list if needed.
   --------------------------- */
const LOCATION_DATA = [
  {
    country: "India",
    code: "91",
    states: [
      { name: "Andhra Pradesh", cities: ["Visakhapatnam", "Vijayawada", "Tirupati"] },
      { name: "Telangana", cities: ["Hyderabad", "Warangal", "Nizamabad"] },
      { name: "Tamil Nadu", cities: ["Chennai", "Coimbatore", "Madurai"] },
      { name: "Karnataka", cities: ["Bengaluru", "Mysuru", "Mangalore"] },
      { name: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur"] },
      { name: "Gujarat", cities: ["Ahmedabad", "Surat", "Vadodara"] },
      { name: "Punjab", cities: ["Chandigarh", "Ludhiana", "Amritsar"] }
    ]
  },
  {
    country: "United States",
    code: "1",
    states: [
      { name: "California", cities: ["Los Angeles", "San Francisco", "San Diego"] },
      { name: "New York", cities: ["New York City", "Buffalo", "Rochester"] },
      { name: "Texas", cities: ["Houston", "Dallas", "Austin"] },
      { name: "Florida", cities: ["Miami", "Orlando", "Tampa"] }
    ]
  },
  {
    country: "United Kingdom",
    code: "44",
    states: [
      { name: "England", cities: ["London", "Manchester", "Liverpool"] },
      { name: "Scotland", cities: ["Edinburgh", "Glasgow", "Aberdeen"] },
      { name: "Wales", cities: ["Cardiff", "Swansea", "Newport"] }
    ]
  },
  {
    country: "Canada",
    code: "1",
    states: [
      { name: "Ontario", cities: ["Toronto", "Ottawa", "Hamilton"] },
      { name: "British Columbia", cities: ["Vancouver", "Victoria", "Surrey"] },
      { name: "Quebec", cities: ["Montreal", "Quebec City", "Laval"] }
    ]
  },
  {
    country: "Australia",
    code: "61",
    states: [
      { name: "New South Wales", cities: ["Sydney", "Newcastle", "Wollongong"] },
      { name: "Victoria", cities: ["Melbourne", "Geelong", "Ballarat"] },
      { name: "Queensland", cities: ["Brisbane", "Gold Coast", "Cairns"] }
    ]
  }
];

/* ---------------------------
   Simple DOM helpers
   --------------------------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* Elements */
const form = $('#regForm');
const submitBtn = $('#submitBtn');
const resetBtn = $('#resetBtn');
const alertBox = $('#formAlert');

const firstName = $('#firstName');
const lastName = $('#lastName');
const email = $('#email');
const phone = $('#phone');
const countrySel = $('#country');
const stateSel = $('#state');
const citySel = $('#city');
const password = $('#password');
const confirmPassword = $('#confirmPassword');
const terms = $('#terms');
const pwdMeter = $('#pwdMeter');
const pwdText = $('#pwdText');

const genderRadios = $$('input[name="gender"]');

const errors = {
  firstName: $('#err-firstName'),
  lastName: $('#err-lastName'),
  email: $('#err-email'),
  phone: $('#err-phone'),
  gender: $('#err-gender'),
  password: $('#err-password'),
  confirmPassword: $('#err-confirmPassword'),
  terms: $('#err-terms')
};

/* ---------------------------
   Password eye toggle (SVG swap)
   --------------------------- */
function togglePassword(fieldId, btn) {
  const input = document.getElementById(fieldId);
  const svg = btn.querySelector('svg');
  if (!svg) return;

  if (input.type === 'password') {
    input.type = 'text';
    // set closed-eye icon (simple path)
    svg.innerHTML = '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 4a4 4 0 100-8 4 4 0 000 8z"/>';
  } else {
    input.type = 'password';
    // set open-eye icon (original)
    svg.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"/>';
  }
}

/* ---------------------------
   Dropdown population
   --------------------------- */
function populateCountries() {
  countrySel.innerHTML = '<option value="">Select country</option>';
  LOCATION_DATA.forEach((c, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = c.country;
    countrySel.appendChild(opt);
  });
  populateStates();
}

function populateStates() {
  stateSel.innerHTML = '<option value="">Select state</option>';
  citySel.innerHTML = '<option value="">Select city</option>';
  if (countrySel.value === '') return;
  const states = LOCATION_DATA[countrySel.value].states;
  states.forEach((s, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = s.name;
    stateSel.appendChild(opt);
  });
}

function populateCities() {
  citySel.innerHTML = '<option value="">Select city</option>';
  if (countrySel.value === '' || stateSel.value === '') return;
  const cities = LOCATION_DATA[countrySel.value].states[stateSel.value].cities;
  cities.forEach(ct => {
    const opt = document.createElement('option');
    opt.value = ct;
    opt.textContent = ct;
    citySel.appendChild(opt);
  });
}

/* ---------------------------
   Validation helpers
   --------------------------- */
function showError(node, msg) {
  node.textContent = msg || '';
}

function validateEmail() {
  const val = email.value.trim();
  if (!val) { showError(errors.email, 'Email is required'); return false; }
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(val)) { showError(errors.email, 'Enter a valid email'); return false; }
  const domain = val.split('@')[1].toLowerCase();
  const DISPOSABLE_DOMAINS = ["tempmail.com","10minutemail.com","mailinator.com","disposablemail.com","temp-mail.org"];
  if (DISPOSABLE_DOMAINS.includes(domain)) { showError(errors.email, 'Disposable email not allowed'); return false; }
  showError(errors.email, '');
  return true;
}

function validatePhone() {
  const val = phone.value.trim();
  if (!val) { showError(errors.phone, 'Phone number is required'); return false; }
  const digits = val.replace(/\D/g, '');
  if (digits.length < 8) { showError(errors.phone, 'Enter a valid phone number'); return false; }
  showError(errors.phone, '');
  return true;
}

function validateNames() {
  if (!firstName.value.trim()) { showError(errors.firstName, 'First name required'); return false; }
  showError(errors.firstName, '');
  if (!lastName.value.trim()) { showError(errors.lastName, 'Last name required'); return false; }
  showError(errors.lastName, '');
  return true;
}

function validateGender() {
  if (!genderRadios.some(r => r.checked)) { showError(errors.gender, 'Please select gender'); return false; }
  showError(errors.gender, '');
  return true;
}

function checkPasswordStrength() {
  const val = password.value;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  pwdMeter.value = score;
  const strength = ['Very weak','Weak','Medium','Strong','Very strong'];
  pwdText.textContent = val ? `Strength: ${strength[score]}` : 'Password strength';
  return score >= 2;
}

function validatePasswords() {
  if (!password.value) { showError(errors.password, 'Password required'); return false; }
  if (!checkPasswordStrength()) { showError(errors.password, 'Use a stronger password'); return false; }
  if (password.value !== confirmPassword.value) { showError(errors.confirmPassword, 'Passwords do not match'); return false; }
  showError(errors.password, '');
  showError(errors.confirmPassword, '');
  return true;
}

function validateTerms() {
  if (!terms.checked) { showError(errors.terms, 'You must accept terms'); return false; }
  showError(errors.terms, '');
  return true;
}

function isFormValid() {
  return validateNames() && validateEmail() && validatePhone() && validateGender() && validatePasswords() && validateTerms();
}

/* ---------------------------
   Submit toggle & reset
   --------------------------- */
function toggleSubmit() {
  const ready = firstName.value.trim() && lastName.value.trim() && email.value.trim() && phone.value.trim()
    && genderRadios.some(r=>r.checked) && password.value && confirmPassword.value && terms.checked;
  submitBtn.disabled = !ready;
}

function resetFormUI() {
  Object.keys(errors).forEach(k => errors[k].textContent = '');
  pwdMeter.value = 0;
  pwdText.textContent = 'Password strength';
  alertBox.className = 'alert';
  alertBox.textContent = '';
  populateCountries();
  toggleSubmit();
}

function showFormAlert(message, type) {
  alertBox.textContent = message;
  alertBox.className = `alert show ${type === 'success' ? 'success' : 'error'}`;
}

/* ---------------------------
   Initialize DOM listeners
   --------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  populateCountries();

  countrySel.addEventListener('change', () => {
    populateStates();
    populateCities();
    // update left country code display
    if (countrySel.value !== '') {
      const code = LOCATION_DATA[countrySel.value].code || '';
      const codeSpan = document.getElementById('countryCode');
      codeSpan.textContent = code ? `+${code}` : '+91';
    } else {
      document.getElementById('countryCode').textContent = '+91';
    }
    validatePhone();
    toggleSubmit();
  });

  stateSel.addEventListener('change', () => { populateCities(); toggleSubmit(); });
  citySel.addEventListener('change', toggleSubmit);

  firstName.addEventListener('input', () => { validateNames(); toggleSubmit(); });
  lastName.addEventListener('input', () => { validateNames(); toggleSubmit(); });
  email.addEventListener('input', () => { validateEmail(); toggleSubmit(); });
  phone.addEventListener('input', () => { validatePhone(); toggleSubmit(); });
  genderRadios.forEach(r => r.addEventListener('change', () => { validateGender(); toggleSubmit(); }));

  password.addEventListener('input', () => { checkPasswordStrength(); validatePasswords(); toggleSubmit(); });
  confirmPassword.addEventListener('input', () => { validatePasswords(); toggleSubmit(); });

  terms.addEventListener('change', () => { validateTerms(); toggleSubmit(); });

  resetBtn.addEventListener('click', () => { form.reset(); resetFormUI(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      showFormAlert('Please fix the errors before submitting.', 'error');
      return;
    }

    const payload = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      country: countrySel.options[countrySel.selectedIndex]?.text || '',
      state: stateSel.options[stateSel.selectedIndex]?.text || '',
      city: citySel.options[citySel.selectedIndex]?.text || ''
    };

    showFormAlert('Registration successful! Your profile has been submitted successfully.', 'success');
    console.log('Simulated payload:', payload);

    setTimeout(() => { form.reset(); resetFormUI(); }, 1500);
  });

  toggleSubmit();
});

/* Selenium-friendly trigger */
window.triggerSubmitFromSelenium = function() {
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
};
