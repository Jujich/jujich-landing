export interface Project {
  id: string
  tier: 'featured' | 'supporting' | 'landing'
  name: string
  type: string
  status: string
  category: string[]
  description: string
  tags: string[]
  task: string
  features: string[]
  note?: string
  url?: string
}

export interface Experiment {
  name: string
  status: string
  description: string
}

const projectsRu: Project[] = [
  {
    id: 'vpn', tier: 'featured', name: 'Jujich Services', type: 'Подписки / Telegram', status: 'Разработка и эксплуатация', category: ['services', 'web'],
    description: 'VPN-сервис с web-интерфейсом, Telegram Mini App, ботом и административной панелью. Весь путь от подключения до управления подпиской.',
    tags: ['Nuxt 4', 'Pinia', 'NestJS', 'Python', 'Grafana'],
    task: 'Сделать подключение понятным для пользователя, а управление подписками и инфраструктурой — прозрачным для администратора.',
    features: ['Подписки, баланс, заявки на пополнение и объединение аккаунтов.', 'Инструкции для разных устройств и QR-коды подключения.', 'Административные таблицы с восстановлением фильтров и состояния.', 'Мониторинг с различением нулевых показателей и отсутствующих данных.', 'Контейнеризация, GitLab CI и наблюдаемость через Prometheus, Grafana и Loki.'],
    note: 'Пополнение баланса — через заявку администратору.'
  },
  {
    id: 'school', tier: 'featured', name: 'Платформа онлайн-обучения', type: 'EdTech / Web', status: 'Реализовано', category: ['web'],
    url: 'https://academy-gb.ru',
    description: 'От каталога курсов до кабинетов ученика и куратора. Видео, домашние задания и управление программой обучения в одном продукте.',
    tags: ['Nuxt 3', 'TypeScript', 'NestJS', 'S3', 'HLS'],
    task: 'Связать покупку доступа, учебные материалы и работу куратора в последовательный пользовательский сценарий.',
    features: ['Ролевые кабинеты ученика, куратора и администратора.', 'Редактор структуры курса с drag-and-drop и HLS-плеер с выбором качества.', 'Домашние задания с проверкой куратором.', 'Multipart-загрузка в S3 с прогрессом и повтором неудачных частей.', 'SSR-аутентификация, очереди обработки видео и обновление сессий.'],
    note: 'В текущей конфигурации оплата подтверждается вручную.'
  },
  {
    id: 'forma', tier: 'featured', name: 'Forma — CMS с AI-редактором', type: 'CMS / AI / Web', status: 'Локальный MVP', category: ['web'],
    description: 'CMS для редактирования контента и кода вручную или через диалог с AI. Предпросмотр, история версий и локальная публикация в одном рабочем пространстве.',
    tags: ['Vue 3', 'TypeScript', 'Express 5', 'OpenAI Responses API'],
    task: 'Дать владельцу сайта возможность менять контент, проверять результат и публиковать выбранную версию.',
    features: ['Редактирование контента и JSON, HTML, CSS и JavaScript вручную или через AI.', 'Предпросмотр сайта на desktop и mobile.', 'Черновики, история версий, отмена изменений и восстановление.', 'Сохранение заявок из форм и HTTPS-webhooks.', 'ZIP-экспорт стартовых проектов Nuxt и Next.'],
    note: 'Однопользовательский локальный MVP. Внешний хостинг и командная работа — следующие этапы.'
  },
  {
    id: 'crm', tier: 'featured', name: 'CRM для управления продажами', type: 'B2B / Web', status: 'MVP', category: ['web'],
    description: 'Лиды, сделки, канбан и командные задачи. От привычного рабочего пространства до интеграции с AI-агентами через MCP.',
    tags: ['Nuxt 4', 'NestJS', 'PostgreSQL', 'MCP / OAuth'],
    task: 'Объединить продажи и командную работу с разграничением данных и прав между компаниями.',
    features: ['Лиды, клиенты, сделки, воронки, задачи и база знаний.', 'Серверная модель прав и изоляция компаний.', 'Согласование конфликтующих правок с сохранением черновика.', 'Импорт из Bitrix24 и amoCRM, мессенджер и WebRTC-звонки 1:1.', 'MCP-интерфейс с OAuth и уровнями разрешений для AI-агентов.'],
    note: 'Функциональный MVP. Звонки 1:1 реализованы без TURN; поддержка всех сетевых конфигураций не подтверждена.'
  },
  {
    id: 'medical', tier: 'supporting', name: 'МедСнимки / MedImages', type: 'Web / Android', status: 'Прототип', category: ['mobile', 'web'],
    description: 'Прототип фотоархива для врачей МГНЦ. Проект рассчитан на фотофиксацию на приёме и работу с архивными снимками, с привязкой к карте пациента и члену семьи.',
    tags: ['Nuxt 4', 'Tauri 2', 'Kotlin', 'IndexedDB', 'SQLite'],
    task: 'Упростить перенос снимков с телефона врача в карту пациента и сохранять очередь отправки при потере связи. По ТЗ целевая система хранения — 1С во внутренней сети МГНЦ.',
    features: ['Выбор фотографии, предпросмотр и текстовая метка.', 'IndexedDB в web-версии, SQLite и WorkManager на Android.', 'Контрольные точки многошаговой загрузки и восстановление очереди.', 'Защита от конкурентного обновления сессий и смешения данных аккаунтов.', 'Собрана debug APK; реализована интеграция с отдельным backend по API-контракту.'],
    note: 'Прототип. Поиск карты по номеру или штрихкоду, выбор члена семьи и передача в 1С — целевые функции; сквозная отправка ещё требует проверки.'
  },
  {
    id: 'mafia', tier: 'supporting', name: 'Панель ведущего «Мафии»', type: 'Web / Android', status: 'Реализовано', category: ['mobile', 'web'],
    description: 'Инструмент для ведущего очной игры: роли, ночные действия, голосование и история. Android-версия работает без постоянного подключения к сети.',
    tags: ['Nuxt 3', 'Capacitor', 'NestJS', 'Offline-first'],
    task: 'Помочь ведущему проводить игру по сложным правилам и сохранять состояние даже при нестабильном интернете.',
    features: ['Пятишаговый мастер подготовки и проверка распределения ролей.', 'Пошаговые ночные действия, голосование и восстанавливаемый таймер.', 'Локальный игровой движок и хранение состояния на Android.', 'Очередь синхронизации с повторами и ревизиями.', 'Идемпотентный транзакционный импорт снимков игры на сервер.'],
    note: 'Приложение для ведущего очной игры. Синхронизация однонаправленная, без совместного редактирования.'
  },
  {
    id: 'legal', tier: 'landing', name: 'B2B-лендинг с CMS', type: 'Сайт / Интеграции', status: 'Реализовано', category: ['services'],
    description: 'Лендинг юридических услуг: редактируемый контент и заявки в CRM и Telegram.',
    tags: ['Nuxt 4', 'CMS'],
    task: 'Представить услуги и принимать заявки.',
    features: ['Редактирование контента и доставка заявок в CRM и Telegram.']
  }
]

const experimentsRu: Experiment[] = [
  { name: 'Ultim AI', status: 'MVP', description: 'Агрегатор AI-моделей с единым веб-интерфейсом для работы с нейросетями. Проект не нашёл клиентов.' },
  { name: 'ИИ-агенты для бизнеса', status: 'Настройка и интеграции', description: 'Настройка ИИ-агентов под задачи компании: работа с информацией, обработка запросов и автоматизация повседневных процессов. Подготовка инструкций, подключение нужных инструментов и адаптация сценариев под рабочие процессы команды.' }
]

export const projectsData: Record<'ru' | 'en', Project[]> = {
  ru: projectsRu,
  en: [
    {
      id: 'vpn', tier: 'featured', name: 'Jujich Services', type: 'Subscriptions / Telegram', status: 'Development and operations', category: ['services', 'web'],
      description: 'A VPN service with a web interface, Telegram Mini App, bot and admin panel. From initial setup to subscription management.',
      tags: ['Nuxt 4', 'Pinia', 'NestJS', 'Python', 'Grafana'],
      task: 'Make setup straightforward for users and give administrators clear control over subscriptions and infrastructure.',
      features: ['Subscriptions, balances, top-up requests and account merging.', 'Device-specific instructions and connection QR codes.', 'Admin tables that preserve filters and state.', 'Monitoring that distinguishes zero values from missing data.', 'Containerization, GitLab CI and observability with Prometheus, Grafana and Loki.'],
      note: 'Balance top-ups are requested through an administrator.'
    },
    {
      id: 'school', tier: 'featured', name: 'Online learning platform', type: 'EdTech / Web', status: 'Implemented', category: ['web'],
      url: 'https://academy-gb.ru',
      description: 'From a course catalog to student and tutor dashboards. Video, assignments and course management in one product.',
      tags: ['Nuxt 3', 'TypeScript', 'NestJS', 'S3', 'HLS'],
      task: 'Connect course access purchases, learning materials and tutor support in a coherent user journey.',
      features: ['Role-based dashboards for students, tutors and administrators.', 'A drag-and-drop course editor and an HLS player with quality selection.', 'Assignments with tutor review.', 'Multipart uploads to S3 with progress tracking and retries for failed parts.', 'SSR authentication, video processing queues and session refresh.'],
      note: 'Payments are confirmed manually in the current configuration.'
    },
    {
      id: 'forma', tier: 'featured', name: 'Forma — CMS with an AI editor', type: 'CMS / AI / Web', status: 'Local MVP', category: ['web'],
      description: 'A CMS for editing content and code manually or through AI chat. Preview, version history and local publishing in one workspace.',
      tags: ['Vue 3', 'TypeScript', 'Express 5', 'OpenAI Responses API'],
      task: 'Let site owners edit content, review the result and publish the version they choose.',
      features: ['Manual and AI editing of content, JSON, HTML, CSS and JavaScript.', 'Desktop and mobile site previews.', 'Drafts, version history, undo and restoration.', 'Form submissions and HTTPS webhooks.', 'ZIP exports of Nuxt and Next starter projects.'],
      note: 'A single-user local MVP. External hosting and team collaboration are planned next.'
    },
    {
      id: 'crm', tier: 'featured', name: 'Sales management CRM', type: 'B2B / Web', status: 'MVP', category: ['web'],
      description: 'Leads, deals, kanban and team tasks. A familiar workspace with MCP integration for AI agents.',
      tags: ['Nuxt 4', 'NestJS', 'PostgreSQL', 'MCP / OAuth'],
      task: 'Bring sales and teamwork together while keeping each company’s data and permissions separate.',
      features: ['Leads, clients, deals, pipelines, tasks and a knowledge base.', 'Server-side permissions and company data isolation.', 'Conflict resolution that preserves the user’s draft.', 'Bitrix24 and amoCRM imports, messaging and one-to-one WebRTC calls.', 'An MCP interface with OAuth and permission levels for AI agents.'],
      note: 'A functional MVP. One-to-one calls are implemented without TURN; support for all network configurations has not been verified.'
    },
    {
      id: 'medical', tier: 'supporting', name: 'MedImages', type: 'Web / Android', status: 'Prototype', category: ['mobile', 'web'],
      description: 'A photo archive prototype for doctors at the Research Centre for Medical Genetics. The project is intended to link appointment and archived photos to a patient record and family member.',
      tags: ['Nuxt 4', 'Tauri 2', 'Kotlin', 'IndexedDB', 'SQLite'],
      task: 'Simplify moving photos from a doctor’s phone to patient records and preserve pending uploads when connectivity drops. The specification targets 1C storage on the centre’s internal network.',
      features: ['Photo selection, preview and text labels.', 'IndexedDB on the web; SQLite and WorkManager on Android.', 'Checkpoints for multi-step uploads and queue recovery.', 'Protection against concurrent session refresh and mixing account data.', 'A debug APK build and integration with a separate backend against an API contract.'],
      note: 'Prototype. Patient lookup by number or barcode, family selection and 1C integration are target features. End-to-end uploads to the live storage service remain unverified.'
    },
    {
      id: 'mafia', tier: 'supporting', name: 'Mafia game host dashboard', type: 'Web / Android', status: 'Implemented', category: ['mobile', 'web'],
      description: 'A tool for hosting in-person games: roles, night actions, voting and history. The Android version works without a continuous internet connection.',
      tags: ['Nuxt 3', 'Capacitor', 'NestJS', 'Offline-first'],
      task: 'Help hosts run games with complex rules and preserve game state even with an unreliable connection.',
      features: ['A five-step setup wizard with role assignment validation.', 'Guided night actions, voting and a timer that recovers after restart.', 'A local game engine and persistent state on Android.', 'A synchronization queue with retries and revision tracking.', 'Idempotent, transactional import of game snapshots on the server.'],
      note: 'Built for the host of an in-person game. Synchronization is one-way, without collaborative editing.'
    },
    {
      id: 'legal', tier: 'landing', name: 'B2B landing page with a CMS', type: 'Website / Integrations', status: 'Implemented', category: ['services'],
      description: 'A legal services landing page with editable content and inquiries delivered to CRM and Telegram.',
      tags: ['Nuxt 4', 'CMS'],
      task: 'Present services and collect inquiries.',
      features: ['Content editing and inquiry delivery to CRM and Telegram.']
    }
  ]
}

export const experimentsData: Record<'ru' | 'en', Experiment[]> = {
  ru: experimentsRu,
  en: [
    { name: 'Ultim AI', status: 'MVP', description: 'An AI model aggregator with a shared web interface for working with AI models. The project did not find customers.' },
    { name: 'AI agents for business', status: 'Configuration & integrations', description: 'Configuring AI agents for company needs, from working with information and handling requests to automating everyday tasks. Defining instructions, connecting the right tools and tailoring workflows to how the team works.' }
  ]
}

export const projects = projectsData.ru
export const experiments = experimentsData.ru
