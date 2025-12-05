// Enhanced interactions and animations for resume page
// - responsive nav (hamburger)
// - smoother slider with autoplay & pause on hover/focus
// - reveal-on-scroll animations
// - improved swipe handling and accessibility
// - respects prefers-reduced-motion

(function(){
  // Utilities
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================
     NAV BUILD + HAMBURGER
     ========================= */
  const navList = $('#navbar__list');
  const sections = $$('main section[data-nav]');
  const navItems = [];

  // Create nav items
  sections.forEach((section, idx) => {
    const label = section.getAttribute('data-nav') || `Section ${idx+1}`;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = label;
    a.setAttribute('data-target-index', idx);
    a.addEventListener('click', (e) => {
      e.preventDefault();
      section.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      setActiveNav(idx);
    });
    li.appendChild(a);
    navList.appendChild(li);
    navItems.push(a);
  });

  // Hamburger for small screens
  const navControls = document.createElement('div');
  navControls.className = 'nav-controls';
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'nav-toggle';
  toggleBtn.type = 'button';
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.setAttribute('aria-label', 'Toggle navigation');
  toggleBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M4 12h16M4 17h16"/></svg>`;
  navControls.appendChild(toggleBtn);
  // insert navControls into nav
  const navElem = $('#nav');
  navElem.insertBefore(navControls, navElem.firstChild);

  // Toggle behavior: on small screens make navList horizontally scrollable; toggle adds focus style
  toggleBtn.addEventListener('click', () => {
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!expanded));
    if(!expanded){
      // focus first link for a11y
      const first = navItems[0];
      if(first) first.focus();
    } else {
      toggleBtn.blur();
    }
  });

  function setActiveNav(idx){
    navItems.forEach((a,i) => a.classList.toggle('active', i === idx));
  }

  /* =========================
     IntersectionObserver - active section & reveal-on-scroll
     ========================= */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const idx = sections.indexOf(entry.target);
        if(idx !== -1) setActiveNav(idx);
      }
    });
  }, observerOptions);

  sections.forEach(s => sectionObserver.observe(s));

  // Reveal elements (progressive)
  const revealTargets = $$('section, .tech-div, .t-div > div, .a-div2, .exp-container .slide');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if(en.isIntersecting){
        en.target.classList.add('revealed');
        revealObserver.unobserve(en.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -12%', threshold: 0.05 });

  if(!prefersReducedMotion){
    revealTargets.forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  } else {
    // If reduced motion, just make items visible immediately
    revealTargets.forEach(el => el.classList.add('revealed'));
  }

  /* =========================
     To-top button behavior
     ========================= */
  const toTopBtn = document.getElementById('to-top');
  let lastKnownScrollY = 0;
  let ticking = false;

  function onScroll(){
    lastKnownScrollY = window.scrollY || document.documentElement.scrollTop;
    if(!ticking){
      window.requestAnimationFrame(() => {
        if(lastKnownScrollY > 420){
          toTopBtn.classList.add('show');
        } else {
          toTopBtn.classList.remove('show');
        }
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* =========================
     Slider: slides positioned and animated via classes
     ========================= */
  const sliderContainer = $('.exp-container');
  const slides = $$('.exp-container .slide');
  let current = slides.findIndex(s => s.classList.contains('active'));
  if(current === -1) current = 0;
  let autoplayInterval = null;
  const AUTOPLAY_DELAY = 7000;
  const swipeThreshold = 40;

  // initialize positions
  function updateSlideClasses(targetIndex){
    slides.forEach((s, i) => {
      s.classList.remove('prev', 'next', 'active');
      if(i === targetIndex) s.classList.add('active');
      else if(i < targetIndex) s.classList.add('prev');
      else s.classList.add('next');
    });
    current = (targetIndex + slides.length) % slides.length;
    updateDots();
  }

  // next/prev functions exposed globally for inline onclick usage
  window.nextSlide = function(){
    updateSlideClasses((current + 1) % slides.length);
  };
  window.prevSlide = function(){
    updateSlideClasses((current - 1 + slides.length) % slides.length);
  };

  // Create dots
  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'exp-dots';
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Show slide ${i+1}`);
    btn.addEventListener('click', () => updateSlideClasses(i));
    dotsWrap.appendChild(btn);
  });
  sliderContainer.appendChild(dotsWrap);
  const dots = Array.from(dotsWrap.children);
  function updateDots(){
    dots.forEach((d,i) => d.classList.toggle('active', i === current));
  }

  updateSlideClasses(current);

  // Autoplay with pause on hover & focus
  function startAutoplay(){
    if(prefersReducedMotion) return;
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      updateSlideClasses((current + 1) % slides.length);
    }, AUTOPLAY_DELAY);
  }
  function stopAutoplay(){
    if(autoplayInterval) { clearInterval(autoplayInterval); autoplayInterval = null; }
  }
  sliderContainer.addEventListener('mouseenter', stopAutoplay);
  sliderContainer.addEventListener('focusin', stopAutoplay);
  sliderContainer.addEventListener('mouseleave', startAutoplay);
  sliderContainer.addEventListener('focusout', startAutoplay);

  // Swipe support
  (function addSwipe(){
    if(!('ontouchstart' in window)) return;
    let sx = 0, sy = 0, moved = false;
    sliderContainer.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      sx = t.clientX; sy = t.clientY; moved = false;
    }, {passive:true});
    sliderContainer.addEventListener('touchmove', (e) => { moved = true; }, {passive:true});
    sliderContainer.addEventListener('touchend', (e) => {
      if(!moved) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      if(Math.abs(dx) > swipeThreshold && Math.abs(dx) > Math.abs(dy)){
        if(dx < 0) window.nextSlide(); else window.prevSlide();
      }
    });
  })();

  // keyboard arrows
  document.addEventListener('keydown', (e) => {
    if(document.activeElement && ['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
    if(e.key === 'ArrowRight') window.nextSlide();
    if(e.key === 'ArrowLeft') window.prevSlide();
  });

  // start autoplay after a short delay
  setTimeout(startAutoplay, 900);

  /* =========================
     Phone Toast (showPhoneNumber)
     ========================= */
  window.showPhoneNumber = function(){
    const phone = '+20 10 0000 0000'; // <-- استبدل بالرقم الحقيقي
    const id = 'phone-toast';
    const existing = document.getElementById(id);
    if(existing){ existing.remove(); return; }
    const toast = document.createElement('div');
    toast.id = id;
    toast.textContent = phone;
    Object.assign(toast.style, {
      position: 'fixed',
      right: '18px',
      bottom: '86px',
      background: '#2b6f9b',
      color: '#fff',
      padding: '10px 14px',
      borderRadius: '10px',
      boxShadow: '0 12px 28px rgba(20,20,30,0.2)',
      zIndex: 2200,
      fontWeight: 700,
      cursor: 'pointer'
    });
    toast.title = 'Tap to copy';
    toast.tabIndex = 0;
    toast.addEventListener('click', () => {
      navigator.clipboard?.writeText(phone).then(() => {
        toast.textContent = 'Copied ✓';
        setTimeout(()=> toast.remove(), 1200);
      }).catch(()=> {});
    });
    toast.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' ') { toast.click(); }
    });
    document.body.appendChild(toast);
    setTimeout(()=> toast.remove(), 5000);
  };

  /* =========================
     Misc: lazy images, initial states
     ========================= */
  // lazy loading
  $$('img').forEach(img => {
    if(!img.hasAttribute('loading')) img.setAttribute('loading','lazy');
  });

  // make profile float only on larger screens and if motion not reduced
  const profile = $('.profile-pic');
  if(profile && !prefersReducedMotion && window.innerWidth > 700) profile.classList.add('float');

  // ensure initial nav active
  setTimeout(() => {
    let found = sections.findIndex(s => {
      const r = s.getBoundingClientRect();
      return r.top >= 0 && r.top < window.innerHeight * 0.6;
    });
    if(found === -1) found = 0;
    setActiveNav(found);
  }, 300);

})();
