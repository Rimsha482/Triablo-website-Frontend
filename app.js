(() => {
  const cards = Array.from(document.querySelectorAll('.demo-item'));
  const searchInput = document.querySelector('#demo-search');
  const filterButtons = Array.from(document.querySelectorAll('.filter-button'));
  const savedCount = document.querySelector('.saved-count');
  const emptyState = document.querySelector('#empty-state');
  const themeToggle = document.querySelector('.theme-toggle');
  const backToTop = document.querySelector('.back-to-top');
  const favoriteKey = 'triablo-favorites';
  const themeKey = 'triablo-theme';
  let activeFilter = 'all';
  let favorites = [];

  try {
    const storedFavorites = JSON.parse(localStorage.getItem(favoriteKey) || '[]');
    favorites = Array.isArray(storedFavorites) ? storedFavorites : [];
  } catch (error) {
    console.error('Unable to load saved demos from local storage.', error);
  }

  function updateCards() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const isFavorite = favorites.includes(card.querySelector('.demo-link').getAttribute('href'));
      const matchesFilter = activeFilter === 'all'
        || (activeFilter === 'favorites' && isFavorite)
        || card.dataset.category === activeFilter;
      const matchesSearch = !query || `${card.dataset.search} ${card.textContent}`.toLowerCase().includes(query);
      const isVisible = matchesFilter && matchesSearch;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    emptyState.hidden = visibleCount !== 0;
    savedCount.textContent = String(favorites.length);
  }

  function saveFavorites() {
    try {
      localStorage.setItem(favoriteKey, JSON.stringify(favorites));
    } catch (error) {
      console.error('Unable to save favorite demos to local storage.', error);
    }
  }

  cards.forEach((card) => {
    const link = card.querySelector('.demo-link');
    const button = card.querySelector('.save-button');
    const destination = link.getAttribute('href');
    const saved = favorites.includes(destination);
    button.setAttribute('aria-pressed', String(saved));
    button.textContent = saved ? '♥' : '♡';

    button.addEventListener('click', () => {
      const isSaved = favorites.includes(destination);
      favorites = isSaved
        ? favorites.filter((item) => item !== destination)
        : [...favorites, destination];
      button.setAttribute('aria-pressed', String(!isSaved));
      button.setAttribute('aria-label', `${isSaved ? 'Save' : 'Remove'} ${link.getAttribute('aria-label').replace('Explore ', '')}`);
      button.textContent = isSaved ? '♡' : '♥';
      saveFavorites();
      updateCards();
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle('is-active', isActive);
        filterButton.setAttribute('aria-pressed', String(isActive));
      });
      updateCards();
    });
  });

  searchInput.addEventListener('input', updateCards);
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      event.preventDefault();
      searchInput.focus();
    }
    if (event.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.value = '';
      searchInput.blur();
      updateCards();
    }
  });

  try {
    if (localStorage.getItem(themeKey) === 'dark') document.documentElement.classList.add('theme-dark');
  } catch (error) {
    console.error('Unable to load the saved theme preference.', error);
  }
  themeToggle.setAttribute('aria-label', document.documentElement.classList.contains('theme-dark') ? 'Switch to light theme' : 'Switch to dark theme');
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('theme-dark');
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    try {
      localStorage.setItem(themeKey, isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Unable to save the theme preference.', error);
    }
  });

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => backToTop.classList.toggle('is-visible', window.scrollY > 500), { passive: true });
  updateCards();
})();
