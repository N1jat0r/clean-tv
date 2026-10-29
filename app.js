'use strict';
/* Clean TV — веб-версия для браузера телевизора (VIDAA и др.).
   Настройки хранятся в самом ТВ (localStorage). Плитка открывает сайт в этом же браузере;
   кнопка Back/Назад на пульте возвращает на главный экран. */

const THEMES = [
  { name: 'Графит', c: ['#3a3b40', '#1c1c1e', '#050506'] },
  { name: 'Голубо-синяя', c: ['#5ac8fa', '#1e5bc6', '#0a1a3f'], tinted: true },
  { name: 'Зелёно-синяя', c: ['#34c77b', '#0f7c8c', '#0b2347'], tinted: true },
  { name: 'Океан', c: ['#2c5364', '#203a43', '#0f2027'], tinted: true },
  { name: 'Изумруд', c: ['#1abc9c', '#0b6e5a', '#03241d'], tinted: true },
  { name: 'Фиолетовая', c: ['#af52de', '#5b2a9e', '#150a2e'], tinted: true },
  { name: 'Фуксия', c: ['#ff6fb5', '#7a3cff', '#1a0b3d'], tinted: true },
  { name: 'Закат', c: ['#ff9f55', '#c2416b', '#2a0f2e'], tinted: true },
  { name: 'Красная', c: ['#ff5e57', '#9e1b32', '#22060c'], tinted: true },
  { name: 'Полночь', c: ['#1e2a4a', '#0d1428', '#02040a'] },
  { name: 'Песок', c: ['#d6b98c', '#8a6a45', '#2b1f14'], tinted: true },
  { name: 'Светлая', c: ['#ffffff', '#e8e8ed', '#c7c7cc'], light: true },
];

const TILE_COLORS = [
  ['#ff3b30', '#a3001b'], ['#ff9f0a', '#a33d00'], ['#30d158', '#0b5d2a'], ['#64d2ff', '#0a5bb5'],
  ['#5e5ce6', '#25217a'], ['#bf5af2', '#4b1fa8'], ['#ff375f', '#3a0010'], ['#8e8e93', '#2c2c2e'],
];

const GLYPHS = {
  play: '<path d="M8 5.5v13l11-6.5z"/>',
  note: '<path d="M9 17.5a2.5 2.5 0 1 1-2-2.45V5l12-2v11.5a2.5 2.5 0 1 1-2-2.45V6.4L9 7.8z"/>',
  film: '<path fill-rule="evenodd" d="M4 5h16v14H4zM6 7v2h2V7zm0 4v2h2v-2zm0 4v2h2v-2zm10-8v2h2V7zm0 4v2h2v-2zm0 4v2h2v-2z"/>',
  live: '<circle cx="12" cy="12" r="3.2"/><path d="M6.3 6.3a8 8 0 0 0 0 11.4l1.4-1.4a6 6 0 0 1 0-8.6zm11.4 0-1.4 1.4a6 6 0 0 1 0 8.6l1.4 1.4a8 8 0 0 0 0-11.4z"/>',
  globe: '<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm6.9 8h-3a14 14 0 0 0-1.2-5.3A7 7 0 0 1 18.9 11zM12 5.1c.9 1.2 1.7 3.3 1.9 5.9h-3.8c.2-2.6 1-4.7 1.9-5.9zM9.3 5.7A14 14 0 0 0 8.1 11h-3a7 7 0 0 1 4.2-5.3zM5.1 13h3a14 14 0 0 0 1.2 5.3A7 7 0 0 1 5.1 13zm6.9 5.9c-.9-1.2-1.7-3.3-1.9-5.9h3.8c-.2 2.6-1 4.7-1.9 5.9zm2.7-.6a14 14 0 0 0 1.2-5.3h3a7 7 0 0 1-4.2 5.3z"/>',
  search: '<path d="M10.5 4a6.5 6.5 0 0 1 5.2 10.4l4.4 4.4-1.4 1.4-4.4-4.4A6.5 6.5 0 1 1 10.5 4zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z"/>',
  star: '<path d="m12 3 2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.9 6.4 20l1.3-6.2L3 9.5l6.3-.7z"/>',
  game: '<path d="M7 7h10a5 5 0 0 1 4.8 6.4l-1 3.4a2.5 2.5 0 0 1-4.3.9L14.6 16H9.4l-1.9 1.7a2.5 2.5 0 0 1-4.3-.9l-1-3.4A5 5 0 0 1 7 7zm0 3v1.5H5.5v1.5H7v1.5h1.5V13H10v-1.5H8.5V10zm8.5.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm2 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>',
};
const ICON_SHIELD = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5zm-1.2 13.6-3.5-3.5 1.4-1.4 2.1 2.1 4.9-4.9 1.4 1.4z"/></svg>';

const F = 'font-family="Segoe UI, Arial, sans-serif" text-anchor="middle"';
const MARKS = {
  yt: '<rect x="3" y="10" width="42" height="29" rx="9" fill="#fff"/><path d="M20 17.5v14l12-7z" fill="#e50914"/>',
  ytmusic: '<circle cx="24" cy="24" r="18" fill="none" stroke="#fff" stroke-width="3.2"/><circle cx="24" cy="24" r="11" fill="#fff"/><path d="M21 19v10l8.5-5z" fill="#d1002a"/>',
  twitch: '<path d="M9 5h31v21l-8.5 8.5H25l-5.5 5.5v-5.5H9z" fill="#fff"/><path d="M21.5 13h3.4v9.5h-3.4zm9 0h3.4v9.5h-3.4z" fill="#6c2bd9"/>',
  vk: `<rect x="4" y="4" width="40" height="40" rx="12" fill="#fff"/><text x="24" y="31.5" ${F} font-size="19" font-weight="900" fill="#0a5bb5">VK</text>`,
  rutube: `<text x="24" y="28.5" ${F} font-size="10.5" font-weight="900" textLength="40" lengthAdjust="spacingAndGlyphs" fill="#fff">RUTUBE</text><rect x="12" y="32.5" width="24" height="2.6" rx="1.3" fill="#00a1e7"/>`,
  netflix: `<text x="24" y="38" ${F} font-size="38" font-weight="900" fill="#e50914">N</text>`,
  kinopoisk: '<circle cx="24" cy="24" r="18" fill="#fff"/><g stroke="#ff6a00" stroke-width="3.2" stroke-linecap="round"><path d="M24 8.5v8M24 31.5v8M8.5 24h8M31.5 24h8M13 13l5.7 5.7M29.3 29.3 35 35M35 13l-5.7 5.7M18.7 29.3 13 35"/></g><circle cx="24" cy="24" r="4.2" fill="#ff6a00"/>',
  spotify: '<circle cx="24" cy="24" r="18" fill="#000"/><g fill="none" stroke="#2ee06f" stroke-linecap="round"><path d="M14 19.5c7.2-2.4 14.4-1.9 20.6 1.6" stroke-width="3.2"/><path d="M15.4 25.4c5.6-1.7 11.3-1.3 16.4 1.3" stroke-width="2.7"/><path d="M16.8 31c4.1-1.1 8.2-.8 11.8 1" stroke-width="2.3"/></g>',
  search: '<circle cx="21" cy="21" r="11" fill="none" stroke="#fff" stroke-width="4"/><path d="m29.5 29.5 9 9" stroke="#fff" stroke-width="4.6" stroke-linecap="round"/>',
  plus: '<path d="M24 11v26M11 24h26" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
  gear: '<path fill="currentColor" fill-rule="evenodd" transform="translate(4 4) scale(1.667)" d="M10.3 2h3.4l.5 2.6a8 8 0 0 1 1.9 1.1l2.5-.9 1.7 2.9-2 1.7a8 8 0 0 1 0 2.2l2 1.7-1.7 2.9-2.5-.9a8 8 0 0 1-1.9 1.1l-.5 2.6h-3.4l-.5-2.6a8 8 0 0 1-1.9-1.1l-2.5.9-1.7-2.9 2-1.7a8 8 0 0 1 0-2.2l-2-1.7 1.7-2.9 2.5.9a8 8 0 0 1 1.9-1.1zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/>',
};

// Плитки по умолчанию. ytTv — сайт для TV-режима YouTube.
const DEFAULT_TILES = [
  { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/', ytTv: 'https://www.youtube.com/tv', c: ['#ff4d4d', '#b3000f'], g: 'yt', cat: 'Видео' },
  { id: 'ytmusic', name: 'YouTube Music', url: 'https://music.youtube.com/', c: ['#ff3366', '#7a0018'], g: 'ytmusic', cat: 'Музыка' },
  { id: 'twitch', name: 'Twitch', url: 'https://www.twitch.tv/', c: ['#a970ff', '#5b21c9'], g: 'twitch', cat: 'Прямые трансляции' },
  { id: 'vkvideo', name: 'VK Видео', url: 'https://vkvideo.ru/', c: ['#4c9bff', '#0a4fc4'], g: 'vk', cat: 'Видео' },
  { id: 'rutube', name: 'Rutube', url: 'https://rutube.ru/', c: ['#24427a', '#0b1020'], g: 'rutube', cat: 'Видео' },
  { id: 'netflix', name: 'Netflix', url: 'https://www.netflix.com/', c: ['#3d0b10', '#000000'], g: 'netflix', cat: 'Фильмы и сериалы' },
  { id: 'kinopoisk', name: 'Кинопоиск', url: 'https://hd.kinopoisk.ru/', c: ['#ff8a1f', '#c43d00'], g: 'kinopoisk', cat: 'Фильмы и сериалы' },
  { id: 'spotify', name: 'Spotify', url: 'https://open.spotify.com/', c: ['#2ee06f', '#0b6b30'], g: 'spotify', cat: 'Музыка' },
  { id: 'search', name: 'Поиск', url: 'https://duckduckgo.com/', c: ['#7d7aff', '#3634a3'], g: 'search', cat: 'Интернет' },
];

const SYS_TILES = [
  { sys: 'add', name: 'Добавить', title: 'Добавить сайт', sub: 'Любой сайт — отдельной плиткой на главном экране', g: 'plus' },
  { sys: 'settings', name: 'Настройки', title: 'Настройки', sub: 'Темы и плитки', g: 'gear' },
];

// ---------- хранилище настроек в самом телевизоре ----------

const STORE = 'cleantv-config';
const DEFAULTS = { theme: 0, ytMode: 'tv', tiles: null };

function loadConfig() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE) || '{}'); } catch {}
  const c = { ...DEFAULTS, ...saved };
  if (!Array.isArray(c.tiles)) c.tiles = DEFAULT_TILES.map(t => ({ ...t }));
  return c;
}
function saveConfig() {
  try { localStorage.setItem(STORE, JSON.stringify(cfg)); } catch {}
}

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const svg = g => `<svg viewBox="0 0 24 24" fill="currentColor">${GLYPHS[g] || GLYPHS.play}</svg>`;
const hostOf = url => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; } };

let cfg = loadConfig();
let lastKey = null;
const modalStack = [];

// ---------- тема ----------

function applyTheme() {
  const t = THEMES[cfg.theme] || THEMES[0];
  const root = document.documentElement;
  t.c.forEach((c, i) => root.style.setProperty(`--bg${i + 1}`, c));
  root.classList.toggle('light', !!t.light);
  root.classList.toggle('tinted', !!t.tinted);
}

// ---------- главный экран ----------

function tileById(id) { return cfg.tiles.find(t => t.id === id); }

function cardInner(t) {
  if (MARKS[t.g]) return `<div class="mark"><svg viewBox="0 0 48 48">${MARKS[t.g]}</svg></div>`;
  return `<div class="logo">${svg(t.g)}<span>${esc(t.name)}</span></div>`;
}

function renderGrid() {
  const grid = $('#grid');
  grid.innerHTML = cfg.tiles.map(t => `
    <div class="tile focusable" tabindex="0" data-key="${esc(t.id)}" data-id="${esc(t.id)}">
      <div class="card" style="--c1:${esc(t.c[0])};--c2:${esc(t.c[1])}">
        ${cardInner(t)}
        <div class="shine"></div>
      </div>
      <div class="label">${esc(t.name)}</div>
    </div>`).join('') + SYS_TILES.map(s => `
    <div class="tile sys focusable" tabindex="0" data-key="sys-${s.sys}" data-sys="${s.sys}">
      <div class="card">${cardInner(s)}<div class="shine"></div></div>
      <div class="label">${s.name}</div>
    </div>`).join('');

  for (const el of grid.querySelectorAll('.tile')) {
    const t = el.dataset.id && tileById(el.dataset.id);
    const s = el.dataset.sys && SYS_TILES.find(x => x.sys === el.dataset.sys);
    el.addEventListener('click', () => {
      if (t) return launch(el, t);
      if (s.sys === 'add') openEditor(null); else openSettings();
    });
    el.addEventListener('focus', () => { lastKey = el.dataset.key; showHero(t, s); });
    el.addEventListener('mouseenter', () => el.focus());
    el.addEventListener('contextmenu', e => { e.preventDefault(); if (t) openMenu(t); });
    el.addEventListener('mousemove', e => tilt(el, e));
    el.addEventListener('mouseleave', () => tilt(el, null));
  }
}

function tilt(el, e) {
  const card = el.querySelector('.card');
  if (!e) { card.style.removeProperty('--rx'); card.style.removeProperty('--ry'); return; }
  const r = card.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  card.style.setProperty('--ry', `${(x - .5) * 10}deg`);
  card.style.setProperty('--rx', `${(.5 - y) * 8}deg`);
  card.style.setProperty('--sx', `${x * 100}%`);
  card.style.setProperty('--sy', `${y * 100}%`);
}

function showHero(t, s) {
  const root = document.documentElement.style;
  const box = $('.hero-text'), art = $('#hero-art');
  for (const el of [box, art]) {
    el.classList.remove('swap');
    void el.offsetWidth;
    el.classList.add('swap');
  }
  const it = t || s;
  art.classList.toggle('sys', !t);
  art.style.setProperty('--c1', t ? t.c[0] : '');
  art.style.setProperty('--c2', t ? t.c[1] : '');
  art.innerHTML = cardInner(it);
  if (t) {
    $('#hero-cat').textContent = t.cat || 'Сайт';
    $('#hero-title').textContent = t.name;
    $('#hero-sub').textContent = hostOf(t.url);
    root.setProperty('--hc', t.c[0]);
  } else {
    $('#hero-cat').textContent = 'Clean TV';
    $('#hero-title').textContent = s.title;
    $('#hero-sub').textContent = s.sub;
    root.setProperty('--hc', 'transparent');
  }
}

function serviceUrl(t) {
  return t.id === 'youtube' && cfg.ytMode === 'tv' && t.ytTv ? t.ytTv : t.url;
}

function launch(el, t) {
  el.classList.add('press');
  // Переход на сайт в этом же окне браузера ТВ; назад — кнопка Back на пульте
  setTimeout(() => { location.href = serviceUrl(t); }, 160);
}

function focusHome() {
  const el = (lastKey && document.querySelector(`#grid [data-key="${cssEsc(lastKey)}"]`)) || document.querySelector('#grid .tile');
  if (el) { el.focus(); scrollToTile(el); }
}

function cssEsc(s) { return (window.CSS && CSS.escape) ? CSS.escape(s) : String(s).replace(/[^\w-]/g, '\\$&'); }

function scrollToTile(tile) {
  const home = $('#home');
  const rem = innerWidth / 120;
  const r = tile.getBoundingClientRect();
  const firstRow = Math.abs(r.top - $('#grid .tile').getBoundingClientRect().top) < 5;
  let target = home.scrollTop;
  if (firstRow) target = 0;
  else if (r.bottom > innerHeight - 6 * rem || r.top < 6 * rem) {
    const hero = $('.hero');
    target = Math.min(hero.offsetTop + hero.offsetHeight - 5.5 * rem, home.scrollHeight - innerHeight);
  }
  document.body.classList.toggle('scrolled', target > 0);
  home.scrollTo({ top: target });
}

function updateChip() {
  const chip = $('#adchip');
  chip.innerHTML = ICON_SHIELD;
  chip.title = 'Clean TV';
}

function tick() {
  let s;
  try { s = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }); }
  catch { const d = new Date(); s = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  $('#time').textContent = s;
}

function toast(text, ms) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), ms || 5000);
}

function save(patch) {
  Object.assign(cfg, patch);
  saveConfig();
}

// ---------- окна ----------

function openModal(id) {
  const el = document.getElementById(id);
  modalStack.push({ el, returnFocus: document.activeElement });
  el.classList.add('open');
}
function closeModal() {
  const m = modalStack.pop();
  if (!m) return;
  m.el.classList.remove('open');
  if (m.returnFocus && document.contains(m.returnFocus)) m.returnFocus.focus();
  else focusHome();
}
function closeAllModals() {
  modalStack.length = 0;
  const open = document.querySelectorAll('.modal.open');
  for (const m of open) m.classList.remove('open');
}
function scope() { return modalStack.length ? modalStack[modalStack.length - 1].el : $('#home'); }
function focusIn(el, key) {
  const target = (key && el.querySelector(`[data-key="${cssEsc(key)}"]`)) || el.querySelector('.focusable');
  if (target) target.focus();
}

// ---------- меню плитки ----------

function openMenu(t) {
  const i = cfg.tiles.indexOf(t);
  const items = [
    ['Открыть', () => { closeModal(); location.href = serviceUrl(t); }],
    i > 0 && ['Переместить влево', () => move(t, -1)],
    i < cfg.tiles.length - 1 && ['Переместить вправо', () => move(t, 1)],
    ['Изменить', () => { closeModal(); openEditor(t); }],
    ['Удалить', () => remove(t), 'danger'],
    ['Отмена', closeModal],
  ].filter(Boolean);
  const sheet = $('#menu .sheet');
  sheet.innerHTML = `<h3>${esc(t.name)}</h3>` +
    items.map((it, n) => `<button class="pill wide focusable ${it[2] || ''}" data-n="${n}">${it[0]}</button>`).join('');
  sheet.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => items[+b.dataset.n][1]());
    b.addEventListener('mouseenter', () => b.focus());
  });
  openModal('menu');
  focusIn(sheet);
}

function move(t, dir) {
  const i = cfg.tiles.indexOf(t);
  const tiles = cfg.tiles.slice();
  const tmp = tiles[i]; tiles[i] = tiles[i + dir]; tiles[i + dir] = tmp;
  save({ tiles });
  closeAllModals();
  lastKey = t.id;
  renderGrid();
  focusHome();
}

function remove(t) {
  save({ tiles: cfg.tiles.filter(x => x.id !== t.id) });
  closeAllModals();
  lastKey = null;
  renderGrid();
  focusHome();
}

// ---------- добавление / изменение плитки ----------

function openEditor(t) {
  const draft = t ? { ...t } : { name: '', url: '', c: TILE_COLORS[3], g: 'play' };
  if (!GLYPHS[draft.g]) draft.g = 'play';
  const sheet = $('#editor .sheet');
  const render = focusKey => {
    sheet.innerHTML = `
      <h3>${t ? 'Изменить плитку' : 'Новая плитка'}</h3>
      <label class="field"><span>Название</span><input class="focusable" data-key="name" maxlength="28" value="${esc(draft.name)}"></label>
      <label class="field"><span>Адрес сайта</span><input class="focusable" data-key="url" placeholder="например, kinopub.me" value="${esc(draft.url)}"></label>
      <div class="field"><span>Цвет</span><div class="row">${TILE_COLORS.map((c, i) =>
        `<div class="dot focusable${c[0] === draft.c[0] ? ' sel' : ''}" tabindex="0" data-key="c${i}" data-c="${i}" style="background:linear-gradient(135deg,${c[0]},${c[1]})"></div>`).join('')}</div></div>
      <div class="field"><span>Значок</span><div class="row">${Object.keys(GLYPHS).map(g =>
        `<div class="glyph focusable${g === draft.g ? ' sel' : ''}" tabindex="0" data-key="g-${g}" data-g="${g}">${svg(g)}</div>`).join('')}</div></div>
      <div class="err" id="ed-err"></div>
      <div class="row"><button class="pill focusable" data-key="save">Сохранить</button><button class="pill focusable" data-key="cancel">Отмена</button></div>`;
    const name = sheet.querySelector('[data-key=name]'), url = sheet.querySelector('[data-key=url]');
    name.addEventListener('input', () => { draft.name = name.value; });
    url.addEventListener('input', () => { draft.url = url.value; });
    sheet.querySelectorAll('[data-c]').forEach(el => el.addEventListener('click', () => { draft.c = TILE_COLORS[+el.dataset.c]; render(el.dataset.key); }));
    sheet.querySelectorAll('[data-g]').forEach(el => el.addEventListener('click', () => { draft.g = el.dataset.g; render(el.dataset.key); }));
    sheet.querySelector('[data-key=cancel]').addEventListener('click', closeModal);
    sheet.querySelector('[data-key=save]').addEventListener('click', commit);
    sheet.querySelectorAll('.focusable').forEach(el => el.addEventListener('mouseenter', () => { if (el.tagName !== 'INPUT') el.focus(); }));
    focusIn(sheet, focusKey);
  };
  const commit = () => {
    let url = draft.url.trim();
    if (url && !/^https?:\/\//i.test(url)) url = 'https://' + url;
    try { new URL(url); } catch (e) { $('#ed-err').textContent = 'Введите адрес сайта, например youtube.com'; return; }
    const tile = { ...draft, url, name: draft.name.trim() || hostOf(url) };
    if (!t) tile.id = 'c' + Date.now().toString(36);
    const tiles = t ? cfg.tiles.map(x => (x.id === t.id ? tile : x)) : cfg.tiles.concat([tile]);
    save({ tiles });
    closeAllModals();
    lastKey = tile.id;
    renderGrid();
    focusHome();
  };
  openModal('editor');
  render('name');
}

// ---------- настройки ----------

function openSettings() {
  if (!modalStack.some(m => m.el.id === 'settings')) openModal('settings');
  renderSettings(`theme-${cfg.theme}`);
}

function renderSettings(focusKey) {
  const item = (key, act, label, value, note, cls) =>
    `<div class="item focusable ${cls == null ? 'cycle' : cls}" tabindex="0" data-key="${key}" data-act="${act}" data-note="${esc(note)}"><span>${label}</span><em>${value}</em></div>`;
  const sheet = $('#settings .sheet');
  sheet.innerHTML = `<div class="settings-wrap">
    <h1>Настройки</h1>
    <h2>Тема</h2>
    <div class="themes">${THEMES.map((t, i) => `
      <div class="swatch focusable${i === cfg.theme ? ' sel' : ''}" tabindex="0" data-key="theme-${i}" data-act="theme" data-v="${i}"
        data-note="Тема «${t.name}». Нажмите OK, чтобы применить."
        style="background:linear-gradient(135deg,${t.c[0]},${t.c[1]} 55%,${t.c[2]});color:${t.light ? '#1d1d1f' : '#fff'}">
        ${t.name}${i === cfg.theme ? '<b>✓</b>' : ''}
      </div>`).join('')}</div>

    <h2>Основные</h2>
    <div class="list">
      ${item('yt', 'yt', 'YouTube', cfg.ytMode === 'tv' ? 'TV-интерфейс' : 'Обычный сайт',
        'TV-интерфейс (youtube.com/tv) удобен с пультом. Если он не открывается на этом телевизоре, выберите «Обычный сайт». Вход: на телефоне откройте youtube.com/activate.')}
    </div>

    <h2>Прочее</h2>
    <div class="list">
      ${item('reset', 'reset', 'Вернуть плитки по умолчанию', '', 'Ваши добавленные сайты будут удалены.', '')}
    </div>
    <p class="caption" id="caption"></p>
  </div>`;

  sheet.querySelectorAll('[data-act]').forEach(el => {
    el.addEventListener('mouseenter', () => el.focus());
    el.addEventListener('focus', () => { $('#caption').textContent = el.dataset.note || ''; });
    el.addEventListener('click', () => settingsAction(el.dataset.act, el.dataset.v, el.dataset.key));
  });
  focusIn(sheet, focusKey);
}

function settingsAction(act, v, key) {
  switch (act) {
    case 'theme': save({ theme: +v }); applyTheme(); break;
    case 'yt': save({ ytMode: cfg.ytMode === 'tv' ? 'web' : 'tv' }); break;
    case 'reset': save({ tiles: DEFAULT_TILES.map(t => ({ ...t })) }); lastKey = null; renderGrid(); break;
  }
  renderSettings(key);
}

// ---------- навигация пультом ----------

function visible(el) {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
}

function navigate(dir) {
  const items = [].slice.call(scope().querySelectorAll('.focusable')).filter(visible);
  const cur = document.activeElement;
  if (items.indexOf(cur) < 0) { if (items[0]) items[0].focus(); return; }
  const a = cur.getBoundingClientRect();
  const ax = a.left + a.width / 2, ay = a.top + a.height / 2;
  let best = null, bestScore = Infinity;
  for (const el of items) {
    if (el === cur) continue;
    const b = el.getBoundingClientRect();
    const dx = b.left + b.width / 2 - ax, dy = b.top + b.height / 2 - ay;
    let main, cross;
    if (dir === 'left') { main = -dx; cross = Math.abs(dy); }
    else if (dir === 'right') { main = dx; cross = Math.abs(dy); }
    else if (dir === 'up') { main = -dy; cross = Math.abs(dx); }
    else { main = dy; cross = Math.abs(dx); }
    if (main <= 1) continue;
    const score = main + cross * 2.5;
    if (score < bestScore) { bestScore = score; best = el; }
  }
  if (!best) return;
  best.focus();
  if (scope() === $('#home')) scrollToTile(best.closest('.tile') || best);
  else if (best.scrollIntoView) best.scrollIntoView({ block: 'nearest' });
}

// Коды клавиш пультов VIDAA/ТВ: стрелки 37-40, OK 13, Back 8/461/10009, Exit 27
const DIR = { 37: 'left', 38: 'up', 39: 'right', 40: 'down' };
const BACK = { 8: 1, 27: 1, 461: 1, 10009: 1 };
let enterAt = 0, menuFired = false;

function handleKey(e) {
  const code = e.keyCode || 0;
  const a = document.activeElement;
  const typing = a && a.tagName === 'INPUT';
  const dir = DIR[code] || ({ ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' })[e.key];
  if (dir) {
    if (typing && (dir === 'left' || dir === 'right')) return;
    e.preventDefault(); navigate(dir); return;
  }
  if (code === 13 || e.key === 'Enter') {
    e.preventDefault();
    if (typing) { navigate('down'); return; }
    if (!e.repeat) { enterAt = Date.now(); menuFired = false; }
    else if (!menuFired && Date.now() - enterAt > 650 && a && a.dataset.id) { menuFired = true; openMenu(tileById(a.dataset.id)); }
    return;
  }
  if (BACK[code] || e.key === 'Escape' || (e.key === 'Backspace' && !typing)) {
    if (modalStack.length) { e.preventDefault(); closeModal(); }
    // иначе — выход из Clean TV в меню телевизора (не мешаем пульту)
    return;
  }
  if (!typing && (e.key === 'm' || e.key === 'M' || e.key === 'ь' || e.key === 'Ь' || code === 93) && a && a.dataset.id) {
    e.preventDefault(); openMenu(tileById(a.dataset.id));
  }
}

document.addEventListener('keydown', handleKey);
document.addEventListener('keyup', e => {
  if ((e.keyCode || 0) !== 13 && e.key !== 'Enter') return;
  const a = document.activeElement;
  if (!menuFired && a && a.tagName !== 'INPUT' && enterAt) a.click();
  menuFired = false; enterAt = 0;
});

// геймпад (если подключён)
const PAD = { 12: 'up', 13: 'down', 14: 'left', 15: 'right' };
const padHeld = {};
function pollPads() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  const now = performance.now();
  for (const p of pads) {
    if (!p) continue;
    const pressed = {};
    for (const b in PAD) if (p.buttons[b] && p.buttons[b].pressed) pressed[PAD[b]] = 1;
    if (p.buttons[0] && p.buttons[0].pressed) pressed.ok = 1;
    if (p.buttons[1] && p.buttons[1].pressed) pressed.back = 1;
    if (p.axes[0] < -.6) pressed.left = 1; if (p.axes[0] > .6) pressed.right = 1;
    if (p.axes[1] < -.6) pressed.up = 1; if (p.axes[1] > .6) pressed.down = 1;
    for (const k of ['up', 'down', 'left', 'right', 'ok', 'back']) {
      const id = p.index + k;
      if (!pressed[k]) { delete padHeld[id]; continue; }
      const h = padHeld[id];
      if (!h) {
        padHeld[id] = { next: now + 420 };
        if (k === 'ok') { const a = document.activeElement; if (a) a.click(); }
        else if (k === 'back') { if (modalStack.length) closeModal(); }
        else navigate(k);
      } else if ((k === 'up' || k === 'down' || k === 'left' || k === 'right') && now >= h.next) { h.next = now + 110; navigate(k); }
    }
  }
  requestAnimationFrame(pollPads);
}

// ---------- старт ----------

function init() {
  applyTheme();
  renderGrid();
  updateChip();
  tick();
  setInterval(tick, 5000);
  focusHome();
  if (navigator.getGamepads) requestAnimationFrame(pollPads);
  let seen = false;
  try { seen = localStorage.getItem('hints-seen') === '1'; localStorage.setItem('hints-seen', '1'); } catch {}
  if (!seen) toast('Стрелки — выбор · OK — открыть · удерживайте OK — меню плитки · Назад — вернуться', 7000);
}

init();
