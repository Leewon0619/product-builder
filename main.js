document.addEventListener('DOMContentLoaded', () => {
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const navLinks = document.querySelector('.nav-links');
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  const sections = document.querySelectorAll('main section');
  const navLinksAnchors = document.querySelectorAll('.nav-links a');

  // --- Mobile Hamburger Menu ---
  if (hamburgerMenu && navLinks) {
    hamburgerMenu.addEventListener('click', () => {
      hamburgerMenu.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile menu when a link is clicked
  if (navLinks) {
    navLinks.addEventListener('click', (event) => {
      if (event.target.tagName === 'A' && navLinks.classList.contains('active')) {
        hamburgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  // --- Scroll-to-Top Button ---
  if (scrollToTopBtn) {
    let ticking = false;
    const updateScrollButton = () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
      } else {
        scrollToTopBtn.classList.remove('show');
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollButton);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScrollButton();

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Active Nav Link on Scroll ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // 50% of the section must be visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinksAnchors.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
});
