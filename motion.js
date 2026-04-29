/* ============================================================
   Camila site — motion runtime
   ============================================================ */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------- mobile nav -------- */
  const tg = document.getElementById('navToggle');
  const nav = document.querySelector('.primary-nav');
  if (tg && nav) {
    tg.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      tg.setAttribute('aria-expanded', open);
      tg.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        tg.classList.remove('is-open');
        tg.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------- header scrolled -------- */
  const hdr = document.querySelector('.site-header');
  const progress = document.getElementById('scrollProgress');
  const fabWa = document.getElementById('fabWa');

  const onScroll = () => {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = Math.min(1, Math.max(0, y / Math.max(1, h)));
    if (hdr) hdr.classList.toggle('scrolled', y > 24);
    if (progress) progress.style.width = (pct * 100) + '%';
    if (fabWa) fabWa.classList.toggle('visible', y > 600);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* -------- auto-add reveal classes to common blocks -------- */
  const tag = (sel, cls = 'reveal', delayStep = 80, base = 0) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add(cls);
      el.style.setProperty('--rd', (base + i * delayStep) + 'ms');
    });
  };

  tag('.hero-copy .eyebrow', 'reveal', 0, 100);
  tag('.hero-copy .lede', 'reveal', 0, 600);
  tag('.hero-ctas', 'reveal', 0, 750);
  tag('.hero-meta li', 'reveal', 80, 850);
  tag('.hero-portrait', 'reveal-scale', 0, 200);

  tag('.problem-head .section-eyebrow', 'reveal', 0, 0);
  tag('.problem-head .section-title', 'reveal', 0, 120);
  tag('.problem-head .section-lede', 'reveal', 0, 240);
  tag('.pcard', 'reveal', 90, 300);
  tag('.problem-foot', 'reveal', 0, 200);

  tag('.approach-head .section-eyebrow', 'reveal', 0, 0);
  tag('.approach-head .section-title', 'reveal', 0, 120);
  tag('.acard', 'reveal', 100, 200);

  tag('.about-photo', 'reveal-left', 0, 0);
  tag('.about-copy .section-eyebrow', 'reveal-right', 0, 0);
  tag('.about-copy .section-title', 'reveal-right', 0, 120);
  tag('.about-text', 'reveal-right', 0, 240);
  tag('.credentials li', 'reveal', 60, 300);

  tag('.services-head', 'reveal', 0, 0);
  tag('.scard', 'reveal', 120, 200);

  tag('.t-head', 'reveal', 0, 0);
  tag('.tcard', 'reveal', 120, 200);

  tag('.insta-head', 'reveal', 0, 0);
  tag('.ig', 'reveal-scale', 100, 150);
  tag('.insta-foot', 'reveal', 0, 600);

  tag('.cta-photo', 'reveal-left', 0, 0);
  tag('.cta-copy .section-eyebrow', 'reveal-right', 0, 0);
  tag('.cta-copy .section-title', 'reveal-right', 0, 120);
  tag('.cta-copy p', 'reveal-right', 0, 240);
  tag('.cta-actions', 'reveal-right', 0, 360);
  tag('.cta-info li', 'reveal', 80, 480);

  tag('.faq-head', 'reveal-left', 0, 0);
  tag('.faq-list details', 'reveal-right', 80, 0);

  tag('.foot-brand', 'reveal', 0, 0);
  tag('.foot-cols > div', 'reveal', 100, 100);

  tag('.trust-list li', 'reveal', 80, 0);

  /* -------- word-by-word split for [data-split] headings -------- */
  document.querySelectorAll('[data-split]').forEach(h => {
    const html = h.innerHTML;
    // Split text nodes only, preserve <em>, <br/>
    const wrap = document.createElement('span');
    wrap.innerHTML = html;
    const out = [];
    let i = 0;
    const walk = node => {
      if (node.nodeType === 3) {
        const parts = node.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) {
            frag.appendChild(document.createTextNode(p));
          } else {
            const w = document.createElement('span');
            w.className = 'split-word';
            const inner = document.createElement('span');
            inner.textContent = p;
            inner.style.setProperty('--wd', (i * 60) + 'ms');
            i++;
            w.appendChild(inner);
            frag.appendChild(w);
          }
        });
        node.replaceWith(frag);
      } else if (node.nodeType === 1) {
        if (node.tagName === 'EM') {
          const txt = node.textContent;
          node.textContent = '';
          const w = document.createElement('span');
          w.className = 'split-word';
          const inner = document.createElement('span');
          inner.textContent = txt;
          inner.style.setProperty('--wd', (i * 60) + 'ms');
          i++;
          w.appendChild(inner);
          node.appendChild(w);
        } else {
          [...node.childNodes].forEach(walk);
        }
      }
    };
    [...wrap.childNodes].forEach(walk);
    h.innerHTML = '';
    [...wrap.childNodes].forEach(n => h.appendChild(n));
    h.classList.add('split-host');
  });

  /* -------- IntersectionObserver: trigger reveals -------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        // also activate split words inside
        en.target.querySelectorAll('.split-word').forEach(w => w.classList.add('is-in'));
        if (en.target.classList.contains('split-host')) {
          en.target.querySelectorAll('.split-word').forEach(w => w.classList.add('is-in'));
        }
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .split-host, .section-divider'
  ).forEach(el => io.observe(el));

  if (reduce) return;

  /* -------- parallax: hero orbs, portrait, about photo, cta photo -------- */
  const parallaxItems = [
    { el: document.querySelector('.hero-orb-1'),  speed: 0.18, axis: 'y' },
    { el: document.querySelector('.hero-orb-2'),  speed: -0.22, axis: 'y' },
    { el: document.querySelector('.hero-leaf-1'), speed: 0.08, axis: 'y' },
    { el: document.querySelector('.hero-leaf-2'), speed: -0.12, axis: 'y' },
    { el: document.querySelector('.portrait-frame img'), speed: 0.06, axis: 'y' },
    { el: document.querySelector('.ap-frame img'), speed: 0.10, axis: 'y' },
    { el: document.querySelector('.cta-photo img'), speed: 0.08, axis: 'y' },
  ].filter(p => p.el);

  let lastY = 0, ticking = false;
  const updateParallax = () => {
    const y = window.scrollY;
    parallaxItems.forEach(({ el, speed }) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!inView) return;
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const offset = -center * speed;
      // preserve existing animations/transforms by writing a CSS variable
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
  }, { passive: true });
  updateParallax();

  /* -------- approach card: glow follows cursor -------- */
  document.querySelectorAll('.acard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* -------- testimonial cards: 3D tilt -------- */
  document.querySelectorAll('.tcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* -------- magnetic buttons (subtle) -------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18;
      const y = (e.clientY - r.top - r.height / 2) * 0.18;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* -------- cursor aura -------- */
  const aura = document.getElementById('cursorAura');
  if (aura && matchMedia('(hover: hover)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', e => {
      tx = e.clientX; ty = e.clientY;
      aura.classList.add('active');
    });
    document.addEventListener('mouseleave', () => aura.classList.remove('active'));
    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      aura.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();
  }

  /* -------- scroll spy on nav -------- */
  const sections = ['sobre', 'abordagem', 'servicos', 'depoimentos', 'faq', 'contato']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navLinks = document.querySelectorAll('.primary-nav a');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const id = en.target.id;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
  sections.forEach(s => spy.observe(s));
})();
