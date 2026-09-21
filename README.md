# KréaPro — Agence Web & Design

Site de l'agence web **KréaPro** basée à La Réunion. Il présente l'entreprise à ses clients :
ce qui a été réalisé et ce qui est réalisable. Style Tropical / Minimaliste.

## Hébergement

- **Site** : hébergé par **GitHub Pages** (branche `main`, dossier `/ (root)`), servi sur le domaine
  personnalisé **https://kreapro.re/** (fichier `CNAME`).
- **Nom de domaine** : enregistré chez **LWS** (zone DNS chez LWS, à ne pas modifier au-delà des
  enregistrements du site : les `MX` / `mail` / TXT servent à la messagerie).
- **Contact** : `contact@kreapro.re` — reçoit aussi les formulaires (Web3Forms).

## Structure du dépôt

La **racine du dépôt est le site publié**.

- `index.html` · `services.html` · `prix.html` · `portfolio.html` · `a-propos.html` · `contact.html`
- `mentions-legales.html` · `politique-confidentialite.html` · `404.html`
- `projets/` — études de cas
- `demos/` — démos de sites (entreprises fictives, en `noindex`)
- `assets/` — CSS compilé, JS, images, logo (`assets/img/logo/`), fichiers d'impression
- `src/input.css` + `tailwind.config.js` — source du CSS (Tailwind)
- `robots.txt` · `sitemap.xml` · `site.webmanifest` · `CNAME` · `.nojekyll`

Dossiers **locaux, non versionnés** (voir `.gitignore`) :

- `_dev/` — documents de travail privés (charte, plan, scripts de démarchage, générateurs de devis/facture…)
- `_a_supprimer/` — fichiers écartés lors du nettoyage, en attente de suppression définitive

## Développement

```sh
npm ci
npm run dev    # Tailwind en mode watch
npm run build  # CSS minifié (à relancer après toute modif de classes)
npm run serve  # serveur local (port 5500)
```

Le CSS est généré à partir de `./*.html`, `projets/`, `demos/`, `_dev/` et `assets/js/` :
relancer `npm run build` après avoir ajouté ou modifié des classes Tailwind.

## Mise en ligne

Un `git push` sur `main` republie le site (GitHub Pages).
Réglages : *Settings → Pages → Deploy from a branch → `main` / `/ (root)`*, domaine personnalisé
`kreapro.re`, **Enforce HTTPS** coché.

Zone DNS chez LWS pour `kreapro.re` :

| Type | Nom | Valeur |
|---|---|---|
| A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| CNAME | `www` | `<compte GitHub>.github.io.` |

## Reste à faire avant démarchage

Voir `_dev/checklist-lancement.md` (dossier local).
