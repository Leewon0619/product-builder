const generateBtn = document.getElementById('generate-btn');
const lottoNumbersContainer = document.getElementById('lotto-numbers');
const themeToggle = document.getElementById('theme-toggle');

// --- Theme Switcher ---
function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
  } else {
    document.body.classList.remove('dark-mode');
    themeToggle.checked = false;
  }
}

function setTheme(isDarkMode) {
  const theme = isDarkMode ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
  applyTheme(theme);
}

themeToggle.addEventListener('change', (e) => {
  setTheme(e.target.checked);
});

// Apply saved theme on load
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);


// --- Lotto Generator ---
generateBtn.addEventListener('click', () => {
  // Clear previous numbers
  lottoNumbersContainer.innerHTML = '';

  const numbers = new Set();
  while (numbers.size < 6) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNumber);
  }

  const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

  sortedNumbers.forEach((number, index) => {
    const ball = document.createElement('div');
    ball.classList.add('lotto-ball');
    ball.textContent = number;
    lottoNumbersContainer.appendChild(ball);

    // Staggered animation
    setTimeout(() => {
      ball.classList.add('pop');
    }, index * 100);
  });
});