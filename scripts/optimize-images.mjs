import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const imageDirectory = new URL('public/images/', root);
const dataDirectory = new URL('src/data/', root);
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png']);
const manifest = {};

const youtubeImages = {
  JNNDjmnYBlE: 'maxresdefault',
  V4fuo3SiJBU: 'maxresdefault',
  lLm24SQ0_OM: 'maxresdefault',
  abVeGJ98rkM: 'maxresdefault',
  _GK4c1j2Au4: 'maxresdefault',
  lJF6l3jcok4: 'maxresdefault',
  C8eh1jEEr0E: 'hqdefault',
  bRntcQCttnQ: 'maxresdefault',
  '0kX6ciVCMHs': 'maxresdefault',
  '3L7iUjz4Z1E': 'maxresdefault',
  h3r1iKzrMmI: 'maxresdefault',
  qUronAMYsMY: 'hqdefault',
  'u9-XTTKYUks': 'maxresdefault',
  cV0ubZaSz8A: 'maxresdefault',
  Czt1bijOqUU: 'maxresdefault',
};

await mkdir(imageDirectory, { recursive: true });
await mkdir(dataDirectory, { recursive: true });

async function optimize(input, sourceKey, outputBaseName) {
  const resolvedInput = input instanceof URL ? fileURLToPath(input) : input;
  const image = sharp(resolvedInput, { failOn: 'none' }).rotate();
  const metadata = await image.metadata();
  const largeWidth = Math.min(metadata.width ?? 1600, 1600);
  const smallWidth = Math.min(metadata.width ?? 800, 800);
  const largeName = `${outputBaseName}.webp`;
  const smallName = `${outputBaseName}-800.webp`;

  await image
    .clone()
    .resize({ width: largeWidth, withoutEnlargement: true })
    .webp({ quality: 78, effort: 5 })
    .toFile(fileURLToPath(new URL(largeName, imageDirectory)));
  await image
    .clone()
    .resize({ width: smallWidth, withoutEnlargement: true })
    .webp({ quality: 76, effort: 5 })
    .toFile(fileURLToPath(new URL(smallName, imageDirectory)));

  const optimizedMetadata = await sharp(fileURLToPath(new URL(largeName, imageDirectory))).metadata();
  manifest[sourceKey] = {
    src: `/images/${largeName}`,
    srcset: `/images/${smallName} ${smallWidth}w, /images/${largeName} ${largeWidth}w`,
    width: optimizedMetadata.width,
    height: optimizedMetadata.height,
  };
}

for (const fileName of await readdir(imageDirectory)) {
  const extension = path.extname(fileName).toLowerCase();
  if (!supportedExtensions.has(extension)) continue;

  const baseName = path.basename(fileName, extension);
  await optimize(new URL(fileName, imageDirectory), `/images/${fileName}`, baseName);
}

for (const [id, variant] of Object.entries(youtubeImages)) {
  const remoteUrl = `https://i.ytimg.com/vi/${id}/${variant}.jpg`;
  const response = await fetch(remoteUrl);
  if (!response.ok) throw new Error(`Impossible de télécharger ${remoteUrl}: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await optimize(buffer, remoteUrl, `youtube-${id}`);
}

await writeFile(
  new URL('image-manifest.json', dataDirectory),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`${Object.keys(manifest).length} images optimisées.`);
