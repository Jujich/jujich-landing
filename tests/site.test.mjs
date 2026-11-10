import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { projects, projectsData } from '../app/data/projects.ts'
import { profile, portfolioLinks, profileData, experienceData, portfolioLinksData } from '../app/data/profile.ts'

test('project data has stable unique ids and usable case details', () => {
  assert.equal(new Set(projects.map(p => p.id)).size, projects.length)
  for (const p of projects) {
    assert.match(p.id, /^[a-z]+$/)
    assert.ok(p.name && p.description && p.task && p.tags.length && p.features.length)
    for (const category of p.category) assert.ok(['web', 'services', 'mobile'].includes(category))
  }
})

test('public destinations use HTTPS and do not expose infrastructure', () => {
  for (const url of [profile.github, profile.telegram, ...portfolioLinks.map(p => p.url)]) {
    const parsed = new URL(url, 'https://jujich.dev')
    assert.equal(parsed.protocol, 'https:')
    assert.ok(!parsed.username && !parsed.password)
    assert.ok(!/^(localhost|127\.|192\.168\.|10\.)/.test(parsed.hostname))
  }
})

test('download and local assets are actual files in the declared formats', async () => {
  const resumes = await Promise.all(['en', 'ru'].map(language => readFile(`public/kuzma-korolev-resume-${language}.pdf`)))
  for (const pdf of resumes) assert.equal(pdf.subarray(0, 5).toString(), '%PDF-')
  assert.notDeepEqual(resumes[0], resumes[1], 'Each language must have its own résumé')
  assert.deepEqual(await readFile('public/kuzma-korolev-resume.pdf'), resumes[1], 'Previously shared résumé URL serves the current Russian PDF')
  const png = await readFile('public/assets/portrait-upscaled.png')
  assert.equal(png.subarray(1, 4).toString(), 'PNG')
  for (const name of ['cyrillic', 'latin']) {
    const font = await readFile(`public/assets/fonts/manrope-${name}.woff2`)
    assert.equal(font.subarray(0, 4).toString(), 'wOF2')
  }
})

test('published directory has no credentials or operational files', async () => {
  const entries = await readdir('public', { recursive: true, withFileTypes: true })
  for (const entry of entries) {
    assert.ok(!/(credentials|^\.env|^id_rsa|^id_ed25519|\.key$|\.pem$|^research$|^\.git$)/i.test(entry.name), entry.name)
    if (entry.isFile() && /\.(json|js|txt|html|xml|svg)$/.test(entry.name)) {
      const content = await readFile(`${entry.parentPath}/${entry.name}`, 'utf8')
      assert.ok(!/glpat-[a-zA-Z0-9_-]+|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY|192\.168\.98\./.test(content), entry.name)
    }
  }
})

test('EN and RU dictionaries have matching keys and translated content', async () => {
  const en = JSON.parse(await readFile('i18n/locales/en.json', 'utf8'))
  const ru = JSON.parse(await readFile('i18n/locales/ru.json', 'utf8'))
  const flatten = (value, prefix = '') => Object.entries(value).flatMap(([key, val]) => typeof val === 'object' ? flatten(val, `${prefix}${key}.`) : [`${prefix}${key}`]).sort()
  assert.deepEqual(flatten(en), flatten(ru))
  assert.ok(!/[А-Яа-яЁё]/.test(JSON.stringify(en)))
  assert.ok(!/[А-Яа-яЁё]/.test(JSON.stringify(projectsData.en)))
  assert.ok(!/[А-Яа-яЁё]/.test(JSON.stringify(experienceData.en)))
  assert.equal(profileData.en.email, profileData.ru.email)
  const sharedDetails = p => ({id:p.id,tags:p.tags,category:p.category,features:p.features.length})
  assert.deepEqual(projectsData.en.filter(p => p.id !== 'vpn').map(sharedDetails), projectsData.ru.map(sharedDetails))
})

test('EventMatch is featured in both languages while the VPN case is English-only', async () => {
  for (const language of ['en', 'ru']) {
    const eventmatch = projectsData[language].find(p => p.id === 'eventmatch')
    assert.ok(eventmatch, `${language}: EventMatch case exists`)
    assert.equal(eventmatch.name, 'EventMatch')
    assert.equal(eventmatch.tier, 'featured')
  }
  assert.deepEqual(projectsData.ru.filter(p => p.tier === 'featured').map(p => p.id), ['eventmatch', 'school', 'forma', 'crm'])
  assert.deepEqual(projectsData.en.filter(p => p.tier === 'featured').map(p => p.id), ['vpn', 'eventmatch', 'school', 'forma', 'crm'])
  assert.equal(projectsData.en.find(p => p.id === 'vpn')?.name, 'Jujich Services')
  assert.doesNotMatch(JSON.stringify(projectsData.ru), /VPN|Jujich\s*Services/i)
  const ru = JSON.parse(await readFile('i18n/locales/ru.json', 'utf8'))
  assert.doesNotMatch(ru.projects.description, /VPN|Jujich\s*Services/i)
})

test('English résumé omits CSM while the Russian résumé preserves it', () => {
  const isCsmLink = link => /(^|\.)nncsm\.ru$/.test(new URL(link.url, 'https://jujich.dev').hostname)
  assert.ok(experienceData.ru.some(job => job.company === 'Нижегородский ЦСМ'))
  assert.equal(portfolioLinksData.ru.filter(isCsmLink).length, 2)
  assert.ok(!/CSM|ЦСМ|declarations of conformity/i.test(JSON.stringify(experienceData.en)))
  assert.ok(!portfolioLinksData.en.some(isCsmLink))
  assert.deepEqual(portfolioLinksData.en.map(p => p.url), portfolioLinksData.ru.filter(link => !isCsmLink(link)).map(p => p.url))
  assert.equal(experienceData.en.length, experienceData.ru.length - 1)
})

test('Sber preserves both projects and includes the Vite achievement only in English', () => {
  const ru = experienceData.ru.find(job => job.company === 'Сбер')
  const en = experienceData.en.find(job => job.company === 'Sber')
  assert.ok(ru && en)
  for (const job of [ru, en]) {
    assert.ok(job.active)
    assert.match(job.description, /Telegram Mini App/)
    assert.match(job.description, /Next\.js/)
    assert.match(job.description, /Feature-Sliced Design \(FSD\)/)
    assert.match(job.description, /styled-components/)
    for (const tag of ['React', 'Next.js', 'Telegram Mini Apps', 'SDD', 'FSD', 'styled-components']) assert.ok(job.tags.includes(tag))
  }
  assert.match(ru.description, /С сентября 2026.*«Автотрекинг целей B2B\+».*«Поток»/)
  assert.match(en.description, /Since September 2026.*B2B\+ goal-tracking module in POTOK/)
  assert.match(ru.description, /подбору мероприятий с помощью ИИ/)
  assert.match(en.description, /AI-assisted event discovery/)
  assert.equal(ru.period, 'Июль 2026 — сейчас')
  assert.equal(en.period, 'July 2026 — present')
  assert.match(ru.title, /стажировка/)
  assert.equal(en.title, 'Junior Frontend Developer')
  assert.match(en.description, /first month on the internal project.*proposed and successfully implemented a migration to Vite/)
  assert.match(en.description, /build time from 15 to 5 minutes \(3× faster\)/)
  assert.ok(en.tags.includes('Vite'))
  assert.doesNotMatch(JSON.stringify(ru), /Vite|\b(?:15|5)\b|3[×x]/i)
})
