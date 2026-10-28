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
  assert.match(html, /id="project-eventmatch"/, `${file}: EventMatch case`)
  assert.ok(html.includes('EventMatch'), `${file}: EventMatch name`)
  if (locale === 'en') {
    assert.match(html, /id="project-vpn"/, `${file}: VPN case is preserved`)
    assert.ok(html.includes('Jujich Services'), `${file}: Jujich Services name`)
  } else {
    assert.doesNotMatch(html, /id="project-vpn"|Jujich\s+Services|\bVPN\b/i, `${file}: VPN case is omitted`)
  }
  const resumeLinks = [...html.matchAll(/<a\b[^>]*href="([^"]+\.pdf)"[^>]*>/g)]
  assert.equal(resumeLinks.length, 2, `${file}: résumé links in hero and footer`)
  for (const link of resumeLinks) {
    assert.equal(link[1], `/kuzma-korolev-resume-${locale}.pdf`, `${file}: résumé language`)
    assert.match(link[0], /\bdownload(?:[\s=>])/, `${file}: résumé download`)
  }
  const experience = html.match(/<section[^>]*id="experience"[^>]*>([\s\S]*?)<\/section>/)?.[1]
  assert.ok(experience, `${file}: experience section`)
  assert.ok(experience.includes('Telegram Mini App') && experience.includes('Feature-Sliced Design (FSD)') && experience.includes('styled-components'), `${file}: both Sber projects and internal project stack`)
  if (locale === 'en') {
    assert.ok(!/Nizhny Novgorod CSM|CSM customer portal|ЦСМ|nncsm\.ru/.test(html), `${file}: CSM is omitted`)
    assert.ok(experience.includes('Since September 2026') && experience.includes('internal automated key-results tracker for senior executives'), `${file}: internal Sber project`)
    assert.ok(experience.includes('migration to Vite') && experience.includes('build time from 15 to 5 minutes (3× faster)'), `${file}: English Vite achievement`)
  } else {
    assert.ok(html.includes('Нижегородский ЦСМ') && html.includes('https://nncsm.ru') && html.includes('https://lk.nncsm.ru'), `${file}: CSM is preserved`)
    assert.ok(experience.includes('С сентября 2026') && experience.includes('автотрекера ключевых результатов руководителей высшего звена'), `${file}: internal Sber project`)
    assert.doesNotMatch(experience, /Vite|\b(?:15|5)\b|3[×x]/i, `${file}: Vite achievement excluded from Russian`)
  }
}
for (const asset of ['kuzma-korolev-resume-en.pdf', 'kuzma-korolev-resume-ru.pdf', 'assets/portrait-upscaled.png', 'assets/og-cover.png', 'assets/og-cover-ru.png', 'assets/fonts/manrope-latin.woff2', 'assets/fonts/manrope-cyrillic.woff2', 'sitemap.xml', 'robots.txt']) {
  assert.ok((await stat(join(root, asset))).size > 0, asset)
}
const entries = await readdir(root, { recursive: true })
assert.ok(!entries.some(file => /(?:^|\/)(?:\.credentials|\.local|\.env|research|ops|\.git)(?:$|\/)/.test(file)), 'Private files must never be published')
console.log('Generated EN/RU pages, SEO metadata and public assets verified.')
