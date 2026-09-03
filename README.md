# Wild Bike — Site Astro

Site one-page converti depuis un export Aura Builder vers Astro + Tailwind CSS v4.

## Demarrer

```bash
npm install
npm run dev      # serveur local sur http://localhost:4321
npm run build    # build statique dans dist/
npm run preview  # previsualiser le build
```

## Structure du projet

```
wildbike-site/
├── src/
│   ├── components/
│   │   ├── Nav.astro          # Navigation fixe (mix-blend-difference)
│   │   ├── Hero.astro         # Section #prologue (plein ecran)
│   │   ├── Story.astro        # Section #story (sticky scroll)
│   │   ├── Ethos.astro        # Section #ethos (valeurs)
│   │   ├── Movement.astro     # Section #movement (4 etapes)
│   │   ├── Testimonials.astro # Temoignages parents
│   │   ├── Reservation.astro  # Section #reservation (CTA)
│   │   └── Footer.astro       # Pied de page
│   ├── layouts/
│   │   └── Layout.astro       # Layout de base (head, fonts, scripts)
│   ├── pages/
│   │   └── index.astro        # Page d'accueil
│   └── styles/
│       └── global.css         # Tailwind v4 + design tokens + utilities
├── public/                    # Assets statiques
├── astro.config.mjs
├── package.json
└── DESIGN-SYSTEM.md           # Documentation du design system
```

## Deploiement Cloudflare Pages

### Option A — Connexion GitHub (recommandee)

1. Push le repo sur GitHub.
2. Va sur **Cloudflare Dashboard > Workers & Pages > Create > Pages > Connect to Git**.
3. Selectionne le repo `wildbike-site`.
4. Configure :
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`
   - **Node version** : 22 (ou superieur)
5. Clique **Save and Deploy**.

A chaque `git push`, Cloudflare rebuild et deploie automatiquement.

Le deploiement automatique est gere directement par Cloudflare Pages via la connexion GitHub.

## Technologies

- **Astro 5** — framework statique
- **Tailwind CSS 4** — styling via plugin Vite (`@tailwindcss/vite`)
- **Iconify** — icones via web component (`iconify-icon`)
- **Google Fonts** — Oswald (police de titres)
