/* CARE – shared logic (vanilla JS + localStorage) */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ROOT = document.body.dataset.root || '';
const PAGE = document.body.dataset.page;
const L = p => p === 'home' ? ROOT + 'index.html' : (ROOT ? '' : 'pages/') + p + '.html';
const img = id => {
  const images = {
    'walk': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop',
    'grocery': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
    'cook': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop',
    'doctor': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
    'house': '/assets/images/household.jpg',
    'company': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
    'childcare': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop',
    'hero': 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&h=500&fit=crop',
    'g-walk': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop',
    'g-yoga': '/assets/images/group-of-people-with-arms-raised-in-yoga-position.webp',
    'g-chess': 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&h=300&fit=crop',
    'g-music': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop',
    'e-diwali': '/assets/images/diwili.jpg',
    'e-music': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
    'e-art': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=300&fit=crop',
    'e-yoga': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop',
    'event-placeholder': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop'
  };
  return images[id] || images['event-placeholder'];
};
const money = n => '₹' + n.toLocaleString('en-IN');
const svc = id => SERVICES.find(s => s.id === id);
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } }
};

/* ---------- Toast ---------- */
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('show'), 3500);
}

/* ---------- Shared header / footer ---------- */
const NAV = [['home', 'Home'], ['services', 'Services'], ['community', 'Community'], ['events', 'Events'], ['bookings', 'My Bookings'], ['about', 'About Us'], ['contact', 'Contact Us']];
function renderChrome() {
  const links = NAV.map(([k, n]) => `<a href="${L(k)}" class="${PAGE === k ? 'active' : ''}" ${PAGE === k ? 'aria-current="page"' : ''}>${n}</a>`).join('');
  document.body.insertAdjacentHTML('afterbegin', `
    <a class="skip" href="#main">Skip to main content</a>
    <header class="site-header"><div class="wrap bar">
      <a class="logo" href="${L('home')}" aria-label="CARE home">💙 CARE<small>Because We Care</small></a>
      <button class="btn alt small menu-btn" id="menuBtn" aria-expanded="false" aria-controls="nav">☰ Menu</button>
      <nav id="nav" aria-label="Main navigation">${links}
        <a class="cart-link ${PAGE === 'cart' ? 'active' : ''}" href="${L('cart')}" aria-label="Cart">🛒 Cart <span class="badge" id="cartCount" aria-live="polite">0</span></a>
      </nav></div></header>`);
  document.body.insertAdjacentHTML('beforeend', `
    <footer class="site-footer"><div class="wrap foot-grid">
      <div><h3>💙 CARE – Because We Care</h3><p>Neighbourhood help and community for elderly people.</p></div>
      <div><h3>Contact Us</h3><p>Phone: ${CONTACT.phone}<br>Email: ${CONTACT.email}</p></div>
      <div><h3>Please note</h3><p>CARE is not an emergency service. In an emergency, call <strong>112</strong>.</p></div>
    </div></footer>
    <a class="btn call-fab" href="tel:${CONTACT.tel}" aria-label="Call CARE">📞 Call CARE</a>
    <div id="toast" role="status" aria-live="polite"></div>`);
  $('#menuBtn').addEventListener('click', e => {
    const open = $('#nav').classList.toggle('open');
    e.currentTarget.setAttribute('aria-expanded', open);
  });
}

/* ---------- Cart ---------- */
const getCart = () => store.get('care_cart', []).map(i => ({ ...i, hrs: i.hrs || 1 }));
const hrsLabel = h => `${h} hour${h > 1 ? 's' : ''}`;
const lineTotal = i => svc(i.id).price * i.hrs * i.qty;
function updateBadge() {
  const n = getCart().reduce((a, i) => a + i.qty, 0);
  const b = $('#cartCount');
  if (b) b.textContent = n;
}
function setCart(c) { store.set('care_cart', c); updateBadge(); if (PAGE === 'cart') renderCart(); }
function addToCart(id) {
  const sel = $('#h-' + id), hrs = sel ? +sel.value : getMinHours(id);
  const c = getCart(), item = c.find(x => x.id === id && x.hrs === hrs);
  item ? item.qty++ : c.push({ id, hrs, qty: 1 });
  setCart(c);
  toast(`✔ ${svc(id).name} (${hrsLabel(hrs)}) added to your cart`);
}
function changeQty(i, d) {
  const c = getCart();
  if (!c[i]) return;
  c[i].qty = Math.min(10, Math.max(1, c[i].qty + d));
  setCart(c);
}
function changeHrs(i, h) {
  const merged = [];
  getCart().map((x, k) => k === i ? { ...x, hrs: h } : x).forEach(x => {
    const f = merged.find(y => y.id === x.id && y.hrs === x.hrs);
    f ? f.qty = Math.min(10, f.qty + x.qty) : merged.push(x);
  });
  setCart(merged);
}
function removeItem(i) {
  const c = getCart(), [r] = c.splice(i, 1);
  setCart(c);
  toast(`${svc(r.id).name} removed from your cart`);
}
const getMinHours = (serviceId) => {
  const service = SERVICES.find(s => s.id === serviceId);
  return service && service.category === 'childcare' ? 3 : 2;
};

const hourOptions = (sel, serviceId) => {
  const min = getMinHours(serviceId);
  return Array.from({ length: HOURS_RANGE.max - min + 1 }, (_, k) => min + k)
    .map(h => `<option value="${h}" ${h === sel ? 'selected' : ''}>${hrsLabel(h)}</option>`).join('');
};

function renderCart() {
  const box = $('#cartBox'), c = getCart();
  if (!c.length) {
    box.innerHTML = `<div class="panel center"><h2>Your cart is empty</h2><p>Choose a service to get started.</p><a class="btn" href="${L('services')}">Browse Services</a></div>`;
    return;
  }
  const rows = c.map((i, k) => {
    const s = svc(i.id);
    return `<div class="row"><img src="${img(s.id)}" alt="">
      <div><h3>${s.name}</h3><p>${money(s.price)} per hour</p>
        <label for="ch-${k}">Hours per session</label>
        <select id="ch-${k}" data-hrs="${k}">${hourOptions(i.hrs, s.id)}</select></div>
      <div class="qty" role="group" aria-label="Number of sessions for ${s.name}">
        <button class="rb" data-qty="${k}" data-d="-1" aria-label="Fewer sessions of ${s.name}" ${i.qty <= 1 ? 'disabled' : ''}>−</button>
        <output aria-live="polite" title="Sessions">${i.qty}</output>
        <button class="rb" data-qty="${k}" data-d="1" aria-label="More sessions of ${s.name}">+</button>
      </div>
      <strong class="line">${money(lineTotal(i))}<br><small>${i.hrs} hr × ${i.qty}</small></strong>
      <button class="btn danger small" data-remove="${k}" aria-label="Remove ${s.name}">🗑 Remove</button></div>`;
  }).join('');
  const qty = c.reduce((a, i) => a + i.qty, 0);
  const hrs = c.reduce((a, i) => a + i.qty * i.hrs, 0);
  const sub = c.reduce((a, i) => a + lineTotal(i), 0);
  box.innerHTML = `<div class="cart-layout"><div>${rows}</div>
    <aside class="panel summary" aria-label="Order summary"><h2>Order Summary</h2>
      <dl><div><dt>Subtotal</dt><dd>${money(sub)}</dd></div>
      <div><dt>Total quantity</dt><dd>${qty} session${qty > 1 ? 's' : ''}</dd></div>
      <div><dt>Total hours</dt><dd>${hrs} hr${hrs > 1 ? 's' : ''}</dd></div>
      <div class="total"><dt>Estimated total</dt><dd>${money(sub)}</dd></div></dl>
      <p class="meta">Pay after service. No online payment required.</p>
      <button class="btn" id="proceed">Proceed to Book</button></aside></div>`;
}

/* ---------- Bookings ---------- */
function getBookings() {
  let b = store.get('care_bookings', null);
  if (!b) { b = SEED_BOOKINGS; store.set('care_bookings', b); }
  return b;
}

/* ---------- Events ---------- */
function getEvents() {
  let e = store.get('care_events_data', null);
  if (!e) { e = EVENTS; store.set('care_events_data', e); }
  return e;
}

function openAddEventDialog() {
  const dlg = $('#addEventDlg');
  const tomorrow = new Date(Date.now() + 864e5);
  const d = $('#evDate');
  d.min = isoDate(new Date());
  d.value = isoDate(tomorrow);
  dlg.showModal();
}

function addNewEvent(e) {
  e.preventDefault();
  const all = getEvents();
  const id = 'e-' + Date.now();
  const name = $('#evName').value;
  const dateVal = $('#evDate').value;
  const date = new Date(dateVal + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const venue = $('#evVenue').value;
  const desc = $('#evDesc').value;
  
  all.push({ id, name, date, venue, desc });
  store.set('care_events_data', all);
  
  $('#addEventDlg').close();
  $('#addEventForm').reset();
  renderLists();
  toast(`🎉 New event "${name}" added successfully!`);
}
const fmtDate = v => new Date(v + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
const fmtTime = v => { const [h, m] = v.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
const isoDate = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

function openBookDialog() {
  const dlg = $('#bookDlg'), tomorrow = new Date(Date.now() + 864e5);
  const d = $('#bkDate');
  d.min = isoDate(new Date()); d.value = isoDate(tomorrow);
  const c = getCart();
  $('#bkSummary').innerHTML = c.map(i => `<li>${svc(i.id).name} – ${hrsLabel(i.hrs)} × ${i.qty} session${i.qty > 1 ? 's' : ''}</li>`).join('') + `<li><strong>Estimated total: ${money(c.reduce((a, i) => a + lineTotal(i), 0))}</strong></li>`;
  dlg.showModal();
}
function confirmBooking(e) {
  e.preventDefault();
  const date = fmtDate($('#bkDate').value), time = fmtTime($('#bkTime').value);
  const all = getBookings();
  let n = Math.max(...all.map(b => parseInt(b.id.split('-')[1], 10)), 1000);
  getCart().forEach((i, idx) => {
    n++;
    all.push({ id: 'CARE-' + n, service: `${svc(i.id).name} (${hrsLabel(i.hrs)}${i.qty > 1 ? `, ${i.qty} sessions` : ''})`, date, time, fellow: FELLOWS[(n + idx) % FELLOWS.length], status: 'Confirmed' });
  });
  store.set('care_bookings', all);
  $('#bookDlg').close();
  setCart([]);
  $('#cartBox').innerHTML = `<div class="panel center"><h2>🎉 Booking confirmed!</h2><p class="notice success">Your services are booked for ${date} at ${time}. A CARE Fellow will be assigned to help you.</p><a class="btn" href="${L('bookings')}">View My Bookings</a></div>`;
  toast('✔ Booking confirmed');
}

function renderBookings() {
  const all = getBookings(), plan = PLANS.find(p => p.id === store.get('care_plan', null));
  $('#planBox').innerHTML = plan
    ? `<p class="notice success">💙 Your plan: <strong>${plan.name}</strong> – ${plan.hrs} check-in${plan.hrs > 1 ? 's' : ''} per month (${money(plan.price)}/month)</p>`
    : `<p class="notice">You have no subscription yet. <a href="${L('services')}#plans">See our monthly check-in plans</a>.</p>`;
  const groups = [['upcomingList', ['Confirmed', 'Upcoming'], 'No upcoming bookings.'], ['completedList', ['Completed'], 'No completed bookings yet.'], ['cancelledList', ['Cancelled'], 'No cancelled bookings.']];
  groups.forEach(([id, sts, msg]) => {
    const list = all.filter(b => sts.includes(b.status));
    $('#' + id).innerHTML = list.length ? list.map(b => `
      <article class="card"><div class="body">
        <span class="status st-${b.status.toLowerCase()}">${b.status}</span>
        <h3>${b.service}</h3>
        <p><strong>Booking ID:</strong> ${b.id}</p>
        <p><strong>Date:</strong> ${b.date}</p>
        <p><strong>Time:</strong> ${b.time}</p>
        <p><strong>CARE Fellow:</strong> ${b.fellow}</p>
        ${sts.includes('Upcoming') ? `<button class="btn danger small" data-cancel="${b.id}">Cancel Booking</button>` : ''}
      </div></article>`).join('') : `<p class="empty">${msg}</p>`;
  });
}

/* ---------- Card templates ---------- */
const serviceCard = s => {
  const min = getMinHours(s.id);
  return `<article class="card"><img src="${img(s.id)}" alt="Illustration for ${s.name}"><div class="body">
  <h3>${s.name}</h3><p>${s.desc}</p><p class="price">${money(s.price)}<span>/hour</span></p>
  <label for="h-${s.id}">How many hours? (${min}–${HOURS_RANGE.max} hrs, minimum ${min} hrs)</label>
  <select id="h-${s.id}">${hourOptions(min, s.id)}</select>
  <button class="btn" data-add="${s.id}">➕ Add to Cart</button></div></article>`;
};

function planCard(p) {
  const on = store.get('care_plan', null) === p.id;
  return `<article class="card plan ${p.id === 'platinum' ? 'best' : ''}"><div class="body">
    <h3>${p.name}</h3><p class="price">${money(p.price)}<span>/month</span></p>
    <p class="big">${p.hrs} check-in${p.hrs > 1 ? 's' : ''} <span>per month</span></p>
    <p class="meta">Scheduled elderly check-ins + family updates</p>
    <ul>${p.perks.map(x => `<li>${x}</li>`).join('')}</ul>
    <button class="btn ${on ? 'done' : ''}" data-sub="${p.id}" ${on ? 'disabled' : ''}>${on ? '✔ Subscribed' : 'Subscribe to ' + p.name}</button></div></article>`;
}
function groupCard(g) {
  const joined = store.get('care_groups', []).includes(g.id);
  return `<article class="card"><img src="${img(g.id)}" alt="Illustration for ${g.name}"><div class="body">
    <h3>${g.name}</h3><p>${g.desc}</p>
    <p class="meta">📍 ${g.area} &nbsp; 🕐 ${g.time}</p><p class="meta">👥 ${g.members + (joined ? 1 : 0)} members</p>
    <button class="btn ${joined ? 'done' : ''}" data-group="${g.id}" ${joined ? 'disabled' : ''}>${joined ? '✔ Joined' : 'Join Community'}</button></div></article>`;
}
function eventCard(ev) {
  const reg = store.get('care_events', []).includes(ev.id);
  const isDefault = EVENTS.find(e => e.id === ev.id);
  const imgSrc = isDefault ? img(ev.id) : `${ROOT}assets/images/event-placeholder.svg`;
  return `<article class="card"><img src="${imgSrc}" alt="Illustration for ${ev.name}"><div class="body">
    <h3>${ev.name}</h3><p>${ev.desc}</p>
    <p class="meta">📅 ${ev.date}</p><p class="meta">📍 ${ev.venue}</p>
    <button class="btn ${reg ? 'done' : ''}" data-event="${ev.id}" ${reg ? 'disabled' : ''}>${reg ? '✔ Registered' : 'Join Event'}</button></div></article>`;
}
const fill = (sel, items, fn) => { const el = $(sel); if (el) el.innerHTML = items.map(fn).join(''); };
function renderLists() {
  fill('#serviceGrid', SERVICES, serviceCard);
  fill('#featuredGrid', SERVICES.slice(0, 3), serviceCard);
  fill('#planGrid', PLANS, planCard);
  fill('#groupGrid', GROUPS, groupCard);
  fill('#eventGrid', getEvents(), eventCard);
  fill('#homeEvents', getEvents().slice(0, 3), eventCard);
  fill('#hubList', HUBS, h => `<li><strong>${h.area}:</strong> ${h.address}</li>`);
}

/* ---------- Global click handling ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-add],[data-qty],[data-remove],[data-group],[data-event],[data-cancel],[data-sub],#proceed,#dlgBack,#addEventBtn,#dlgCancel');
  if (!t) return;
  if (t.dataset.add) addToCart(t.dataset.add);
  else if (t.dataset.qty) changeQty(t.dataset.qty, +t.dataset.d);
  else if (t.dataset.remove) removeItem(t.dataset.remove);
  else if (t.dataset.group) {
    const g = GROUPS.find(x => x.id === t.dataset.group), j = store.get('care_groups', []);
    j.push(g.id); store.set('care_groups', j); renderLists();
    toast(`🎉 You joined ${g.name}!`);
  } else if (t.dataset.event) {
    const ev = getEvents().find(x => x.id === t.dataset.event);
    if (ev) {
      const r = store.get('care_events', []);
      r.push(ev.id); store.set('care_events', r); renderLists();
      toast(`✔ Registered for ${ev.name} on ${ev.date} at ${ev.venue}`);
    }
  } else if (t.dataset.sub) {
    const p = PLANS.find(x => x.id === t.dataset.sub);
    store.set('care_plan', p.id); renderLists();
    toast(`🎉 Subscribed to ${p.name}: ${p.hrs} check-in${p.hrs > 1 ? 's' : ''} per month`);
  } else if (t.dataset.cancel) {
    const all = getBookings(), b = all.find(x => x.id === t.dataset.cancel);
    if (b && confirm(`Cancel booking ${b.id} (${b.service})?`)) { b.status = 'Cancelled'; store.set('care_bookings', all); renderBookings(); toast('Booking cancelled'); }
  } else if (t.id === 'proceed') openBookDialog();
  else if (t.id === 'dlgBack') $('#bookDlg').close();
  else if (t.id === 'addEventBtn') openAddEventDialog();
  else if (t.id === 'dlgCancel') $('#addEventDlg').close();
});
document.addEventListener('change', e => { if (e.target.dataset.hrs !== undefined) changeHrs(+e.target.dataset.hrs, +e.target.value); });
window.addEventListener('storage', () => { updateBadge(); if (PAGE === 'cart') renderCart(); });

/* ---------- Init ---------- */
renderChrome();
updateBadge();
renderLists();
if (PAGE === 'cart') { renderCart(); $('#bookForm').addEventListener('submit', confirmBooking); }
if (PAGE === 'bookings') renderBookings();
if (PAGE === 'events') $('#addEventForm').addEventListener('submit', addNewEvent);
if (PAGE === 'contact') {
  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const msg = $('#formMsg');
    msg.hidden = false;
    msg.textContent = `✔ Thank you, ${$('#cName').value}! Your message has been sent. Our CARE team will reply soon.`;
    e.target.reset();
    msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
