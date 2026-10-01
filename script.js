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


// ==============================
// FEATURED PROJECTS CAROUSEL
// ==============================

const projectTrack = document.getElementById("project-track");
const nextProjectsButton = document.getElementById("next-projects");
const projectPosition = document.getElementById("project-position");

if (projectTrack && nextProjectsButton && projectPosition) {
  const projectSlides = [...projectTrack.querySelectorAll(".project-slide")];

  const updateProjectPosition = () => {
    const slide = projectSlides[0];
    const slideGap = Number.parseFloat(getComputedStyle(projectTrack).columnGap) || 0;
    const slideStep = slide.offsetWidth + slideGap;
    const firstVisible = Math.round(projectTrack.scrollLeft / slideStep);
    const visibleCount = Math.max(1, Math.round(projectTrack.clientWidth / slideStep));
    const lastVisible = Math.min(projectSlides.length, firstVisible + visibleCount);
    const atEnd = projectTrack.scrollLeft + projectTrack.clientWidth >= projectTrack.scrollWidth - 2;

    projectPosition.textContent = visibleCount === 1
      ? `Project ${firstVisible + 1} of ${projectSlides.length}`
      : `Projects ${firstVisible + 1} and ${lastVisible} of ${projectSlides.length}`;
    nextProjectsButton.querySelector("span").textContent = atEnd ? "Back to first projects" : "Next projects";
    nextProjectsButton.setAttribute("aria-label", atEnd ? "Scroll back to the first projects" : "Scroll right to the next projects");
    nextProjectsButton.querySelector(".project-next-arrow").textContent = atEnd ? "←" : "→";
  };

  nextProjectsButton.addEventListener("click", () => {
    const atEnd = projectTrack.scrollLeft + projectTrack.clientWidth >= projectTrack.scrollWidth - 2;
    projectTrack.scrollTo({
      left: atEnd ? 0 : projectTrack.scrollLeft + projectTrack.clientWidth,
      behavior: "smooth"
    });
  });

  projectTrack.addEventListener("scroll", updateProjectPosition, { passive: true });
  window.addEventListener("resize", updateProjectPosition);
  updateProjectPosition();
}