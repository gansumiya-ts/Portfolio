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

    const icon =
      menuButton.querySelector("i");

    if (mobileMenu.classList.contains("active")) {

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
   DESKTOP CARD EFFECT
========================================================= */

if (
  window.matchMedia(
    "(pointer: fine)"
  ).matches
) {

  const cards =
    document.querySelectorAll(
      ".project-card"
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


        card.style.background =
          `
          radial-gradient(
            400px circle at ${x}px ${y}px,
            rgba(126,110,255,0.09),
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

        card.style.background = "";

      }
    );

  });

}


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
