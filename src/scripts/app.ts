type ClassicSide = 'a' | 'b';
type Side = ClassicSide | 'c';

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
const navLists: Record<ClassicSide, HTMLElement | null> = {
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

const codePanel = document.querySelector<HTMLElement>('[data-cm-code]');
const codePrompt = document.querySelector<HTMLElement>('[data-cm-code-prompt]');
const codeForm = document.querySelector<HTMLFormElement>('[data-cm-code-form]');
const codeInput = document.querySelector<HTMLInputElement>('[data-cm-code-input]');
const codeHint = document.querySelector<HTMLElement>('[data-cm-code-hint]');
const codeResult = document.querySelector<HTMLElement>('[data-cm-code-result]');
const codeFigure = document.querySelector<HTMLElement>('[data-cm-code-figure]');
const codeImage = document.querySelector<HTMLImageElement>('[data-cm-code-image]');
const codeVideo = document.querySelector<HTMLVideoElement>('[data-cm-code-video]');
const codeCaption = document.querySelector<HTMLElement>('[data-cm-code-caption]');
const codeSource = document.querySelector<HTMLAnchorElement>('[data-cm-code-source]');
const codeRandom = document.querySelector<HTMLElement>('[data-cm-code-random]');

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
  c: {
    title: 'Layer: 404',
    text: 'There is no home here. The door only opens one way.',
  },
};
let side: Side = 'a';
let sideBeforeC: ClassicSide = 'a';
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
/* Código secreto de la PFP                                            */
/* ------------------------------------------------------------------ */

const UNKNOWN_MESSAGES = [
  'The layer does not recognize {code}.',
  'No record of {code} exists in this archive.',
  'Static answers in place of {code}.',
  'The tape rejects {code} and keeps spinning.',
  'You knocked with {code}. Nothing opened.',
  'A voice repeats {code} backwards, then goes silent.',
  'The signal for {code} dissolves into interference.',
  'There is no room behind {code}. Someone was just here.',
];

interface CodeImage {
  src: string;
  width: number;
  height: number;
  video?: boolean;
  href?: string;
}

const CODE_IMAGES: Record<string, CodeImage> = {
  '616': { src: '/images/616.svg', width: 520, height: 520 },
  '333': { src: '/images/333.svg', width: 643, height: 814 },
  '666': { src: '/images/666.svg', width: 778, height: 1000 },
  '369': { src: '/images/369.svg', width: 795, height: 1000 },
  '777': { src: '/images/777.svg', width: 1260, height: 1032 },
  '1001': { src: '/images/1001.gif', width: 500, height: 500 },
  '1111': { src: '/images/1111.jpeg', width: 736, height: 607 },
  '312': { src: '/images/312.jpeg', width: 736, height: 920 },
  '3301': { src: '/images/3301.jpeg', width: 736, height: 1041 },
  '333333333': {
    src: '/images/333333333.jpeg',
    width: 736,
    height: 1105,
  },
  '53': { src: '/images/53.jpeg', width: 676, height: 1194 },
  '609': { src: '/images/609.jpeg', width: 736, height: 1308 },
  '79': { src: '/images/79.jpeg', width: 736, height: 920 },
  '2004': {
    src: '/media/codes/2004.mp4',
    width: 640,
    height: 640,
    video: true,
    href: 'https://tenor.com/view/yume-nikki-madotsuki-jump-ending-gif-26637933',
  },
  '69': {
    src: '/media/codes/69.mp4',
    width: 498,
    height: 360,
    video: true,
    href: 'https://tenor.com/view/rpgmaker-yume-nikki-rain-raining-madotsuki-gif-16609780199635110009',
  },
  '123': {
    src: '/media/codes/123.mp4',
    width: 496,
    height: 496,
    video: true,
    href: 'https://tenor.com/view/rumia-touhou-jumpscare-gif-17190961014119105366',
  },
  '321': {
    src: '/media/codes/321.mp4',
    width: 640,
    height: 582,
    video: true,
    href: 'https://tenor.com/view/rumia-dance-cute-fortnite-moves-gif-16580646',
  },
  '88': {
    src: '/media/codes/88.mp4',
    width: 640,
    height: 424,
    video: true,
    href: 'https://tenor.com/view/nra-88th-div-marching-gif-22780604',
  },
  '888': {
    src: '/media/codes/888.mp4',
    width: 154,
    height: 154,
    video: true,
    href: 'https://tenor.com/view/bouncing-marisa-fumo-marisa-kirisame-touhou-fumo-gif-16962360816851147092',
  },
};

let isEnteringC = false;

function resetCodePanel(): void {
  if (!codePanel) return;

  codePanel.hidden = true;
  if (codePrompt) codePrompt.hidden = false;
  if (codeResult) codeResult.hidden = true;
  if (codeHint) codeHint.textContent = '';
  if (codeInput) codeInput.value = '';
  if (codeFigure) codeFigure.hidden = true;
  if (codeImage) {
    codeImage.onerror = null;
    codeImage.removeAttribute('src');
    codeImage.alt = '';
    codeImage.hidden = false;
  }
  if (codeVideo) {
    codeVideo.pause();
    codeVideo.onerror = null;
    codeVideo.removeAttribute('src');
    codeVideo.load();
    codeVideo.hidden = true;
  }
  if (codeSource) {
    codeSource.hidden = true;
    codeSource.removeAttribute('href');
    codeSource.textContent = '';
  }
  if (codeCaption) codeCaption.textContent = '';
  if (codeRandom) {
    codeRandom.hidden = true;
    codeRandom.textContent = '';
  }
}

function openCodePanel(): void {
  if (isEnteringC || !codePanel || !welcome || !sectionEl || !card) return;

  runToken += 1;
  activeId = null;
  abortTyping();
  document.querySelectorAll('.cm-flash').forEach((flash) => flash.remove());

  resetCodePanel();
  card.classList.remove('is-section', 'is-binary');
  card.setAttribute('aria-busy', 'false');
  welcome.hidden = true;
  sectionEl.hidden = true;
  sectionEl.textContent = '';
  sectionEl.classList.remove('is-binary');
  codePanel.hidden = false;

  if (srText) srText.textContent = 'Enter a numeric code.';
  if (statusRegion) statusRegion.textContent = 'Code entry';
  if (viewport) viewport.scrollTop = 0;

  if (window.matchMedia('(max-width: 54rem)').matches) {
    card.scrollIntoView({
      behavior: reduceMotion.matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  window.requestAnimationFrame(() => codeInput?.focus());
}

function randomUnknownText(code: string): string {
  const message =
    UNKNOWN_MESSAGES[Math.floor(Math.random() * UNKNOWN_MESSAGES.length)];
  return message.replace('{code}', code);
}

let sectionCodeMap: Map<string, string> | null = null;

function getSectionCodeMap(): Map<string, string> {
  if (sectionCodeMap) return sectionCodeMap;

  const map = new Map<string, string>();
  let code = 1;

  for (const list of [navLists.a, navLists.b]) {
    if (!list) continue;

    list
      .querySelectorAll<HTMLButtonElement>('[data-section-id]')
      .forEach((tab) => {
        const id = tab.dataset.sectionId;
        if (!id || isHomeId(id)) return;
        map.set(String(code), id);
        code += 1;
      });
  }

  sectionCodeMap = map;
  return map;
}

function renderCodeResult(code: string): void {
  if (!codePanel || !codePrompt || !codeResult) return;

  codePanel.hidden = false;
  codePrompt.hidden = true;
  codeResult.hidden = false;
  if (viewport) viewport.scrollTop = 0;

  const entry = CODE_IMAGES[code];
  if (entry) {
    if (codeRandom) {
      codeRandom.hidden = true;
      codeRandom.textContent = '';
    }

    const isVideo = entry.video === true;

    if (codeFigure && codeCaption) {
      codeFigure.hidden = false;
      codeCaption.textContent = `CODE ${code}`;
    }

    if (codeImage) {
      codeImage.hidden = isVideo;
      if (!isVideo) {
        codeImage.alt = `Code ${code}`;
        codeImage.width = entry.width;
        codeImage.height = entry.height;
        codeImage.onerror = () => {
          if (codeCaption) codeCaption.textContent = `CODE ${code} // NO SIGNAL`;
        };
        codeImage.src = entry.src;
      } else {
        codeImage.onerror = null;
        codeImage.removeAttribute('src');
      }
    }

    if (codeVideo) {
      codeVideo.hidden = !isVideo;
      if (isVideo) {
        codeVideo.width = entry.width;
        codeVideo.height = entry.height;
        codeVideo.muted = true;
        codeVideo.loop = true;
        codeVideo.autoplay = true;
        codeVideo.playsInline = true;
        codeVideo.onerror = () => {
          if (codeCaption) codeCaption.textContent = `CODE ${code} // NO SIGNAL`;
        };
        codeVideo.src = entry.src;
        const playback = codeVideo.play();
        if (playback) playback.catch(() => {});
      } else {
        codeVideo.pause();
        codeVideo.onerror = null;
        codeVideo.removeAttribute('src');
        codeVideo.load();
      }
    }

    if (codeSource) {
      if (entry.href) {
        codeSource.href = entry.href;
        codeSource.textContent = 'TENOR // SOURCE';
        codeSource.hidden = false;
      } else {
        codeSource.hidden = true;
        codeSource.removeAttribute('href');
        codeSource.textContent = '';
      }
    }

    if (srText) {
      srText.textContent = isVideo
        ? `Animation for code ${code}`
        : `Image for code ${code}`;
    }
    if (statusRegion) statusRegion.textContent = `Code ${code} accepted`;
    card?.focus({ preventScroll: true });
    return;
  }

  if (codeFigure) codeFigure.hidden = true;
  if (codeImage) {
    codeImage.onerror = null;
    codeImage.removeAttribute('src');
  }
  if (codeVideo) {
    codeVideo.pause();
    codeVideo.onerror = null;
    codeVideo.removeAttribute('src');
    codeVideo.load();
    codeVideo.hidden = true;
  }
  if (codeSource) {
    codeSource.hidden = true;
    codeSource.removeAttribute('href');
    codeSource.textContent = '';
  }
  if (!codeRandom) return;

  const message = randomUnknownText(code);
  codeRandom.hidden = false;
  codeRandom.textContent = message;

  if (srText) srText.textContent = message;
  if (statusRegion) statusRegion.textContent = `Unknown code ${code}`;

  const node = codeRandom.firstChild;
  if (!reduceMotion.matches && node instanceof Text) {
    startTyping([{ node, full: message, speed: 26 }], {
      scrollRoot: viewport,
    });
  }

  card?.focus({ preventScroll: true });
}

async function enterSideC(code: string): Promise<void> {
  if (isEnteringC) return;

  if (side !== 'c') sideBeforeC = side;
  isEnteringC = true;

  const run = ++runToken;
  abortTyping();
  document.querySelectorAll('.cm-flash').forEach((flash) => flash.remove());
  resetCodePanel();
  activeId = null;

  if (welcome) welcome.hidden = true;
  if (sectionEl) {
    sectionEl.hidden = true;
    sectionEl.textContent = '';
    sectionEl.classList.remove('is-binary');
  }

  card?.classList.remove('is-section', 'is-binary');
  card?.setAttribute('aria-busy', reduceMotion.matches ? 'false' : 'true');
  if (viewport) viewport.scrollTop = 0;

  try {
    if (!reduceMotion.matches) {
      await playCardFlash(400, true);
    }
    if (run !== runToken) return;

    const enteringFromClassic = side !== 'c';
    side = 'c';
    if (enteringFromClassic) {
      applySide('c');
      clearTabSelection();
    }
    renderCodeResult(code);
    card?.setAttribute('aria-busy', 'false');

    if (window.matchMedia('(max-width: 54rem)').matches) {
      card?.scrollIntoView({
        behavior: reduceMotion.matches ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  } finally {
    isEnteringC = false;
  }
}

async function showCodeContent(code: string): Promise<void> {
  if (code === '0') {
    if (side === 'c') setSide(sideBeforeC);
    await activateHome();
    return;
  }

  const sectionId = getSectionCodeMap().get(code);
  if (sectionId) {
    const section = sectionsById.get(sectionId);
    if (!section) return;

    if (section.side !== side) setSide(section.side);
    await activateSection(sectionId);
    return;
  }

  await enterSideC(code);
}

function onCodeSubmit(event: Event): void {
  event.preventDefault();

  const raw = codeInput?.value.trim() ?? '';
  if (!/^\d+$/.test(raw)) {
    if (codeHint) codeHint.textContent = 'Enter a whole number.';
    codeInput?.focus();
    return;
  }

  if (codeHint) codeHint.textContent = '';
  if (codeInput) codeInput.value = '';
  void showCodeContent(String(Number(raw)));
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
  if (tab && card) {
    card.removeAttribute('aria-label');
    card.setAttribute('aria-labelledby', tab.id);
  }
}

function clearTabSelection(): void {
  stopNavCipher();
  activeTabId = null;

  document.querySelectorAll<HTMLButtonElement>('[role="tab"]').forEach((tab) => {
    tab.setAttribute('aria-selected', 'false');
    tab.tabIndex = -1;
  });

  if (card) {
    card.removeAttribute('aria-labelledby');
    card.setAttribute('aria-label', 'Hidden content');
  }
}

function renderSection(section: SectionData, animate: boolean): void {
  if (!sectionEl || !welcome || !card) return;

  resetCodePanel();
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

  resetCodePanel();
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
  if (viewport) viewport.scrollTop = 0;

  if (side === 'c') {
    if (statusRegion) statusRegion.textContent = 'Hidden side';
    clearTabSelection();
  } else {
    if (statusRegion) statusRegion.textContent = '';
    selectTab(`${side}-home`);
  }
}

async function activateHome(): Promise<void> {
  if (!welcome || !sectionEl || !card) return;

  if (side === 'c') setSide(sideBeforeC);

  const run = ++runToken;
  activeId = null;
  selectTab(`${side}-home`);
  resetCodePanel();
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
    timer = window.setTimeout(finish, 10000);

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

function hideTransition(): void {
  if (transition) transition.hidden = true;
  transitionVideo?.pause();
}

function playCardFlash(
  duration: number,
  fullScreen = false,
): Promise<void> {
  if (!card) return Promise.resolve();

  const flash = document.createElement('img');
  flash.className = fullScreen ? 'cm-flash cm-flash--full' : 'cm-flash';
  flash.src = '/media/Intro_Side_A.gif';
  flash.alt = '';
  flash.setAttribute('aria-hidden', 'true');
  (fullScreen ? document.body : card).append(flash);

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
  resetCodePanel();
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

  const src =
    key === 'a'
      ? image.dataset.srcA
      : key === 'b'
        ? image.dataset.srcB
        : image.dataset.srcC;
  const width =
    key === 'a'
      ? image.dataset.widthA
      : key === 'b'
        ? image.dataset.widthB
        : image.dataset.widthC;
  const height =
    key === 'a'
      ? image.dataset.heightA
      : key === 'b'
        ? image.dataset.heightB
        : image.dataset.heightC;

  if (src) image.src = src;
  if (width) image.width = Number(width);
  if (height) image.height = Number(height);
}

function updateSideToggle(next: Side): void {
  if (!toggleButton) return;

  if (next === 'c') {
    toggleButton.textContent = 'GO BACK';
    toggleButton.setAttribute('aria-label', 'Go back');
    toggleButton.setAttribute('title', 'Go back');
    return;
  }

  const target = next === 'a' ? 'Side B' : 'Side A';
  toggleButton.textContent = target;
  toggleButton.setAttribute('aria-label', `Switch to ${target}`);
  toggleButton.setAttribute('title', `Switch to ${target}`);
}

function applySide(next: Side): void {
  root.dataset.side = next;
  updateSideToggle(next);

  if (navLists.a) navLists.a.hidden = next !== 'a';
  if (navLists.b) navLists.b.hidden = next !== 'b';

  setImageForSide(pfp, next);
  setImageForSide(navVisual, next);
  if (next !== 'c') setImageForSide(banner, next);

  if (pfp) pfp.alt = next === 'c' ? 'Madotsuki spinning' : 'Profile picture';

  if (metaTheme) {
    metaTheme.setAttribute('content', next === 'b' ? '#140208' : '#000000');
  }
}

function setSide(next: Side): void {
  if (next === side) return;

  side = next;
  runToken += 1;
  abortTyping();
  document.querySelectorAll('.cm-flash').forEach((flash) => flash.remove());

  applySide(next);
  showWelcome();
}

let isChangingSide = false;

async function changeSide(): Promise<void> {
  if (isChangingSide || isEnteringC) return;

  if (side === 'c') {
    setSide(sideBeforeC);
    return;
  }

  stopNavCipher();

  const intro = document.querySelector<HTMLElement>('.side-a-intro');
  if (intro && !intro.hidden) intro.hidden = true;

  const next: ClassicSide = side === 'a' ? 'b' : 'a';

  if (reduceMotion.matches) {
    setSide(next);
    return;
  }

  isChangingSide = true;
  let sideApplied = false;

  const commitSide = (): void => {
    if (sideApplied) return;
    sideApplied = true;
    setSide(next);
  };

  const playback = playTransitionVideo();
  const switchTimer = window.setTimeout(commitSide, 500);

  try {
    await playback;
    commitSide();
    hideTransition();
  } finally {
    window.clearTimeout(switchTimer);
    isChangingSide = false;
  }
}

/* ------------------------------------------------------------------ */
/* Wiring                                                              */
/* ------------------------------------------------------------------ */

function onNavClick(event: Event): void {
  if (isEnteringC) return;

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
  if (isEnteringC) return;

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

  pfp?.addEventListener('click', openCodePanel);
  codeForm?.addEventListener('submit', onCodeSubmit);

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
