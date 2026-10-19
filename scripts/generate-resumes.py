#!/usr/bin/env python3
"""Create the two print resumes from the site's shared profile/project data.

Requires Node 24+, Python reportlab and pypdf. Fonts are embedded from macOS
Arial/Georgia; set RESUME_FONT_DIR to an equivalent directory on other hosts.
Run with Node 24 on PATH. Outputs go to output/pdf/ and public/.
"""

import io
import json
import os
from pathlib import Path
import shutil
import subprocess
from xml.sax.saxutils import escape

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, TextStringObject

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'output/pdf'
PUBLIC = ROOT / 'public'
FONT_DIR = Path(os.environ.get('RESUME_FONT_DIR', '/System/Library/Fonts/Supplemental'))
NODE = os.environ.get('NODE_BINARY', shutil.which('node') or 'node')

for name, filename in [('Sans', 'Arial.ttf'), ('Bold', 'Arial Bold.ttf'),
                       ('Serif', 'Georgia Italic.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / filename)))
pdfmetrics.registerFontFamily('Sans', normal='Sans', bold='Bold', italic='Serif')

data_js = f"""
import {{ profileData, experienceData, skillsData, portfolioLinksData }} from '{(ROOT / 'app/data/profile.ts').as_uri()}';
import {{ projectsData, experimentsData }} from '{(ROOT / 'app/data/projects.ts').as_uri()}';
console.log(JSON.stringify({{profileData, experienceData, skillsData, portfolioLinksData, projectsData, experimentsData}}));
"""
DATA = json.loads(subprocess.check_output([NODE, '--input-type=module', '-e', data_js], text=True))

W, H = A4
M = 40
CW = W - M * 2
PAPER = HexColor('#f7f7f2')
INK = HexColor('#22251f')
MUTED = HexColor('#64695e')
LINE = HexColor('#d8dbd0')
LIME = HexColor('#d2ff5a')
PANEL = HexColor('#252a23')
LIGHT = HexColor('#edf1e5')


def clean(text):
    return str(text).replace('\u2011', '-').replace('—', '-').replace('–', '-').replace('\u00a0', ' ')


COPY = {
    'en': {
        'label': 'FRONTEND / FULLSTACK DEVELOPER',
        'tagline': 'From interface to a working product.',
        'summary': 'Commercial web development since 2023. I connect thoughtful interfaces with APIs, backend services and reliable delivery - from requirements to launch and maintenance.',
        'experience': 'Experience', 'toolkit': 'TOOLKIT', 'education': 'EDUCATION', 'languages': 'LANGUAGES',
        'degree': 'Software Engineering', 'graduation': "Bachelor's degree\nExpected graduation: 2027",
        'courses': 'Flang + Codex IT / 2025\nHTML Academy / 2024',
        'languageText': 'English - C1, Advanced\nRussian - Native',
        'work': 'Selected projects', 'workNote': 'Web applications, services and mobile tools. More details and project context at jujich.dev.',
        'more': 'ALSO IN MY LAB', 'links': 'LIVE PORTFOLIO',
        'approach': 'How I work',
        'approachText': 'Requirements and architecture, reusable interfaces, typed APIs and deployment. I use AI tools with a specification-driven approach and verify the resulting implementation.',
        'jobs': {
            'Sber': 'Develop a Next.js application and a React Telegram Mini App for AI-assisted event discovery. Work on interface designs using AI tools and specification-driven development.',
            'Freelance': 'Build commercial web applications and digital services. Handle client requirements, architecture, frontend and backend, deployment, maintenance and infrastructure.',
            'Codex IT': 'Contributed to an internal company messenger: UI components, forms and application state in an existing React codebase. Worked with issue tracking and code review.',
        },
        'projects': {
            'school': 'Role-based student, tutor and admin areas; a drag-and-drop course editor, HLS video and assignments. Multipart S3 uploads with progress tracking and retries.',
            'crm': 'Leads, deals, kanban and team tasks with company data isolation. CRM imports and an MCP interface with OAuth and scoped permissions for AI agents.',
            'vpn': 'Web interface, Telegram Mini App, bot and admin panel for VPN subscriptions. Account management, device setup and monitoring with Prometheus, Grafana and Loki.',
            'medical': 'Image collection and an upload queue using IndexedDB on the web, SQLite and WorkManager on Android. State survives restarts; remote uploads still need end-to-end verification.',
            'mafia': 'Host dashboard for in-person games: roles, night actions, voting and a recoverable timer. A local Android game engine with an offline queue and one-way synchronization.',
            'legal': 'Editable services and pricing with CMS publishing through GitLab CI. Enquiries are queued and delivered independently to a CRM and Telegram, with retries and deduplication.',
        },
        'lab': 'Forma: local MVP of a CMS with an AI editor, preview and starter export. AI agent infrastructure: Linux deployments of the third-party Hermes Agent with systemd and a Telegram gateway.',
        'footer': 'Frontend / Fullstack',
    },
    'ru': {
        'label': 'FRONTEND / FULLSTACK-РАЗРАБОТЧИК',
        'tagline': 'От интерфейса до работающего продукта.',
        'summary': 'Коммерческая веб-разработка с 2023 года. Соединяю продуманные интерфейсы с API, серверной логикой и инфраструктурой: от требований до запуска и поддержки.',
        'experience': 'Опыт работы', 'toolkit': 'НАВЫКИ', 'education': 'ОБРАЗОВАНИЕ', 'languages': 'ЯЗЫКИ',
        'degree': 'Программная инженерия', 'graduation': 'Бакалавриат\nОжидаемый выпуск: 2027',
        'courses': 'Flang + Codex IT / 2025\nHTML Academy / 2024',
        'languageText': 'Английский - C1, Advanced\nРусский - родной',
        'work': 'Избранные проекты', 'workNote': 'Веб-приложения, сервисы и мобильные инструменты. Подробности и контекст проектов - на jujich.dev/ru.',
        'more': 'ТАКЖЕ В МОЕЙ ЛАБОРАТОРИИ', 'links': 'ПОРТФОЛИО В СЕТИ',
        'approach': 'Подход к работе',
        'approachText': 'Требования и архитектура, переиспользуемые интерфейсы, типизированные API и деплой. Использую AI-инструменты и подход SDD с проверкой результата.',
        'jobs': {
            'Сбер': 'Разрабатываю приложение на Next.js и Telegram Mini App на React для подбора мероприятий с помощью ИИ. Работаю с макетами интерфейса, AI-инструментами и подходом SDD.',
            'Фриланс': 'Создаю коммерческие веб-приложения и цифровые сервисы. Веду полный цикл: требования заказчика, архитектура, frontend и backend, инфраструктура, деплой и поддержка.',
            'Нижегородский ЦСМ': 'В команде разработки государственной системы для работы с декларациями: страницы, компоненты, типизация, валидация форм, SSR и проксирование API через Nitro.',
            'Codex IT': 'Дорабатывал корпоративный мессенджер: компоненты интерфейса, формы и состояние приложения в существующей кодовой базе. Работал с трекером задач и code review.',
        },
        'projects': {
            'school': 'Кабинеты ученика, куратора и администратора; редактор курсов с drag-and-drop, HLS-видео и домашние задания. Multipart-загрузка в S3 с прогрессом и повторами.',
            'crm': 'Лиды, сделки, канбан и командные задачи с изоляцией данных компаний. Импорт из CRM и MCP-интерфейс с OAuth и уровнями разрешений для AI-агентов.',
            'vpn': 'Web-интерфейс, Telegram Mini App, бот и админ-панель VPN-подписок. Управление аккаунтами, инструкции подключения и мониторинг через Prometheus, Grafana и Loki.',
            'medical': 'Сбор изображений и очередь отправки: IndexedDB в web, SQLite и WorkManager на Android. Данные переживают перезапуск; удалённая отправка требует сквозной проверки.',
            'mafia': 'Панель ведущего очной игры: роли, ночные действия, голосование и таймер. Локальный игровой движок на Android, очередь и однонаправленная синхронизация.',
            'legal': 'Редактируемые услуги и тарифы, CMS с публикацией через GitLab CI. Очередь заявок с независимой доставкой в CRM и Telegram, повторами и дедупликацией.',
        },
        'lab': 'Forma: локальный MVP CMS с AI-редактором, предпросмотром и экспортом starters. Инфраструктура AI-агентов: Linux-развёртывания стороннего Hermes Agent с systemd и Telegram gateway.',
        'footer': 'Frontend / Fullstack',
    },
}


class Resume:
    def __init__(self, locale):
        self.locale = locale
        self.copy = COPY[locale]
        self.profile = DATA['profileData'][locale]
        self.buffer = io.BytesIO()
        self.c = canvas.Canvas(self.buffer, pagesize=A4, pageCompression=1)
        self.c.setTitle(self.profile['name'] + ' | Frontend / Fullstack | ' + locale.upper())
        self.c.setAuthor(self.profile['name'])
        self.c.setSubject('Professional resume / jujich.dev')

    def rect(self, x, top, width, height, fill, radius=0):
        self.c.setFillColor(fill)
        self.c.setStrokeColor(fill)
        if radius:
            self.c.roundRect(x, H - top - height, width, height, radius, fill=1, stroke=0)
        else:
            self.c.rect(x, H - top - height, width, height, fill=1, stroke=0)

    def text(self, text, x, top, size=10, font='Sans', color=INK):
        self.c.setFont(font, size)
        self.c.setFillColor(color)
        self.c.drawString(x, H - top - size, clean(text))

    def para(self, text, x, top, width, size=10.2, leading=14.2, color=INK, font='Sans', markup=False):
        content = clean(text) if markup else escape(clean(text)).replace('\n', '<br/>')
        p = Paragraph(content, ParagraphStyle('text', fontName=font, fontSize=size, leading=leading,
                      textColor=color, alignment=TA_LEFT, spaceBefore=0, spaceAfter=0, splitLongWords=False))
        _, height = p.wrap(width, H)
        if top + height > H - 49:
            raise ValueError(f'{self.locale} content exceeds footer: {text[:55]} at {top + height:.1f}')
        p.drawOn(self.c, x, H - top - height)
        return top + height

    def rule(self, y, x=M, width=CW, color=LINE):
        self.c.setStrokeColor(color)
        self.c.setLineWidth(.55)
        self.c.line(x, H - y, x + width, H - y)

    def link(self, text, url, x, top, size=9.2, color=INK, font='Sans'):
        self.text(text, x, top, size, font, color)
        width = pdfmetrics.stringWidth(clean(text), font, size)
        self.c.linkURL(url, (x, H-top-size-3, x+width, H-top+1), relative=0, thickness=0)
        return width

    def page(self, number):
        self.rect(0, 0, W, H, PAPER)
        self.text('jujich', M, 28, 22, 'Bold')
        self.text('dev', M+59, 28, 7.5, 'Bold')
        self.rect(W-M-57, 31, 57, 20, LIME, 10)
        self.text(f'{self.locale.upper()}  /  CV', W-M-44, 35, 8.5, 'Bold')
        self.rule(65)
        self.rule(H - 44)
        self.link('jujich.dev', 'https://jujich.dev' + ('/ru' if self.locale == 'ru' else '/'), M, H-32, 8.5, MUTED)
        self.text(self.copy['footer'], M+202, H-32, 8.5, color=MUTED)
        self.text(f'0{number} / 02', W-M-36, H-32, 8, color=MUTED)

    def first_page(self):
        self.page(1)
        self.text(self.profile['name'], M, 82, 39, 'Bold')
        self.text(self.copy['label'], M+1, 137, 10.5, 'Bold')
        self.text(self.copy['tagline'], M, 163, 19 if self.locale == 'en' else 17.5, 'Serif')
        self.para(self.copy['summary'], M, 197, CW, 10.3, 14.4, MUTED)
        self.link(self.profile['email'], 'mailto:'+self.profile['email'], M, 239, 9)
        self.link('t.me/jujich', self.profile['telegram'], M+198, 239, 9)
        self.link('github.com/Jujich', self.profile['github'], M+302, 239, 9)
        self.text(self.profile['location'] + '  /  UTC+3', M, 258, 8.5, color=MUTED)
        self.rule(282)

        # The main column retains natural text order; the sidebar follows it in PDF extraction.
        main_width = 325
        y = 301
        self.text('01', M, y+4, 9, color=MUTED)
        self.text(self.copy['experience'], M+24, y, 21, 'Serif')
        y += 40
        for job in DATA['experienceData'][self.locale]:
            self.text(job['company'], M, y, 13.2, 'Bold')
            y += 19
            y = self.para(job['title'] + '  /  ' + job['period'], M, y, main_width,
                          8.6, 11.4, MUTED)
            y += 7
            y = self.para(self.copy['jobs'][job['company']], M, y, main_width, 10.1, 14)
            y += 17

        # The English version has three roles, leaving room for a short working-style note.
        if self.locale == 'en':
            self.rule(y, width=main_width)
            self.text(self.copy['approach'], M, y+15, 13, 'Serif')
            self.para(self.copy['approachText'], M, y+37, main_width, 10, 14, MUTED)

        sx, sw = M + main_width + 25, CW - main_width - 25
        self.rect(sx-10, 300, sw+10, 473, PANEL, 7)
        y = 316
        self.text(self.copy['toolkit'], sx+4, y, 9, 'Bold', LIME)
        y += 25
        for group in DATA['skillsData'][self.locale]:
            y = self.para(group['title'], sx+4, y, sw-16, 10.4, 13, LIGHT, 'Bold')
            y += 5
            y = self.para(' · '.join(group['items']), sx+4, y, sw-16, 9.3, 13.4, LIGHT)
            y += 18
        self.rule(y-3, sx+4, sw-18, HexColor('#58634b'))
        self.text(self.copy['education'], sx+4, y+12, 9, 'Bold', LIME)
        y += 35
        y = self.para(self.profile['education'], sx+4, y, sw-16, 10.2, 13.7, LIGHT, 'Bold')
        y += 6
        y = self.para(self.copy['degree'] + '\n' + self.copy['graduation'], sx+4, y, sw-16, 9.3, 13.4, LIGHT)
        y += 13
        y = self.para(self.copy['courses'], sx+4, y, sw-16, 8.5, 12.4, LIGHT)
        self.text(self.copy['languages'], sx+4, y+18, 9, 'Bold', LIME)
        y = self.para(self.copy['languageText'], sx+4, y+42, sw-16, 9.3, 13.6, LIGHT)
        if y > 760:
            raise ValueError(f'{self.locale}: sidebar exceeds panel ({y})')
        self.c.showPage()

    def second_page(self):
        self.page(2)
        self.text('02', M, 89, 9, color=MUTED)
        self.text(self.copy['work'], M+27, 80, 28, 'Serif')
        self.para(self.copy['workNote'], M, 123, CW, 10.2, 14.4, MUTED)
        y = 158
        for i, project in enumerate(DATA['projectsData'][self.locale], 1):
            self.rect(M, y+2, 23, 23, LIME, 4)
            self.text(f'{i:02}', M+6, y+7, 9, 'Bold')
            x = M+36
            self.text(project['name'], x, y, 12.5, 'Bold')
            y += 20
            self.text(' / '.join(project['tags']) + '  |  ' + project['status'], x, y, 8.1, color=MUTED)
            y += 17
            y = self.para(self.copy['projects'][project['id']], x, y, CW-36, 10.1, 13.7)
            y += 9
            self.rule(y)
            y += 10

        self.text(self.copy['more'], M, y, 8.2, 'Bold', MUTED)
        y = self.para(self.copy['lab'], M, y+18, CW, 9.4, 13.2)
        y += 20
        self.text(self.copy['links'], M, y, 8.2, 'Bold', MUTED)
        links = DATA['portfolioLinksData'][self.locale]
        # Select live links from the résumé; the full list remains on the website.
        selected = [p for p in links if p['url'] in ['https://academy-gb.ru', 'https://finance-balance.ru', 'https://ultim-ai.ru']]
        selected.append({'name': 'jujich.dev', 'url': 'https://jujich.dev' + ('/ru' if self.locale == 'ru' else '/')})
        markup = ' &nbsp; / &nbsp; '.join(f'<link href="{escape(p["url"])}" color="#22251f"><u>{escape(p["url"].replace("https://", "").rstrip("/"))}</u></link>' for p in selected)
        self.para(markup, M, y+17, CW, 9.2, 13.5, markup=True)
        self.c.showPage()

    def save(self):
        self.first_page()
        self.second_page()
        self.c.save()
        reader = PdfReader(io.BytesIO(self.buffer.getvalue()))
        writer = PdfWriter()
        writer.clone_document_from_reader(reader)
        writer._root_object[NameObject('/Lang')] = TextStringObject('ru-RU' if self.locale == 'ru' else 'en-US')
        name = f'kuzma-korolev-resume-{self.locale}.pdf'
        OUTPUT.mkdir(parents=True, exist_ok=True)
        with (OUTPUT / name).open('wb') as stream:
            writer.write(stream)
        shutil.copyfile(OUTPUT / name, PUBLIC / name)
        if self.locale == 'ru':
            # Keep previously shared résumé URLs useful after the redesign.
            shutil.copyfile(OUTPUT / name, PUBLIC / 'kuzma-korolev-resume.pdf')
        print(f'{name}: {len(reader.pages)} pages, {(OUTPUT / name).stat().st_size:,} bytes')


if __name__ == '__main__':
    for lang in ('ru', 'en'):
        Resume(lang).save()
