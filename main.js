document.addEventListener('DOMContentLoaded', () => {
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const navLinks = document.querySelector('.nav-links');
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  const sections = document.querySelectorAll('main section');
  const navLinksAnchors = document.querySelectorAll('.nav-links a');
  const dailyPromptEl = document.getElementById('daily-prompt');
  const copyDailyBtn = document.getElementById('copy-daily');
  const completeDailyBtn = document.getElementById('complete-daily');
  const streakCountEl = document.getElementById('streak-count');
  const streakBar = document.getElementById('streak-bar');
  const streakHint = document.getElementById('streak-hint');
  const challengeList = document.getElementById('challenge-list');
  const challengeProgress = document.getElementById('challenge-progress');
  const challengeCount = document.getElementById('challenge-count');
  const promptBuilder = document.getElementById('prompt-builder');
  const promptOutput = document.getElementById('prompt-output');
  const savePromptBtn = document.getElementById('save-prompt');
  const copyPromptBtn = document.getElementById('copy-prompt');
  const promptLibrary = document.getElementById('prompt-library');
  const clearLibraryBtn = document.getElementById('clear-library');

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

  // --- Daily Mission ---
  const dailyPrompts = [
    "당신은 프로젝트 매니저입니다. 오늘 회의록을 5줄 요약으로 정리하고 다음 액션 3개를 뽑아주세요.",
    "당신은 마케터입니다. 이번 주 프로모션을 위한 카피 문구 5개를 A/B 테스트 버전으로 작성해주세요.",
    "당신은 데이터 분석가입니다. 지난달 KPI를 요약하고 개선 포인트 3개를 제안해주세요.",
    "당신은 UX 라이터입니다. 결제 실패 메시지를 친절한 톤으로 3가지 작성해주세요.",
    "당신은 영업 담당자입니다. 잠재 고객에게 보낼 첫 연락 이메일을 3가지 버전으로 써주세요.",
    "당신은 HR 담당자입니다. 신규 입사자 온보딩 체크리스트를 10개로 만들어주세요.",
    "당신은 고객지원 담당자입니다. 환불 요청에 대한 공감형 답변 템플릿을 만들어주세요."
  ];

  const todayStr = new Date().toISOString().split('T')[0];
  const todayIndex = new Date().getDay();
  const dailyPrompt = dailyPrompts[todayIndex % dailyPrompts.length];

  if (dailyPromptEl) {
    dailyPromptEl.textContent = dailyPrompt;
  }

  const getStreakData = () => {
    const stored = JSON.parse(localStorage.getItem('dailyStreak') || '{}');
    return {
      count: stored.count || 0,
      lastDate: stored.lastDate || null
    };
  };

  const setStreakData = (count, lastDate) => {
    localStorage.setItem('dailyStreak', JSON.stringify({ count, lastDate }));
  };

  const updateStreakUI = () => {
    const { count, lastDate } = getStreakData();
    if (streakCountEl) {
      streakCountEl.textContent = count;
    }
    if (streakBar) {
      const percent = Math.min(100, count * 10);
      streakBar.style.width = `${percent}%`;
    }
    if (streakHint) {
      if (lastDate === todayStr) {
        streakHint.textContent = "오늘 미션 완료! 내일도 이어가 보세요.";
      } else {
        streakHint.textContent = "오늘 미션을 완료하면 기록이 이어집니다.";
      }
    }
  };

  const isYesterday = (dateStr) => {
    if (!dateStr) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateStr === yesterday.toISOString().split('T')[0];
  };

  if (completeDailyBtn) {
    completeDailyBtn.addEventListener('click', () => {
      const { count, lastDate } = getStreakData();
      if (lastDate === todayStr) {
        alert('오늘 미션은 이미 완료했습니다.');
        return;
      }
      const nextCount = isYesterday(lastDate) ? count + 1 : 1;
      setStreakData(nextCount, todayStr);
      updateStreakUI();
    });
  }

  if (copyDailyBtn && dailyPromptEl) {
    copyDailyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(dailyPromptEl.textContent);
        copyDailyBtn.textContent = '복사됨!';
        setTimeout(() => (copyDailyBtn.textContent = '미션 복사'), 1500);
      } catch {
        alert('복사에 실패했습니다. 다시 시도해주세요.');
      }
    });
  }

  updateStreakUI();

  // --- 7-Day Challenge ---
  const loadChallenge = () => {
    const stored = JSON.parse(localStorage.getItem('challengeDays') || '{}');
    if (!challengeList) return stored;
    challengeList.querySelectorAll('input[type="checkbox"]').forEach(input => {
      const day = input.getAttribute('data-day');
      input.checked = Boolean(stored[day]);
    });
    return stored;
  };

  const updateChallengeUI = () => {
    if (!challengeList) return;
    const inputs = challengeList.querySelectorAll('input[type="checkbox"]');
    const completed = Array.from(inputs).filter(input => input.checked).length;
    if (challengeCount) {
      challengeCount.textContent = `${completed}/7 완료`;
    }
    if (challengeProgress) {
      const percent = (completed / 7) * 100;
      challengeProgress.style.width = `${percent}%`;
    }
  };

  const challengeData = loadChallenge();
  updateChallengeUI();

  if (challengeList) {
    challengeList.addEventListener('change', (event) => {
      if (event.target.matches('input[type="checkbox"]')) {
        const day = event.target.getAttribute('data-day');
        challengeData[day] = event.target.checked;
        localStorage.setItem('challengeDays', JSON.stringify(challengeData));
        updateChallengeUI();
      }
    });
  }

  // --- Prompt Builder ---
  const buildPrompt = () => {
    if (!promptBuilder) return '';
    const formData = new FormData(promptBuilder);
    const role = formData.get('role')?.toString().trim();
    const task = formData.get('task')?.toString().trim();
    const context = formData.get('context')?.toString().trim();
    const format = formData.get('format')?.toString().trim();
    const parts = [];
    if (role) parts.push(`당신은 ${role}입니다.`);
    if (context) parts.push(`맥락: ${context}.`);
    if (task) parts.push(`목표: ${task}.`);
    if (format) parts.push(`결과 형식: ${format}.`);
    return parts.join(' ');
  };

  if (promptBuilder) {
    promptBuilder.addEventListener('submit', (event) => {
      event.preventDefault();
      const prompt = buildPrompt();
      if (promptOutput) {
        promptOutput.value = prompt || '입력값을 채워주세요.';
      }
    });
  }

  // --- Prompt Library ---
  const loadLibrary = () => {
    return JSON.parse(localStorage.getItem('promptLibrary') || '[]');
  };

  const saveLibrary = (items) => {
    localStorage.setItem('promptLibrary', JSON.stringify(items));
  };

  const renderLibrary = () => {
    if (!promptLibrary) return;
    const items = loadLibrary();
    promptLibrary.innerHTML = '';
    if (items.length === 0) {
      promptLibrary.innerHTML = '<p>아직 저장된 프롬프트가 없습니다.</p>';
      return;
    }
    items.forEach((item, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'library-item';
      wrapper.innerHTML = `
        <h4>${item.title}</h4>
        <p>${item.text}</p>
        <div class="library-actions">
          <button class="btn ghost" data-copy="${index}">복사</button>
          <button class="btn ghost" data-delete="${index}">삭제</button>
        </div>
      `;
      promptLibrary.appendChild(wrapper);
    });
  };

  if (savePromptBtn) {
    savePromptBtn.addEventListener('click', () => {
      const text = promptOutput?.value?.trim();
      if (!text) {
        alert('먼저 프롬프트를 생성해주세요.');
        return;
      }
      const items = loadLibrary();
      const title = `저장 ${new Date().toLocaleDateString()}`;
      items.unshift({ title, text });
      saveLibrary(items.slice(0, 10));
      renderLibrary();
    });
  }

  if (copyPromptBtn) {
    copyPromptBtn.addEventListener('click', async () => {
      const text = promptOutput?.value?.trim();
      if (!text) {
        alert('복사할 프롬프트가 없습니다.');
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        copyPromptBtn.textContent = '복사됨!';
        setTimeout(() => (copyPromptBtn.textContent = '프롬프트 복사'), 1500);
      } catch {
        alert('복사에 실패했습니다.');
      }
    });
  }

  if (promptLibrary) {
    promptLibrary.addEventListener('click', async (event) => {
      const copyIndex = event.target.getAttribute('data-copy');
      const deleteIndex = event.target.getAttribute('data-delete');
      const items = loadLibrary();
      if (copyIndex !== null) {
        try {
          await navigator.clipboard.writeText(items[copyIndex].text);
          alert('복사되었습니다.');
        } catch {
          alert('복사에 실패했습니다.');
        }
      }
      if (deleteIndex !== null) {
        items.splice(Number(deleteIndex), 1);
        saveLibrary(items);
        renderLibrary();
      }
    });
  }

  if (clearLibraryBtn) {
    clearLibraryBtn.addEventListener('click', () => {
      saveLibrary([]);
      renderLibrary();
    });
  }

  renderLibrary();
});
