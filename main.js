// Initialize when DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const header = document.querySelector("header");

  // Mobile navigation toggle functionality
  function toggleMobileNav() {
    document.getElementById("mobileMenu").classList.toggle("show");
  }

  // Make function globally accessible for inline HTML
  window.toggleMobileNav = toggleMobileNav;

  // Page load entrance animations
  function runInitialAnimations() {
    // Set initial state for hero tape image
    gsap.set(".hero-tape", {
      y: 50,
      x: 100,
      rotate: 20,
      scale: 0.4
    });

    const onLoadTl = gsap.timeline({ defaults: { ease: "power2.out" } });

    onLoadTl
      // Animate header border expansion
      .to(
        "header",
        {
          "--border-width": "100%",
          duration: 3,
        },
        0
      )
      // Animate navigation elements sliding in from top
      .from(
        ".desktop-nav a, .social-sidebar a",
        {
          y: -100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        },
        0
      )
      // Animate sidebar border expansion
      .to(
        ".social-sidebar",
        {
          "--border-height": "100%",
          duration: 10,
        },
        0
      )
      // Reveal hero tape with delay
      .to(
        ".hero-tape-wrapper",
        {
          opacity: 1,
          scale: 1,
          delay: 1.5,
          duration: 1.3,
          ease: "power3.out",
        },
        0
      );
  }

  // Utility function for creating scroll-triggered animations
  function pinAndAnimate({
    trigger,
    endTrigger,
    pin,
    animations,
    markers = false,
    headerOffset = 0,
  }) {
    const end = `top top+=${headerOffset}`;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: `top top+=${headerOffset}`,
        endTrigger,
        end,
        scrub: true,
        pin,
        pinSpacing: false,
        markers: markers,
        invalidateOnRefresh: true,
      },
    });

    // Apply each animation in sequence
    animations.forEach(({ target, vars, position = 0 }) => {
      tl.to(target, vars, position);
    });
  }

  // Configure scroll animations for different screen sizes
  function setupScrollAnimations() {
    const headerOffset = header.offsetHeight - 1;

    ScrollTrigger.matchMedia({
      // Desktop scroll animations (769px and above)
      "(min-width: 769px)": function () {
        // Hero tape animation during scroll from hero to intro section
        pinAndAnimate({
          trigger: ".hero",
          endTrigger: ".section-intro",
          pin: ".hero-tape-wrapper",
          animations: [
            { target: ".hero-tape", vars: { rotate: 0, scale: 0.2, x: 2, y: -90 } }
          ],
          headerOffset,
        });
      },

      // Mobile animations (768px and below)
      "(max-width: 768px)": function () {
        // Simple fade-in for mobile devices
        gsap.to(".hero-tape-wrapper", {
          opacity: 1,
          duration: 1,
          delay: 0.5,
        });
      },
    });
  }

  // Initialize all animations
  runInitialAnimations();
  setupScrollAnimations();

  // Refresh ScrollTrigger calculations
  ScrollTrigger.refresh();
});
