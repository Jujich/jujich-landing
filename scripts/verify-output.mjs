import { readFile, stat, readdir } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { join } from 'node:path'

const root = '.output/public'
for (const [file, language, title, canonical] of [
  ['index.html', 'en-US', 'From interface', 'https://jujich.dev/'],
  ['ru/index.html', 'ru-RU', 'От интерфейса', 'https://jujich.dev/ru']
]) {
  const html = await readFile(join(root, file), 'utf8')
  assert.ok(html.includes(`lang="${language}"`), `${file}: lang`)
  assert.ok(html.includes(title), `${file}: translated HTML`)
  const canonicalMatch = html.match(/rel="canonical" href="([^"]+)"/)
  assert.ok(canonicalMatch, `${file}: canonical exists`)
  assert.equal(new URL(canonicalMatch[1]).href, new URL(canonical).href, `${file}: canonical`)
  assert.ok(html.includes('hreflang="en-US"') && html.includes('hreflang="ru-RU"'), `${file}: hreflang`)
  assert.ok(!/glpat-[\w-]+|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY|192\.168\.98\./.test(html), `${file}: secrets`)
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file}: heading`)
}
for (const asset of ['kuzma-korolev-resume.pdf', 'assets/portrait.png', 'assets/og-cover.png', 'assets/og-cover-ru.png', 'assets/fonts/manrope-latin.woff2', 'assets/fonts/manrope-cyrillic.woff2', 'sitemap.xml', 'robots.txt']) {
  assert.ok((await stat(join(root, asset))).size > 0, asset)
}
const entries = await readdir(root, { recursive: true })
assert.ok(!entries.some(file => /(?:^|\/)(?:\.credentials|\.local|\.env|research|ops|\.git)(?:$|\/)/.test(file)), 'Private files must never be published')
console.log('Generated EN/RU pages, SEO metadata and public assets verified.')
