import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const origin = 'https://wildbike.fr';
const routes = ['/', '/club/', '/stages/', '/veloecole/', '/faq/', '/confidentialite/', '/app-stage/', '/retour-stage/'];
const assets = new Set();
const normalize = html => html.replace(/\r\n/g, '\n').replace(/charset="utf-8"/gi, 'charset="utf-8"');
const revision = process.env.GITHUB_SHA || Date.now().toString();

async function request(path, options = {}) {
  const url = new URL(path, origin);
  url.searchParams.set('deploy-check', revision);
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
  return response;
}

for (const route of routes) {
  const response = await request(route);
  const actual = await response.text();
  const expected = await readFile(new URL(`../dist${route}index.html`, import.meta.url), 'utf8');
  assert.equal(normalize(actual) === normalize(expected), true, `${route}: deployed HTML differs from build`);
  for (const match of actual.matchAll(/(?:src|href)="(\/(?:_astro|images|fonts)\/[^"#]+|\/[^/"?]+\.js(?:\?[^"#]*)?)"/g)) {
    assets.add(match[1].replaceAll('&amp;', '&'));
  }
  if (route === '/') {
    const shopLinks = [...expected.matchAll(/href="(https:\/\/www\.helloasso\.com\/associations\/wild-bike\/boutiques\/[^\"]+)"/g)];
    assert.ok(shopLinks.length >= 2, 'Homepage shop links missing');
    const redirect = await fetch(`${origin}/boutique/?deploy-check=${revision}`, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
    assert.equal(redirect.status, 301, 'Boutique redirect status');
    assert.equal(new URL(redirect.headers.get('location')).pathname, new URL(shopLinks[0][1]).pathname, 'Boutique redirect destination');
    assert.equal(new URL(redirect.headers.get('location')).origin, 'https://www.helloasso.com', 'Boutique redirect host');
  }
  if (route === '/app-stage/') {
    assert.ok(response.headers.get('content-security-policy')?.includes('https://automate.gilles-borrego.com'), 'Stage API missing from CSP');
  }
  console.log(`OK ${route}`);
}

for (const asset of assets) await request(asset, { method: 'HEAD' });
await request('/contact/');
console.log(`OK ${assets.size} assets, boutique redirect and WordPress contact page`);
