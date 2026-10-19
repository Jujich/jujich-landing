# Деплой jujich.dev

Лендинг собирается как статический Nuxt-сайт. Node.js 24.22.0 установлен отдельно в `/opt/jujich/node`: системный Node и другие приложения сервера не меняются.

## GitLab → сервер

Репозиторий: `https://gitlab.pixels-it.ru/jujich-landing/jujich-landing` (private).

Push в защищённую ветку `main` запускает `.gitlab-ci.yml`:

1. `npm ci --no-audit --no-fund`
2. `npm run typecheck`
3. `npm test`
4. `npm run generate`
5. Сохранение `.output/public` как артефакта на 7 дней.
6. `ops/deploy.sh` публикует проверенный артефакт на том же сервере.

Отдельный project runner `jujich-landing-origin` (ID 49, тег `jujich-landing`) закреплён за этим проектом и принимает только protected refs. Сервис `jujich-runner.service` и задания работают от пользователя `jujich-deploy`, без sudo. Существующий `gitlab-runner.service` сохранён.

Рабочий каталог runner: `/var/lib/jujich-runner`. Его authentication token хранится только на сервере в `config.toml` с правами `0600`. В CI не нужны SSH-пароль и личный GitLab token.

## Публикация и откат

- Origin: `192.168.98.14`, nginx, `/var/www/jujich.dev`.
- Готовые версии: `releases/<commit SHA>-<pipeline ID>`.
- `current` переключается атомарным переименованием симлинка.
- `previous` хранит последнюю успешную версию. Сохраняются минимум пять последних сборок.
- После переключения проверяется `/.well-known/deployment.txt` через nginx. При ошибке автоматически возвращается предыдущая версия.
- Блокировка `flock` и GitLab `resource_group: production` предотвращают одновременные публикации.

Для возврата к более старому содержимому сделайте revert нужного коммита в `main` и push: обычный pipeline проверит и опубликует исправленную версию.

## Домен и HTTPS

DNS в Timeweb: `jujich.dev` и `www.jujich.dev` → `82.208.85.23`, TTL 600. Другие DNS-записи не меняются.

Публичный NAT ведёт на существующий nginx-шлюз kserver (`192.168.98.12`), который проксирует только этот домен на origin `192.168.98.14:80`. HTTPS завершается на шлюзе; внутри LAN используется HTTP. Сертификат Let's Encrypt выпущен для обоих имён, действует до 17.01.2027; продление выполняет активный `certbot.timer`. Канонический адрес — `https://jujich.dev`, с редиректами HTTP и www. На origin используются `try_files $uri $uri/ =404`, поэтому английская `/` и русская `/ru/` страницы обслуживаются как отдельные статические маршруты.

Файлы:

- `ops/nginx-origin.conf` — nginx на origin.
- `ops/nginx-gateway-http.conf` — первоначальный HTTP vhost на шлюзе для выпуска сертификата.
- `ops/nginx-gateway.conf` — действующий HTTPS vhost и канонические редиректы.
- `ops/provision-origin.sh` — первоначальная настройка origin (root, Ubuntu; существующие сервисы не заменяются).
- `ops/jujich-runner.service` — отдельный runner.

На сервере уже работает `sing-box`, который сбрасывал исходящие подключения к GitLab/npm. С явного разрешения владельца применён `ops/configure-ci-egress.sh`: отдельное nftables-правило для UID `jujich-deploy` использует существующую bypass mark sing-box и направляет только CI-трафик напрямую. Правило сохраняется сервисом `jujich-ci-egress.service`; VPN остальных пользователей и процессов не изменяется.

## Проверки и обслуживание

На origin:

```sh
sudo systemctl status jujich-runner
sudo journalctl -u jujich-runner --since '10 minutes ago'
curl -fsS -H 'Host: jujich.dev' http://127.0.0.1/.well-known/deployment.txt
```

На шлюзе:

```sh
sudo nginx -t
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
```

Снаружи:

```sh
curl -I https://jujich.dev/
curl -I https://jujich.dev/ru/
curl -I https://www.jujich.dev/
```

`.credentials/`, `.local/`, `.env*`, зависимости и результаты сборки исключены через `.gitignore`. Не добавляйте пароли, SSH-ключи или токены в tracked-файлы.
