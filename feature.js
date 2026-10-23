(() => {
  const logo = document.querySelector('.logo img');
  const sections = Array.from(document.querySelectorAll('.section-card'));
  if (!logo || !sections.length) return;

  const pathParts = window.location.pathname.split('/');
  const homeHref = pathParts.includes('images') ? '../index.html' : 'index.html';
  const header = document.querySelector('.logo');
  header.classList.add('demo-header');
  header.innerHTML = `<a class="demo-brand" href="${homeHref}"><img src="${logo.getAttribute('src')}" alt="">triablo.</a><a class="demo-home" href="${homeHref}">← Back to showcase</a>`;

  const headingText = document.title.split(' - ')[0].replace(' Feature', '').replace(' - Triablo', '');
  const main = document.createElement('main');
  main.className = 'demo-main';
  const hero = document.querySelector('.parallax-hero');
  const intro = document.createElement('div');
  intro.innerHTML = `<p class="demo-eyebrow">TRIABLO / FEATURE PREVIEW</p><h1 class="demo-title"></h1><p class="demo-description">A thoughtfully designed storefront experience for putting products, stories, and your brand in the spotlight.</p>`;
  intro.querySelector('h1').textContent = headingText;
  const grid = document.createElement('div');
  grid.className = 'demo-grid';
  sections.forEach((section) => grid.append(section));
  if (hero) main.append(hero);
  main.append(intro, grid);
  header.after(main);

  const footer = document.createElement('footer');
  footer.className = 'demo-footer';
  footer.innerHTML = `<span>Triablo — Thoughtful storefronts, memorable first impressions.</span><a href="${homeHref}">Explore all demos →</a>`;
  document.body.append(footer);
  const backToTop = document.createElement('button');
  backToTop.className = 'demo-back-top';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.textContent = '↑';
  document.body.append(backToTop);

  try {
    const accent = localStorage.getItem('selectedColor');
    if (accent && /^#[0-9a-f]{6}$/i.test(accent)) document.documentElement.style.setProperty('--demo-accent', accent);
  } catch (error) {
    console.error('Unable to load the selected accent color.', error);
  }
  window.addEventListener('scroll', () => backToTop.classList.toggle('is-visible', window.scrollY > 350), { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
