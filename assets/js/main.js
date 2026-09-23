// Navigation mobile (menu burger)
function initMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  const icon = toggle ? toggle.querySelector("use") : null;
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("flex");
    menu.classList.toggle("hidden");
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (icon) icon.setAttribute("href", isOpen ? "#icon-close" : "#icon-menu");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.add("hidden");
      menu.classList.remove("flex");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Filtres de la galerie Portfolio
function initPortfolioFilters() {
  const buttons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category]");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      buttons.forEach((btn) => {
        const isActive = btn === button;
        btn.setAttribute("aria-pressed", String(isActive));
        btn.classList.toggle("bg-willow-green", isActive);
        btn.classList.toggle("text-midnight-violet", isActive);
        btn.classList.toggle("bg-white/70", !isActive);
        btn.classList.toggle("text-midnight-violet/70", !isActive);
      });

      cards.forEach((card) => {
        const categories = (card.getAttribute("data-category") || "").split(" ");
        const show = filter === "tous" || categories.includes(filter);
        card.classList.toggle("hidden", !show);
      });
    });
  });
}

// Animation d'apparition douce au scroll
function initScrollReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    // Pas de support ou préférence utilisateur : le contenu reste visible tel quel.
    return;
  }

  // L'état masqué (voir .reveal-pending en CSS) n'est appliqué qu'ici, une fois
  // le support confirmé, pour ne jamais cacher le contenu si le script échoue.
  items.forEach((item) => item.classList.add("reveal-pending"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fadeUp");
          entry.target.classList.remove("reveal-pending");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

// Tilt 3D + lueur au curseur sur les cartes — actif seulement sur les pages
// marquées data-fx sur <body> (voir .card dans src/input.css)
function initCardTilt() {
  if (!document.body.hasAttribute("data-fx")) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = x / rect.width - 0.5;
      const cy = y / rect.height - 0.5;
      card.style.setProperty("--rx", `${cy * -6}deg`);
      card.style.setProperty("--ry", `${cx * 6}deg`);
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

// Bouton CTA avec inclinaison 3D qui suit le curseur (attribut data-tilt-btn,
// voir [data-tilt-btn] dans src/input.css)
function initButtonTilt() {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll("[data-tilt-btn]").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      btn.style.setProperty("--rx", `${cy * -16}deg`);
      btn.style.setProperty("--ry", `${cx * 16}deg`);
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.setProperty("--rx", "0deg");
      btn.style.setProperty("--ry", "0deg");
    });
  });
}

// Révélation au défilement avancée : titre en clip-path, cartes en
// rotation/échelle (classes .scroll-clip / .scroll-card, voir src/input.css).
// Suivi direct de la position au scroll plutôt qu'IntersectionObserver —
// plus fiable pour un élément isolé comme un titre.
function initScrollDrivenReveal() {
  const targets = Array.prototype.slice.call(document.querySelectorAll(".scroll-card, .scroll-clip"));
  if (!targets.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    targets.forEach((t) => t.classList.add("in-view"));
    return;
  }

  let pending = targets;
  let ticking = false;

  function check() {
    ticking = false;
    const vh = window.innerHeight;
    pending = pending.filter((t) => {
      const rect = t.getBoundingClientRect();
      if (rect.top < vh * 0.9 && rect.bottom > 0) {
        t.classList.add("in-view");
        return false;
      }
      return true;
    });
    if (!pending.length) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(check);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  check();
}

// Marque le lien de navigation actif selon la page courante
function initActiveNavLink() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current) {
      link.classList.add("text-midnight-violet", "after:w-full");
      link.setAttribute("aria-current", "page");
    }
  });
}

// Mode sombre — l'état initial est déjà posé avant le rendu par le script
// inline dans <head> de chaque page (évite le flash au chargement). Cette
// fonction ne fait que brancher le(s) bouton(s) (nav + menu mobile) et
// mémoriser le choix.
function initDarkMode() {
  const toggles = document.querySelectorAll("[data-theme-toggle]");
  if (!toggles.length) return;

  function apply(isDark) {
    document.documentElement.classList.toggle("dark", isDark);
    toggles.forEach((btn) => btn.setAttribute("aria-pressed", String(isDark)));
    try {
      localStorage.setItem("kreapro-theme", isDark ? "dark" : "light");
    } catch (e) {
      // Stockage indisponible (navigation privée, quota) : le choix ne sera
      // pas mémorisé d'une visite à l'autre, sans conséquence bloquante.
    }
  }

  toggles.forEach((btn) => {
    btn.setAttribute("aria-pressed", String(document.documentElement.classList.contains("dark")));
    btn.addEventListener("click", () => apply(!document.documentElement.classList.contains("dark")));
  });
}

// Barre de progression de lecture, épinglée en haut de la fenêtre.
function initScrollProgress() {
  const fill = document.querySelector("[data-progress-fill]");
  if (!fill) return;

  let ticking = false;
  function update() {
    ticking = false;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
    fill.style.width = pct + "%";
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}

// Bouton retour en haut de page.
function initBackToTop() {
  const btn = document.querySelector("[data-back-to-top]");
  if (!btn) return;

  let ticking = false;
  function update() {
    ticking = false;
    btn.classList.toggle("is-visible", window.scrollY > 500);
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  update();

  btn.addEventListener("click", () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });
}

// Bouton de contact flottant extensible (WhatsApp / e-mail / téléphone).
function initContactFab() {
  const toggle = document.querySelector("[data-fab-toggle]");
  const menu = document.querySelector("[data-fab-menu]");
  const icon = toggle ? toggle.querySelector("use") : null;
  if (!toggle || !menu) return;

  function setOpen(isOpen) {
    menu.classList.toggle("flex", isOpen);
    menu.classList.toggle("hidden", !isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (icon) icon.setAttribute("href", isOpen ? "#icon-close" : "#icon-chat");
  }

  toggle.addEventListener("click", () => setOpen(menu.classList.contains("hidden")));

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !toggle.contains(event.target) && !menu.classList.contains("hidden")) {
      setOpen(false);
    }
  });
}

// Recherche du site — fenêtre modale filtrant assets/js/search-index.js
// (chargé avant ce script ; voir index.html et al.).
function initSiteSearch() {
  const triggers = document.querySelectorAll("[data-search-open]");
  const backdrop = document.querySelector("[data-search-backdrop]");
  const input = document.querySelector("[data-search-input]");
  const results = document.querySelector("[data-search-results]");
  if (!triggers.length || !backdrop || !input || !results) return;

  const index = window.KREAPRO_SEARCH_INDEX || [];
  // Le site n'a qu'un seul niveau d'imbrication (racine + projets/ + guides/) :
  // l'index stocke des chemins depuis la racine, on ajoute "../" au besoin plutôt
  // que des chemins absolus (le site reste ainsi déplaçable dans un sous-dossier).
  const basePrefix = /\/(projets|guides)\//.test(window.location.pathname) ? "../" : "";
  let lastFocused = null;

  function render(items) {
    results.innerHTML = "";
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "px-4 py-3 text-sm text-ink/70 dark:text-cream/70";
      empty.textContent = "Aucun résultat. Essayez un autre mot-clé.";
      results.appendChild(empty);
      return;
    }
    items.forEach((item) => {
      const a = document.createElement("a");
      a.href = basePrefix + item.url;
      a.className = "search-result";
      const titleEl = document.createElement("span");
      titleEl.className = "block font-heading text-sm font-semibold text-midnight-violet dark:text-cream";
      titleEl.textContent = item.title;
      const descEl = document.createElement("span");
      descEl.className = "mt-0.5 block text-sm text-ink/70";
      descEl.textContent = item.description;
      a.append(titleEl, descEl);
      results.appendChild(a);
    });
  }

  function filter(query) {
    const q = query.trim().toLowerCase();
    if (!q) return render(index);
    render(
      index.filter(
        (item) => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      )
    );
  }

  function open() {
    lastFocused = document.activeElement;
    backdrop.classList.remove("hidden");
    backdrop.classList.add("flex");
    input.value = "";
    render(index);
    document.body.style.overflow = "hidden";
    input.focus();
  }

  function close() {
    backdrop.classList.add("hidden");
    backdrop.classList.remove("flex");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  triggers.forEach((btn) => btn.addEventListener("click", open));
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) close();
  });
  input.addEventListener("input", () => filter(input.value));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !backdrop.classList.contains("hidden")) close();
  });
}

// Bandeau d'information sur le stockage local (préférence de thème),
// affiché une seule fois puis mémorisé comme lu.
function initStorageNotice() {
  const notice = document.querySelector("[data-storage-notice]");
  const dismiss = document.querySelector("[data-storage-dismiss]");
  if (!notice || !dismiss) return;

  let seen;
  try {
    seen = localStorage.getItem("kreapro-storage-notice-seen");
  } catch (e) {
    seen = "1"; // pas de stockage disponible : inutile d'afficher un message à ce sujet
  }
  if (seen) return; // reste masqué (classe "hidden" déjà posée dans le HTML)

  notice.classList.remove("hidden");
  notice.classList.add("flex");
  dismiss.addEventListener("click", () => {
    notice.classList.add("hidden");
    notice.classList.remove("flex");
    try {
      localStorage.setItem("kreapro-storage-notice-seen", "1");
    } catch (e) {
      // rien à faire : le bandeau réapparaîtra simplement à la prochaine visite
    }
  });
}

// Envoi de formulaire via Web3Forms (https://web3forms.com), sans backend.
// Réutilisé par le formulaire de contact (contact.html) et la newsletter
// (pied de page) — même service, clé publique dans le champ caché
// "access_key" de chaque formulaire.
function initWeb3Form(formSelector, confirmationSelector, errorSelector) {
  const form = document.querySelector(formSelector);
  const confirmation = document.querySelector(confirmationSelector);
  const errorBox = errorSelector ? document.querySelector(errorSelector) : null;
  if (!form || !confirmation) return;

  const endpoint = form.getAttribute("action") || "https://api.web3forms.com/submit";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    const label = button ? button.textContent : "";
    if (button) {
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
      button.textContent = button.getAttribute("data-loading-label") || "Envoi en cours…";
    }
    if (errorBox) errorBox.classList.add("hidden");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        form.classList.add("hidden");
        confirmation.classList.remove("hidden");
        confirmation.focus();
      } else {
        throw new Error(data.message || "Échec de l'envoi");
      }
    } catch (err) {
      if (errorBox) {
        errorBox.classList.remove("hidden");
      } else {
        window.alert(
          "L'envoi a échoué. Merci de nous écrire directement sur WhatsApp ou à contact@kreapro.re."
        );
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.removeAttribute("aria-busy");
        button.textContent = label;
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initPortfolioFilters();
  initScrollReveal();
  initCardTilt();
  initButtonTilt();
  initScrollDrivenReveal();
  initActiveNavLink();
  initDarkMode();
  initScrollProgress();
  initBackToTop();
  initContactFab();
  initSiteSearch();
  initStorageNotice();
  initWeb3Form("[data-contact-form]", "[data-contact-confirmation]", "[data-contact-error]");
  initWeb3Form("[data-newsletter-form]", "[data-newsletter-confirmation]", "[data-newsletter-error]");
});
