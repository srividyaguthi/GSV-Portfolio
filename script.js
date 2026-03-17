  // ─── Init EmailJS ───
  emailjs.init('service_7zo1uqo');
 
  // ─── Loader ───
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('loader-finished');
      document.getElementById('main-content').style.opacity = '1';
    }, 5800);
  });
 
  // ─── Generate stars ───
  const sf = document.getElementById('star-field');
  for (let i = 0; i < 120; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${(Math.random()*4+2).toFixed(1)}s;--dl:${(Math.random()*4).toFixed(1)}s;--op:${(Math.random()*0.6+0.3).toFixed(2)};`;
    sf.appendChild(s);
  }
 
  // ─── Wand cursor trail ───
  const dot = document.getElementById('cursor-dot');
  document.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
    spawnTrail(e.clientX, e.clientY);
  });
  let lastTrail = 0;
  function spawnTrail(x, y) {
    const now = Date.now();
    if (now - lastTrail < 40) return;
    lastTrail = now;
    const s = document.createElement('div');
    s.className = 'wand-trail';
    const size = Math.random() * 6 + 3;
    const cols = ['rgba(236,185,57,','rgba(255,220,100,','rgba(116,0,1,','rgba(200,160,50,'];
    const col = cols[Math.floor(Math.random() * cols.length)];
    s.style.cssText = `left:${x+(Math.random()-.5)*14}px;top:${y+(Math.random()-.5)*14}px;width:${size}px;height:${size}px;background:${col}0.85)`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 650);
  }
 
  // ─── Scroll progress ───
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    document.getElementById('scroll-bar').style.width = pct + '%';
  });
 
  // ─── Typing effect ───
  const phrases = [
    'Aspiring Full Stack Developer',
    'MERN Stack Enthusiast',
    'AI & DSA Explorer',
    'Problem Solver'
  ];
  let pi = 0, ci = 0, deleting = false;
  const el = document.getElementById('typing-el');
  function typeLoop() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    } else {
      el.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(typeLoop, 400); return; }
    }
    setTimeout(typeLoop, deleting ? 55 : 90);
  }
  setTimeout(typeLoop, 6500); // start after loader fades
 
  // ─── Animated number counters ───
  function animateCounter(el) {
    const target  = parseFloat(el.dataset.target);
    const dec     = parseInt(el.dataset.decimal  || 0);
    const suffix  = el.dataset.suffix || '';
    const dur     = 1800;
    const step    = 16;
    const steps   = dur / step;
    let current   = 0;
    const inc     = target / steps;
    const timer   = setInterval(() => {
      current += inc;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current.toFixed(dec) + suffix;
    }, step);
  }
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.currentTarget.querySelectorAll('.stat-num').forEach(animateCounter);
        counterObs.unobserve(e.currentTarget);
      }
    });
  }, { threshold: 0.3 });
  const statsEl = document.getElementById('stats');
  if (statsEl) counterObs.observe(statsEl);
 
  // ─── Skills accordion ───
  function toggleSkill(id) {
    const row = document.getElementById(id);
    const open = row.classList.contains('open');
    document.querySelectorAll('.skill-row').forEach(r => r.classList.remove('open'));
    if (!open) row.classList.add('open');
  }
 
  // ─── Scroll reveal ───
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.07 });
  document.querySelectorAll('.section-reveal').forEach(el => obs.observe(el));
 
  // ─── Contact form — EmailJS ───
  async function handleSubmit() {
    const name    = document.getElementById('fc-name').value.trim();
    const email   = document.getElementById('fc-email').value.trim();
    const message = document.getElementById('fc-message').value.trim();
    const status  = document.getElementById('form-status');
    const btn     = document.getElementById('submit-btn');
 
    if (!name || !email || !message) {
      status.textContent = 'Please fill in all fields before dispatching your owl.';
      status.className = 'error';
      return;
    }
 
    btn.querySelector('span').textContent = 'Sending...';
    btn.disabled = true;
    status.textContent = '';
    status.className = '';
 
    try {
      // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your EmailJS values
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        from_name:    name,
        from_email:   email,
        message:      message,
        to_name:      'Sri Vidya',
      });
      document.getElementById('owl-msg').classList.add('show');
      status.textContent = 'Message delivered successfully!';
      status.className   = 'success';
      document.getElementById('fc-name').value    = '';
      document.getElementById('fc-email').value   = '';
      document.getElementById('fc-message').value = '';
      setTimeout(() => document.getElementById('owl-msg').classList.remove('show'), 5000);
    } catch (err) {
      status.textContent = 'Owl got lost in the Forbidden Forest. Please try emailing directly.';
      status.className   = 'error';
      console.error('EmailJS error:', err);
    } finally {
      btn.querySelector('span').textContent = 'Dispatch Owl ⟶';
      btn.disabled = false;
    }
  }