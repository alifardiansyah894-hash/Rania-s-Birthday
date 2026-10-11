/* =========================================================
   THE MOST SPECIAL BIRTHDAY GIFT FOR RANIA
   Gabungan Phase 1 - 5B
   Edit teks di bagian "DATA" (chapters, memories, precious,
   songs, letters, questions) supaya gampang.
   ========================================================= */

/* ---------- 1. SKY: bintang & hati di Canvas ---------- */
const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');
let W = 0, H = 0;
const DPR = Math.min(window.devicePixelRatio || 1, 2);

const STAR_COUNT = 70;    // jumlah bintang (turunkan kalau terlalu ramai)
const HEART_COUNT = 14;   // jumlah hati melayang

const COLORS = {
  blue: '126,200,255',
  pink: '255,143,199',
  white: '244,248,255'
};

let stars = [];
let hearts = [];

function resize() {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

const rand = (a, b) => a + Math.random() * (b - a);

function makeStar() {
  const layer = Math.random() < 0.6 ? 0 : Math.random() < 0.7 ? 1 : 2;
  return {
    x: rand(0, W),
    y: rand(0, H),
    r: [rand(.4, .9), rand(.8, 1.4), rand(1.3, 2.2)][layer],
    base: [.25, .5, .8][layer],
    speed: rand(.4, 1.4),
    phase: rand(0, Math.PI * 2),
    drift: [.003, .008, .015][layer],
    color: Math.random() < .25 ? COLORS.blue : COLORS.white
  };
}

function makeHeart(startAnywhere) {
  return {
    x: rand(0, W),
    y: startAnywhere ? rand(0, H) : H + 30,
    size: rand(6, 16),
    vy: rand(.12, .4),
    sway: rand(.3, 1),
    phase: rand(0, Math.PI * 2),
    life: startAnywhere ? rand(0, 1) : 0,
    color: Math.random() < .55 ? COLORS.pink : COLORS.blue
  };
}

function drawHeart(x, y, s, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;
  ctx.shadowColor = `rgba(${color},.9)`;
  ctx.shadowBlur = s * 1.2;
  ctx.fillStyle = `rgba(${color},1)`;
  ctx.beginPath();
  ctx.moveTo(0, s * .3);
  ctx.bezierCurveTo(-s, -s * .5, -s * .5, -s, 0, -s * .35);
  ctx.bezierCurveTo(s * .5, -s, s, -s * .5, 0, s * .3);
  ctx.fill();
  ctx.restore();
}

function initSky() {
  resize();
  stars = Array.from({ length: STAR_COUNT }, makeStar);
  hearts = Array.from({ length: HEART_COUNT }, () => makeHeart(true));
}

let running = true;
let last = 0;

function frame(t) {
  if (!running) return;
  const dt = Math.min((t - last) / 16.67, 3);
  last = t;

  ctx.clearRect(0, 0, W, H);
  if (skyHidden) {            // layar konstelasi: gambar kilau saja
  drawSparks(dt);
  ctx.globalAlpha = 1;
  requestAnimationFrame(frame);
  return;
  }

  for (const s of stars) {
    s.x -= s.drift * dt;
    if (s.x < -5) s.x = W + 5;
    const a = s.base * (0.55 + 0.45 * Math.sin(t * 0.001 * s.speed + s.phase));
    ctx.globalAlpha = a;
    ctx.fillStyle = `rgb(${s.color})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const h of hearts) {
    h.y -= h.vy * dt;
    h.life += 0.0025 * dt;
    const x = h.x + Math.sin(t * 0.0006 * h.sway + h.phase) * 18;
    const a = Math.sin(Math.min(h.life, 1) * Math.PI) * 0.7;
    drawHeart(x, h.y, h.size, h.color, a);
    if (h.life >= 1 || h.y < -30) Object.assign(h, makeHeart(false));
  }

  drawSparks(dt);
  ctx.globalAlpha = 1;
  requestAnimationFrame(frame);
}

// Hemat baterai: berhenti saat tab tidak aktif atau saat langit tidak dipakai
let skyHidden = false;
let skyLoop = true;

function syncSky() {
  const should = !document.hidden;
  if (should && !running) {
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  } else if (!should) {
    running = false;
  }
}

function setSkyPaused(p) {
  skyHidden = p;
  syncSky();
}

document.addEventListener('visibilitychange', syncSky);

let lastW = window.innerWidth;
window.addEventListener('resize', () => {
  // abaikan perubahan tinggi (address bar naik-turun)
  if (window.innerWidth === lastW) return;
  lastW = window.innerWidth;
  initSky();
});

initSky();
requestAnimationFrame(frame);

/* ---------- 2. TYPING ANIMATION ---------- */
const line1 = document.getElementById('typeLine1');
const line2 = document.getElementById('typeLine2');
const openBtn = document.getElementById('openBtn');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function typeText(el, text, speed) {
  el.classList.add('typing');
  el.textContent = '';
  for (const ch of text) {
    el.textContent += ch;
    await sleep(speed);
  }
  el.classList.remove('typing');
}

async function runOpening() {
  await sleep(900);
  await typeText(line1, 'Rania...', 140);
  await sleep(700);
  await typeText(line2, 'Aku membuat sesuatu yang spesial untukmu.', 55);
  await sleep(600);
  openBtn.classList.remove('hidden');
}
runOpening();

/* ---------- 3. SPARKLE LEDAKAN ---------- */
const sparks = [];

function burst(x, y, count = 26) {
  const palette = [COLORS.blue, COLORS.pink, COLORS.white];
  for (let i = 0; i < count && sparks.length < 120; i++) {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(1, 4.5);
    sparks.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.5,
      life: 0,
      max: rand(50, 90),
      size: rand(1.5, 3.5),
      color: palette[Math.floor(Math.random() * 3)]
    });
  }
}

function drawSparks(dt) {
  for (let i = sparks.length - 1; i >= 0; i--) {
    const p = sparks[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.985;
    p.vy = p.vy * 0.985 + 0.02 * dt;
    p.life += dt;
    const k = 1 - p.life / p.max;
    if (k <= 0) { sparks.splice(i, 1); continue; }

    const s = p.size * 2.5;
    ctx.globalAlpha = k;
    ctx.fillStyle = `rgb(${p.color})`;
    ctx.shadowColor = `rgb(${p.color})`;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - s);
    ctx.quadraticCurveTo(p.x, p.y, p.x + s, p.y);
    ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + s);
    ctx.quadraticCurveTo(p.x, p.y, p.x - s, p.y);
    ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - s);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
}

/* ---------- 4. NAVIGASI ANTAR SECTION ---------- */
function showSection(id) {
  document.querySelectorAll('.section').forEach((s) => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  setSkyPaused(id === 'constellation');
}

// "Pengumuman" ke fitur lain (dipakai achievement)
function emit(type, val) {
  document.dispatchEvent(new CustomEvent('gift', { detail: { type, val } }));
}

/* ---------- 5. BUKA HADIAH ---------- */
openBtn.addEventListener('click', async () => {
  openBtn.disabled = true;
  showSection('giftStage');

  const gift = document.getElementById('gift');
  await sleep(1000);
  gift.classList.add('wiggle');
  await sleep(1500);
  gift.classList.remove('wiggle');
  gift.classList.add('open');

  const r = gift.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height * 0.4, 30);
  await sleep(600);
  burst(r.left + r.width / 2, r.top + r.height * 0.4, 24);
  await sleep(1500);

  showSection('birthday');
});

document.getElementById('nextBtn').addEventListener('click', () => {
  showSection('story');
});

/* =========================================================
   PHASE 3: STORY, GALLERY, PRECIOUS GIFTS
   ========================================================= */

/* ---------- DATA ---------- */
const chapters = [
  { t: 'Awal Bertemu',    x: 'Awal ketemu aku menganggap mu teman biasa :3, dan saat itu aku belum suka kamu🗿' },
  { t: 'Jadi Musuh',      x: 'Lalu kita menjadi musuh, aku sangat sangat membenci mu, bahkan sangat benci sama kamu dulu😖, aku dulu benci kamu karena saat aku dijodoh²kan sama kamu, kamu bilang najis padaku(╥_╥), itu membuatku benci dan sakit🤧' },
  { t: 'Mulai Dekat',     x: 'Aku mulai dekat denganmu semenjak kamu meminta akun tiktok ku, soalnya selama itu kamu ngechat aku terus (⁠≧⁠▽⁠≦⁠), aku sukaaa, suka bangetttt(⁠≧⁠▽⁠≦⁠)' },
  { t: 'Makin Dekat',     x: 'Aku mulai makin dekat denganmu saat kita sering chat chat an itu😖👉🏻👈🏻  selama itu aku sebenernya udh suka sama kamu, namun aku belum berani ngungkapin nyaa(⁠｡>/⁠/~/⁠/<｡⁠)' },
  { t: 'Jatuh Cinta',     x: 'Aku jatuh cinta padamu, malam itu, lebih tepat nya 6 july 2026 aku menyatakan cinta itu kepadamu(⁠｡>/⁠/~/⁠/<｡⁠), aku menyatakan cinta karena aku suka padamu, saat itu aku sudah siap ditolak, dan aku berpikir bahwa mungkin dengan menyatakan cinta aku akan dibenci olehmu, dan jika aku dibenci oleh orang yang aku sukai, mungkin perasaan itu akan hilang sekaligus asing atau jadi teman biasa mungkin, saat itu aku sudah benar² sangat siap untuk ditolak dan dibenci, namun jawaban mu membuatku terkejut, tidak ada yang menyangka bahwa kamu akan menerima cintaku itu, aku sangat senang, sangat gembira saat itu🥹, awal nya kukira kamu sedang bercanda, ternyata beneran😖👉🏻👈🏻💓, Makasih banyakkk yaaa sayanggg🤧💐' },
  { t: 'Sekarang',        x: 'Sampai sekarang pun aku masih suka, masih sangat mencintaimu<333💓💐' },
  { t: 'Masih Berlanjut', x: 'Sampai saat ini, saat esok, dan sampai seterusnya akan tetap mencintaimu Sayanggg💓💐💕💞             Muachhhhh<333                        Sayangggg, aku sangat kangenn sama kamuuuu><💓💐💕💞                                    –Alif <3' }
];

const memories = [
  { src: 'Photo1.jpg', cap: '' },
  { src: 'Photo2.jpg', cap: '' },
  { src: 'Photo3.jpg', cap: '' },
  { src: 'Photo4.jpg', cap: '' }
];

const precious = [
  { src: 'rania-drawing-1.jpg', cap: 'Ini Adalah Hadiah Pertama Yang Dibuat Dengan Susah Payah Olehmu, Hadiah Ini Sangat Berharga Bagiku, Aku Akan Menjaga Hadiah Ini Dengan Baik🥹💓💕💞' },
  { src: 'rania-drawing-2.jpg', cap: 'Ini Adalah Hadiah Yang Dibuat Olehmu Untuk Hari Ulang Tahun Ku, Gambar Ini Juga Gak Kalah Bagus Dari Hadiah Pertama, Semua Hadiah Darimu Sangat Berharga, Aku Akan Menjaganya Dengan Baik🥹😍💓💞' }
];

/* ---------- OUR STORY ---------- */
const stCard = document.getElementById('storyCard');
const stStep = document.getElementById('stStep');
const stTitle = document.getElementById('stTitle');
const stText = document.getElementById('stText');
const stDots = document.getElementById('stDots');
const stPrev = document.getElementById('stPrev');
const stNext = document.getElementById('stNext');
let ci = 0;

chapters.forEach(() => stDots.appendChild(document.createElement('i')));

function renderChapter() {
  const c = chapters[ci];
  stStep.textContent = `BAB ${ci + 1} / ${chapters.length}`;
  stTitle.textContent = c.t;
  stText.textContent = c.x;
  [...stDots.children].forEach((d, i) => d.classList.toggle('on', i === ci));
  stPrev.style.visibility = ci === 0 ? 'hidden' : 'visible';
  stNext.textContent = ci === chapters.length - 1 ? 'LANJUT' : 'BERIKUTNYA';
  stCard.classList.remove('in');
  void stCard.offsetWidth;
  stCard.classList.add('in');
}

stNext.addEventListener('click', () => {
  if (ci < chapters.length - 1) { ci++; renderChapter(); }
  else showSection('gallery');
});
stPrev.addEventListener('click', () => {
  if (ci > 0) { ci--; renderChapter(); }
});
renderChapter();

/* ---------- LIGHTBOX ---------- */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCap = document.getElementById('lbCap');

function openLightbox(src, cap) {
  lbImg.classList.remove('missing');
  lbImg.onerror = () => lbImg.classList.add('missing');
  lbImg.src = src;
  lbCap.textContent = cap || '';
lbCap.style.display = cap ? '' : 'none';
  lb.classList.add('show');
}
function closeLightbox() { lb.classList.remove('show'); }

document.getElementById('lbClose').addEventListener('click', closeLightbox);
lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

/* ---------- KARTU (gallery & precious) ---------- */
function buildCards(list, gridId, extraClass) {
  const grid = document.getElementById(gridId);
  list.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'mem-card ' + extraClass;

    const img = document.createElement('img');
    img.alt = '';
    img.loading = 'lazy';
    img.onerror = () => card.classList.add('noimg');
    img.src = item.src;

    card.append(img);
if (item.cap) {
  const cap = document.createElement('span');
  cap.textContent = item.cap;
  card.append(cap);
}
    card.addEventListener('click', () => {
      card.classList.add('lift');
      setTimeout(() => {
        card.classList.remove('lift');
        openLightbox(item.src, item.cap);
      }, 250);
    });
    grid.appendChild(card);
  });
}
buildCards(memories, 'memGrid', '');
buildCards(precious, 'preciousGrid', 'precious');

document.getElementById('galNext').addEventListener('click', () => showSection('gifts'));
document.getElementById('giftsNext').addEventListener('click', () => showSection('music'));

/* =========================================================
   PHASE 4: MUSIC PLAYER
   File audio taruh di assets/music/
   ========================================================= */

const songs = [
  { title: 'BoyFriend',         artist: 'Ariana Grande ft. Social House', src: 'song01.mp3' },
  { title: 'Love For You',      artist: '',                               src: 'song02.mp3' },
  { title: 'Miku',              artist: 'Anamanaguchi',                   src: 'song03.mp3' },
  { title: 'Kyu-Kurarin',       artist: '',                               src: 'song04.mp3' },
  { title: 'Mermerizer',        artist: '',                               src: 'song05.mp3' },
  { title: 'Shape of My Heart', artist: '',                               src: 'song06.mp3' },
  { title: 'We Don\'t Talk Anymore', artist: '', src: 'song11.mp3' },
  { title: 'Obsessed',          artist: 'Mariah Carey',                   src: 'song07.mp3' },
  { title: 'Some',              artist: '',                               src: 'song08.mp3' },
  { title: 'Scott and Zelda',   artist: '',                               src: 'song09.mp3' },
  { title: 'Gabriela',          artist: 'KATSEYE',                        src: 'song10.mp3' }
];

const ICON = {
  play:   '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
  pause:  '<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
  prev:   '<svg viewBox="0 0 24 24"><path d="M6 5h2v14H6zM20 5v14L9 12z"/></svg>',
  next:   '<svg viewBox="0 0 24 24"><path d="M16 5h2v14h-2zM4 5v14l11-7z"/></svg>',
  repeat: '<svg viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2z"/></svg>'
};

const pTitle = document.getElementById('pTitle');
const pArtist = document.getElementById('pArtist');
const pMsg = document.getElementById('pMsg');
const pSeek = document.getElementById('pSeek');
const pCur = document.getElementById('pCur');
const pDur = document.getElementById('pDur');
const pPlay = document.getElementById('pPlay');
const pPrev = document.getElementById('pPrev');
const pNext = document.getElementById('pNext');
const pRepeat = document.getElementById('pRepeat');
const pBadge = document.getElementById('pBadge');
const pVol = document.getElementById('pVol');
const plist = document.getElementById('plist');
const disc = document.getElementById('disc');

pPrev.insertAdjacentHTML('afterbegin', ICON.prev);
pNext.insertAdjacentHTML('afterbegin', ICON.next);
pRepeat.insertAdjacentHTML('afterbegin', ICON.repeat);
pPlay.innerHTML = ICON.play;

const audio = new Audio();
audio.preload = 'metadata';
audio.volume = 0.8;

let idx = 0;
let repeatMode = 'one';   // 'off' | 'all' | 'one'

const fmt = (s) => {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return m + ':' + String(r).padStart(2, '0');
};

songs.forEach((s, i) => {
  const li = document.createElement('li');
  li.innerHTML =
    `<span class="num">${i + 1}</span>` +
    `<div><div class="t"></div><div class="a"></div></div>`;
  li.querySelector('.t').textContent = s.title;
  li.querySelector('.a').textContent = s.artist;
  li.addEventListener('click', () => loadSong(i, true));
  plist.appendChild(li);
});

function loadSong(i, autoplay) {
  idx = (i + songs.length) % songs.length;
  const s = songs[idx];
  audio.src = s.src;
  pTitle.textContent = s.title;
  pArtist.textContent = s.artist;
  pMsg.textContent = '';
  pSeek.value = 0;
  pCur.textContent = '0:00';
  pDur.textContent = '0:00';
  [...plist.children].forEach((li, n) => li.classList.toggle('active', n === idx));
  if (autoplay) playSong();
}

function playSong() {
  audio.play().catch((e) => {
    if (e.name === 'NotAllowedError') pMsg.textContent = 'Ketuk play untuk mulai';
  });
}

audio.addEventListener('play', () => {
  pPlay.innerHTML = ICON.pause;
  disc.classList.add('spin');
});
audio.addEventListener('pause', () => {
  pPlay.innerHTML = ICON.play;
  disc.classList.remove('spin');
});
audio.addEventListener('loadedmetadata', () => {
  pSeek.max = audio.duration;
  pDur.textContent = fmt(audio.duration);
});
audio.addEventListener('timeupdate', () => {
  pSeek.value = audio.currentTime;
  pCur.textContent = fmt(audio.currentTime);
});
audio.addEventListener('error', () => {
  pMsg.textContent = 'File audio belum ada: ' + songs[idx].src;
  disc.classList.remove('spin');
  pPlay.innerHTML = ICON.play;
});
audio.addEventListener('ended', () => {
    const PAIR = [5, 6];   // Shape of My Heart <-> We Don't Talk Anymore
  if (repeatMode === 'one' && PAIR.includes(idx)) {
    loadSong(idx === PAIR[0] ? PAIR[1] : PAIR[0], true);
    return;
  }
  if (repeatMode === 'one') {
    audio.currentTime = 0;
    playSong();
  } else if (idx === songs.length - 1 && repeatMode === 'off') {
    loadSong(0, false);
  } else {
    loadSong(idx + 1, true);
  }
});

pPlay.addEventListener('click', () => {
  if (audio.paused) playSong(); else audio.pause();
});
pNext.addEventListener('click', () => loadSong(idx + 1, true));
pPrev.addEventListener('click', () => {
  if (audio.currentTime > 3) audio.currentTime = 0;
  else loadSong(idx - 1, true);
});
pRepeat.addEventListener('click', () => {
  repeatMode = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
  pRepeat.classList.toggle('on', repeatMode !== 'off');
  pBadge.textContent = repeatMode === 'one' ? '1' : '';
});
pSeek.addEventListener('input', () => { audio.currentTime = pSeek.value; });
pVol.addEventListener('input', () => { audio.volume = pVol.value; });

loadSong(0, false);

document.getElementById('musicNext').addEventListener('click', () => showSection('stars'));

/* =========================================================
   PHASE 5A: SURAT CINTA + KONSULTASI BINTANG
   ========================================================= */

const letters = [
  { label: 'UNTUKMU',                       title: 'Untukmu',                       text: ['[LETTER_1]'] },
  { label: 'HAL YANG TAK PERNAH KUKATAKAN', title: 'Hal yang Tak Pernah Kukatakan', text: ['[LETTER_2]'] },
  { label: 'CERITA KECIL',                  title: 'Cerita Kecil',                  text: ['[LETTER_3]'] },
  { label: 'HARAPANKU UNTUKMU',             title: 'Harapanku untukmu',             text: ['[LETTER_4]'] }
];
// Satu surat boleh banyak paragraf: text: ['paragraf 1', 'paragraf 2']

const questions = [
  'Apa kenangan yang paling kamu sukai?',
  'Apa sesuatu yang ingin kamu katakan?',
  'Apa harapanmu untuk ke depannya?'
];
const starPos = [{ x: 22, y: 32 }, { x: 72, y: 26 }, { x: 46, y: 52 }];

/* ---------- SURAT CINTA ---------- */
const letterGrid = document.getElementById('letterGrid');
const lv = document.getElementById('letterView');
const env = document.getElementById('env');
const paperWrap = document.getElementById('paperWrap');
const lTitle = document.getElementById('lTitle');
const lBody = document.getElementById('lBody');
const lettersRead = new Set();
let letterBusy = false;

letters.forEach((L, i) => {
  const card = document.createElement('div');
  card.className = 'lcard';
  card.innerHTML = '<span></span>';
  card.querySelector('span').textContent = L.label;
    card.addEventListener('click', () => openLetter(i, card));
  letterGrid.appendChild(card);
});

async function openLetter(i, card) {
  if (letterBusy) return;
  letterBusy = true;
  const L = letters[i];

  lTitle.textContent = L.title;
  lBody.innerHTML = '';
  L.text.forEach((t, n) => {
    const p = document.createElement('p');
    p.className = 'rv';
    p.textContent = t;
    p.style.setProperty('--i', n);
    lBody.appendChild(p);
  });

  env.className = 'env';
  paperWrap.classList.remove('show');
  lv.classList.add('show');

  await sleep(500);
  env.classList.add('open');
  await sleep(900);
  env.classList.add('out');
  await sleep(900);
  env.classList.add('gone');
  paperWrap.classList.add('show');

  card.classList.add('read');
  lettersRead.add(i);
  emit('letter', lettersRead.size);
  letterBusy = false;
}

document.getElementById('lClose').addEventListener('click', () => {
  lv.classList.remove('show');
  paperWrap.classList.remove('show');
});

document.getElementById('lettersNext').addEventListener('click', () => showSection('stars'));

/* ---------- KONSULTASI BINTANG ---------- */
const starfield = document.getElementById('starfield');
const qcard = document.getElementById('qcard');
const qText = document.getElementById('qText');
const starsNext = document.getElementById('starsNext');
const starSeen = new Set();
const starBtns = [];

const STAR_SVG =
  '<svg viewBox="0 0 24 24"><path d="M12 0Q13 11 24 12Q13 13 12 24Q11 13 0 12Q11 11 12 0Z"/></svg>';

questions.forEach((q, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'star-btn';
  b.innerHTML = STAR_SVG;
  b.setAttribute('aria-label', 'Bintang ' + (i + 1));
  b.style.left = starPos[i].x + '%';
  b.style.top = starPos[i].y + '%';
  b.style.animationDelay = (i * 0.8) + 's';
  b.addEventListener('click', () => selectStar(i));
  starfield.appendChild(b);
  starBtns.push(b);
});

function selectStar(i) {
  starBtns.forEach((b) => b.classList.remove('active'));
  starBtns[i].classList.add('active', 'seen');
  qText.textContent = questions[i];
  qcard.classList.add('show');
  starSeen.add(i);
  if (starSeen.size === questions.length) {
    starsNext.classList.remove('hidden');
    emit('star', starSeen.size);
  }
}

document.getElementById('qClose').addEventListener('click', () => {
  qcard.classList.remove('show');
  starBtns.forEach((b) => b.classList.remove('active'));
});

starsNext.addEventListener('click', () => { showSection('game'); startGame(); });

/* =========================================================
   PHASE 5B: GAME + ACHIEVEMENT + BINTANG RAHASIA
   ========================================================= */

/* ---------- ACHIEVEMENTS ---------- */
const ACH = {
  opener:  { name: 'Pembuka Hadiah',      desc: 'Kamu membuka hadiahnya.' },
  memory:  { name: 'Penjelajah Kenangan', desc: 'Kamu melihat sebuah kenangan.' },
  letters: { name: 'Pembaca Surat',       desc: 'Semua surat sudah kamu baca.' },
  stars:   { name: 'Pencari Bintang',     desc: 'Semua bintang sudah kamu temukan.' },
  hearts:  { name: 'Pengumpul Hati',      desc: 'Semua hati berhasil kamu tangkap.' },
  final:   { name: 'Bab Terakhir',        desc: 'Kamu sampai di akhir cerita.' }
};

const toast = document.createElement('div');
toast.className = 'toast';
toast.innerHTML = STAR_SVG + '<div><b></b><small></small></div>';
document.body.appendChild(toast);

const achDone = new Set();
const achQueue = [];
let toastBusy = false;

function unlock(id) {
  if (!ACH[id] || achDone.has(id)) return;
  achDone.add(id);
  achQueue.push(ACH[id]);
  if (!toastBusy) runToasts();
}

async function runToasts() {
  toastBusy = true;
  while (achQueue.length) {
    while (achQueue.length) {
    const a = achQueue.shift();
    toast.querySelector('b').textContent = a.name;
    toast.querySelector('small').textContent = a.desc;
    toast.classList.add('show');
    await sleep(2600);
    toast.classList.remove('show');
    await sleep(500);
  }
  toastBusy = false;
}

document.addEventListener('gift', (e) => {
  const { type, val } = e.detail;
  if (type === 'letter' && val >= letters.length) unlock('letters');
  if (type === 'star') unlock('stars');
  if (type === 'hearts') unlock('hearts');
  if (type === 'final') unlock('final');
    if (type === 'letterSent') unlock('final');
});

openBtn.addEventListener('click', () => { sleep(5400).then(() => unlock('opener')); });

['memGrid', 'preciousGrid'].forEach((id) => {
  document.getElementById(id).addEventListener('click', () => unlock('memory'));
});

/* ---------- MINI GAME: TANGKAP HATINYA ---------- */
const GAME_TARGET = 15;
const gamefield = document.getElementById('gamefield');
const gameScore = document.getElementById('gameScore');
const gameInfo = document.getElementById('gameInfo');
const gameNext = document.getElementById('gameNext');
let gScore = 0, gTimer = null;

const HEART_SVG =
  '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

function startGame() {
  if (gTimer || gScore >= GAME_TARGET) return;
  spawnHeart();
  gTimer = setInterval(spawnHeart, 750);
}

function spawnHeart() {
  if (document.hidden || gamefield.children.length >= 8) return;
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'heart-item ' + (Math.random() < 0.55 ? 'h-pink' : 'h-blue');
  const size = rand(46, 62);
  b.style.width = b.style.height = size + 'px';
  b.style.left = rand(4, 84) + '%';
  b.style.animationDuration = rand(4.5, 7) + 's';
  b.style.setProperty('--dx', rand(-40, 40) + 'px');
  b.setAttribute('aria-label', 'Hati');
  b.innerHTML = HEART_SVG;
  b.addEventListener('pointerdown', (e) => { e.preventDefault(); catchHeart(b); });
  b.addEventListener('animationend', () => b.remove());
  gamefield.appendChild(b);
}

function catchHeart(b) {
  if (b.dataset.done) return;
  b.dataset.done = '1';
  const r = b.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 10);
  b.remove();
  gScore++;
  gameScore.textContent = gScore + ' / ' + GAME_TARGET;
  if (gScore >= GAME_TARGET) finishGame();
}

function finishGame() {
  clearInterval(gTimer);
  gamefield.innerHTML = '';
  gameInfo.textContent = 'Semua hati sudah kamu kumpulkan.';
  gameNext.classList.remove('hidden');
  emit('hearts', gScore);
}

gameNext.addEventListener('click', () => showSection('special'));

/* ---------- BINTANG RAHASIA ---------- */
const secretCard = document.getElementById('secretCard');
const secretBtn = document.createElement('button');
secretBtn.type = 'button';
secretBtn.className = 'star-btn secret';
secretBtn.innerHTML = STAR_SVG;
secretBtn.setAttribute('aria-label', 'Bintang kecil');
secretBtn.style.left = '88%';
secretBtn.style.top = '68%';
secretBtn.style.animationDelay = '1.2s';
starfield.appendChild(secretBtn);

secretBtn.addEventListener('click', () => {
  const r = secretBtn.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 18);
  qcard.classList.remove('show');
  starBtns.forEach((b) => b.classList.remove('active'));
  secretBtn.classList.add('seen');
  secretCard.classList.add('show');
});
document.getElementById('secretClose').addEventListener('click', () => {
  secretCard.classList.remove('show');
});
starBtns.forEach((b) => b.addEventListener('click', () => secretCard.classList.remove('show')));
  /

/* ---------- DATA ---------- */
// Link website lama. Ganti dengan alamat aslinya (harus diawali https://)
const OLD_WEBSITE_URL = 'https://alifardiansyah894-hash.github.io/A-Gift-For-Rania/';

// Tambah karakter dengan menambah satu baris lagi.
const characters = [
  { name: 'Loid Forger', src: 'Loid Forger.jpg', msg: '💚🌹✨ Untuk istriku tercinta, Rania sayangku... ✨🌹💚,                   🎂🎉💖 SELAMAT ULANG TAHUN, ISTRIKU TERSAYANG, RANIAAAAA!! 💖🎉🎂🥹💐💍💚💚💚, Sayangku Raniaaa~ 🥹💗💞 Kalau hari ini aku diberi kesempatan untuk menyampaikan satu hal yang paling penting kepadamu, aku ingin mengatakan betapa berharganya dirimu dan betapa bahagianya aku karena bisa merayakan hari istimewa ini bersamamu dalam cerita kita. 🥺❤️‍🩹💖🌹, Rania sayang, selamat bertambah usia, yaaa! 🎂🎁💝 Semoga kamu selalu sehat, panjang umur, dilimpahi kebahagiaan, dimudahkan segala urusanmu, dan diberikan kekuatan untuk menghadapi setiap tantangan yang datang. 🤲🏻💚✨ Semoga semua impian yang kamu simpan di dalam hati satu per satu menjadi kenyataan. 🌈🌟💐, Aku tahu, tidak setiap hari akan berjalan sesuai dengan keinginanmu. Terkadang ada hari ketika kamu merasa lelah, kecewa, atau ingin menyerah. Namun, sayang, jangan pernah menganggap dirimu tidak cukup kuat hanya karena kamu sedang mengalami hari yang sulit. 🥺🫶🏻💚 Kamu sudah berusaha sejauh ini, dan itu adalah sesuatu yang layak kamu banggakan. 💖🌷✨, Kalau aku bisa berdiri di hadapanmu sekarang, aku akan tersenyum, memberikan hadiah ulang tahun terbaik yang bisa kupersiapkan, lalu berkata dengan sungguh-sungguh..., Selamat ulang tahun, Rania, istriku tersayang. 💍💚 Aku tidak bisa menjanjikan bahwa setiap hari akan selalu mudah, tetapi aku berharap kamu selalu menemukan alasan untuk tersenyum, keberanian untuk mengejar impianmu, dan orang-orang tulus yang akan menghargai keberadaanmu. 🥹💐❤️,Aku ingin melihatmu bahagia, melihatmu berkembang, dan melihatmu berhasil meraih hal-hal yang selama ini kamu impikan. Jangan lupa menjaga kesehatanmu, makan dengan teratur, istirahat yang cukup, dan jangan terlalu keras kepada dirimu sendiri, ya, sayangkuuu! 😭💗🫂🌸, Dan kalau hari ini kamu bertanya apa hadiah paling berharga yang bisa kuberikan, mungkin bukan sesuatu yang paling mahal, melainkan sebuah harapan tulus: semoga kehidupanmu dipenuhi cinta dari keluarga, persahabatan yang baik, kedamaian, dan kebahagiaan yang tidak mudah hilang. 💝💚🌹✨, Sekali lagi, SELAMAT ULANG TAHUN, RANIAAA, ISTRIKU TERCINTA!! 🎂🎉🎊💚💚💚💍💐🥹, Semoga setiap lilin di kue ulang tahunmu menjadi simbol harapan baru, setiap doa membawa ketenangan, dan setiap langkahmu mengantarkanmu menuju masa depan yang indah. 🌟🕊️🌈💖, Dengan penuh kasih dan ketulusan     💚🌹                                    Loid Forger — untuk Rania, istriku tersayang. 🌹💚💍🥰' },
  { name: 'Kaito Kid', src: 'Kaito Kid.jpg', msg: '💙🎩✨ Untuk nona paling istimewa di dunia, Rania! ✨🎩💙, 💎🌹🎂 HAPPY BIRTHDAY, ISTRIKU TERCANTIK, RANIAAAAA!! 🎂🌹💎😭💙💍✨, Hehehe~ selamat ulang tahun, sayangkuuuu! 😏💙🎩💖 Apakah kamu tahu apa yang sedang ingin kucuri hari ini? Hmmm... bukan permata berlian, bukan emas, bukan pula harta karun yang disimpan di dalam brankas paling kuat sekalipun. 💎🔐✨, Aku ingin mencuri senyumanmu, menyimpan kebahagiaanmu sebagai harta paling berharga, dan membuat hari ulang tahunmu menjadi kenangan yang indah! 😭💘💙🌹🎁, Ehem! Nona Rania yang terhormat, izinkan seorang pesulap sepertiku mempersembahkan keajaiban khusus untukmu malam ini. 🎩🪄✨💙, Satu kedipan mata... 🌟, Satu kilauan cahaya... 💎, Dan tadaaaaaa!! 🎉🎊🎆, Sebuah ucapan paling tulus untuk seseorang yang sangat istimewa..., SELAMAT ULANG TAHUN, RANIA, ISTRIKU TERSAYANG!! 😭😭💙💙💙💍💐🎂🎉🎁🌹💖💞💓, Semoga usiamu yang baru membawa lebih banyak kebahagiaan, kesehatan, keberuntungan, dan kesempatan untuk mewujudkan seluruh impianmu. 🌈✨💙 Semoga setiap kesedihan perlahan berganti dengan ketenangan, setiap kekhawatiran menemukan jawabannya, dan setiap usaha baikmu membuahkan hasil yang membanggakan. 🥹🫶🏻💐, Kalau dunia adalah panggung pertunjukan yang megah, maka aku berharap kamu selalu mendapatkan bagian cerita yang indah. Kalau hidup adalah perjalanan panjang, semoga kamu menemukan banyak tempat yang membuatmu merasa nyaman. Dan kalau kebahagiaan adalah sebuah permata, semoga kamu mendapatkannya dalam jumlah yang tidak terhitung! 💎💙🌌✨, Raniaaa, sayangggg! 😭💗💞 Jangan lupa tertawa, jangan malu untuk bermimpi besar, dan jangan pernah menganggap dirimu tidak pantas mendapatkan hal-hal baik. Kamu berhak mendapatkan penghargaan atas usahamu, kesempatan untuk berkembang, dan kebahagiaan yang tulus. 🥺💙🌷, Kalau aku bisa muncul di hadapanmu dengan topi putih kebanggaanku, aku akan membungkuk dengan elegan, mengulurkan setangkai mawar, lalu berkata..., "Nona Rania, malam ini saya tidak datang untuk mencuri permata Anda. Saya datang untuk mengucapkan selamat ulang tahun kepada seseorang yang layak mendapatkan seluruh kebahagiaan di dunia. Izinkan saya mempersembahkan harapan terbaik saya untuk Anda." 🎩🌹💙💍✨, Lalu aku akan mengangkat topiku dan berkata..., "Selamat ulang tahun, istriku Rania! Semoga senyummu selalu bersinar lebih terang daripada berlian mana pun yang pernah kulihat!" 😭💙💎💖💞🌹, DAN TADAAAAA!! 🎉🎉🎉🎂🎂🎂💙💙💙, Hari ini adalah harimu, Rania! Nikmatilah setiap detiknya, tertawalah sepuasnya, makanlah kue ulang tahunmu dengan bahagia, dan kumpulkan kenangan yang kelak membuatmu tersenyum ketika mengingatnya. 🍰😋💙🎁✨, SELAMAT ULANG TAHUN, RATU KECILKU, RANIAAAAA!! 👑💙💍😭🎉🎊🎂💐🌹💎✨, Semoga keajaiban terbaik dalam hidupmu bukan hanya terjadi hari ini, tetapi juga pada hari-hari biasa yang menantimu esok, lusa, dan seterusnya. 🥹💖🌈, 🎩💙 Dengan pesona seorang pesulap dan ketulusan sebuah harapan                    Kaito Kid — untuk Rania, istriku tersayang! 💙💍🌹✨' },
  { name: 'Shinichi Kudo', src: 'Shinichi Kudo.jpg', msg: '💙🔎🌹✨ Untuk istriku tercinta, Rania sayangku... ✨🌹🔎💙, 🎂🎉💍💖 SELAMAT ULANG TAHUN, ISTRIKU TERSAYANG, RANIAAAAA!! 😭😭😭💙💙💙💐🌷🎁🎊🎉, Raniaaa, sayangkuuu! 🥹💙💗 Hari ini adalah hari yang istimewa, dan sebagai suamimu dalam cerita kita, ada satu hal yang ingin kusampaikan kepadamu dengan sepenuh hati: aku berharap kamu selalu bahagia dan tidak pernah melupakan betapa berharganya dirimu. 💍💙🌹✨, Hehehe~ sebagai seorang detektif, aku biasanya menyelesaikan berbagai misteri dengan mengumpulkan petunjuk, memeriksa bukti, dan menggunakan logika. 🔎🕵🏻‍♂️💙 Namun, ada satu hal yang tidak membutuhkan penyelidikan panjang..., Yaitu keinginanku untuk mengucapkan selamat ulang tahun kepada istriku tersayang! 😭💙💞💗, SELAMAT ULANG TAHUN, RANIAAAAA!! 🎂🎂🎂🎉🎉🎉💙💙💙💍💐🌹✨, Semoga di usiamu yang baru ini, kamu selalu diberikan kesehatan, umur yang penuh keberkahan, hati yang tenang, dan kebahagiaan yang melimpah. 🤲🏻💙🌟 Semoga segala impianmu perlahan menjadi kenyataan, usahamu membuahkan hasil yang membanggakan, dan setiap langkahmu membawamu menuju masa depan yang indah. 🌈💐💖, Rania, sayang... 🥺🫶🏻💙 Aku tahu bahwa kehidupan tidak selalu berjalan sesuai dengan rencana. Ada kalanya seseorang merasa lelah, kecewa, atau bingung menentukan langkah selanjutnya. Namun, jangan pernah berpikir bahwa satu kegagalan berarti seluruh perjuanganmu sia-sia, ya? ❤️‍🩹💙✨, Kalau sebuah kasus terasa sulit, seorang detektif tidak langsung menyerah. Dia mengamati kembali petunjuknya, memikirkan kemungkinan lain, lalu mencoba menemukan jalan keluar. 🔎💡💙 Begitu pula dengan kehidupanmu. Tidak apa-apa jika kamu perlu beristirahat, tidak apa-apa jika kamu melakukan kesalahan, dan tidak apa-apa jika kamu membutuhkan waktu untuk memahami sesuatu., Yang penting, jangan berhenti menghargai dirimu sendiri. 🥹💙🌷 Kamu berhak merasa bangga atas setiap usaha yang sudah kamu lakukan, bahkan ketika hasilnya belum sesuai harapan. 💗💞✨, Andai aku bisa berdiri di hadapanmu sekarang, aku akan tersenyum, memberikan hadiah ulang tahun yang sudah kusiapkan, lalu berkata..., "Rania, selamat ulang tahun. 💙 Aku mungkin bisa memecahkan banyak misteri di dunia ini, tetapi hari ini aku hanya ingin memastikan satu hal: semoga kamu tahu betapa pentingnya menjaga kebahagiaanmu sendiri. Teruslah tersenyum, kejarlah impianmu, dan jangan pernah meragukan kemampuanmu." 🥹💍💙🌹, Aaaaah, Raniaaa! 😭😭💙💙💙 Kalau kamu tersenyum hari ini, anggap saja itu sebagai keberhasilan terbesar dari misi ulang tahunku! WKWKWK!! 🗿🤣💗💞, Aku berharap kamu mendapatkan banyak hadiah yang menyenangkan 🎁💝, menikmati kue ulang tahun yang lezat 🍰😋, tertawa bersama teman-temanmu 🥰🌸, dan menghabiskan hari ini dengan perasaan bahagia. 🎉💙🌈, Jangan lupa menjaga kesehatanmu, beristirahat dengan cukup, dan tetap semangat mengejar cita-citamu, ya, sayangku! 🫶🏻💙✨, Dan jika suatu hari nanti kamu melihat langit biru yang cerah, semoga itu mengingatkanmu bahwa masih banyak kemungkinan indah yang menantimu. ☁️💙🌤️ Sebuah hari yang sulit tidak menentukan seluruh hidupmu, dan satu langkah kecil pun tetap berarti jika kamu terus bergerak maju. 🌟💐, RANIAAAAA, ISTRIKU TERSAYANG!! 😭😭😭💙💙💙💍💍💍, 🎂🎉 SELAMAT ULANG TAHUN!! 🎉🎂, Semoga panjang umur, sehat selalu, semakin bahagia, semakin percaya diri, semakin sukses, dan semoga semua harapan baikmu satu per satu terwujud. 🤲🏻💙🌹✨, Teruslah menjadi Rania yang istimewa dengan caramu sendiri. Jangan merasa harus menjadi orang lain hanya untuk mendapatkan pengakuan, karena perjalanan hidup setiap orang berbeda. 🥹💙🌷, Kalau aku harus menyelidiki satu misteri terakhir hari ini, mungkin aku akan bertanya..., "Apa yang membuat hari ulang tahun Rania menjadi begitu istimewa?" 🔎💙✨,Dan jawabannya sederhana..., Karena hari ini adalah hari untuk merayakan kelahiran seseorang yang pantas mendapatkan kebahagiaan, perhatian, dan doa-doa terbaik. Yaitu KAMU, RANIA! 😭💙💗💞💐🎂🎉,          💙🔎🌹 Selamat ulang tahun, istriku tersayang! 🌹🔎💙                           — Shinichi Kudo 💙🕵🏻‍♂️🔎💍✨' }
];

/* ---------- NAVIGASI ---------- */
document.getElementById('specialOpen').addEventListener('click', () => showSection('husbands'));
document.getElementById('specialNext').addEventListener('click', () => showSection('past'));
document.getElementById('charBack').addEventListener('click', () => showSection('special'));

/* ---------- KARTU KARAKTER ---------- */
const charGrid = document.getElementById('charGrid');
const charView = document.getElementById('charView');
const chImg = document.getElementById('chImg');
const chName = document.getElementById('chName');
const chMsg = document.getElementById('chMsg');

characters.forEach((c) => {
  const card = document.createElement('div');
  card.className = 'mem-card char';

  const img = document.createElement('img');
  img.alt = '';
  img.loading = 'lazy';
  img.onerror = () => card.classList.add('noimg');
  img.src = c.src;

  const label = document.createElement('span');
  label.textContent = c.name;

  card.append(img, label);
  card.addEventListener('click', () => {
    card.classList.add('lift');                // naik + bercahaya dulu
    setTimeout(() => {
      card.classList.remove('lift');
      openChar(c);
    }, 300);
  });
  charGrid.appendChild(card);
});

function openChar(c) {
  chImg.classList.remove('missing');
  chImg.onerror = () => chImg.classList.add('missing');
  chImg.src = c.src;
  chName.textContent = c.name;
  chMsg.textContent = c.msg;
  charView.classList.add('show');
}
function closeChar() { charView.classList.remove('show'); }

document.getElementById('chClose').addEventListener('click', closeChar);
charView.addEventListener('click', (e) => { if (e.target === charView) closeChar(); });

/* ---------- HADIAH SEBELUMNYA ---------- */
const oldLink = document.getElementById('oldLink');
const pastNote = document.getElementById('pastNote');
const urlOk = /^https?:\/\//i.test(OLD_WEBSITE_URL);

if (urlOk) oldLink.href = OLD_WEBSITE_URL;

oldLink.addEventListener('click', (e) => {
  if (!urlOk) {
    e.preventDefault();
    pastNote.textContent = 'Link belum diisi. Isi OLD_WEBSITE_URL di script.js.';
  }
});

document.getElementById('pastNext').addEventListener('click', () => showSection('finalLetter'));

/* =========================================================
   PHASE 7A: SURAT TERAKHIR + SISTEM PESAN (Supabase)
   ========================================================= */

/* ---------- PENGATURAN (isi setelah setup Supabase) ---------- */
const SUPABASE_URL = 'https://hetgyzemylojafiscoqy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_DqN55blS9Mm1YbZ-uTvB5w_ERw0ZenN';

// true = HANYA untuk ngetes tampilan. Pesan TIDAK tersimpan.
// Wajib false saat website dibagikan ke Rania.
const DEV_MODE = false;

/* ---------- ELEMEN ---------- */
const flSection = document.getElementById('finalLetter');
const flEnv = document.getElementById('flEnv');
const flHint = document.getElementById('flHint');
const flText = document.getElementById('flText');
const flCount = document.getElementById('flCount');
const flMsg = document.getElementById('flMsg');
const flSend = document.getElementById('flSend');
const flTest = document.getElementById('flTest');
const flEdit = document.getElementById('flEdit');
const flDelete = document.getElementById('flDelete');

const setState = (s) => { flSection.dataset.state = s; };

/* ---------- KONEKSI SUPABASE ---------- */
let sb = null;
let myMessage = null;   // isi pesan Rania saat ini (null = belum ada)

const hasConfig = /^https:\/\//i.test(SUPABASE_URL) && !SUPABASE_KEY.includes('[PASTE');
if (hasConfig && window.supabase) {
  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Ambil id pengguna anonim (dibuat otomatis kalau belum ada)



async function getUid() {
  const { data } = await sb.auth.getSession();
  if (data.session) return data.session.user.id;
  const res = await sb.auth.signInAnonymously();
  if (res.error) throw res.error;
  return res.data.user.id;
}

async function loadMine() {
  if (!sb) return;
  try {
        const { data: ss } = await sb.auth.getSession();
    if (!ss.session) return;
    const uid = ss.session.user.id;
    const { data, error } = await sb
      .from('messages').select('content').eq('user_id', uid).maybeSingle();
    if (error) throw error;
    myMessage = data ? data.content : null;
  } catch (e) {
    console.warn('Gagal memuat pesan:', e);
  }
}
loadMine();

/* ---------- BUKA AMPLOP ---------- */
let flBusy = false;

flEnv.addEventListener('click', async () => {
  if (flBusy || flSection.dataset.state !== 'closed') return;
  flBusy = true;
  flEnv.classList.add('open');
  await sleep(900);
  flEnv.classList.add('out');
  await sleep(900);
  openWriting();
  flBusy = false;
});

function updateCount() {
  flCount.textContent = flText.value.length + ' / 1000';
}
flText.addEventListener('input', updateCount);

function openWriting() {
  if (myMessage !== null) flText.value = myMessage;
  updateCount();
  flSend.textContent = myMessage !== null ? 'SIMPAN PERUBAHAN' : 'KIRIM PESAN';
  flMsg.textContent = '';
  setState('writing');
}

/* ---------- KIRIM / SIMPAN ---------- */
flSend.addEventListener('click', async () => {
  const text = flText.value.trim();
  if (!text) { flMsg.textContent = 'Tulis sesuatu dulu ya.'; return; }

  flSend.disabled = true;
  flMsg.textContent = 'Mengirim...';

  try {
    if (sb) {
          const { data: ss } = await sb.auth.getSession();
    if (!ss.session) return;
    const uid = ss.session.user.id;
      const { error } = await sb.from('messages').upsert(
        { user_id: uid, content: text, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );
      if (error) throw error;
      flTest.textContent = '';
    } else if (DEV_MODE) {
      flTest.textContent = 'MODE TES: pesan ini TIDAK tersimpan di database.';
    } else {
      throw new Error('backend-belum-siap');
    }
    myMessage = text;
    flMsg.textContent = '';
    setState('sent');
    emit('letterSent');
  } catch (e) {
    console.error(e);
        if (e.message === 'backend-belum-siap') {
      console.warn('Cek SUPABASE_URL dan SUPABASE_KEY di script.js');
    }
    flMsg.textContent = navigator.onLine
      ? 'Pesan belum bisa terkirim. Coba lagi sebentar ya.'
      : 'Sepertinya kamu sedang offline. Cek internetmu lalu coba lagi ya.';
  }
  flSend.disabled = false;
});

/* ---------- UBAH ---------- */
flEdit.addEventListener('click', openWriting);

/* ---------- HAPUS (tekan dua kali supaya tidak kepencet) ---------- */
let delArmed = false;
let delTimer = null;

function resetDel() {
  delArmed = false;
  flDelete.textContent = 'HAPUS PESAN';
    }

flDelete.addEventListener('click', async () => {
  if (!delArmed) {
    delArmed = true;
    flDelete.textContent = 'YAKIN HAPUS?';
    delTimer = setTimeout(resetDel, 3500);
    return;
  }
  clearTimeout(delTimer);
  resetDel();
  flDelete.disabled = true;

  try {
    if (sb) {
          const { data: ss } = await sb.auth.getSession();
    if (!ss.session) return;
    const uid = ss.session.user.id;
      const { error } = await sb.from('messages').delete().eq('user_id', uid);
      if (error) throw error;
    }
    myMessage = null;
    flText.value = '';
    flTest.textContent = '';
    updateCount();
    flEnv.className = 'env tap';          // amplop kembali tertutup
    flHint.textContent = 'Pesanmu sudah dihapus. Ketuk amplop kalau mau menulis lagi.';
    setState('closed');
  } catch (e) {
    console.error(e);
    flTest.textContent = 'Pesan belum bisa dihapus. Coba lagi sebentar ya.';
  }
  flDelete.disabled = false;
});

/* =========================================================
   PHASE 7B: PESAN -> CAHAYA -> BINTANG -> KONSTELASI HATI -> AKHIR
   ========================================================= */

/* ---------- TEKS (gampang diedit) ---------- */
const CON_FOUND = 'Pesanmu sudah menemukan tempatnya di antara bintang-bintang.';
const CON_BDAY = 'Selamat ulang tahun, Rania.';
const CON_END = [
  { t: 'Terima kasih sudah menjadi bagian dari ceritaku.', script: false },
  { t: 'Selamat ulang tahun, Rania.', script: true },
  { t: 'Semoga cerita kita selalu punya bab berikutnya.', script: false }
];

/* ---------- ELEMEN & STATE ---------- */
const conCanvas = document.getElementById('conCanvas');
const cc = conCanvas.getContext('2d');
const conText = document.getElementById('conText');
const conRestart = document.getElementById('conRestart');

const CON_N = 22;            // jumlah bintang di hati
let cW = 0, cH = 0, conSc = 1;
let conOn = false, conT0 = 0, conLast = 0;
let conPts = [], conTarget = [], conTrail = [];
let conFlags = { star: false, heart: false };

const cClamp = (v) => Math.max(0, Math.min(1, v));
const cEase = (v) => (v < .5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2);
const cLerp = (a, b, k) => a + (b - a) * k;
// u: 0 = biru, 1 = pink
const mixRGB = (u) =>
  Math.round(cLerp(126, 255, u)) + ',' +
  Math.round(cLerp(200, 143, u)) + ',' +
  Math.round(cLerp(255, 199, u));

/* ---------- UKURAN & TITIK HATI ---------- */
function conResize() {
  cW = window.innerWidth;
  cH = window.innerHeight;
  conCanvas.width = cW * DPR;
  conCanvas.height = cH * DPR;
  cc.setTransform(DPR, 0, 0, DPR, 0, 0);
  conSc = Math.min(cW * 0.85, cH * 0.4) / 34;
  const cx = cW / 2, cy = cH * 0.31;
  conTarget = Array.from({ length: CON_N }, (_, i) => {
    const t = (i / CON_N) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return { x: cx + x * conSc, y: cy - y * conSc, u: (x + 16) / 32 };
  });
}
window.addEventListener('resize', () => { if (conOn) conResize(); });

/* ---------- ALAT GAMBAR ---------- */
function conGlow(x, y, r, rgb, a) {
  if (a <= 0.005) return;
  const g = cc.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')');
  g.addColorStop(1, 'rgba(' + rgb + ',0)');
  cc.fillStyle = g;
  cc.beginPath();
  cc.arc(x, y, r, 0, Math.PI * 2);
  cc.fill();
}

function conSparkle(x, y, s, rgb, a) {
  cc.fillStyle = 'rgba(' + rgb + ',' + a + ')';
  cc.beginPath();
  cc.moveTo(x, y - s);
  cc.quadraticCurveTo(x, y, x + s, y);
  cc.quadraticCurveTo(x, y, x, y + s);
  cc.quadraticCurveTo(x, y, x - s, y);
  cc.quadraticCurveTo(x, y, x, y - s);
  cc.fill();
}

/* ---------- ANIMASI UTAMA ---------- */
function conFrame(ts) {
    if (!conOn) return;
  if (document.hidden) { conLast = ts; requestAnimationFrame(conFrame); return; }
  const t = Math.max(0, ts - conT0);
  const dt = Math.min((ts - conLast) / 16.67, 3);
  conLast = ts;
  cc.clearRect(0, 0, cW, cH);

  const sx = cW / 2, sy = cH * 0.72;   // posisi awal surat
  const p0 = conTarget[0];             // bintang pertama (titik hati)

  /* 1) Surat jadi cahaya, naik, jadi bintang */
  const kp = cClamp(t / 1600);
  if (kp < 1) {
    const w = 120 * (1 - 0.6 * kp), h = 84 * (1 - 0.6 * kp);
    conGlow(sx, sy, 90, COLORS.blue, 0.35 * (1 - kp));
    cc.globalAlpha = 1 - kp;
    cc.fillStyle = '#f6f9ff';
    cc.fillRect(sx - w / 2, sy - h / 2, w, h);
    cc.globalAlpha = 1;
  }

  let ox = sx, oy = sy, orbA = 0, orbR = 0;
  if (t < 1600) {
    orbA = kp; orbR = 6 + 14 * kp;
  } else if (t < 4000) {
    const k = cEase((t - 1600) / 2400);
    ox = cLerp(sx, p0.x, k) + Math.sin(k * Math.PI * 3) * 16 * (1 - k);
    oy = cLerp(sy, p0.y, k);
    orbA = 1; orbR = 20 - 8 * k;
    if (conTrail.length < 30) {
      conTrail.push({ x: ox, y: oy, l: 1, c: Math.random() < .5 ? COLORS.blue : COLORS.pink });
    }
  } else {
    ox = p0.x; oy = p0.y;
    orbA = 1 - cClamp((t - 4000) / 700); orbR = 12;
    if (!conFlags.star) { conFlags.star = true; burst(p0.x, p0.y, 22); }
  }

  // jejak cahaya
  for (let i = conTrail.length - 1; i >= 0; i--) {
    const q = conTrail[i];
    q.l -= 0.02 * dt;
    if (q.l <= 0) { conTrail.splice(i, 1); continue; }
    cc.fillStyle = 'rgba(' + q.c + ',' + (0.55 * q.l) + ')';
    cc.beginPath();
    cc.arc(q.x, q.y, 1.5 + 2.5 * q.l, 0, Math.PI * 2);
    cc.fill();
  }
  if (orbA > 0) {
    conGlow(ox, oy, orbR * 3.2, COLORS.blue, 0.45 * orbA);
    conGlow(ox, oy, orbR * 1.4, COLORS.white, 0.95 * orbA);
  }

  /* 2) Posisi bintang-bintang */
  for (let i = 0; i < CON_N; i++) {
    const q = conPts[i], tg = conTarget[i];
    if (i === 0) {
      q.x = tg.x; q.y = tg.y;
      q.a = cClamp((t - 4000) / 700); q.pg = 1;
    } else {
      q.a = cClamp((t - 4600 - i * 60) / 700);
      q.pg = cEase(cClamp((t - 5000 - i * 90) / 1800));
      const wob = (1 - q.pg) * 8;
      const fx = q.sx * cW + Math.sin(t * 0.0007 + q.ph) * wob;
      const fy = q.sy * cH + Math.cos(t * 0.0006 + q.ph) * wob;
      q.x = cLerp(fx, tg.x, q.pg);
      q.y = cLerp(fy, tg.y, q.pg);
    }
  }

  /* 3) Garis konstelasi */
  const lineK = cEase(cClamp((t - 7600) / 2200));
  cc.lineWidth = 1.2;
  for (let i = 0; i < CON_N; i++) {
    const j = (i + 1) % CON_N;
    const A = conPts[i], B = conPts[j];
    const mp = Math.min(A.pg, B.pg);
    const la = Math.min(A.a, B.a) * (0.3 * mp * mp + 0.6 * lineK);
    if (la < 0.01) continue;
    cc.strokeStyle = 'rgba(' + mixRGB((conTarget[i].u + conTarget[j].u) / 2) + ',' + la + ')';
    cc.beginPath();
    cc.moveTo(A.x, A.y);
    cc.lineTo(B.x, B.y);
    cc.stroke();
  }

  /* 4) Cahaya lembut di tengah hati */
  const hk = cEase(cClamp((t - 9200) / 2200));
  if (hk > 0) {
    const beat = 0.85 + 0.15 * Math.sin(t * 0.003);
    conGlow(cW / 2, cH * 0.31, conSc * 22, COLORS.pink, 0.16 * hk * beat);
    conGlow(cW / 2, cH * 0.31, conSc * 14, COLORS.blue, 0.08 * hk);
  }
  if (!conFlags.heart && t > 9800) {
    conFlags.heart = true;
    burst(cW / 2, cH * 0.31, 30);
  }

  /* 5) Gambar bintang */
  for (let i = 0; i < CON_N; i++) {
    const q = conPts[i];
    if (q.a <= 0.01) continue;
    const rgb = mixRGB(conTarget[i].u);
    const tw = 1 + 0.25 * Math.sin(t * 0.003 + q.ph);
    const s = q.size * (i === 0 ? 2.1 : 1.6) * (0.8 + 0.4 * q.pg) * tw;
    conGlow(q.x, q.y, s * 6, rgb, 0.35 * q.a);
    conSparkle(q.x, q.y, s * 3, rgb, 0.9 * q.a);
    cc.fillStyle = 'rgba(255,255,255,' + q.a + ')';
    cc.beginPath();
    cc.arc(q.x, q.y, s * 0.6, 0, Math.PI * 2);
    cc.fill();
  }

  requestAnimationFrame(conFrame);
}

/* ---------- TEKS ---------- */
function conAdd(text, script) {
  const p = document.createElement('p');
  p.className = script ? 'script big con-line' : 'con-line';
  p.textContent = text;
  conText.appendChild(p);
}
async function conClear() {
  [...conText.children].forEach((p) => p.classList.add('out'));
  await sleep(700);
  conText.innerHTML = '';
}
async function conSay(text, script) {
  if (conText.children.length) await conClear();
  conAdd(text, script);
}

/* ---------- MUSIK JADI LEBIH LEMBUT ---------- */
async function conSoftenMusic() {
  const to = Math.min(audio.volume, 0.3);
  while (audio.volume > to + 0.01) {
    audio.volume = Math.max(to, audio.volume - 0.03);
    pVol.value = audio.volume;
    await sleep(150);
  }
}

/* ---------- URUTAN WAKTU ---------- */
async function conSequence() {
  await sleep(4400);
  conSoftenMusic();
  await conSay(CON_FOUND, false);
  await sleep(5200);
  await conSay(CON_BDAY, true);
  await sleep(3600);
  await conClear();
  for (const L of CON_END) {
    conAdd(L.t, L.script);
    await sleep(2400);
  }
  await sleep(1200);
  conRestart.classList.remove('hidden');
}

/* ---------- MULAI & ULANGI ---------- */
function startConstellation() {
  if (conOn) return;
  conOn = true;
  showSection('constellation');
  conText.innerHTML = '';
  conRestart.classList.add('hidden');
  conResize();
  conPts = Array.from({ length: CON_N }, () => ({
    sx: rand(0.1, 0.9), sy: rand(0.08, 0.6),
    ph: rand(0, Math.PI * 2), size: rand(1.6, 2.8),
    x: 0, y: 0, a: 0, pg: 0
  }));
  conTrail = [];
  conFlags = { star: false, heart: false };
  conT0 = performance.now();
  conLast = conT0;
  requestAnimationFrame(conFrame);
  conSequence();
}

document.getElementById('flNext').addEventListener('click', startConstellation);

// Mulai ulang dari awal TANPA muat ulang halaman.
// Pesan Rania tetap aman di database.
conRestart.addEventListener('click', () => {
  // hentikan animasi konstelasi
  conOn = false;
  conText.innerHTML = '';
  conRestart.classList.add('hidden');

  // musik: berhenti dan volume normal lagi
  audio.pause();
  audio.volume = 0.8;
  pVol.value = 0.8;

  // gift box kembali tertutup
  const g = document.getElementById('gift');
  g.classList.remove('open', 'wiggle');
  openBtn.disabled = false;

  // cerita kembali ke bab 1
  ci = 0;
  renderChapter();

  // surat terakhir kembali tertutup
  flEnv.className = 'env tap';
  flHint.textContent = 'Ketuk amplop.';
  flBusy = false;
  setState('closed');

  showSection('opening');
});

/* =========================================================
   INGAT POSISI: kembali dari website lama tidak mulai dari awal
   ========================================================= */
const RETURN_KEY = 'rania-return-to-past';
const MUSIC_KEY = 'rania-return-music';

// Simpan tanda + posisi lagu sebelum pergi ke website lama
oldLink.addEventListener('click', () => {
  if (!urlOk) return;
  try {
    localStorage.setItem(RETURN_KEY, String(Date.now()));
    localStorage.setItem(MUSIC_KEY, JSON.stringify({
      i: idx, t: audio.currentTime, p: !audio.paused
    }));
  } catch (e) { /* abaikan kalau storage diblokir */ }
});

// Saat halaman dimuat: kalau baru saja pergi ke website lama, langsung ke sana
(function restoreFromOld() {
  try {
    const t = Number(localStorage.getItem(RETURN_KEY));
    const m = JSON.parse(localStorage.getItem(MUSIC_KEY) || 'null');
    localStorage.removeItem(RETURN_KEY);
    localStorage.removeItem(MUSIC_KEY);
    // hanya berlaku 30 menit supaya tidak nyasar di kunjungan berikutnya
    if (!t || Date.now() - t > 30 * 60 * 1000) return;

    showSection('past');

    // lanjutkan lagu yang tadi diputar, mulai dari detik yang sama
    if (m && m.p) {
      loadSong(m.i, false);
      audio.addEventListener('loadedmetadata', () => {
        audio.currentTime = m.t;
      }, { once: true });
      pastNote.textContent = 'Ketuk layar untuk melanjutkan musik.';
      document.addEventListener('click', () => {
        playSong();
        pastNote.textContent = '';
      }, { once: true });
    }
  } catch (e) { /* abaikan */ }
})();

/* =========================================================
   MUSIK PEMBUKA: Shape of My Heart mulai saat tutup kotak terbuka
   ========================================================= */
const OPENING_SONG_INDEX = 5;   // 0 = lagu pertama, jadi 5 = lagu ke-6

openBtn.addEventListener('click', () => {
  // Pancing izin audio dari ketukan Rania (diam, tidak terdengar)
  audio.muted = true;
  loadSong(OPENING_SONG_INDEX, false);
  audio.play().then(() => {
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
  }).catch(() => { audio.muted = false; });

  // Lagu mulai tepat saat tutup kotak terbuka (sekitar 3,5 detik)
  sleep(3500).then(() => playSong());
});

// Tampilan awal tombol repeat: ulang satu lagu
pRepeat.classList.add('on');
pBadge.textContent = '1';

/* =========================================================
   TOMBOL KEMBALI di sebelah tombol LANJUT
   ========================================================= */
function addBack(nextId, targetId, floating) {
  const nextBtn = document.getElementById(nextId);
  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'btn ghost';
  back.textContent = 'KEMBALI';
  back.addEventListener('click', () => showSection(targetId));

  const wrap = document.createElement('div');
  wrap.className = floating ? 'navrow' : 'row';
  nextBtn.parentNode.insertBefore(wrap, nextBtn);
  wrap.append(back, nextBtn);
}

addBack('galNext', 'story');        // Galeri  -> Cerita
addBack('giftsNext', 'gallery');    // Hadiah  -> Galeri
addBack('musicNext', 'gifts');      // Musik   -> Hadiah
addBack('starsNext', 'music', true);  // Bintang -> Musik
addBack('gameNext', 'stars', true);   // Game    -> Bintang
addBack('specialNext', 'game');     // Spesial -> Game
addBack('pastNext', 'special');     // Masa lalu -> Spesial                          
