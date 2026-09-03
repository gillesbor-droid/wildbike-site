@echo off
echo.
echo === Initialisation du depot Git pour Wild Bike ===
echo.

git init
git add -A
git commit -m "Initial commit: Wild Bike site (Astro + Tailwind v4)"

echo.
echo === Depot initialise. Prochaines etapes ===
echo.
echo 1. Cree un repo sur GitHub : https://github.com/new
echo    Nom suggere : wildbike-site
echo.
echo 2. Connecte le repo local :
echo    git remote add origin https://github.com/TON-USER/wildbike-site.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Configure Cloudflare Pages (voir README.md)
echo.
pause
