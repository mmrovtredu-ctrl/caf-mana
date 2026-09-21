/* ============================================================
   ANIM — anime.js v4 (ESM via CDN).
   Regra: a animação é enfeite. Se o CDN cair, o site continua
   100% legível e clicável — por isso tudo aqui é opcional, com
   try/catch e checagem de prefers-reduced-motion.
   ============================================================ */

const REDUZIR = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let A = null;
export let ANIM_OK = false;

export async function initAnime() {
  if (REDUZIR) return null;
  try {
    A = await import("https://cdn.jsdelivr.net/npm/animejs@4.5.0/+esm");
    ANIM_OK = true;
    document.documentElement.classList.add("anim-on");
    return A;
  } catch (e) {
    console.warn("[anim] anime.js não carregou, seguindo sem animação:", e);
    return null;
  }
}

/* ---------- 1. Título do hero: letras entrando uma a uma ---------- */
export function heroTitulo(seletor = ".hero h1") {
  if (!A) return;
  try {
    const { animate, stagger, splitText } = A;
    const alvo = document.querySelector(seletor);
    if (!alvo) return;
    const { chars, words } = splitText(alvo, { words: true, chars: true });
    if (words) words.forEach((w) => { w.style.display = "inline-block"; });
    animate(chars, {
      y: [
        { to: "-1.6rem", ease: "outExpo", duration: 480 },
        { to: 0, ease: "outBounce", duration: 620, delay: 60 },
      ],
      opacity: { from: 0, duration: 160 },
      delay: stagger(18),
      ease: "inOutCirc",
    });
  } catch (e) { console.warn("[anim] heroTitulo:", e); }
}

/* ---------- 2. Resto do hero entrando em sequência ---------- */
export function heroEntrada() {
  if (!A) return;
  try {
    const { animate, stagger } = A;
    animate(".hero .eyebrow, .hero p.lead, .hero .cta-row, .hero-figure", {
      opacity: [0, 1],
      y: [16, 0],
      duration: 600,
      delay: stagger(120, { start: 200 }),
      ease: "outExpo",
    });
  } catch (e) { console.warn("[anim] heroEntrada:", e); }
}

/* ---------- 3. Letras interativas: reagem ao passar o mouse ----------
   words:true + chars:true agrupa as letras dentro de cada palavra, pra
   evitar que a linha quebre no meio de uma palavra (bug já visto). */
export function letrasInterativas(seletor = ".letras-int") {
  if (!A) return;
  try {
    const { splitText, waapi } = A;
    document.querySelectorAll(seletor).forEach((titulo) => {
      const { chars, words } = splitText(titulo, { words: true, chars: true });
      if (words) words.forEach((w) => { w.style.display = "inline-block"; });
      chars.forEach((c) => {
        c.style.display = "inline-block";
        c.addEventListener("mouseenter", () => {
          try {
            waapi.animate(c, {
              translateY: [0, "-0.32em", 0],
              color: ["currentColor", "var(--ouro-bright, #e0b354)", "currentColor"],
              duration: 460,
              easing: "ease-out",
            });
          } catch (_) {}
        });
      });
    });
  } catch (e) { console.warn("[anim] letrasInterativas:", e); }
}

/* ---------- 4. Revelação de mídia ao rolar (produto/fotos da feira) ----------
   Sem anime.js, o elemento NUNCA fica escondido por CSS — só entra em
   clip-path quando a animação de fato vai rodar. */
export function revelarMidia(seletor = ".media-clip") {
  if (!A) return;
  const alvos = document.querySelectorAll(seletor);
  if (!alvos.length || !("IntersectionObserver" in window)) return;
  try {
    const { waapi } = A;
    const vistos = new WeakSet();
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        const el = entrada.target;
        if (!entrada.isIntersecting || vistos.has(el)) return;
        vistos.add(el);
        try {
          waapi.animate(el, {
            clipPath: ["inset(0 0 0 100%)", "inset(0 0 0 0%)"],
            scale: [1.06, 1],
            duration: 900,
            easing: "cubic-bezier(.16,1,.3,1)",
          });
        } catch (_) { el.style.clipPath = "none"; }
        io.unobserve(el);
      });
    }, { threshold: .2 });
    alvos.forEach((el) => { el.style.clipPath = "inset(0 0 0 100%)"; io.observe(el); });
  } catch (e) { console.warn("[anim] revelarMidia:", e); }
}

/* ---------- 5. Entrada em cascata para grupos de cards ---------- */
export function entradaCards(seletor) {
  const els = document.querySelectorAll(seletor);
  if (!els.length) return;
  if (!A) { els.forEach((e) => (e.style.opacity = 1)); return; }
  try {
    const { animate, stagger } = A;
    if (!("IntersectionObserver" in window)) {
      animate(els, { opacity: [0, 1], y: [24, 0], duration: 600, delay: stagger(80) });
      return;
    }
    const io = new IntersectionObserver((entradas, obs) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        animate(entrada.target, { opacity: [0, 1], y: [24, 0], duration: 650, ease: "outExpo" });
        obs.unobserve(entrada.target);
      });
    }, { threshold: .2 });
    els.forEach((e) => io.observe(e));
  } catch (e) { els.forEach((el) => (el.style.opacity = 1)); }
}
