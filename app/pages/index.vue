<script setup lang="ts">
import { profileData, experienceData, skillsData, portfolioLinksData } from '~/data/profile'
import { projectsData, experimentsData } from '~/data/projects'
const { t, locale } = useI18n()
const language = computed(() => locale.value === 'ru' ? 'ru' : 'en')
const resumePath = computed(() => `/kuzma-korolev-resume-${language.value}.pdf`)
const profile = computed(() => profileData[language.value])
const experience = computed(() => experienceData[language.value])
const skills = computed(() => skillsData[language.value])
const portfolioLinks = computed(() => portfolioLinksData[language.value])
const projects = computed(() => projectsData[language.value])
const experiments = computed(() => experimentsData[language.value])
const i18nHead = useLocaleHead({ seo: true })
const activeFilter = ref('all')
const filters = ['all', 'web', 'services', 'mobile']
const filteredProjects = computed(() => activeFilter.value === 'all' ? projects.value : projects.value.filter(project => project.category.includes(activeFilter.value)))
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
  <div>
    <a href="#main" class="skip-link">{{ t('nav.skip') }}</a>
    <header class="site-header wrap">
      <a class="wordmark" href="#" :aria-label="t('nav.home')">jujich<span>dev</span><i></i></a>
      <nav :aria-label="t('nav.label')"><a href="#projects">{{ t('nav.projects') }}</a><a href="#experience">{{ t('nav.experience') }}</a><a href="#about">{{ t('nav.about') }}</a></nav>
      <div class="header-actions"><div class="language-switch" :aria-label="t('nav.language')"><SwitchLocalePathLink locale="en" :class="{ selected: language === 'en' }" :aria-current="language === 'en' ? 'page' : undefined" lang="en">EN</SwitchLocalePathLink><span>/</span><SwitchLocalePathLink locale="ru" :class="{ selected: language === 'ru' }" :aria-current="language === 'ru' ? 'page' : undefined" lang="ru">RU</SwitchLocalePathLink></div><a class="header-contact" href="#contact">{{ t('nav.contact') }} <span>↗</span></a></div>
    </header>

    <main id="main">
      <section class="hero wrap" aria-labelledby="hero-title">
        <div class="hero-topline"><span><i class="status-dot"></i> {{ t('hero.available') }}</span><span>{{ t('hero.location') }}</span></div>
        <div class="hero-layout">
          <div class="hero-copy"><p class="eyebrow">{{ t('hero.eyebrow') }}</p><h1 id="hero-title">{{ t('hero.line1') }}<br>{{ t('hero.line2') }}<br><span>{{ t('hero.line3') }}</span><b>.</b></h1><p class="hero-description">{{ t('hero.description') }}</p><div class="hero-actions"><a class="button button-dark" href="#projects">{{ t('hero.projects') }} <span>↗</span></a><a class="text-link" :href="resumePath" download>{{ t('hero.resume') }} <span>↓</span></a></div></div>
          <aside class="profile-card" :aria-label="t('hero.profileLabel')"><div class="profile-card-top"><span>{{ t('hero.profile') }}</span><span>01 / KK</span></div><div class="portrait-area"><img src="/assets/portrait-upscaled.png" :alt="profile.name" width="851" height="1849" fetchpriority="high"><span class="portrait-sticker">hello,<br>world<span>↗</span></span><span class="portrait-code">&lt;developer /&gt;</span></div><div class="profile-card-bottom"><div><b>{{ profile.name }}</b><span>{{ t('hero.tagline') }}</span></div><a :href="profile.github" target="_blank" rel="noopener noreferrer" :aria-label="t('hero.github')">↗</a></div></aside>
        </div>
        <div class="hero-facts"><div><b>{{ t('hero.since') }}</b><span>{{ t('hero.commercial') }}</span></div><div><b>Frontend +</b><span>{{ t('hero.fullstack') }}</span></div><div><b>{{ t('hero.english') }}</b><span>{{ t('hero.englishNote') }}</span></div><a href="#projects" class="scroll-link">{{ t('hero.scroll') }} <span>↓</span></a></div>
      </section>

      <section class="projects-section section-pad" id="projects" aria-labelledby="projects-title"><div class="wrap"><div class="section-heading"><div><p class="eyebrow"><span>01 /</span> {{ t('projects.eyebrow') }}</p><h2 id="projects-title">{{ t('projects.line1') }}<br><span class="serif">{{ t('projects.line2') }}</span></h2></div><p>{{ t('projects.description') }}</p></div><div class="project-filters" :aria-label="t('projects.filterLabel')"><button v-for="filter in filters" :key="filter" :class="{ active: activeFilter === filter }" :aria-pressed="activeFilter === filter" @click="activeFilter = filter">{{ t(`filters.${filter}`) }}<span v-if="filter === 'all'">{{ projects.length.toString().padStart(2, '0') }}</span></button><span class="project-count" aria-live="polite">{{ filteredProjects.length }} / {{ projects.length }}</span></div>
        <div class="project-grid"><article v-for="project in filteredProjects" :key="project.id" class="project-card"><ProjectVisual :kind="project.id" /><div class="project-body"><div class="project-kicker"><span>{{ project.type }}</span><span>{{ project.status }}</span></div><h3>{{ project.name }}</h3><p>{{ project.description }}</p><ul class="tags" :aria-label="t('projects.technologies')"><li v-for="tag in project.tags" :key="tag">{{ tag }}</li></ul><details class="project-details"><summary>{{ t('projects.details') }} <span>+</span></summary><div class="project-details-content"><h4>{{ t('projects.task') }}</h4><p>{{ project.task }}</p><h4>{{ t('projects.features') }}</h4><ul><li v-for="feature in project.features" :key="feature">{{ feature }}</li></ul><p v-if="project.note" class="project-note">{{ project.note }}</p></div></details></div></article></div>
        <div class="lab"><div class="lab-title"><span class="lab-icon">✳</span><div><p class="eyebrow">{{ t('projects.labEyebrow') }}</p><h3>{{ t('projects.labTitle') }}</h3></div></div><div class="lab-items"><article v-for="experiment in experiments" :key="experiment.name"><div><h4>{{ experiment.name }}</h4><span>{{ experiment.status }}</span></div><p>{{ experiment.description }}</p></article></div></div>
        <details class="more-work"><summary>{{ t('projects.more') }} <span>{{ t('projects.openList') }} ↗</span></summary><div class="portfolio-links"><a v-for="link in portfolioLinks" :key="link.url" :href="link.url" target="_blank" rel="noopener noreferrer"><div><b>{{ link.name }}</b><span>{{ link.type }}</span></div><span>↗</span></a></div></details>
      </div></section>

      <section id="experience" class="experience-section section-pad wrap" aria-labelledby="experience-title"><div class="section-heading"><div><p class="eyebrow"><span>02 /</span> {{ t('experience.eyebrow') }}</p><h2 id="experience-title">{{ t('experience.line1') }}<br><span class="serif">{{ t('experience.line2') }}</span></h2></div><p>{{ t('experience.description') }}</p></div><div class="timeline"><article v-for="job in experience" :key="job.company" class="job"><div class="job-date"><span>{{ job.period }}</span><i :class="{ current: job.active }"></i></div><div class="job-name"><h3>{{ job.company }}</h3><p>{{ job.title }}</p></div><div class="job-content"><p>{{ job.description }}</p><ul class="tags"><li v-for="tag in job.tags" :key="tag">{{ tag }}</li></ul></div></article></div></section>

      <section class="skills-section section-pad" aria-labelledby="skills-title"><div class="wrap"><div class="section-heading"><div><p class="eyebrow"><span>03 /</span> {{ t('skills.eyebrow') }}</p><h2 id="skills-title">{{ t('skills.line1') }}<br><span class="serif">{{ t('skills.line2') }}</span></h2></div><p>{{ t('skills.description') }}</p></div><div class="skills-grid"><article v-for="(group, index) in skills" :key="group.title"><span class="skill-index">0{{ index + 1 }}</span><h3>{{ group.title }}</h3><p>{{ group.note }}</p><ul><li v-for="skill in group.items" :key="skill">{{ skill }}</li></ul></article></div></div></section>

      <section class="about-section section-pad wrap" id="about" aria-labelledby="about-title"><div class="about-heading"><p class="eyebrow"><span>04 /</span> {{ t('about.eyebrow') }}</p><h2 id="about-title">{{ t('about.line1') }}<br><span class="serif">{{ t('about.line2') }}</span></h2><span class="about-asterisk" aria-hidden="true">✳</span></div><div class="about-copy"><p class="about-lead">{{ t('about.lead') }}</p><p>{{ t('about.body1') }}</p><p>{{ t('about.body2') }}</p><div class="education"><span>{{ t('about.education') }}</span><h3>{{ profile.education }}</h3><p>{{ profile.degree }}<br>{{ profile.graduation }}</p><div class="education-extra"><span>{{ t('about.flang') }}</span><span>{{ t('about.academy') }}</span></div></div><div class="languages"><div><b>{{ t('about.russian') }}</b><span>{{ t('about.native') }}</span></div><div><b>{{ t('about.english') }}</b><span>{{ t('about.advanced') }}</span></div></div></div></section>

      <section class="contact-section" id="contact" aria-labelledby="contact-title"><div class="wrap"><div class="contact-top"><span class="eyebrow">{{ t('contact.eyebrow') }}</span><span><i class="status-dot"></i> {{ t('contact.hello') }}</span></div><div class="contact-main"><h2 id="contact-title">{{ t('contact.line1') }}<br><span class="serif">{{ t('contact.line2') }}</span></h2><a class="contact-arrow" :href="profile.linkedin" target="_blank" rel="noopener noreferrer" :aria-label="t('contact.linkedin')">↗</a></div><div class="contact-bottom"><a class="button button-dark" :href="profile.linkedin" target="_blank" rel="noopener noreferrer">{{ t('contact.linkedin') }} <span>↗</span></a><div class="email-group"><a :href="`mailto:${profile.email}`">{{ profile.email }}</a><button @click="copyEmail" :aria-label="copied ? t('contact.copied') : t('contact.copy')">{{ copied ? '✓' : '⧉' }}</button><span class="copy-feedback" role="status">{{ copied ? t('contact.copied') : copyError ? t('contact.copyError') : '' }}</span></div></div></div></section>
    </main>
    <footer class="site-footer wrap"><a class="wordmark" href="#" :aria-label="t('nav.top')">jujich<span>dev</span><i></i></a><p>{{ profile.name }} · 2026</p><div><a :href="profile.github" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a :href="profile.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a :href="resumePath" download>{{ t('hero.resume') }} ↓</a></div><span>{{ t('footer.made') }} <i>✳</i></span></footer>
  </div>
</template>
