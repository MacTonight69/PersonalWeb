type Side = 'a' | 'b';

interface SectionBlock {
  type: 'paragraph' | 'heading' | 'terms';
  text?: string;
  level?: 2 | 3;
  items?: { term: string; description: string }[];
}

interface SectionData {
  id: string;
  side: Side;
  title: string;
  blocks: SectionBlock[];
  binary: boolean;
}

interface TypeItem {
  node: Text;
  full: string;
  speed: number;
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;

const card = document.querySelector<HTMLElement>('[data-center-card]');
const viewport = document.querySelector<HTMLElement>('[data-cm-viewport]');
const welcome = document.querySelector<HTMLElement>('[data-cm-welcome]');
const sectionEl = document.querySelector<HTMLElement>('[data-cm-section]');
const srText = document.querySelector<HTMLElement>('[data-cm-sr]');
const statusRegion = document.querySelector<HTMLElement>('[data-cm-status]');
const toggleButton = document.querySelector<HTMLButtonElement>('[data-side-toggle]');
const navLists: Record<Side, HTMLElement | null> = {
  a: document.querySelector<HTMLElement>('[data-nav-list="a"]'),
  b: document.querySelector<HTMLElement>('[data-nav-list="b"]'),
};
const navVisual = document.querySelector<HTMLImageElement>('[data-nav-visual]');
const pfp = document.querySelector<HTMLImageElement>('[data-pfp]');
const banner = document.querySelector<HTMLImageElement>('[data-banner]');
const welcomeTitle = document.querySelector<HTMLElement>('#cm-title');
const welcomeText = document.querySelector<HTMLElement>('#cm-welcome-text');
const transition = document.querySelector<HTMLElement>('[data-side-transition]');
const transitionVideo = document.querySelector<HTMLVideoElement>('[data-transition-video]');
const metaTheme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
const dataNode = document.getElementById('sections-data');

const sections: SectionData[] = dataNode?.textContent
  ? (JSON.parse(dataNode.textContent) as SectionData[])
  : [];
const sectionsById = new Map(sections.map((section) => [section.id, section]));

const welcomeEls = Array.from(
  document.querySelectorAll<HTMLElement>('[data-welcome-text]'),
);
const HOME_TEXT: Record<Side, { title: string; text: string }> = {
  a: {
    title: 'Layer: 088',
    text: 'You may be confused. Perhaps almost as much as I am. If you wish to discover who I am, perhaps this information will be of help. Be careful: they are watching us.',
  },
  b: {
    title: 'Layer: 088',
    text: 'Feel free to look and browse this entire website.',
  },
};
let side: Side = 'a';
let activeId: string | null = null;
let activeTabId: string | null = null;
let runToken = 0;
let typeTimer: number | undefined;
let activeTyping: { complete: () => void } | null = null;

const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();
let welcomeFull: string[] = [HOME_TEXT.a.title, HOME_TEXT.a.text];

const isHomeId = (id: string): boolean => id === 'a-home' || id === 'b-home';

function setWelcomeContent(nextSide: Side): void {
  welcomeFull = [HOME_TEXT[nextSide].title, HOME_TEXT[nextSide].text];
  welcomeTitle?.setAttribute('aria-label', welcomeFull[0]);
  welcomeText?.setAttribute('aria-label', welcomeFull[1]);
}

function restoreWelcomeText(): void {
  welcomeEls.forEach((element, index) => {
    element.textContent = welcomeFull[index] ?? '';
  });
}

/* ------------------------------------------------------------------ */
/* Typewriter                                                          */
/* ------------------------------------------------------------------ */

function abortTyping(): void {
  if (typeTimer !== undefined) {
    window.clearTimeout(typeTimer);
    typeTimer = undefined;
  }
  activeTyping = null;
  document.querySelector('.cm-caret')?.remove();
}

function collectTextNodes(element: HTMLElement): Text[] {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const text = normalize(node.data);
    if (!text) {
      node.data = '';
      continue;
    }
    node.data = text;
    nodes.push(node);
  }

  return nodes;
}

function scrollToCaret(container: HTMLElement | null): void {
  if (!container) return;
  const nearBottom =
    container.scrollHeight - container.scrollTop - container.clientHeight < 100;
  if (nearBottom) container.scrollTop = container.scrollHeight;
}

function startTyping(
  items: TypeItem[],
  options: {
    chunk?: number;
    gap?: number;
    scrollRoot?: HTMLElement | null;
    onDone?: () => void;
  } = {},
): void {
  abortTyping();
  if (items.length === 0) {
    options.onDone?.();
    return;
  }

  const caret = document.createElement('span');
  caret.className = 'cm-caret';
  caret.textContent = '▌';
  caret.setAttribute('aria-hidden', 'true');

  const chunk = Math.max(1, options.chunk ?? 1);
  const gap = options.gap ?? 0;
  let index = 0;
  let charIndex = 0;
  let ticks = 0;
  let finished = false;

  items.forEach(({ node }) => {
    node.data = '';
  });

  const finish = (): void => {
    if (finished) return;
    finished = true;
    window.clearTimeout(typeTimer);
    typeTimer = undefined;
    caret.remove();
    activeTyping = null;
    scrollToCaret(options.scrollRoot ?? null);
    options.onDone?.();
  };

  activeTyping = {
    complete: () => {
      if (finished) return;
      items.forEach(({ node, full }) => {
        node.data = full;
      });
      finish();
    },
  };

  const step = (): void => {
    if (finished) return;

    const item = items[index];
    const next = Math.min(item.full.length, charIndex + chunk);
    item.node.data = item.full.slice(0, next);
    charIndex = next;

    if (item.node.parentNode) {
      item.node.parentNode.insertBefore(caret, item.node.nextSibling);
    }

    ticks += 1;
    if (ticks % 8 === 0) scrollToCaret(options.scrollRoot ?? null);

    if (charIndex >= item.full.length) {
      index += 1;
      charIndex = 0;
      if (index >= items.length) {
        finish();
        return;
      }
      typeTimer = window.setTimeout(step, gap);
      return;
    }

    typeTimer = window.setTimeout(step, item.speed);
  };

  step();
}

function typeWelcome(onDone?: () => void): void {
  if (activeId || reduceMotion.matches) {
    onDone?.();
    return;
  }

  const items: TypeItem[] = [];

  welcomeEls.forEach((element, index) => {
    element.textContent = welcomeFull[index];
    const node = element.firstChild;
    if (!(node instanceof Text)) return;
    items.push({
      node,
      full: welcomeFull[index],
      speed: Number(element.dataset.speed) || 24,
    });
  });

  startTyping(items, { chunk: 1, gap: 240, onDone });
}

/* ------------------------------------------------------------------ */
/* Cifrados de la navegación activa                                    */
/* ------------------------------------------------------------------ */

const CIPHER_ALPHABET = 'ZKQJXYVWTSRPONMLIHGFEDCBA';
const MIXED_POOL =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:\'\",.<>/?|~';
const SYMBOL_POOL = '0123456789!@#$%^&*()-_=+[]{};:\'\",.<>/?|~';

function shiftLetters(text: string, shift: number): string {
  return text.replace(/[A-Za-z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    const offset = char.charCodeAt(0) - base;
    return String.fromCharCode(base + ((offset + shift) % 26));
  });
}

function atbash(text: string): string {
  return text.replace(/[A-Za-z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    const offset = char.charCodeAt(0) - base;
    return String.fromCharCode(base + (25 - offset));
  });
}

function vigenere(text: string, key: string): string {
  let keyIndex = 0;
  return text.replace(/[A-Za-z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    const shift = key.charCodeAt(keyIndex % key.length) - 65;
    keyIndex += 1;
    const offset = char.charCodeAt(0) - base;
    return String.fromCharCode(base + ((offset + shift) % 26));
  });
}

function substitute(text: string, alphabet: string): string {
  return text.replace(/[A-Za-z]/g, (char) => {
    const upper = char <= 'Z';
    const index = char.toUpperCase().charCodeAt(0) - 65;
    const replacement = alphabet[index] ?? char;
    return upper ? replacement : replacement.toLowerCase();
  });
}

function mixChars(text: string, pool: string, salt: number): string {
  let state = salt;

  return text.replace(/[A-Za-z0-9]/g, (char, index) => {
    state = (state * 33 + char.charCodeAt(0) + index * 17) % 8191;
    return pool[state % pool.length];
  });
}

const CIPHERS: Array<(text: string) => string> = [
  (text) => shiftLetters(text, 13),
  (text) => shiftLetters(text, 7),
  (text) => atbash(text),
  (text) => vigenere(text, 'NAVY'),
  (text) => substitute(text, CIPHER_ALPHABET),
  (text) => mixChars(text, MIXED_POOL, 11),
  (text) => mixChars(text, SYMBOL_POOL, 29),
];

let cipherTimer: number | undefined;
let cipherLabel: HTMLElement | null = null;
let cipherOriginal = '';

function stopNavCipher(): void {
  if (cipherTimer !== undefined) {
    window.clearInterval(cipherTimer);
    cipherTimer = undefined;
  }

  if (cipherLabel) cipherLabel.textContent = cipherOriginal;
  cipherLabel = null;
  cipherOriginal = '';
}

function startNavCipher(button: HTMLButtonElement | null): void {
  stopNavCipher();
  if (!button || reduceMotion.matches) return;

  const label = button.querySelector<HTMLElement>('[data-nav-label]');
  if (!label) return;

  cipherLabel = label;
  cipherOriginal = label.textContent ?? '';
  if (!cipherOriginal) return;

  let step = 0;
  const tick = (): void => {
    label.textContent =
      CIPHERS[step % CIPHERS.length](cipherOriginal);
    step += 1;
  };

  tick();
  cipherTimer = window.setInterval(tick, 500);
}

function startActiveCipher(): void {
  if (!activeTabId || reduceMotion.matches) return;
  startNavCipher(getTab(activeTabId));
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

const toBinary = (text: string): string =>
  Array.from(new TextEncoder().encode(text))
    .map((byte) => byte.toString(2).padStart(8, '0'))
    .join(' ');

const blockToPlainText = (block: SectionBlock): string => {
  if (block.type === 'terms') {
    return (block.items ?? [])
      .map((item) => `${item.term}: ${item.description}`)
      .join(' ');
  }
  return block.text ?? '';
};

function getTab(id: string): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>(
    `[data-section-id="${id}"]`,
  );
}

function selectTab(id: string): void {
  stopNavCipher();
  activeTabId = id;

  document.querySelectorAll<HTMLButtonElement>('[role="tab"]').forEach((tab) => {
    const selected = tab.dataset.sectionId === id;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  const tab = getTab(id);
  if (tab && card) card.setAttribute('aria-labelledby', tab.id);
}

function renderSection(section: SectionData, animate: boolean): void {
  if (!sectionEl || !welcome || !card) return;

  abortTyping();
  welcome.hidden = true;
  sectionEl.hidden = false;
  sectionEl.textContent = '';
  sectionEl.classList.toggle('is-binary', section.binary);
  card.classList.add('is-section');
  card.classList.toggle('is-binary', section.binary);

  const title = document.createElement('h1');
  title.className = 'cm-title';
  title.textContent = section.title;
  sectionEl.append(title);

  const body = document.createElement('div');
  body.className = 'cm-body';
  const display = (text: string) => (section.binary ? toBinary(text) : text);

  for (const block of section.blocks) {
    if (block.type === 'heading') {
      const heading = document.createElement(block.level === 3 ? 'h3' : 'h2');
      heading.className = 'cm-heading';
      heading.textContent = display(block.text ?? '');
      body.append(heading);
      continue;
    }

    if (block.type === 'paragraph') {
      const paragraph = document.createElement('p');
      paragraph.className = 'cm-paragraph';
      paragraph.textContent = display(block.text ?? '');
      body.append(paragraph);
      continue;
    }

    const list = document.createElement('dl');
    list.className = 'cm-terms';

    for (const item of block.items ?? []) {
      const row = document.createElement('div');
      row.className = 'cm-term';
      const term = document.createElement('dt');
      term.textContent = display(item.term);
      const description = document.createElement('dd');
      description.textContent = display(item.description);
      row.append(term, description);
      list.append(row);
    }

    body.append(list);
  }

  sectionEl.append(body);

  if (srText) {
    srText.textContent = [section.title, ...section.blocks.map(blockToPlainText)]
      .join('. ')
      .trim();
  }

  if (statusRegion) statusRegion.textContent = `Section: ${section.title}`;
  if (viewport) viewport.scrollTop = 0;
  card.setAttribute('aria-busy', animate ? 'true' : 'false');

  if (!animate || reduceMotion.matches) {
    startActiveCipher();
    return;
  }

  const nodes = collectTextNodes(sectionEl);
  const items = nodes.map((node) => ({
    node,
    full: node.data,
    speed: 10,
  }));
  const total = items.reduce((sum, item) => sum + item.full.length, 0);
  const chunk = Math.max(1, Math.min(10, Math.ceil(total / 800)));

  startTyping(items, {
    chunk,
    gap: 90,
    scrollRoot: viewport,
    onDone: () => card.setAttribute('aria-busy', 'false'),
  });

  startActiveCipher();
}

function showWelcome(): void {
  if (!welcome || !sectionEl || !card) return;

  abortTyping();
  document.querySelectorAll('.cm-flash').forEach((flash) => flash.remove());
  activeId = null;
  card.classList.remove('is-section', 'is-binary');
  card.setAttribute('aria-busy', 'false');
  sectionEl.hidden = true;
  sectionEl.textContent = '';
  sectionEl.classList.remove('is-binary');
  setWelcomeContent(side);
  restoreWelcomeText();
  welcome.hidden = false;

  if (srText) srText.textContent = '';
  if (statusRegion) statusRegion.textContent = '';
  if (viewport) viewport.scrollTop = 0;
  selectTab(`${side}-home`);
}

async function activateHome(): Promise<void> {
  if (!welcome || !sectionEl || !card) return;

  const run = ++runToken;
  activeId = null;
  selectTab(`${side}-home`);
  abortTyping();
  document.querySelectorAll('.cm-flash').forEach((flash) => flash.remove());

  const intro = document.querySelector<HTMLElement>('.side-a-intro');
  if (intro && !intro.hidden) intro.hidden = true;

  setWelcomeContent(side);
  card.classList.remove('is-section', 'is-binary');
  sectionEl.hidden = true;
  sectionEl.textContent = '';
  sectionEl.classList.remove('is-binary');
  restoreWelcomeText();
  welcome.hidden = false;

  if (srText) srText.textContent = '';
  if (statusRegion) statusRegion.textContent = 'Home';
  if (viewport) viewport.scrollTop = 0;
  card.setAttribute('aria-busy', reduceMotion.matches ? 'false' : 'true');

  if (reduceMotion.matches) {
    card.setAttribute('aria-busy', 'false');
    return;
  }

  await playCardFlash(300);
  if (run !== runToken) return;

  typeWelcome(() => card?.setAttribute('aria-busy', 'false'));
  startActiveCipher();

  if (window.matchMedia('(max-width: 54rem)').matches) {
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ------------------------------------------------------------------ */
/* Transition                                                          */
/* ------------------------------------------------------------------ */

function playTransitionVideo(): Promise<void> {
  if (!transition || !transitionVideo) return Promise.resolve();

  return new Promise((resolve) => {
    let settled = false;
    let timer = 0;

    const cleanup = (): void => {
      window.clearTimeout(timer);
      transitionVideo.removeEventListener('ended', onEnded);
      transitionVideo.removeEventListener('error', onError);
      transition.removeEventListener('click', onSkip);
      window.removeEventListener('keydown', onKey);
      transitionVideo.pause();
      transition.hidden = true;
    };

    const finish = (): void => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };

    const onEnded = (): void => finish();
    const onError = (): void => finish();
    const onSkip = (): void => finish();
    const onKey = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape' && event.key !== 'Enter' && event.key !== ' ') {
        return;
      }
      event.preventDefault();
      finish();
    };

    transition.hidden = false;
    transition.addEventListener('click', onSkip);
    window.addEventListener('keydown', onKey);
    transitionVideo.addEventListener('ended', onEnded);
    transitionVideo.addEventListener('error', onError);
    timer = window.setTimeout(finish, 8000);

    transitionVideo.muted = true;
    try {
      transitionVideo.currentTime = 0;
    } catch {
      // Si el video aún no tiene metadatos, play() empieza desde el inicio.
    }

    const playback = transitionVideo.play();
    if (playback) playback.catch(() => finish());
  });
}

function playCardFlash(duration: number): Promise<void> {
  if (!card) return Promise.resolve();

  const flash = document.createElement('img');
  flash.className = 'cm-flash';
  flash.src = '/media/Intro_Side_A.gif';
  flash.alt = '';
  flash.setAttribute('aria-hidden', 'true');
  card.append(flash);

  return new Promise((resolve) => {
    window.setTimeout(() => {
      flash.remove();
      resolve();
    }, duration);
  });
}

async function activateSection(id: string): Promise<void> {
  const section = sectionsById.get(id);
  if (!section) return;

  const run = ++runToken;
  activeId = id;
  selectTab(id);
  abortTyping();

  const intro = document.querySelector<HTMLElement>('.side-a-intro');
  if (intro && !intro.hidden) intro.hidden = true;

  card?.classList.add('is-section');
  card?.setAttribute('aria-busy', 'true');
  if (statusRegion) statusRegion.textContent = `Section: ${section.title}`;

  if (reduceMotion.matches) {
    renderSection(section, false);
    return;
  }

  await playCardFlash(300);
  if (run !== runToken) return;

  renderSection(section, true);

  if (window.matchMedia('(max-width: 54rem)').matches) {
    card?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ------------------------------------------------------------------ */
/* Side switch                                                         */
/* ------------------------------------------------------------------ */

function setImageForSide(image: HTMLImageElement | null, key: Side): void {
  if (!image) return;
  const src = key === 'a' ? image.dataset.srcA : image.dataset.srcB;
  const width = key === 'a' ? image.dataset.widthA : image.dataset.widthB;
  const height = key === 'a' ? image.dataset.heightA : image.dataset.heightB;

  if (src) image.src = src;
  if (width) image.width = Number(width);
  if (height) image.height = Number(height);
}

function setSide(next: Side): void {
  if (next === side) return;

  side = next;
  runToken += 1;
  abortTyping();
  document.querySelectorAll('.cm-flash').forEach((flash) => flash.remove());

  if (transition) transition.hidden = true;
  transitionVideo?.pause();

  root.dataset.side = side;

  const target = side === 'a' ? 'Side B' : 'Side A';
  if (toggleButton) {
    toggleButton.textContent = target;
    toggleButton.setAttribute('aria-label', `Switch to ${target}`);
    toggleButton.setAttribute('title', `Switch to ${target}`);
  }

  if (navLists.a) navLists.a.hidden = side !== 'a';
  if (navLists.b) navLists.b.hidden = side !== 'b';

  setImageForSide(pfp, side);
  setImageForSide(navVisual, side);
  setImageForSide(banner, side);

  if (metaTheme) {
    metaTheme.setAttribute('content', side === 'a' ? '#000000' : '#140208');
  }

  showWelcome();
}

let isChangingSide = false;

async function changeSide(): Promise<void> {
  if (isChangingSide) return;

  stopNavCipher();

  const intro = document.querySelector<HTMLElement>('.side-a-intro');
  if (intro && !intro.hidden) intro.hidden = true;

  const next: Side = side === 'a' ? 'b' : 'a';

  if (reduceMotion.matches) {
    setSide(next);
    return;
  }

  isChangingSide = true;

  try {
    await playTransitionVideo();
    setSide(next);
  } finally {
    isChangingSide = false;
  }
}

/* ------------------------------------------------------------------ */
/* Wiring                                                              */
/* ------------------------------------------------------------------ */

function onNavClick(event: Event): void {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const button = target.closest<HTMLButtonElement>('[data-section-id]');
  const id = button?.dataset.sectionId;
  if (!id) return;

  if (isHomeId(id)) {
    void activateHome();
  } else {
    void activateSection(id);
  }
}

function onNavKeydown(event: KeyboardEvent): void {
  const list = event.currentTarget as HTMLElement;
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;

  const tabs = Array.from(
    list.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
  );
  if (tabs.length === 0) return;

  const current =
    document.activeElement instanceof HTMLButtonElement
      ? tabs.indexOf(document.activeElement)
      : -1;

  let nextIndex = 0;

  if (event.key === 'Home') {
    nextIndex = 0;
  } else if (event.key === 'End') {
    nextIndex = tabs.length - 1;
  } else {
    const delta = event.key === 'ArrowDown' ? 1 : -1;
    nextIndex =
      current < 0 ? 0 : (current + delta + tabs.length) % tabs.length;
  }

  event.preventDefault();
  tabs[nextIndex].focus();
  tabs[nextIndex].click();
}

function init(): void {
  const intro = document.querySelector<HTMLElement>('.side-a-intro');

  toggleButton?.addEventListener('click', () => {
    void changeSide();
  });

  navLists.a?.addEventListener('click', onNavClick);
  navLists.b?.addEventListener('click', onNavClick);
  navLists.a?.addEventListener('keydown', onNavKeydown);
  navLists.b?.addEventListener('keydown', onNavKeydown);

  card?.addEventListener('click', () => {
    activeTyping?.complete();
  });

  setWelcomeContent('a');
  selectTab('a-home');
  startActiveCipher();

  if (reduceMotion.matches || !intro || getComputedStyle(intro).display === 'none') {
    typeWelcome();
    return;
  }

  intro.addEventListener('animationend', (event) => {
    if ((event as AnimationEvent).animationName === 'side-a-intro-dismiss') {
      typeWelcome();
    }
  });
}

init();

export {};
