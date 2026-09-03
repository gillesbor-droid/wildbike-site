# Wild Bike — Design System

Reference complete pour creer des pages coherentes avec le site Wild Bike.
Tous les tokens sont definis dans `src/styles/global.css` via `@theme` (Tailwind v4).

---

## 1. Couleurs

| Token CSS | Hex | Utilitaire Tailwind | Usage |
|-----------|-----|---------------------|-------|
| `--color-edit-teal` | `#007C7A` | `bg-edit-teal`, `text-edit-teal`, `border-edit-teal` | Couleur principale (CTA, accents, liens, overlays) |
| `--color-edit-teal-dark` | `#004D4B` | `bg-edit-teal-dark`, `text-edit-teal-dark` | Variation sombre (hover, fallback) |
| `--color-edit-red` | `#C1232E` | `bg-edit-red`, `text-edit-red` | Legacy template (non utilise sur Wild Bike) |
| `--color-edit-dark-red` | `#721212` | `bg-edit-dark-red` | Legacy template |
| `--color-edit-black` | `#000000` | `bg-edit-black`, `text-edit-black` | Texte et fonds noirs |
| `--color-edit-white` | `#FFFFFF` | `bg-edit-white`, `text-edit-white` | Texte sur fond sombre |
| `--color-edit-gray` | `#1E1E1E` | `border-edit-gray` | Bordures subtiles (footer) |
| `--color-edit-dark` | `#121212` | `bg-edit-dark` | Fond de sections sombres (ethos) |

### Opacite

Tailwind v4 supporte les modificateurs d'opacite nativement :

```
bg-edit-teal/90    →  teal a 90%
text-white/80      →  texte blanc a 80%
bg-black/60        →  fond noir a 60%
border-white/20    →  bordure blanche a 20%
```

### Palette Tailwind utilisee

- `zinc-100` — fond des cartes de temoignages
- `white` — fond des sections claires
- `black` — fond du body, overlays

---

## 2. Typographie

### Polices

| Police | Role | Source | Import |
|--------|------|--------|--------|
| **Oswald** | Titres (display) | Google Fonts | `<link>` dans `Layout.astro` |
| **Helvetica Custom** | Corps de texte | Local fallback (Helvetica Neue > Helvetica > Arial) | `@font-face` dans `global.css` |

### Classes de texte

| Classe | CSS genere | Usage |
|--------|-----------|-------|
| `font-display` | `font-family: "Oswald"; text-transform: uppercase; font-weight: 600` | Tous les titres et labels |
| `tracking-tighter` | `letter-spacing: -0.05em` | Titres principaux (h1, h2) |
| `tracking-tight` | `letter-spacing: -0.025em` | Sous-titres (h3) |
| `tracking-widest` | `letter-spacing: 0.1em` | Labels et tags (eyebrows) |
| `tracking-custom` | `letter-spacing: 0.075rem` | Espacement custom (rare) |

### Echelle de tailles (Tailwind par defaut)

| Classe | Taille | Usage typique |
|--------|--------|-------------|
| `text-xs` | 0.75rem (12px) | Labels, liens nav, footer |
| `text-sm` | 0.875rem (14px) | Corps de texte secondaire |
| `text-base` | 1rem (16px) | Corps de texte principal |
| `text-lg` | 1.125rem (18px) | Texte de mise en avant |
| `text-xl` | 1.25rem (20px) | Citations |
| `text-2xl` | 1.5rem (24px) | Sous-titres (h3) |
| `text-3xl` | 1.875rem (30px) | Numeros d'etapes |
| `text-4xl` | 2.25rem (36px) | Titres mobile (h2) |
| `text-5xl` | 3rem (48px) | Titres desktop (h2) |
| `text-7xl` | 4.5rem (72px) | Gros titres desktop (h2) |
| `text-8xl` | 6rem (96px) | Hero (h1) |

### Poids

- `font-medium` (500) — corps de texte
- `font-semibold` (600) — inclus dans `.font-display`

---

## 3. Espacements

### Padding de sections

| Pattern | Classes | Usage |
|---------|---------|-------|
| Section standard | `py-32` (8rem) | Temoignages, reservation, ethos |
| Section large | `py-32 md:py-48` (8rem / 12rem) | Movement |
| Section narrative | `py-24 lg:py-32` (6rem / 8rem) | Story (cote texte) |

### Padding horizontal

| Pattern | Classes | Usage |
|---------|---------|-------|
| Mobile | `px-6` (1.5rem) | Toutes sections |
| Desktop | `md:px-12` (3rem) | Sections avec `max-w-7xl` |
| Narrative | `lg:px-20` (5rem) | Story (cote texte) |

### Max widths

| Classe | Largeur | Usage |
|--------|---------|-------|
| `max-w-7xl` | 80rem (1280px) | Conteneur standard |
| `max-w-5xl` | 64rem (1024px) | Hero h1 |
| `max-w-4xl` | 56rem (896px) | Ethos, reservation |
| `max-w-xl` | 36rem (576px) | Hero sous-titre |

### Gaps

| Classe | Valeur | Usage |
|--------|--------|-------|
| `gap-3` | 0.75rem | Logo dots, social icons |
| `gap-4` | 1rem | Grille d'etapes |
| `gap-5` | 1.25rem | Grille de temoignages |
| `gap-8` | 2rem | Liens nav |
| `gap-12` | 3rem | Colonnes footer |
| `gap-16` | 4rem | Blocs narrative |

---

## 4. Utilitaires custom

Definis dans `global.css` avec `@utility` (Tailwind v4) :

| Utilitaire | Effet | Usage |
|-----------|-------|-------|
| `font-display` | Oswald, uppercase, 600 | Tous les titres |
| `mix-blend-nav` | `mix-blend-mode: difference; color: white` | Navigation fixe sur images |
| `solid-overlay` | `background: rgba(0,0,0,0.5)` | Overlay sombre sur images hero |
| `vignette` | `radial-gradient(circle, transparent 50%, rgba(0,0,0,0.8) 150%)` | Vignette sur images hero |
| `tracking-custom` | `letter-spacing: 0.075rem` | Espacement custom |

---

## 5. Animations

### Scroll reveal (IntersectionObserver)

Classe CSS a ajouter sur les elements a animer :

| Classe | Effet | Usage |
|--------|-------|-------|
| `fade-up` | Opacite 0→1 + translateY(2rem→0) | Titres, blocs, sections |
| `fade-in` | Opacite 0→1 | Overlays, backgrounds |

Le script dans `Layout.astro` observe tous les `.fade-up` et `.fade-in` et ajoute `.is-visible` quand ils entrent dans le viewport (threshold 15%).

Delais optionnels via inline style :
```html
<div class="fade-up" style="animation-delay: 200ms;">
```

### Transitions Tailwind

- `transition-colors duration-300` — liens, boutons
- `transition-all duration-300` — social icons (border + bg)

### Animations Tailwind

- `animate-bounce` — indicateur de scroll (mouse icon)
- `animate-[pulse_20s_ease-in-out_infinite]` — image hero (pulse tres lent)

---

## 6. Composants recurrents

### Bouton CTA plein

```html
<a href="#reservation"
   class="bg-edit-teal text-white hover:bg-white hover:text-black
          transition-colors duration-300 font-display text-xs
          tracking-widest px-10 py-5 flex items-center justify-center
          gap-3 w-fit mx-auto fade-up">
  RÉSERVER UN COURS D'ESSAI GRATUIT
  <iconify-icon icon="solar:arrow-right-linear" width="16" stroke-width="2"></iconify-icon>
</a>
```

### Bouton CTA inverse

```html
<a href="tel:0750903677"
   class="inline-flex items-center justify-center gap-3
          bg-white text-black hover:bg-black hover:text-white
          transition-colors duration-300 font-display text-xs
          tracking-widest px-10 py-5">
  RÉSERVER UN COURS D'ESSAI GRATUIT
  <iconify-icon icon="solar:arrow-right-linear" width="16" stroke-width="2"></iconify-icon>
</a>
```

### Eyebrow (label de section)

```html
<span class="text-edit-teal font-display text-xs tracking-widest">
  POURQUOI WILD BIKE
</span>
```

### Carte etape

```html
<div class="bg-black/50 border border-white/20 p-8">
  <span class="font-display text-edit-teal text-3xl">01</span>
  <h3 class="font-display text-2xl tracking-tight mt-6 mb-4">TITRE</h3>
  <p class="text-white/75 text-sm leading-relaxed font-medium">Texte</p>
</div>
```

### Carte temoignage

```html
<blockquote class="border-t-4 border-edit-teal bg-zinc-100 p-8">
  <iconify-icon icon="solar:quote-right-linear" class="text-edit-teal text-3xl mb-6"></iconify-icon>
  <p class="font-display text-xl leading-snug">« CITATION »</p>
</blockquote>
```

### Logo Wildbike

```html
<a href="#" class="flex items-center gap-1">
  <span class="font-display text-2xl md:text-3xl tracking-tighter">Wildbike</span>
  <div class="flex gap-[0.1rem] mt-1">
    <div class="w-1.5 h-1.5 bg-edit-teal"></div>
    <div class="w-1.5 h-1.5 bg-edit-teal"></div>
    <div class="w-1.5 h-1.5 bg-edit-teal"></div>
    <div class="w-1.5 h-1.5 bg-edit-teal"></div>
    <div class="w-1.5 h-1.5 bg-edit-teal"></div>
  </div>
</a>
```

---

## 7. Icones

**Bibliotheque** : Iconify — set **Solar** (line style)

**Chargement** : web component via CDN dans `Layout.astro`
```html
<script is:inline src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
```

**Usage** :
```html
<iconify-icon icon="solar:arrow-right-linear" width="16" stroke-width="2"></iconify-icon>
```

**Icones utilisees sur le site** :

| Icone | Nom Iconify | Usage |
|-------|------------|-------|
| Menu hamburger | `solar:hamburger-menu-linear` | Nav mobile |
| Fleche droite | `solar:arrow-right-linear` | Boutons CTA |
| Souris | `solar:mouse-circle-linear` | Indicateur scroll (hero) |
| Guillemets | `solar:quote-right-linear` | Temoignages |
| Appareil photo | `solar:camera-linear` | Social (Instagram) |
| Enveloppe | `solar:letter-linear` | Social (email) |

---

## 8. Breakpoints responsive

Tailwind v4 (mobile-first) :

| Prefix | Min-width | Cible |
|--------|----------|-------|
| (none) | 0 | Mobile |
| `md:` | 768px | Tablette |
| `lg:` | 1024px | Desktop |

Patterns recurrents :
- Grilles : `grid-cols-1 md:grid-cols-2` ou `grid-cols-1 md:grid-cols-3`
- Flex direction : `flex-col lg:flex-row` (story)
- Sticky : `lg:sticky top-0` (story image)
- Display : `hidden md:flex` (nav desktop)

---

## 9. Layout patterns

### Section plein ecran avec image de fond

```html
<section class="relative py-32 text-white text-center overflow-hidden">
  <div class="absolute inset-0 w-full h-full">
    <img src="..." alt="..." class="w-full h-full object-cover filter grayscale" />
    <div class="absolute inset-0 bg-edit-teal/90 mix-blend-multiply"></div>
    <div class="absolute inset-0 bg-black/60"></div>
  </div>
  <div class="relative z-10 max-w-7xl mx-auto px-6">
    <!-- contenu -->
  </div>
</section>
```

### Section sticky scroll (narrative)

```html
<section class="relative bg-white text-black">
  <div class="flex flex-col lg:flex-row relative">
    <div class="lg:w-1/2 lg:sticky top-0 h-screen overflow-hidden">
      <img src="..." class="w-full h-full object-cover" />
    </div>
    <div class="lg:w-1/2 px-6 py-24 lg:px-20 flex flex-col gap-16">
      <!-- blocs narratifs avec .fade-up -->
    </div>
  </div>
</section>
```

### Section sombre avec grille de fond

```html
<section class="py-32 bg-edit-dark text-white relative overflow-hidden">
  <div class="absolute inset-0 opacity-[0.03]"
       style="background-image: linear-gradient(#fff 1px, transparent 1px),
                               linear-gradient(to right, #fff 1px, transparent 1px);
              background-size: 4rem 4rem;">
  </div>
  <div class="max-w-7xl mx-auto px-6 relative z-10">
    <!-- contenu -->
  </div>
</section>
```

---

## 10. Filtres d'image

Appliques sur les photos pour un rendu brut et cohérent :

| Classe | Effet | Usage |
|--------|-------|-------|
| `filter grayscale` | Niveaux de gris | Toutes les images |
| `contrast-125` | Contraste +25% | Hero, story |
| `contrast-150` | Contraste +50% | Movement (plus dur) |
| `object-cover` | Cover | Toutes les images pleine section |
| `object-center` | Centrage | Hero |
