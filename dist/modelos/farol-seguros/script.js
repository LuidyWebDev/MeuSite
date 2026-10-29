// ----------------- Destaque da Seção -----------------

const navLinks = document.querySelectorAll("#navbar menu a");
const navSections = Array.from(navLinks)
  .filter((link) => link.hash)
  .map((link) => document.querySelector(link.hash))
  .filter(Boolean);

function setActiveNavLink(hash) {
  const currentPageLink = Array.from(navLinks).find(
    (link) => !link.hash && link.pathname === window.location.pathname
  );

  navLinks.forEach((link) => {
    const isActive = currentPageLink
      ? link === currentPageLink
      : link.hash === hash;
    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function updateActiveNavLink() {
  const currentHash = window.location.hash || "#inicio";
  setActiveNavLink(currentHash);
}

updateActiveNavLink();
window.addEventListener("hashchange", updateActiveNavLink);

if (navSections.length) {
  function updateActiveSectionOnScroll() {
    const activationLine = document.querySelector("#navbar").getBoundingClientRect().bottom + 24;
    const currentSection = [...navSections].reverse().find((section) =>
      section.getBoundingClientRect().top <= activationLine
    );

    setActiveNavLink(currentSection ? `#${currentSection.id}` : "#inicio");
  }

  window.addEventListener("scroll", updateActiveSectionOnScroll, { passive: true });
  window.addEventListener("resize", updateActiveSectionOnScroll);
  updateActiveSectionOnScroll();
}


// ----------------- Menu Mobile -----------------

const menuToggle = document.querySelector("#menu-toggle");
const navMenu = document.querySelector("#nav-menu");

function setMenuOpen(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  navMenu.classList.toggle("is-open", isOpen);
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("click", (event) => {
  if (!event.target.closest("#navbar")) setMenuOpen(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 700) setMenuOpen(false);
});


// ----------------- Voltar ao topo -----------------

const backToTopButton = document.createElement("button");
backToTopButton.id = "voltar-topo";
backToTopButton.type = "button";
backToTopButton.setAttribute("aria-label", "Voltar ao topo");
backToTopButton.setAttribute("aria-hidden", "true");
backToTopButton.tabIndex = -1;
backToTopButton.textContent = "↑";
document.body.append(backToTopButton);

function updateBackToTopButton() {
  const isVisible = window.scrollY > 400;
  backToTopButton.classList.toggle("is-visible", isVisible);
  backToTopButton.setAttribute("aria-hidden", String(!isVisible));
  backToTopButton.tabIndex = isVisible ? 0 : -1;
}

window.addEventListener("scroll", updateBackToTopButton, { passive: true });
updateBackToTopButton();

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


// ----------------- Carrossel -----------------

const carouselCards = Array.from(
  document.querySelectorAll("#banner-content .cards")
);

if (carouselCards.length > 0) {
const carouselPositions = ["active", "next", "far-next", "hidden", "hidden", "hidden", "far-prev", "prev"];
const pageCardIndex = {
  "seguroviagem.html": 0,
  "seguroresidencial.html": 1,
  "seguroauto.html": 2,
  "seguroempresa.html": 3,
  "segurovida.html": 4,
  "segurocartaverde.html": 5,
  "segurosaude.html": 5,
  "segurocondominio.html": 6,
};
const pageName = window.location.pathname.split("/").pop().toLowerCase() || "index.html";
let activeCardIndex = pageCardIndex[pageName] ?? carouselCards.findIndex((card) =>
  card.classList.contains("active")
);

function showCarouselCard(index) {
  activeCardIndex = (index + carouselCards.length) % carouselCards.length;

  carouselCards.forEach((card, cardIndex) => {
    const offset = (cardIndex - activeCardIndex + carouselCards.length) % carouselCards.length;
    card.classList.remove(...carouselPositions);
    card.classList.add(carouselPositions[offset]);
  });
}

showCarouselCard(activeCardIndex);

document.querySelector("#carousel-btn-left").addEventListener("click", () => {
  showCarouselCard(activeCardIndex - 1);
});

document.querySelector("#carousel-btn-right").addEventListener("click", () => {
  showCarouselCard(activeCardIndex + 1);
});

const carousel = document.querySelector("#banner-content");
let dragStartX = 0;
let isDraggingCarousel = false;
let suppressCardClick = false;
let dragSteps = 0;
let lastDragStepAt = 0;
const dragStepDistance = 140;
const dragStepCooldown = 900;
let currentDragStepDistance = dragStepDistance;

carousel.addEventListener("pointerdown", (event) => {
  if (!event.isPrimary || event.pointerType === "touch" || event.target.closest(".carousel-btn")) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;

  dragStartX = event.clientX;
  isDraggingCarousel = true;
  dragSteps = 0;
  lastDragStepAt = 0;
  currentDragStepDistance = dragStepDistance;
  suppressCardClick = false;
  carousel.classList.add("is-dragging");
  const captureTarget = event.target.closest("a") || carousel;
  captureTarget.setPointerCapture(event.pointerId);
});

carousel.addEventListener("pointermove", (event) => {
  if (!isDraggingCarousel) return;

  const dragDistance = event.clientX - dragStartX;
  const nextDragSteps = Math.trunc(dragDistance / currentDragStepDistance);
  const stepChange = Math.sign(nextDragSteps - dragSteps);

  if (stepChange !== 0 && Date.now() - lastDragStepAt >= dragStepCooldown) {
    showCarouselCard(activeCardIndex - stepChange);
    dragSteps += stepChange;
    lastDragStepAt = Date.now();
  }
});

carousel.addEventListener("pointerup", (event) => {
  if (!isDraggingCarousel) return;

  const dragDistance = event.clientX - dragStartX;
  isDraggingCarousel = false;
  if (Math.abs(dragDistance) >= 20) {
    suppressCardClick = true;
  }

  if (Math.abs(dragDistance) >= currentDragStepDistance && dragSteps === 0) {
    showCarouselCard(activeCardIndex + (dragDistance < 0 ? 1 : -1));
  }

  carousel.classList.remove("is-dragging");
});

carousel.addEventListener("pointercancel", () => {
  isDraggingCarousel = false;
  carousel.classList.remove("is-dragging");
});

let touchStartX = 0;
let touchStartY = 0;
let touchDragSteps = 0;
let isTouchDraggingCarousel = false;

carousel.addEventListener("touchstart", (event) => {
  if (event.touches.length !== 1 || event.target.closest(".carousel-btn")) return;

  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
  touchDragSteps = 0;
  lastDragStepAt = 0;
  isTouchDraggingCarousel = true;
  carousel.classList.add("is-dragging");
}, { passive: true });

carousel.addEventListener("touchmove", (event) => {
  if (!isTouchDraggingCarousel || event.touches.length !== 1) return;

  const touch = event.touches[0];
  const dragDistance = touch.clientX - touchStartX;
  const verticalDistance = touch.clientY - touchStartY;
  if (Math.abs(dragDistance) <= Math.abs(verticalDistance)) return;

  event.preventDefault();
  const nextDragSteps = Math.trunc(dragDistance / 80);
  const stepChange = Math.sign(nextDragSteps - touchDragSteps);

  if (stepChange !== 0 && Date.now() - lastDragStepAt >= dragStepCooldown) {
    showCarouselCard(activeCardIndex - stepChange);
    touchDragSteps += stepChange;
    lastDragStepAt = Date.now();
  }
}, { passive: false });

function finishTouchCarouselDrag(event) {
  if (!isTouchDraggingCarousel) return;

  const dragDistance = event.changedTouches[0].clientX - touchStartX;
  isTouchDraggingCarousel = false;
  carousel.classList.remove("is-dragging");

  if (Number.isFinite(dragDistance) && Math.abs(dragDistance) >= 20) {
    suppressCardClick = true;
  }

  if (Number.isFinite(dragDistance) && Math.abs(dragDistance) >= 80 && touchDragSteps === 0) {
    showCarouselCard(activeCardIndex + (dragDistance < 0 ? 1 : -1));
  }
}

carousel.addEventListener("touchend", finishTouchCarouselDrag);
carousel.addEventListener("touchcancel", () => {
  isTouchDraggingCarousel = false;
  carousel.classList.remove("is-dragging");
});

carousel.addEventListener("click", (event) => {
  if (!suppressCardClick) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  suppressCardClick = false;
}, true);

carousel.addEventListener("dragstart", (event) => event.preventDefault());
}

