// ==============================
// MOBILE NAVIGATION
// ==============================

const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-link");

menuBtn.addEventListener("click", () => {
  const isHidden = mobileMenu.classList.toggle("hidden");

  menuBtn.setAttribute("aria-expanded", !isHidden);
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});


// ==============================
// CONTACT FORM
// ==============================

const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("Please complete all fields before sending your message.");
    return;
  }

  alert(`Thanks, ${name}! Your message has been received.`);

  contactForm.reset();
});


// ==============================
// DYNAMIC COPYRIGHT YEAR
// ==============================

const currentYear = new Date().getFullYear();
const copyright = document.getElementById("copyright-year");

if (copyright) {
  copyright.textContent = currentYear;
}