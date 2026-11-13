# Migration o2switch + WordPress

Objectif : publier les pages Astro prioritaires sans changer les DNS et sans casser les pages WordPress conservées.

## Principe retenu

- DNS conservés chez o2switch.
- WordPress reste en place pour `/contact/`, les mentions légales, les CGV et les autres routes historiques non redirigées.
- Astro fournit `/`, `/club/`, `/stages/`, `/veloecole/`, `/faq/`, `/confidentialite/`, la page 404 et les ressources statiques.
- Apache sert les fichiers réels avant de laisser WordPress gérer les permaliens.

## Avant action

1. Exporter/sauvegarder les pages WordPress actuelles Accueil et Stages.
2. Télécharger une copie de `public_html/.htaccess`.
3. Vérifier que `public_html/index.html`, `public_html/_astro/`, `public_html/images/` et `public_html/stages/` n'existent pas déjà, ou les sauvegarder si présents.
4. Garder l'accès FTP/cPanel ouvert pour retour arrière rapide.

## Déploiement

1. Lancer `npm run build` localement.
2. Envoyer le contenu complet de `dist/` dans `public_html/`, sans inclure le dossier `dist` lui-même.
3. Ne pas supprimer WordPress.
4. Ne pas déplacer `index.php`.

## Déploiement automatique

Le workflow `.github/workflows/deploy-o2switch.yml` déploie `dist/` à chaque push sur `main` et peut aussi être lancé manuellement.

- Le build est recréé avec Node.js 22 et `npm ci`.
- L'adresse IP temporaire du runner GitHub est ajoutée à la liste blanche SSH o2switch, puis retirée même si le déploiement échoue.
- La clé SSH est dédiée à GitHub Actions et la clé hôte de `reload.o2switch.net` est épinglée.
- `rsync` n'utilise pas `--delete` et exclut `.htaccess` : WordPress et la configuration serveur restent en place.
- Les secrets GitHub requis sont `O2SWITCH_HOST`, `O2SWITCH_USER`, `O2SWITCH_SSH_KEY` et `O2SWITCH_CPANEL_TOKEN`.
- Le jeton cPanel `github-actions-wildbike-deploy` expire le 4 novembre 2027 et devra être renouvelé avant cette date.
- Les fichiers remplacés sont sauvegardés hors de la racine publique dans `/home/bogi5130/deploy-backups/<identifiant-exécution-GitHub>/`.
- Les permissions publiées sont `0755` pour les dossiers et `0644` pour les fichiers ; les fichiers sont transférés avec `--delay-updates`.
- `npm run verify:production` compare les huit pages principales au build, vérifie leurs ressources, la redirection boutique, la CSP Stage Control et la page Contact WordPress.

### Utilisation courante

1. Modifier les sources, lancer `npm run build` et contrôler le diff.
2. Committer uniquement les fichiers voulus et pousser sur `main`.
3. Suivre `gh run list --workflow deploy-o2switch.yml`, puis `gh run watch <id> --exit-status`.
4. En cas d'échec, lire `gh run view <id> --log-failed` avant toute nouvelle tentative.
5. Pour relancer sans nouveau commit : `gh workflow run deploy-o2switch.yml --ref main`.

Les secrets sont administrés dans GitHub > Settings > Secrets and variables > Actions. Ne pas copier leurs valeurs dans les notes. Les changements du fichier serveur `.htaccess` restent une opération distincte du déploiement statique.

### Retour arrière du contenu statique

Pour une modification versionnée, créer un commit de retour arrière avec `git revert <commit>`, puis pousser sur `main`. Pour une restauration ciblée depuis l'hébergement, comparer les fichiers courants aux copies dans `deploy-backups/<id>/` et restaurer seulement les fichiers concernés. Les sauvegardes rsync contiennent les fichiers remplacés, pas une copie complète du site.

## Règles .htaccess optionnelles

Si `/` ou `/stages/` continuent d'afficher WordPress après upload, ajouter ces règles tout en haut de `public_html/.htaccess`, avant le bloc WordPress :

```apache
DirectoryIndex index.html index.php

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule ^stage/?$ /stages/ [R=301,L]
RewriteRule ^$ /index.html [L]
RewriteRule ^stages/?$ /stages/index.html [L]
</IfModule>
```

## Vérification immédiate

Tester :

- `https://wildbike.fr/` doit afficher la nouvelle homepage Astro.
- `https://wildbike.fr/stages/` doit afficher la nouvelle page Stages Astro.
- `https://wildbike.fr/stage/` doit rediriger vers `/stages/`.
- `https://wildbike.fr/club/` doit afficher la page Astro Club.
- `https://wildbike.fr/veloecole/` doit afficher la page Astro Vélo-école.
- `https://wildbike.fr/faq/` doit afficher la page Astro FAQ.
- `https://wildbike.fr/confidentialite/` doit afficher la politique de confidentialité Astro.
- `https://wildbike.fr/contact/` doit rester WordPress.
- `https://wildbike.fr/_astro/` doit charger les assets Astro.
- Les images `/images/...` doivent s'afficher.

## Retour arrière

Supprimer ou renommer les fichiers statiques Astro publiés :

- `public_html/index.html`
- `public_html/club/`, `public_html/stages/`, `public_html/veloecole/`, `public_html/faq/` et `public_html/confidentialite/`
- `public_html/_astro/`
- `public_html/images/`

Puis retirer les règles ajoutées dans `.htaccess` si elles ont été ajoutées. WordPress reprendra alors l'accueil et la page Stages.
