const forms = document.querySelectorAll('.validate');
forms.forEach(form => form.setAttribute('novalidate', true));

const hasError = field => {
  if (field.disabled || ['file','reset','submit','button'].includes(field.type)) return;
  const v = field.validity;
  if (v.valid) return;
  if (v.valueMissing) return 'Please fill out this field.';
  if (v.typeMismatch) {
    if (field.type === 'email') return 'Please enter an email address.';
    if (field.type === 'url') return 'Please enter a URL.';
  }
  if (v.tooShort) return `Please use at least ${field.getAttribute('minLength')} characters.`;
  if (v.tooLong) return `Please use no more than ${field.getAttribute('maxLength')} characters.`;
  if (v.badInput) return 'Please enter a number.';
  if (v.patternMismatch) return field.getAttribute('title') || 'Please match the requested format.';
  return 'The value you entered is invalid.';
};

const showError = (field, error) => {
  field.classList.add('error');
  const id = field.id || field.name;
  if (!id) return;
  let message = field.form.querySelector(`.error-message#error-for-${id}`);
  if (!message) {
    message = document.createElement('div');
    message.className = 'error-message';
    message.id = `error-for-${id}`;
    field.parentNode.insertBefore(message, field.nextSibling);
  }
  field.setAttribute('aria-describedby', `error-for-${id}`);
  message.textContent = error;
  message.style.display = 'block';
  message.style.visibility = 'visible';
};

const removeError = field => {
  field.classList.remove('error');
  field.removeAttribute('aria-describedby');
  const id = field.id || field.name;
  if (!id) return;
  const message = field.form.querySelector(`.error-message#error-for-${id}`);
  if (!message) return;
  message.textContent = '';
  message.style.display = 'none';
  message.style.visibility = 'hidden';
};

document.addEventListener('blur', event => {
  if (!event.target.form || !event.target.form.classList.contains('validate')) return;
  const error = hasError(event.target);
  if (error) { showError(event.target, error); return; }
  removeError(event.target);
}, true);

document.addEventListener('submit', event => {
  if (!event.target.classList.contains('validate')) return;
  let hasErrors;
  for (const field of event.target.elements) {
    const error = hasError(field);
    if (error) {
      showError(field, error);
      if (!hasErrors) hasErrors = field;
    }
  }
  if (hasErrors) {
    event.preventDefault();
    hasErrors.focus();
  }
}, false);

/* ---- TYPEWRITER ---- */
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  const text = heroTitle.textContent.trim();
  heroTitle.textContent = '';
  heroTitle.classList.add('typewriter');
  let i = 0;
  const type = () => {
    if (i < text.length) {
      heroTitle.textContent += text[i++];
      setTimeout(type, 55);
    } else {
      heroTitle.classList.add('typewriter-done');
    }
  };
  setTimeout(type, 700);
}

/* ---- SCROLL REVEAL ---- */
document.querySelectorAll('.skill-badge, .project-card, .blog-card, .blog-post-card, .about-grid, .contact-links, .contact-form-title, form.validate').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 8) * 75}ms`;
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- HERO AURORA GLOW ---- */
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty('--glow-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    hero.style.setProperty('--glow-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  });
  hero.addEventListener('mouseleave', () => {
    hero.style.setProperty('--glow-x', '50%');
    hero.style.setProperty('--glow-y', '50%');
  });
}
