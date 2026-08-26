/* =========================================================
   ENABLE SCROLL-REVEAL (progressive enhancement)
========================================================= */

document.documentElement.classList.add("js-loaded");


/* =========================================================
   YEAR
========================================================= */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton =
  document.getElementById("mobile-menu-button");

const mobileMenu =
  document.getElementById("mobile-menu");

if (menuButton && mobileMenu) {

  menuButton.addEventListener("click", () => {

    mobileMenu.classList.toggle("active");

    document.body.classList.toggle("menu-open");

    const isActive =
      mobileMenu.classList.contains("active");

    menuButton.setAttribute(
      "aria-expanded",
      isActive ? "true" : "false"
    );

    const icon =
      menuButton.querySelector("i");

    if (isActive) {

      icon.classList.remove("fa-bars");
      icon.classList.add("fa-xmark");

    } else {

      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");

    }

  });


  mobileMenu
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener("click", () => {

        mobileMenu.classList.remove("active");

        document.body.classList.remove("menu-open");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

        const icon =
          menuButton.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

      });

    });

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
  document.querySelectorAll(".reveal");


const revealObserver =
  new IntersectionObserver(

    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add("active");

          revealObserver.unobserve(
            entry.target
          );

        }

      });

    },

    {
      threshold: 0.12
    }

  );


revealElements.forEach((element) => {

  revealObserver.observe(element);

});


/* =========================================================
   STAGGER ANIMATION
========================================================= */

document
  .querySelectorAll(
    `
    .skills-bento .reveal,
    .projects-grid .reveal,
    .currently-grid .reveal,
    .about-side .reveal
    `
  )
  .forEach((element, index) => {

    element.style.transitionDelay =
      `${(index % 5) * 80}ms`;

  });

/* =========================================================
   POINTER POSITION

   --mouse-x / --mouse-y:
     viewport coordinates for fixed cursor effects.

   --petro-x / --petro-y:
     full-document coordinates for the absolute petroglyph
     layer. Works after scrolling and supports mouse + touch.
========================================================= */

let pointerClientX = -500;
let pointerClientY = -500;
let pointerAnimationFrame = null;
let touchHideTimer = null;

function renderPointerPosition() {
  pointerAnimationFrame = null;

  const documentX =
    pointerClientX + window.scrollX;

  const documentY =
    pointerClientY + window.scrollY;

  document.documentElement.style.setProperty(
    "--mouse-x",
    `${pointerClientX}px`
  );

  document.documentElement.style.setProperty(
    "--mouse-y",
    `${pointerClientY}px`
  );

  document.documentElement.style.setProperty(
    "--petro-x",
    `${documentX}px`
  );

  document.documentElement.style.setProperty(
    "--petro-y",
    `${documentY}px`
  );
}

function schedulePointerRender() {
  if (pointerAnimationFrame !== null) {
    return;
  }

  pointerAnimationFrame =
    window.requestAnimationFrame(
      renderPointerPosition
    );
}

function updatePointerPosition(event) {
  pointerClientX = event.clientX;
  pointerClientY = event.clientY;

  if (touchHideTimer) {
    clearTimeout(touchHideTimer);
    touchHideTimer = null;
  }

  schedulePointerRender();
}

document.addEventListener(
  "pointermove",
  updatePointerPosition,
  { passive: true }
);

document.addEventListener(
  "pointerdown",
  updatePointerPosition,
  { passive: true }
);

window.addEventListener(
  "scroll",
  schedulePointerRender,
  { passive: true }
);

document.addEventListener(
  "pointerout",
  (event) => {
    if (
      event.pointerType === "mouse" &&
      !event.relatedTarget
    ) {
      pointerClientX = -500;
      pointerClientY = -500;
      schedulePointerRender();
    }
  }
);

function hideTouchReveal(event) {
  if (event.pointerType === "mouse") {
    return;
  }

  touchHideTimer = setTimeout(() => {
    pointerClientX = -500;
    pointerClientY = -500;
    schedulePointerRender();
  }, 600);
}

document.addEventListener(
  "pointerup",
  hideTouchReveal,
  { passive: true }
);

document.addEventListener(
  "pointercancel",
  hideTouchReveal,
  { passive: true }
);

schedulePointerRender();

/* =========================================================
   CURSOR GLOW
========================================================= */

const cursorGlow =
  document.getElementById("cursor-glow");


if (
  cursorGlow &&
  window.matchMedia(
    "(pointer: fine)"
  ).matches
) {

  document.addEventListener(
    "mousemove",
    (event) => {

      cursorGlow.style.left =
        `${event.clientX}px`;

      cursorGlow.style.top =
        `${event.clientY}px`;

    }
  );


  document.addEventListener(
    "mouseleave",
    () => {

      cursorGlow.style.opacity = "0";

    }
  );


  document.addEventListener(
    "mouseenter",
    () => {

      cursorGlow.style.opacity = "0.12";

    }
  );

}


/* =========================================================
   TERMINAL TYPING
========================================================= */

const terminalText =
  document.getElementById("terminal-text");


const terminalMessages = [

  "building scalable systems",

  "processing real-time events",

  "automating data workflows",

  "deploying backend services",

  "building AI agents"

];


let terminalMessageIndex = 0;
let terminalCharacterIndex = 0;
let terminalDeleting = false;


function terminalType() {

  if (!terminalText) {
    return;
  }


  const currentMessage =
    terminalMessages[
      terminalMessageIndex
    ];


  if (!terminalDeleting) {

    terminalCharacterIndex++;

    terminalText.textContent =
      currentMessage.substring(
        0,
        terminalCharacterIndex
      );


    if (
      terminalCharacterIndex ===
      currentMessage.length
    ) {

      terminalDeleting = true;

      setTimeout(
        terminalType,
        1700
      );

      return;

    }

  } else {

    terminalCharacterIndex--;

    terminalText.textContent =
      currentMessage.substring(
        0,
        terminalCharacterIndex
      );


    if (
      terminalCharacterIndex === 0
    ) {

      terminalDeleting = false;

      terminalMessageIndex =
        (
          terminalMessageIndex + 1
        ) %
        terminalMessages.length;

    }

  }


  setTimeout(
    terminalType,
    terminalDeleting
      ? 30
      : 55
  );

}


setTimeout(
  terminalType,
  900
);


/* =========================================================
   NAVBAR SCROLL
========================================================= */

const navbar =
  document.querySelector(".navbar");


window.addEventListener(
  "scroll",
  () => {

    if (!navbar) {
      return;
    }


    if (
      window.scrollY > 20
    ) {

      navbar.style.background =
        "rgba(7, 10, 20, 0.90)";

    } else {

      navbar.style.background =
        "rgba(7, 10, 20, 0.72)";

    }

  }
);


/* =========================================================
   DESKTOP CARD EFFECT (tilt + cursor glow)
========================================================= */

if (
  window.matchMedia(
    "(pointer: fine)"
  ).matches
) {

  const cards =
    document.querySelectorAll(
      ".project-card, .skill-card, .currently-card"
    );


  cards.forEach((card) => {

    card.addEventListener(
      "mousemove",
      (event) => {

        const rect =
          card.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left;

        const y =
          event.clientY -
          rect.top;

        const rotateY =
          ((x / rect.width) - 0.5) * 8;

        const rotateX =
          ((y / rect.height) - 0.5) * -8;

        card.style.transition =
          "transform 0.06s linear";

        card.style.transform =
          `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

        card.style.background =
          `
          radial-gradient(
            400px circle at ${x}px ${y}px,
            rgba(255,159,67,0.1),
            transparent 45%
          ),
          linear-gradient(
            135deg,
            rgba(255,255,255,0.055),
            rgba(255,255,255,0.018)
          )
          `;

      }
    );


    card.addEventListener(
      "mouseleave",
      () => {

        card.style.transition =
          "transform 0.4s ease";

        card.style.transform = "";

        card.style.background = "";

      }
    );

  });

}


/* =========================================================
   MAGNETIC BUTTONS
========================================================= */

if (
  window.matchMedia(
    "(pointer: fine)"
  ).matches
) {

  document
    .querySelectorAll(".button")
    .forEach((button) => {

      button.addEventListener(
        "mousemove",
        (event) => {

          const rect =
            button.getBoundingClientRect();

          const x =
            event.clientX -
            rect.left -
            rect.width / 2;

          const y =
            event.clientY -
            rect.top -
            rect.height / 2;

          button.style.transition =
            "transform 0.06s linear";

          button.style.transform =
            `translate(${x * 0.18}px, ${(y * 0.35) - 3}px)`;

        }
      );


      button.addEventListener(
        "mouseleave",
        () => {

          button.style.transition =
            "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";

          button.style.transform = "";

        }
      );

    });

}


/* =========================================================
   SCROLL PROGRESS
========================================================= */

const scrollProgress =
  document.getElementById("scroll-progress");


function updateScrollProgress() {

  if (!scrollProgress) {
    return;
  }

  const docHeight =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const percent =
    docHeight > 0
      ? (window.scrollY / docHeight) * 100
      : 0;

  scrollProgress.style.width = `${percent}%`;

}


window.addEventListener(
  "scroll",
  updateScrollProgress,
  { passive: true }
);

updateScrollProgress();


/* =========================================================
   ACTIVE NAV LINK
========================================================= */

const navLinkGroups = {};

document
  .querySelectorAll(
    ".nav-links a[href^='#'], .mobile-menu a[href^='#']"
  )
  .forEach((link) => {

    const id =
      link.getAttribute("href").slice(1);

    if (!navLinkGroups[id]) {
      navLinkGroups[id] = [];
    }

    navLinkGroups[id].push(link);

  });


const trackedSections =
  document.querySelectorAll("section[id]");


const activeSectionObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) {
          return;
        }

        const links =
          navLinkGroups[entry.target.id];

        if (!links) {
          return;
        }

        document
          .querySelectorAll(
            ".nav-links a, .mobile-menu a"
          )
          .forEach((link) => {
            link.classList.remove("active");
          });

        links.forEach((link) => {
          link.classList.add("active");
        });

      });

    },

    {
      rootMargin: "-45% 0px -50% 0px",
      threshold: 0
    }
  );


trackedSections.forEach((section) => {
  activeSectionObserver.observe(section);
});


/* =========================================================
   SMOOTH INTERNAL LINKS
========================================================= */

document
  .querySelectorAll('a[href^="#"]')
  .forEach((anchor) => {

    anchor.addEventListener(
      "click",
      function (event) {

        const href =
          this.getAttribute("href");


        if (
          !href ||
          href === "#"
        ) {
          return;
        }


        const target =
          document.querySelector(href);


        if (target) {

          event.preventDefault();

          const offset = 70;

          const position =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            offset;


          window.scrollTo({

            top: position,

            behavior: "smooth"

          });

        }

      }
    );

  });
