export interface Project {
  id: string
  name: string
  type: string
  status: string
  category: string[]
  description: string
  tags: string[]
  task: string
  features: string[]
  note?: string
}

export interface Experiment {
  name: string
  status: string
  description: string
}

const projectsRu: Project[] = [
  {
    id: 'school', name: 'Платформа онлайн-обучения', type: 'EdTech / Web', status: 'Реализовано', category: ['web'],
    description: 'От каталога курсов до кабинетов ученика и куратора. Видео, домашние задания и управление программой обучения в одном продукте.',
    tags: ['Nuxt 3', 'TypeScript', 'NestJS', 'S3', 'HLS'],
    task: 'Связать покупку доступа, учебные материалы и работу куратора в последовательный пользовательский сценарий.',
    features: ['Ролевые кабинеты ученика, куратора и администратора.', 'Редактор структуры курса с drag-and-drop и HLS-плеер с выбором качества.', 'Домашние задания с проверкой куратором.', 'Multipart-загрузка в S3 с прогрессом и повтором неудачных частей.', 'SSR-аутентификация, очереди обработки видео и обновление сессий.'],
    note: 'В текущей конфигурации оплата подтверждается вручную.'
  },
  {
    id: 'crm', name: 'CRM для управления продажами', type: 'B2B / Web', status: 'MVP', category: ['web'],
    description: 'Лиды, сделки, канбан и командные задачи. От привычного рабочего пространства до интеграции с AI-агентами через MCP.',
    tags: ['Nuxt 4', 'NestJS', 'PostgreSQL', 'MCP / OAuth'],
    task: 'Объединить продажи и командную работу с разграничением данных и прав между компаниями.',
    features: ['Лиды, клиенты, сделки, воронки, задачи и база знаний.', 'Серверная модель прав и изоляция компаний.', 'Согласование конфликтующих правок с сохранением черновика.', 'Импорт из Bitrix24 и amoCRM, мессенджер и WebRTC-звонки 1:1.', 'MCP-интерфейс с OAuth и уровнями разрешений для AI-агентов.'],
    note: 'Функциональный MVP. Звонки 1:1 реализованы без TURN; поддержка всех сетевых конфигураций не подтверждена.'
  },
  {
    id: 'vpn', name: 'Jujich Services', type: 'Подписки / Telegram', status: 'Разработка и эксплуатация', category: ['services', 'web'],
    description: 'VPN-сервис с web-интерфейсом, Telegram Mini App, ботом и административной панелью. Весь путь от подключения до управления подпиской.',
    tags: ['Nuxt 4', 'Pinia', 'NestJS', 'Python', 'Grafana'],
    task: 'Сделать подключение понятным для пользователя, а управление подписками и инфраструктурой — прозрачным для администратора.',
    features: ['Подписки, баланс, заявки на пополнение и объединение аккаунтов.', 'Инструкции для разных устройств и QR-коды подключения.', 'Административные таблицы с восстановлением фильтров и состояния.', 'Мониторинг с различением нулевых показателей и отсутствующих данных.', 'Контейнеризация, GitLab CI и наблюдаемость через Prometheus, Grafana и Loki.'],
    note: 'Пополнение баланса — через заявку администратору.'
  },
  {
    id: 'medical', name: 'МедСнимки', type: 'Web / Android', status: 'Прототип', category: ['mobile', 'web'],
    description: 'Сбор изображений с подписью и очередью отправки. Данные сохраняются на устройстве, а работа продолжается после перезапуска приложения.',
    tags: ['Nuxt 4', 'Tauri 2', 'Kotlin', 'IndexedDB', 'SQLite'],
    task: 'Сохранять фотографии и текстовые метки, переживать потерю связи и восстанавливать очередь загрузки.',
    features: ['Выбор фотографии, предпросмотр и текстовая метка.', 'IndexedDB в web-версии, SQLite и WorkManager на Android.', 'Контрольные точки многошаговой загрузки и восстановление очереди.', 'Защита от конкурентного обновления сессий и смешения данных аккаунтов.', 'Собрана debug APK; реализована интеграция с отдельным backend по API-контракту.'],
    note: 'Удалённая отправка ещё требует сквозной проверки. Приложение предназначено для сбора изображений, без диагностики.'
  },
  {
    id: 'mafia', name: 'Панель ведущего «Мафии»', type: 'Web / Android', status: 'Реализовано', category: ['mobile', 'web'],
    description: 'Инструмент для ведущего очной игры: роли, ночные действия, голосование и история. Android-версия работает без постоянного подключения к сети.',
    tags: ['Nuxt 3', 'Capacitor', 'NestJS', 'Offline-first'],
    task: 'Помочь ведущему проводить игру по сложным правилам и сохранять состояние даже при нестабильном интернете.',
    features: ['Пятишаговый мастер подготовки и проверка распределения ролей.', 'Пошаговые ночные действия, голосование и восстанавливаемый таймер.', 'Локальный игровой движок и хранение состояния на Android.', 'Очередь синхронизации с повторами и ревизиями.', 'Идемпотентный транзакционный импорт снимков игры на сервер.'],
    note: 'Приложение для ведущего очной игры. Синхронизация однонаправленная, без совместного редактирования.'
  },
  {
    id: 'legal', name: 'B2B-лендинг с CMS', type: 'Сайт / Интеграции', status: 'Реализовано', category: ['services'],
    description: 'Сайт юридических услуг с редактируемым контентом. Заявки попадают в очередь и доставляются в CRM и Telegram с повтором при сбоях.',
    tags: ['Nuxt 4', 'Nuxt Content', 'Nuxt Studio', 'GitLab CI'],
    task: 'Дать бизнесу сайт для приёма заявок, а сотрудникам — возможность редактировать и публиковать контент без работы с кодом.',
    features: ['Адаптивные услуги, тарифы и отзывы, SSR и SEO-разметка.', 'Единая форма с валидацией, сохранением полей при ошибке и дедупликацией.', 'Файловая очередь с независимыми повторами доставки в Bitrix24 и Telegram.', 'CMS с контентными схемами; публикация через Git-коммит и CI.', 'Атомарное переключение релизов, healthcheck и откат.']
  }
]

const experimentsRu: Experiment[] = [
  { name: 'Forma — CMS с AI-редактором', status: 'Локальный MVP', description: 'Редактирование контента и кода через диалог, desktop/mobile preview, история версий и экспорт Nuxt/Next starters. Внешний хостинг и командная работа — следующие этапы.' },
  { name: 'Инфраструктура AI-агентов', status: 'Внедрения', description: 'Linux-развёртывания стороннего Hermes Agent: systemd, Telegram gateway, прокси, автоматическое обновление конфигурации и восстановление после сетевых сбоев.' }
]

export const projectsData: Record<'ru' | 'en', Project[]> = {
  ru: projectsRu,
  en: [
    {
      id: 'school', name: 'Online learning platform', type: 'EdTech / Web', status: 'Implemented', category: ['web'],
      description: 'From a course catalog to student and tutor dashboards. Video, assignments and course management in one product.',
      tags: ['Nuxt 3', 'TypeScript', 'NestJS', 'S3', 'HLS'],
      task: 'Connect course access purchases, learning materials and tutor support in a coherent user journey.',
      features: ['Role-based dashboards for students, tutors and administrators.', 'A drag-and-drop course editor and an HLS player with quality selection.', 'Assignments with tutor review.', 'Multipart uploads to S3 with progress tracking and retries for failed parts.', 'SSR authentication, video processing queues and session refresh.'],
      note: 'Payments are confirmed manually in the current configuration.'
    },
    {
      id: 'crm', name: 'Sales management CRM', type: 'B2B / Web', status: 'MVP', category: ['web'],
      description: 'Leads, deals, kanban and team tasks. A familiar workspace with MCP integration for AI agents.',
      tags: ['Nuxt 4', 'NestJS', 'PostgreSQL', 'MCP / OAuth'],
      task: 'Bring sales and teamwork together while keeping each company’s data and permissions separate.',
      features: ['Leads, clients, deals, pipelines, tasks and a knowledge base.', 'Server-side permissions and company data isolation.', 'Conflict resolution that preserves the user’s draft.', 'Bitrix24 and amoCRM imports, messaging and one-to-one WebRTC calls.', 'An MCP interface with OAuth and permission levels for AI agents.'],
      note: 'A functional MVP. One-to-one calls are implemented without TURN; support for all network configurations has not been verified.'
    },
    {
      id: 'vpn', name: 'Jujich Services', type: 'Subscriptions / Telegram', status: 'Development and operations', category: ['services', 'web'],
      description: 'A VPN service with a web interface, Telegram Mini App, bot and admin panel. From initial setup to subscription management.',
      tags: ['Nuxt 4', 'Pinia', 'NestJS', 'Python', 'Grafana'],
      task: 'Make setup straightforward for users and give administrators clear control over subscriptions and infrastructure.',
      features: ['Subscriptions, balances, top-up requests and account merging.', 'Device-specific instructions and connection QR codes.', 'Admin tables that preserve filters and state.', 'Monitoring that distinguishes zero values from missing data.', 'Containerization, GitLab CI and observability with Prometheus, Grafana and Loki.'],
      note: 'Balance top-ups are requested through an administrator.'
    },
    {
      id: 'medical', name: 'MedImages', type: 'Web / Android', status: 'Prototype', category: ['mobile', 'web'],
      description: 'Image collection with text labels and an upload queue. Data stays on the device, and work can continue after the application restarts.',
      tags: ['Nuxt 4', 'Tauri 2', 'Kotlin', 'IndexedDB', 'SQLite'],
      task: 'Preserve photos and text labels through connection loss and restore the upload queue.',
      features: ['Photo selection, preview and text labels.', 'IndexedDB on the web; SQLite and WorkManager on Android.', 'Checkpoints for multi-step uploads and queue recovery.', 'Protection against concurrent session refresh and mixing account data.', 'A debug APK build and integration with a separate backend against an API contract.'],
      note: 'Remote uploads still require end-to-end verification. The application collects images and does not provide diagnostics.'
    },
    {
      id: 'mafia', name: 'Mafia game host dashboard', type: 'Web / Android', status: 'Implemented', category: ['mobile', 'web'],
      description: 'A tool for hosting in-person games: roles, night actions, voting and history. The Android version works without a continuous internet connection.',
      tags: ['Nuxt 3', 'Capacitor', 'NestJS', 'Offline-first'],
      task: 'Help hosts run games with complex rules and preserve game state even with an unreliable connection.',
      features: ['A five-step setup wizard with role assignment validation.', 'Guided night actions, voting and a timer that recovers after restart.', 'A local game engine and persistent state on Android.', 'A synchronization queue with retries and revision tracking.', 'Idempotent, transactional import of game snapshots on the server.'],
      note: 'Built for the host of an in-person game. Synchronization is one-way, without collaborative editing.'
    },
    {
      id: 'legal', name: 'B2B landing page with a CMS', type: 'Website / Integrations', status: 'Implemented', category: ['services'],
      description: 'A legal services website with editable content. Enquiries are queued and delivered to a CRM and Telegram, with retries after failures.',
      tags: ['Nuxt 4', 'Nuxt Content', 'Nuxt Studio', 'GitLab CI'],
      task: 'Give the business a website for collecting enquiries and let staff edit and publish content without working with code.',
      features: ['Responsive services, pricing and reviews, with SSR and SEO markup.', 'A shared form with validation, deduplication and field preservation after errors.', 'A file-based queue with independent delivery retries for Bitrix24 and Telegram.', 'A CMS with content schemas; publishing through a Git commit and CI.', 'Atomic release switching, health checks and rollback.']
    }
  ]
}

export const experimentsData: Record<'ru' | 'en', Experiment[]> = {
  ru: experimentsRu,
  en: [
    { name: 'Forma — CMS with an AI editor', status: 'Local MVP', description: 'Content and code editing through chat, desktop/mobile preview, version history and Nuxt/Next starter exports. External hosting and team collaboration are planned next.' },
    { name: 'AI agent infrastructure', status: 'Deployments', description: 'Linux deployments of the third-party Hermes Agent: systemd, a Telegram gateway, proxies, automated configuration updates and recovery from network failures.' }
  ]
}

export const projects = projectsData.ru
export const experiments = experimentsData.ru
