(() => {
  'use strict';

  /* ------------------------------------------------------------------ *
   * CONFIG — replace with your real Formspree endpoint before launch.
   * Create a free form at https://formspree.io, then paste its ID below.
   * ------------------------------------------------------------------ */
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xrenwrjb';

  const EVENT_DATE = new Date('2026-10-05T08:00:00-04:00');

  /* ------------------------------------------------------------------ *
   * Tier data
   * ------------------------------------------------------------------ */
  const TIERS = [
    {
      id: 'golfer', group: 'golfer', name: 'Individual Golfer', price: 225,
      desc: 'One golfer entry to the Charity Golf Outing. Includes greens fee, cart, and lunch.',
      addon: { id: 'package', name: 'Player Package', price: 25, desc: '2 mulligans + entry into the putting contest for prizes' }
    },
    {
      id: 'foursome', group: 'golfer', name: 'Foursome', price: 900,
      desc: 'Register a full team of 4 golfers together. Includes greens fees, carts, and lunch for all 4 players.'
    },
    {
      id: 'eagle', group: 'sponsor', name: 'Eagle Sponsor', price: 500,
      desc: 'Our top sponsorship tier — maximum signage, social, and event-day recognition.'
    },
    {
      id: 'birdie', group: 'sponsor', name: 'Birdie Sponsor', price: 250,
      desc: 'Prominent signage and recognition across the event and our channels.'
    },
    {
      id: 'teebox', group: 'sponsor', name: 'Tee Box Sponsor', price: 150,
      desc: 'Sponsor a tee box with your business signage displayed on the course.'
    },
    {
      id: 'firsttee', group: 'booster', name: 'First Tee Booster', price: 25,
      desc: 'A great way to show your support for RHS Golf.'
    },
    {
      id: 'fairway', group: 'booster', name: 'Fairway Booster', price: 50,
      desc: 'Help us keep our golfers on course for a successful season.'
    },
    {
      id: 'greenside', group: 'booster', name: 'Greenside Booster', price: 75,
      desc: 'Your generous support makes a meaningful impact on our team.'
    },
    {
      id: 'clubhouse', group: 'booster', name: 'Clubhouse Booster', price: 100,
      desc: 'Our highest individual booster level.'
    }
  ];

  /* Benefit bullets pulled verbatim from the printed 2026 flyer. */
  const BENEFITS = {
    eagle: [
      'Prominent logo placement on event signage and printed materials',
      'Recognition on event social media before and after the outing',
      'Verbal recognition during event announcements and awards',
      'Complimentary tee box sponsorship sign'
    ],
    birdie: [
      'Name or logo displayed on event sponsor signage',
      'Recognition in printed event materials',
      'Recognition on event social media',
      'Event day acknowledgment signage'
    ],
    teebox: [
      'Custom sponsor sign displayed at one tee box during the outing',
      'Recognition in printed event materials',
      'Recognition on social media'
    ],
    firsttee: [
      'A great way to show your support for RHS Golf',
      'Recognized on event signage'
    ],
    fairway: [
      'Helps keep our golfers on course for a successful season',
      'Recognized on event signage'
    ],
    greenside: [
      'A meaningful impact on our team',
      'Recognized on event signage'
    ],
    clubhouse: [
      'Our highest individual booster level',
      'Recognized on event signage'
    ]
  };

  const fmt = (n) => `$${n.toLocaleString('en-US')}`;
  const byId = (id) => TIERS.find((t) => t.id === id);

  /* ------------------------------------------------------------------ *
   * Cart state: { [tierId]: { qty, addon: bool } }
   * ------------------------------------------------------------------ */
  const cart = {};

  function cartLines() {
    const lines = [];
    Object.keys(cart).forEach((id) => {
      const entry = cart[id];
      if (!entry || entry.qty <= 0) return;
      const tier = byId(id);
      lines.push({ id, name: tier.name, unitPrice: tier.price, qty: entry.qty, total: tier.price * entry.qty });
      if (entry.addon && tier.addon) {
        lines.push({ id: `${id}-addon`, name: ` + ${tier.addon.name}`, unitPrice: tier.addon.price, qty: entry.qty, total: tier.addon.price * entry.qty });
      }
    });
    return lines;
  }

  function cartTotal() { return cartLines().reduce((sum, l) => sum + l.total, 0); }
  function cartItemCount() { return cartLines().reduce((sum, l) => sum + l.qty, 0); }
  function cartHasGroup(group) { return Object.keys(cart).some((id) => cart[id]?.qty > 0 && byId(id).group === group); }

  /* ------------------------------------------------------------------ *
   * Render tier lists
   * ------------------------------------------------------------------ */
  const listEls = {
    golfer: document.getElementById('tierListGolfer'),
    sponsor: document.getElementById('tierListSponsor'),
    booster: document.getElementById('tierListBooster')
  };

  function renderTiers() {
    Object.values(listEls).forEach((el) => { el.innerHTML = ''; });

    TIERS.forEach((tier) => {
      const entry = cart[tier.id];
      const qty = entry?.qty || 0;

      const li = document.createElement('li');
      li.className = 'tier-row' + (qty > 0 ? ' is-in-cart' : '');
      li.dataset.tierId = tier.id;

      const main = document.createElement('div');
      main.className = 'tier-main';
      main.innerHTML = `
        <div class="tier-name">${tier.name}</div>
        <p class="tier-desc">${tier.desc}</p>
      `;

      if (tier.addon && qty > 0) {
        const addonWrap = document.createElement('div');
        addonWrap.className = 'tier-addon';
        addonWrap.innerHTML = `
          <label>
            <input type="checkbox" data-addon-for="${tier.id}" ${entry.addon ? 'checked' : ''}>
            <span>Add ${tier.addon.name} (+${fmt(tier.addon.price)}) — ${tier.addon.desc}</span>
          </label>
        `;
        main.appendChild(addonWrap);
      }

      const price = document.createElement('div');
      price.className = 'tier-price';
      price.textContent = fmt(tier.price);

      const action = document.createElement('div');
      action.className = 'tier-action';
      if (qty > 0) {
        action.innerHTML = `
          <div class="qty-stepper">
            <button type="button" class="qty-btn" data-action="dec" aria-label="Decrease ${tier.name} quantity">−</button>
            <span class="qty-val">${qty}</span>
            <button type="button" class="qty-btn" data-action="inc" aria-label="Increase ${tier.name} quantity">+</button>
          </div>
        `;
      } else {
        action.innerHTML = `<button type="button" class="btn btn-primary btn-sm" data-action="add" aria-label="Add ${tier.name} to cart">Add</button>`;
      }

      li.append(main, price, action);
      listEls[tier.group].appendChild(li);
    });

    applyTierFilter(currentFilter);
  }

  function setQty(tierId, qty) {
    if (!cart[tierId]) cart[tierId] = { qty: 0, addon: false };
    cart[tierId].qty = Math.max(0, qty);
    if (cart[tierId].qty === 0) delete cart[tierId];
    renderTiers();
    renderCheckout();
    renderCartBar();
  }

  [listEls.golfer, listEls.sponsor, listEls.booster].forEach((list) => {
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const row = btn.closest('.tier-row');
      const tierId = row.dataset.tierId;
      const current = cart[tierId]?.qty || 0;
      if (btn.dataset.action === 'add' || btn.dataset.action === 'inc') setQty(tierId, current + 1);
      if (btn.dataset.action === 'dec') setQty(tierId, current - 1);
    });
    list.addEventListener('change', (e) => {
      const box = e.target.closest('input[data-addon-for]');
      if (!box) return;
      const tierId = box.dataset.addonFor;
      if (!cart[tierId]) return;
      cart[tierId].addon = box.checked;
      renderCheckout();
      renderCartBar();
    });
  });

  /* ------------------------------------------------------------------ *
   * Tier tabs filter
   * ------------------------------------------------------------------ */
  let currentFilter = 'all';
  const tabButtons = document.querySelectorAll('.tier-tab');
  const groupLabels = document.querySelectorAll('.tier-group-label, .tier-group-note');

  function applyTierFilter(filter) {
    currentFilter = filter;
    Object.entries(listEls).forEach(([group, el]) => {
      const show = filter === 'all' || filter === group;
      el.hidden = !show;
    });
    groupLabels.forEach((label) => {
      const show = filter === 'all' || filter === label.dataset.group;
      label.hidden = !show;
    });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      applyTierFilter(btn.dataset.filter);
    });
  });

  /* ------------------------------------------------------------------ *
   * Checkout panel
   * ------------------------------------------------------------------ */
  const checkoutEmpty = document.getElementById('checkoutEmpty');
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutSuccess = document.getElementById('checkoutSuccess');
  const golferFields = document.getElementById('golferFields');
  const sponsorFields = document.getElementById('sponsorFields');
  const orderSummaryEl = document.getElementById('orderSummary');
  const orderTotalEl = document.getElementById('orderTotal');

  function renderCheckout() {
    const lines = cartLines();
    const empty = lines.length === 0;

    checkoutEmpty.hidden = !empty;
    checkoutForm.hidden = empty;
    if (empty) { checkoutSuccess.hidden = true; }

    if (empty) return;

    golferFields.hidden = !cartHasGroup('golfer');
    sponsorFields.hidden = !cartHasGroup('sponsor');

    orderSummaryEl.innerHTML = lines.map((l) => `
      <li>
        <span class="os-name">${l.name}${l.qty > 1 ? ` × ${l.qty}` : ''}</span>
        <span class="os-price">${fmt(l.total)}</span>
      </li>
    `).join('');
    orderTotalEl.textContent = fmt(cartTotal());
  }

  /* ------------------------------------------------------------------ *
   * Sticky cart bar
   * ------------------------------------------------------------------ */
  const cartBar = document.getElementById('cartBar');
  const cartCountEl = document.getElementById('cartCount');
  const cartBarTotalEl = document.getElementById('cartBarTotal');

  function renderCartBar() {
    const count = cartItemCount();
    const show = count > 0;
    cartBar.hidden = !show;
    document.body.classList.toggle('has-cart-bar', show);
    if (!show) return;
    cartCountEl.textContent = `${count} item${count === 1 ? '' : 's'}`;
    cartBarTotalEl.textContent = fmt(cartTotal());
  }

  document.getElementById('cartBarContinue').addEventListener('click', () => {
    document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => checkoutForm.hidden ? null : checkoutForm.querySelector('input')?.focus(), 500);
  });

  /* ------------------------------------------------------------------ *
   * Scroll-to-register / sponsor CTAs
   * ------------------------------------------------------------------ */
  document.querySelectorAll('.js-scroll-register').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
    });
  });
  document.querySelectorAll('.js-scroll-sponsor').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('benefits').scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ------------------------------------------------------------------ *
   * Form validation + submit
   * ------------------------------------------------------------------ */
  function fieldError(input, message) {
    const field = input.closest('.field');
    const errorEl = field?.querySelector('.field-error');
    if (message) {
      field?.classList.add('has-error');
      if (errorEl) errorEl.textContent = message;
    } else {
      field?.classList.remove('has-error');
      if (errorEl) errorEl.textContent = '';
    }
  }

  function validateForm() {
    let valid = true;
    let firstInvalid = null;

    const required = [
      checkoutForm.fullName, checkoutForm.email, checkoutForm.phone
    ];
    if (!sponsorFields.hidden) required.push(checkoutForm.businessName, checkoutForm.contactPerson);

    required.forEach((input) => {
      if (!input) return;
      const value = input.value.trim();
      let message = '';
      if (!value) message = 'This field is required.';
      else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = 'Enter a valid email address.';
      else if (input.type === 'tel' && value.replace(/\D/g, '').length < 10) message = 'Enter a valid phone number.';

      fieldError(input, message);
      if (message) {
        valid = false;
        if (!firstInvalid) firstInvalid = input;
      }
    });

    if (firstInvalid) firstInvalid.focus();
    return valid;
  }

  ['fullName', 'email', 'phone', 'businessName', 'contactPerson'].forEach((name) => {
    checkoutForm.addEventListener('blur', (e) => {
      if (e.target.name === name) validateForm();
    }, true);
  });

  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    const lines = cartLines();
    const payload = {
      fullName: checkoutForm.fullName.value.trim(),
      email: checkoutForm.email.value.trim(),
      phone: checkoutForm.phone.value.trim(),
      teamName: checkoutForm.teamName?.value.trim() || '',
      player2: checkoutForm.player2?.value.trim() || '',
      player3: checkoutForm.player3?.value.trim() || '',
      player4: checkoutForm.player4?.value.trim() || '',
      placeOnTeam: checkoutForm.placeOnTeam?.checked || false,
      businessName: checkoutForm.businessName?.value.trim() || '',
      contactPerson: checkoutForm.contactPerson?.value.trim() || '',
      logoNote: checkoutForm.logoNote?.value.trim() || '',
      order: lines.map((l) => `${l.name} x${l.qty} = ${fmt(l.total)}`).join('\n'),
      total: fmt(cartTotal())
    };

    try {
      if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
        // Formspree endpoint not configured yet — fall back to a static confirmation
        // so the flow is still demoable. Replace FORMSPREE_ENDPOINT in js/main.js.
        console.warn('Formspree endpoint not configured. See js/main.js. Payload:', payload);
        await new Promise((r) => setTimeout(r, 400));
      } else {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Submission failed');
      }

      checkoutForm.hidden = true;
      checkoutSuccess.hidden = false;
      checkoutSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Continue';
      alert('Something went wrong submitting your order. Please try again, or email ravensonthegreen@gmail.com.');
    }
  });

  document.getElementById('resetCheckout').addEventListener('click', () => {
    Object.keys(cart).forEach((id) => delete cart[id]);
    checkoutForm.reset();
    document.querySelectorAll('.field.has-error').forEach((f) => f.classList.remove('has-error'));
    checkoutSuccess.hidden = true;
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('submitBtn').textContent = 'Continue';
    renderTiers();
    renderCheckout();
    renderCartBar();
    document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------ *
   * Benefits accordion
   * ------------------------------------------------------------------ */
  const accordionEl = document.getElementById('benefitsAccordion');
  const checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 13 4 4L19 7"/></svg>';

  function renderAccordion() {
    accordionEl.innerHTML = TIERS
      .filter((t) => t.group === 'sponsor' || t.group === 'booster')
      .map((tier) => {
        const bullets = (BENEFITS[tier.id] || []).map((b) => `<li>${checkSvg}<span>${b}</span></li>`).join('');
        return `
          <div class="accordion-item" data-tier="${tier.id}">
            <button type="button" class="accordion-trigger" aria-expanded="false">
              <span class="accordion-trigger-left">${tier.name} <span class="accordion-price">${fmt(tier.price)}</span></span>
              <svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div class="accordion-panel">
              <div class="accordion-panel-inner">
                <ul>${bullets}</ul>
              </div>
            </div>
          </div>
        `;
      }).join('');

    accordionEl.querySelectorAll('.accordion-trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const isOpen = item.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(isOpen));
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Countdown timer
   * ------------------------------------------------------------------ */
  function updateCountdown() {
    const now = new Date();
    const diff = EVENT_DATE - now;
    const els = {
      d: document.getElementById('cd-days'),
      h: document.getElementById('cd-hours'),
      m: document.getElementById('cd-minutes'),
      s: document.getElementById('cd-seconds')
    };
    if (diff <= 0) {
      els.d.textContent = els.h.textContent = els.m.textContent = els.s.textContent = '0';
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    els.d.textContent = String(days);
    els.h.textContent = String(hours).padStart(2, '0');
    els.m.textContent = String(mins).padStart(2, '0');
    els.s.textContent = String(secs).padStart(2, '0');
  }

  /* ------------------------------------------------------------------ *
   * Mobile nav toggle
   * ------------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ------------------------------------------------------------------ *
   * Init
   * ------------------------------------------------------------------ */
  renderTiers();
  renderCheckout();
  renderCartBar();
  renderAccordion();
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
