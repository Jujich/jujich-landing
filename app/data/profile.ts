export interface Profile {
  name: string
  role: string
  email: string
  telegram: string
  github: string
  linkedin: string
  location: string
  education: string
  degree: string
  graduation: string
}

export interface Experience {
  company: string
  period: string
  title: string
  description: string
  tags: string[]
  active: boolean
}

export interface SkillGroup {
  title: string
  note: string
  items: string[]
}

export interface PortfolioLink {
  name: string
  type: string
  url: string
}

const profileRu: Profile = {
  name: 'Кузьма Королев',
  role: 'Frontend / Fullstack-разработчик',
  email: 'korolev.kuzma1@gmail.com',
  telegram: 'https://t.me/jujich',
  github: 'https://github.com/Jujich',
  linkedin: 'https://www.linkedin.com/in/kuzma-korolev-105975441/',
  location: 'Нижний Новгород, Россия',
  education: 'ННГУ им. Н. И. Лобачевского',
  degree: 'ИИТММ · Программная инженерия',
  graduation: 'Бакалавриат, ожидаемый выпуск — 2027',
}

const experienceRu: Experience[] = [
  {
    company: 'Сбер', period: 'Июль 2026 — сейчас', title: 'Frontend-разработчик · стажировка',
    description: 'Внешний проект по подбору мероприятий с помощью ИИ. Разработка веб-приложения на Next.js и Telegram Mini App на React, работа над макетами интерфейса с применением ИИ и подходом SDD. С сентября 2026 года — frontend внутреннего автотрекера ключевых результатов руководителей высшего звена: Next.js, архитектура Feature-Sliced Design (FSD) и styled-components.',
    tags: ['React', 'Next.js', 'Telegram Mini Apps', 'SDD', 'FSD', 'styled-components'], active: true
  },
  {
    company: 'Фриланс', period: 'Январь 2023 — сейчас', title: 'Fullstack-разработчик',
    description: 'Коммерческая разработка веб-приложений и цифровых сервисов. Полный цикл: обсуждение задачи с заказчиком, требования и архитектура, frontend и backend, инфраструктура, деплой и поддержка.',
    tags: ['Vue / Nuxt', 'React', 'NestJS', 'GitLab CI'], active: true
  },
  {
    company: 'Нижегородский ЦСМ', period: 'Январь — декабрь 2025', title: 'Frontend-разработчик',
    description: 'В команде разработки государственной информационной системы для работы с декларациями. Страницы и переиспользуемые компоненты, типизация данных, валидация форм, SSR и проксирование запросов к API через Nitro.',
    tags: ['Nuxt', 'TypeScript', 'Nuxt UI', 'Zod', 'Nitro'], active: false
  },
  {
    company: 'Codex IT', period: 'Июль — август 2025', title: 'Frontend-разработчик · стажировка',
    description: 'Внутренний корпоративный мессенджер. Доработка интерфейса, компонентов, форм и состояния приложения в существующей кодовой базе. Работа с трекером задач и code review.',
    tags: ['React', 'TypeScript', 'MUI', 'Zustand'], active: false
  }
]

const skillsRu: SkillGroup[] = [
  { title: 'Интерфейсы', note: 'Мой основной фокус', items: ['TypeScript', 'JavaScript', 'Vue 3', 'Nuxt', 'React', 'Next.js', 'HTML / CSS', 'Tailwind CSS', 'Nuxt UI', 'MUI'] },
  { title: 'Состояние и данные', note: 'От формы до API', items: ['Pinia', 'Zustand', 'Redux', 'Vuex', 'Zod', 'REST API', 'WebSocket'] },
  { title: 'За пределами frontend', note: 'Для полного цикла', items: ['Node.js', 'NestJS', 'Prisma', 'PostgreSQL', 'Docker', 'GitLab CI/CD', 'Nginx', 'Tauri', 'Electron'] }
]

const portfolioLinksRu: PortfolioLink[] = [
  { name: 'Академия Главного Бухгалтера', type: 'Веб-школа', url: 'https://academy-gb.ru' },
  { name: 'Finance Balance', type: 'Бухгалтерские услуги', url: 'https://finance-balance.ru' },
  { name: 'Ultim AI', type: 'MVP · Агрегатор AI-моделей', url: 'https://ultim-ai.ru' },
  { name: 'AI-агенты для бизнеса', type: 'Стартап на базе OpenClaw', url: 'https://claw.jujichservices.ru' },
  { name: 'TastyWorld', type: 'Лендинг POS-системы', url: 'https://tastyworld.jujichservices.ru' },
  { name: 'ГОСТмаркет', type: 'Магазин документации', url: 'https://gostmarket.pixelservices.ru' },
  { name: 'Нижегородский ЦСМ', type: 'Сайт организации', url: 'https://nncsm.ru' },
  { name: 'Личный кабинет ЦСМ', type: 'Веб-приложение', url: 'https://lk.nncsm.ru' }
]

export const profileData: Record<'ru' | 'en', Profile> = {
  ru: profileRu,
  en: {
    ...profileRu,
    name: 'Kuzma Korolev',
    role: 'Frontend / Fullstack developer',
    location: 'Nizhny Novgorod, Russia',
    education: 'Lobachevsky University',
    degree: 'Institute of IT, Mathematics and Mechanics · Software Engineering',
    graduation: 'Bachelor’s degree, expected graduation — 2027'
  }
}

export const experienceData: Record<'ru' | 'en', Experience[]> = {
  ru: experienceRu,
  en: [
    {
      company: 'Sber', period: 'July 2026 — present', title: 'Junior Frontend Developer',
      description: 'An external project for AI-assisted event discovery. Development of a Next.js web application and a React Telegram Mini App, with AI-assisted interface design and a specification-driven development approach. Since September 2026, frontend development for an internal automated key-results tracker for senior executives, using Next.js, Feature-Sliced Design (FSD) and styled-components. Within my first month on the internal project, I proposed and successfully implemented a migration to Vite, cutting build time from 15 to 5 minutes (3× faster).',
      tags: ['React', 'Next.js', 'Telegram Mini Apps', 'SDD', 'FSD', 'styled-components', 'Vite'], active: true
    },
    {
      company: 'Freelance', period: 'January 2023 — present', title: 'Fullstack developer',
      description: 'Commercial web applications and digital services across the full development cycle: client discussions, requirements and architecture, frontend and backend, infrastructure, deployment and maintenance.',
      tags: ['Vue / Nuxt', 'React', 'NestJS', 'GitLab CI'], active: true
    },
    {
      company: 'Codex IT', period: 'July — August 2025', title: 'Frontend developer · internship',
      description: 'An internal company messenger. Improvements to the interface, components, forms and application state in an existing codebase, with issue tracking and code review.',
      tags: ['React', 'TypeScript', 'MUI', 'Zustand'], active: false
    }
  ]
}

export const skillsData: Record<'ru' | 'en', SkillGroup[]> = {
  ru: skillsRu,
  en: [
    { title: 'Interfaces', note: 'My main focus', items: ['TypeScript', 'JavaScript', 'Vue 3', 'Nuxt', 'React', 'Next.js', 'HTML / CSS', 'Tailwind CSS', 'Nuxt UI', 'MUI'] },
    { title: 'State and data', note: 'From forms to APIs', items: ['Pinia', 'Zustand', 'Redux', 'Vuex', 'Zod', 'REST API', 'WebSocket'] },
    { title: 'Beyond frontend', note: 'Across the development cycle', items: ['Node.js', 'NestJS', 'Prisma', 'PostgreSQL', 'Docker', 'GitLab CI/CD', 'Nginx', 'Tauri', 'Electron'] }
  ]
}

export const portfolioLinksData: Record<'ru' | 'en', PortfolioLink[]> = {
  ru: portfolioLinksRu,
  en: [
    { name: 'Chief Accountant Academy', type: 'Online school', url: 'https://academy-gb.ru' },
    { name: 'Finance Balance', type: 'Accounting services', url: 'https://finance-balance.ru' },
    { name: 'Ultim AI', type: 'MVP · AI model aggregator', url: 'https://ultim-ai.ru' },
    { name: 'AI agents for business', type: 'OpenClaw-based startup', url: 'https://claw.jujichservices.ru' },
    { name: 'TastyWorld', type: 'POS system landing page', url: 'https://tastyworld.jujichservices.ru' },
    { name: 'GOSTmarket', type: 'Technical standards store', url: 'https://gostmarket.pixelservices.ru' }
  ]
}

export const profile = profileData.ru
export const experience = experienceData.ru
export const skills = skillsData.ru
export const portfolioLinks = portfolioLinksData.ru
