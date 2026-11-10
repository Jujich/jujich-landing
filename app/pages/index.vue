<script setup lang="ts">
import { profileData, experienceData, skillsData, portfolioLinksData } from '~/data/profile'
import { projectsData, experimentsData } from '~/data/projects'
const { t, locale } = useI18n()
const language = computed(() => locale.value === 'ru' ? 'ru' : 'en')
const resumePath = computed(() => `/kuzma-korolev-resume-${language.value}.pdf`)
const profile = computed(() => profileData[language.value])
const experience = computed(() => experienceData[language.value])
const skills = computed(() => skillsData[language.value])
const projects = computed(() => projectsData[language.value])
const projectOrder = ['eventmatch', 'school', 'crm', 'forma']
const featuredProjects = computed(() => projects.value.filter(project => projectOrder.includes(project.id)).sort((a, b) => projectOrder.indexOf(a.id) - projectOrder.indexOf(b.id)))
const serviceProject = computed(() => projects.value.find(project => project.id === 'vpn'))
const projectColumns = computed(() => [featuredProjects.value.filter((_, i) => i % 2 === 0), featuredProjects.value.filter((_, i) => i % 2 === 1)])
const jobHighlight = (description: string) => language.value === 'en' ? description.match(/Within my first month.*$/)?.[0] : undefined
const roman = (index: number) => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][index] || String(index + 1)
const supportingProjects = computed(() => projects.value.filter(project => project.tier === 'supporting'))
const landingProjects = computed(() => projects.value.filter(project => project.tier === 'landing'))
const portfolioLinks = computed(() => portfolioLinksData[language.value].filter(link => !featuredProjects.value.some(project => project.url === link.url)))
const experiments = computed(() => experimentsData[language.value])
const i18nHead = useLocaleHead({ seo: true })
const pageRoot = ref<HTMLElement | null>(null)
const menuButton = ref<HTMLButtonElement | null>(null)
const siteNav = ref<HTMLElement | null>(null)
const menuOpen = ref(false)
let restoreMenuFocus = true
async function navigateToSection(section: string) {
  if (!menuOpen.value) return
  restoreMenuFocus = false
  menuOpen.value = false
  await nextTick()
  document.getElementById(section)?.focus({ preventScroll: true })
}
usePortfolioMotion(pageRoot, locale)

watch(menuOpen, async (open) => {
  document.documentElement.classList.toggle('menu-open', open)
  await nextTick()
  if (open) siteNav.value?.querySelector<HTMLAnchorElement>('a')?.focus()
  else if (restoreMenuFocus) menuButton.value?.focus({ preventScroll: true })
  restoreMenuFocus = true
})
watch(locale, () => { menuOpen.value = false; copied.value = false; copyError.value = false })
function handleKeydown(event: KeyboardEvent) {
  if (!menuOpen.value) return
  if (event.key === 'Escape') { menuOpen.value = false; return }
  if (event.key !== 'Tab') return
  const items = [...(siteNav.value?.querySelectorAll<HTMLAnchorElement>('a') || []), menuButton.value].filter((item): item is HTMLAnchorElement | HTMLButtonElement => !!item)
  const first = items[0], last = items.at(-1)
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
}
function handleResize() { if (window.innerWidth > 1024) menuOpen.value = false }
onMounted(() => { window.addEventListener('keydown', handleKeydown); window.addEventListener('resize', handleResize) })
onUnmounted(() => {
  document.documentElement.classList.remove('menu-open')
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
})
const copied = ref(false)
const copyError = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.value.email)
    copied.value = true
    copyError.value = false
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => { copied.value = false }, 2500)
  } catch { copyError.value = true }
}
onUnmounted(() => clearTimeout(copyTimer))
useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs,
  link: i18nHead.value.link,
  meta: i18nHead.value.meta,
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: profile.value.name, url: `https://jujich.dev${language.value === 'ru' ? '/ru' : '/'}`, jobTitle: t('meta.jobTitle'), sameAs: [profile.value.github, profile.value.linkedin, profile.value.telegram], knowsLanguage: ['ru', 'en'] }) }]
}))
useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.ogDescription'),
  ogUrl: () => `https://jujich.dev${language.value === 'ru' ? '/ru' : '/'}`,
  ogImage: () => `https://jujich.dev/assets/og-cover${language.value === 'ru' ? '-ru' : ''}.png`
})
</script>

<template>
  <div id="top" ref="pageRoot" :class="`portfolio locale-${language}`">
    <a href="#main" class="skip-link">{{ t('nav.skip') }}</a>
    <header class="site-header wrap">
      <a class="wordmark" href="#top" :aria-label="t('nav.home')" :inert="menuOpen">jujich<span>.dev</span></a>
      <nav id="site-nav" ref="siteNav" :aria-label="t('nav.label')">
        <a href="#projects" @click="navigateToSection('projects')">{{ t('nav.projects') }}()</a><a href="#experience" @click="navigateToSection('experience')">{{ t('nav.experience') }}()</a><a href="#about" @click="navigateToSection('about')">{{ t('nav.about') }}()</a>
      </nav>
      <div class="header-actions">
        <div class="language-switch" :aria-label="t('nav.language')" :inert="menuOpen"><SwitchLocalePathLink locale="en" :class="{ selected: language === 'en' }" :aria-current="language === 'en' ? 'page' : undefined" lang="en">EN</SwitchLocalePathLink><span>/</span><SwitchLocalePathLink locale="ru" :class="{ selected: language === 'ru' }" :aria-current="language === 'ru' ? 'page' : undefined" lang="ru">RU</SwitchLocalePathLink></div>
        <a class="header-contact" href="#contact" :inert="menuOpen">{{ t('nav.contact') }} <ArrowIcon /></a>
        <button ref="menuButton" class="menu-btn" type="button" :aria-label="t(menuOpen ? 'redesign.menu.close' : 'redesign.menu.open')" aria-controls="site-nav" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen"><span></span><span></span><span></span></button>
      </div>
    </header>

    <main id="main" :inert="menuOpen">
      <section class="hero wrap" aria-labelledby="hero-title">
        <div class="hero-meta"><p><i class="status-dot"></i>{{ t('redesign.hero.available') }}</p><p class="code">{{ t('redesign.hero.meta') }}</p><p class="code">{{ t('redesign.hero.location') }}</p></div>
        <div class="hero-name" aria-hidden="true"><p class="hero-display"><span v-for="(letter, index) in 'KOROLEV'" :key="index" :class="index < 4 ? 'hl' : 'hr'">{{ letter }}</span></p></div>
        <div class="hero-stage">
          <div class="hero-side hero-left">
            <div><p class="eyebrow">{{ t('redesign.hero.eyebrow') }}</p><h1 id="hero-title">{{ t('redesign.hero.line1') }}<br>{{ t('redesign.hero.line2') }} <span>{{ t('redesign.hero.line3') }}</span></h1></div>
            <div><p class="hero-description">{{ t('redesign.hero.description') }}</p><div class="hero-actions"><a class="btn btn-dark" href="#projects">{{ t('hero.projects') }} <span class="btn-ico"><ArrowIcon /></span></a><a class="text-link" :href="resumePath" download>{{ t('hero.resume') }} <ArrowIcon direction="down" /></a></div></div>
          </div>
          <figure class="hero-figure"><img src="/assets/redesign/portrait.webp" :alt="profile.name" width="899" height="1500" fetchpriority="high"></figure>
          <div class="hero-side hero-right"><dl class="hero-stats"><div><dt>{{ t('redesign.hero.production') }}</dt><dd>{{ t('redesign.hero.years') }}</dd></div></dl></div>
        </div>
        <div class="hero-foot" aria-hidden="true"><span class="hero-foot-note"></span><FolderTab class="hero-tab" /></div>
      </section>

      <section id="approach" class="statement wrap" :aria-label="t('redesign.approach.label')">
        <div class="statement-head"><p class="eyebrow"><b>I</b><span class="code">{{ t('redesign.approach.label') }}</span></p><p class="eyebrow"><span class="code">React · Next.js · TypeScript</span></p></div>
        <div class="statement-body"><p class="statement-text" data-split><span v-for="line in 4" :key="line" :class="`l${line}`">{{ t(`redesign.approach.line${line}`) }}</span></p><figure class="statement-cursor" aria-hidden="true" data-parallax=".12"><img src="/assets/redesign/cursor.png" alt="" width="579" height="786" loading="lazy"></figure></div>
        <div class="statement-foot"><ul class="stack-line" :aria-label="t('projects.technologies')" data-reveal><li v-for="(tech, index) in ['React', 'Next.js', 'TypeScript', 'Vue / Nuxt', 'NestJS', 'CI/CD']" :key="tech" :class="{ accent: index < 2 }">{{ tech }}</li></ul><p class="comment" data-reveal>{{ t('redesign.approach.note') }}</p></div>
      </section>

      <section id="projects" tabindex="-1" class="projects-wrap" aria-labelledby="projects-title">
        <div class="seam-top" aria-hidden="true"><div class="seam-tab"><svg viewBox="0 0 440 58" preserveAspectRatio="none"><path d="M0 58C44 58 50 0 96 0H344C390 0 396 58 440 58Z" /></svg></div></div>
        <div class="dark projects-section"><div class="wrap">
          <div class="scatter"><p class="eyebrow"><b>II</b><span class="code">{{ t('projects.featured') }}</span></p><h2 id="projects-title"><span class="st scatter-first" data-split>{{ t('redesign.projects.line1') }}</span><span class="st st-soft scatter-second" data-split>{{ t('redesign.projects.line2') }}</span></h2><p class="comment scatter-note scatter-aside" data-reveal>{{ t('projects.description') }}</p></div>
          <div class="folder-grid"><div v-for="(column, columnIndex) in projectColumns" :key="columnIndex" class="folder-col" :class="{ 'folder-col--offset': columnIndex === 1 }"><ProjectFolder v-for="project in column" :key="project.id" :project="project" :number="roman(projectOrder.indexOf(project.id))" :style="{ order: projectOrder.indexOf(project.id) }" /></div></div>
          <section class="sub-block" aria-labelledby="supporting-title"><div class="sub-head"><p class="eyebrow"><span class="code">{{ t('projects.supportingEyebrow') }}</span></p><h3 id="supporting-title" data-split>{{ t('projects.supportingTitle') }}</h3></div><div class="sub-body supporting-grid"><ProjectFolder v-for="project in supportingProjects" :key="project.id" :project="project" supporting /></div></section>
          <section class="sub-block" aria-labelledby="lab-title"><div class="sub-head"><p class="eyebrow"><span class="code">{{ t('projects.labEyebrow') }}</span></p><h3 id="lab-title" data-split>{{ t('projects.labTitle') }}</h3></div><div class="sub-body lab-items">
            <article v-if="serviceProject" id="project-vpn" class="lab-feature" data-reveal><div><h4>{{ serviceProject.name }}</h4><span>{{ serviceProject.status }}</span></div><div class="lab-body"><p class="comment">{{ serviceProject.description }}</p><ul class="tags" :aria-label="t('projects.technologies')"><li v-for="tag in serviceProject.tags" :key="tag">{{ tag }}</li></ul><details class="project-details case"><summary :aria-label="t('projects.details')"><ArrowIcon class="case-arrow" /></summary><div class="project-details-content"><h4>// {{ t('projects.task') }}</h4><p>{{ serviceProject.task }}</p><h4>// {{ t('projects.features') }}</h4><ul><li v-for="feature in serviceProject.features" :key="feature">{{ feature }}</li></ul><p class="project-note">{{ serviceProject.note }}</p></div></details></div></article>
            <article v-for="experiment in experiments" :key="experiment.name" class="lab-feature" data-reveal><div><h4>{{ experiment.name }}</h4><span>{{ experiment.status }}</span></div><div class="lab-body"><p class="comment">{{ experiment.description }}</p></div></article>
          </div></section>
        </div></div>
        <div class="seam-down" aria-hidden="true"><svg viewBox="0 0 440 58" preserveAspectRatio="none"><path d="M0 0C44 0 50 58 96 58H344C390 58 396 0 440 0Z" /></svg></div>
      </section>

      <section class="websites-section wrap" aria-labelledby="websites-title"><div class="sub-block websites-work"><div class="websites-top"><div class="sub-head"><p class="eyebrow"><span class="code">{{ t('redesign.websites.label') }}</span></p><h3 id="websites-title" data-split>{{ t('redesign.websites.line1') }}<br><em>{{ t('redesign.websites.line2') }}</em></h3></div><div class="websites-intro"><p>{{ t('projects.websitesDescription') }}</p><p v-for="project in landingProjects" :key="project.id" class="landing-mention"><span>{{ project.name }}</span> — {{ project.description }}</p></div></div><div class="site-list"><a v-for="(link, index) in portfolioLinks" :key="link.url" class="site-row" :class="index % 2 ? 'site-l' : 'site-r'" :data-reveal="index % 2 ? 'from-left' : 'from-right'" :href="link.url" target="_blank" rel="noopener noreferrer"><span class="site-num">{{ roman(index) }}</span><span class="site-name">{{ link.name }}</span><span class="site-meta">{{ link.type }}</span><span class="site-arrow"><ArrowIcon /></span></a></div></div></section>

      <div class="wrap interlude-wrap"><section class="interlude" aria-labelledby="interlude-title" data-parallax=".08"><p class="eyebrow"><b>III</b><span class="code">{{ t('redesign.interlude.label') }}</span></p><h2 id="interlude-title" data-split>{{ t('redesign.interlude.line1') }}<br><span class="soft">{{ t('redesign.interlude.line2') }}</span></h2><p class="comment">{{ t('redesign.interlude.note') }}</p></section></div>

      <section id="experience" tabindex="-1" class="experience-section section-pad wrap" aria-labelledby="experience-title"><div class="scatter"><p class="eyebrow"><b>IV</b><span class="code">{{ t('experience.eyebrow') }}</span></p><p class="comment scatter-note experience-note" data-reveal>{{ t('experience.description') }}</p><h2 id="experience-title"><span class="st st-r experience-heading" data-split>{{ language === 'en' ? t('redesign.experience.line2') : t('redesign.experience.line1') }}</span></h2></div><div class="timeline"><article v-for="(job, index) in experience" :key="job.company" class="folder job" :class="{ 'f-ink': index === 0 }" data-reveal="folder" :style="{ '--i': index }"><div class="folder-body"><div class="job-name"><h3>{{ job.company }}</h3><p>{{ job.title }}</p></div><div class="job-content"><p v-if="jobHighlight(job.description)" class="job-highlight">{{ jobHighlight(job.description) }}</p><p>{{ job.description.replace(jobHighlight(job.description) || '', '').trim() }}</p><ul class="tags"><li v-for="tag in job.tags" :key="tag">{{ tag }}</li></ul></div></div><FolderTab><span :class="{ 'current-period': job.active }">{{ job.period }}</span></FolderTab></article></div></section>

      <section class="skills-section wrap" aria-labelledby="skills-title"><div class="scatter"><p class="eyebrow"><b>V</b><span class="code">{{ t('skills.eyebrow') }}</span></p><h2 id="skills-title"><span class="st skills-first" data-split>{{ t('redesign.skills.line1') }}</span><span class="st st-soft st-gap scatter-second" data-split>{{ t('redesign.skills.line2') }}</span></h2><p class="comment scatter-note scatter-aside" data-reveal>{{ t('skills.description') }}</p></div><div class="marquee" aria-hidden="true"><div class="marquee-row" data-marquee="-.6"><template v-for="(tech, index) in ['react', 'next.js', 'typescript', 'vue', 'nuxt', 'tailwind', 'zustand', 'pinia', 'react', 'next.js', 'typescript']" :key="index"><span>{{ tech }}</span><i></i></template></div><div class="marquee-row outline" data-marquee=".6"><template v-for="(tech, index) in ['node.js', 'nestjs', 'prisma', 'postgresql', 'docker', 'nginx', 'gitlab ci', 'node.js', 'nestjs', 'prisma']" :key="index"><span>{{ tech }}</span><i></i></template></div></div><div class="skills-grid"><article v-for="(group, index) in skills" :key="group.title" class="folder" :class="{ 'f-ink': index === 0 }" data-reveal="folder"><div class="folder-body"><span class="skill-index">{{ roman(index) }}</span><h3>{{ group.title }}</h3><p class="comment">{{ group.note }}</p><ul><li v-for="skill in group.items" :key="skill" :class="{ primary: ['React', 'Next.js', 'TypeScript'].includes(skill) }">{{ skill }}</li></ul></div><FolderTab aria-hidden="true" /></article></div></section>

      <section id="about" tabindex="-1" class="about section-pad wrap" aria-labelledby="about-title"><div class="about-head"><p class="eyebrow"><b>VI</b><span class="code">{{ t('about.eyebrow') }}</span></p><h2 id="about-title" class="st" data-split>{{ t('redesign.about.title') }}</h2><div class="about-note" data-reveal><p class="comment">{{ t('redesign.about.note') }}</p><img class="about-glasses" src="/assets/redesign/glasses.webp" alt="" aria-hidden="true" width="1424" height="372" loading="lazy"></div></div><div class="about-body"><p class="about-lines" data-split><span v-for="line in 4" :key="line" :class="`l${line}`">{{ t(`redesign.about.line${line}`) }}</span></p><p class="about-caption code" aria-hidden="true">spec → build → verify</p></div><div class="about-grid"><figure class="about-laptop" aria-hidden="true" data-reveal="scale"><img src="/assets/redesign/laptop.webp" alt="" width="1100" height="1475" loading="lazy"></figure><article class="folder education" data-reveal="folder"><div class="folder-body"><span class="code">{{ t('about.education') }}</span><h3>{{ profile.education }}</h3><p>{{ profile.degree }}<br>{{ profile.graduation }}</p><div class="education-extra"><span>{{ t('about.flang') }}</span><span>{{ t('about.academy') }}</span></div><div class="languages"><span>{{ t('about.russian') }} · {{ t('about.native') }}</span><span>{{ t('about.english') }} · {{ t('about.advanced') }}</span></div></div><FolderTab aria-hidden="true" /></article><figure class="folder motto" data-reveal="folder" :aria-label="t('redesign.mottoLabel')"><div class="folder-body"><div class="motto-bar" aria-hidden="true"><i></i><i></i><i></i></div><pre><code><span class="ln"><span class="kw">if</span> success() == <span class="bool">True</span>:</span><span class="ln">    <span class="fn">celebrate</span>()</span><span class="ln"><span class="kw">while</span> success() == <span class="bool">False</span>:</span><span class="ln">    <span class="fn">try_again</span>()</span><span class="ln">    <span class="fn">be_awesome</span>()<span class="caret" aria-hidden="true"></span></span></code></pre></div><FolderTab aria-hidden="true" /></figure></div></section>

      <div class="seam-top seam-contact" aria-hidden="true"><div class="seam-tab"><svg viewBox="0 0 440 58" preserveAspectRatio="none"><path d="M0 58C44 58 50 0 96 0H344C390 0 396 58 440 58Z" /></svg></div></div>
      <section id="contact" class="contact-section" aria-labelledby="contact-title"><div class="contact-glow" aria-hidden="true"></div><img class="contact-cursor" src="/assets/redesign/cursor.webp" alt="" aria-hidden="true" width="579" height="786" loading="lazy" data-parallax=".1"><div class="wrap"><div class="contact-top"><span class="eyebrow"><span class="code">{{ t('contact.eyebrow') }}</span></span><span><i class="status-dot"></i>{{ t('contact.hello') }}</span></div><div class="contact-main"><h2 id="contact-title" data-split>{{ t('redesign.contact.line1') }} <span class="soft">{{ t('redesign.contact.line2') }}</span></h2></div><div class="contact-bottom"><a class="btn btn-olive" :href="profile.linkedin" target="_blank" rel="noopener noreferrer">{{ t('contact.linkedin') }} <span class="btn-ico"><ArrowIcon /></span></a><div class="email-group"><a :href="`mailto:${profile.email}`">{{ profile.email }}</a><button type="button" @click="copyEmail" :aria-label="copied ? t('contact.copied') : t('contact.copy')"><span v-if="copied" aria-hidden="true">✓</span><svg v-else class="copy-ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="8.5" y="8.5" width="12" height="12" rx="3.2" /><path d="M15.5 5.6V5.5A2.5 2.5 0 0 0 13 3H6.5A3.5 3.5 0 0 0 3 6.5V13a2.5 2.5 0 0 0 2.5 2.5h.1" /></svg></button><span class="copy-feedback" role="status">{{ copied ? t('contact.copied') : copyError ? t('contact.copyError') : '' }}</span></div></div></div></section>
    </main>
    <div class="site-footer-band" :inert="menuOpen"><footer class="site-footer wrap"><a class="wordmark" href="#top" :aria-label="t('nav.top')">jujich<span>.dev</span></a><p>{{ profile.name }} · 2026</p><div><a :href="profile.github" target="_blank" rel="noopener noreferrer">GitHub <ArrowIcon /></a><a href="https://github.com/Jujich/jujich-landing" target="_blank" rel="noopener noreferrer" :aria-label="t('footer.sourceLabel')">{{ t('footer.source') }} <ArrowIcon /></a><a :href="profile.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowIcon /></a><a :href="resumePath" download>{{ t('hero.resume') }} <ArrowIcon direction="down" /></a></div></footer></div>
  </div>
</template>
