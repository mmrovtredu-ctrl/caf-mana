import * as anim from "./anim.js";

/* ============================================================
   SCROLL REVEAL genérico (fade + slide), independente do anime.js
   ============================================================ */
function reveals() {
  const els = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    els.forEach((e) => e.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("in");
        io.unobserve(entrada.target);
      }
    });
  }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  els.forEach((e) => io.observe(e));
  // rede de segurança: se por algum motivo o observer não disparar, mostra tudo
  setTimeout(() => els.forEach((e) => e.classList.add("in")), 1800);
}

/* ============================================================
   MARQUEE — duplica o conteúdo pra loop contínuo sem buraco
   ============================================================ */
function montarMarquee() {
  const track = document.querySelector(".marquee-track");
  if (!track) return;
  track.innerHTML = track.innerHTML + track.innerHTML;
}

(function header() {
  const h = document.getElementById("top");
  if (!h) return;
  const on = () => h.classList.toggle("scrolled", window.scrollY > 10);
  on();
  window.addEventListener("scroll", on, { passive: true });
})();

/* ============================================================
   BOOT
   ============================================================ */
(async function boot() {
  document.getElementById("ano").textContent = new Date().getFullYear();

  montarMarquee();
  reveals();

  await anim.initAnime();
  anim.heroTitulo();
  anim.heroEntrada();
  anim.letrasInterativas();
  anim.entradaCards(".produto");
})();
