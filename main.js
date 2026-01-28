document.addEventListener('DOMContentLoaded', () => {
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const navLinks = document.querySelector('.nav-links');

  // Toggle mobile menu
  if (hamburgerMenu && navLinks) {
    hamburgerMenu.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile menu when a link is clicked
  if (navLinks) {
    navLinks.addEventListener('click', (event) => {
      if (event.target.tagName === 'A' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    });
  }
});
