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
  const locale = language.slice(0, 2)
  const resumeLinks = [...html.matchAll(/<a\b[^>]*href="([^"]+\.pdf)"[^>]*>/g)]
  assert.equal(resumeLinks.length, 2, `${file}: résumé links in hero and footer`)
  for (const link of resumeLinks) {
    assert.equal(link[1], `/kuzma-korolev-resume-${locale}.pdf`, `${file}: résumé language`)
    assert.match(link[0], /\bdownload(?:[\s=>])/, `${file}: résumé download`)
  }
  if (locale === 'en') {
    assert.ok(!/Nizhny Novgorod CSM|CSM customer portal|ЦСМ|nncsm\.ru/.test(html), `${file}: CSM is omitted`)
  } else {
    assert.ok(html.includes('Нижегородский ЦСМ') && html.includes('https://nncsm.ru') && html.includes('https://lk.nncsm.ru'), `${file}: CSM is preserved`)
  }
}
for (const asset of ['kuzma-korolev-resume-en.pdf', 'kuzma-korolev-resume-ru.pdf', 'assets/portrait.png', 'assets/og-cover.png', 'assets/og-cover-ru.png', 'assets/fonts/manrope-latin.woff2', 'assets/fonts/manrope-cyrillic.woff2', 'sitemap.xml', 'robots.txt']) {
  assert.ok((await stat(join(root, asset))).size > 0, asset)
}
const entries = await readdir(root, { recursive: true })
assert.ok(!entries.some(file => /(?:^|\/)(?:\.credentials|\.local|\.env|research|ops|\.git)(?:$|\/)/.test(file)), 'Private files must never be published')
console.log('Generated EN/RU pages, SEO metadata and public assets verified.')
