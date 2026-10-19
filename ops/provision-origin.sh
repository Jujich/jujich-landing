#!/usr/bin/env bash
# Run once as root on the origin Ubuntu server after inspecting its services.
# Run from the repository (or a copy of ops/). No credentials belong in this file.
set -Eeuo pipefail
[[ "$(id -u)" == 0 ]] || { echo 'Provisioning requires root' >&2; exit 1; }
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
source /etc/os-release
[[ "$ID" == ubuntu && "$VERSION_CODENAME" =~ ^[a-z]+$ ]] || { echo 'This installer is for Ubuntu' >&2; exit 1; }
export DEBIAN_FRONTEND=noninteractive
missing_packages=()
for package in ca-certificates curl git gnupg nginx python3 util-linux xz-utils; do
  if [[ "$(dpkg-query -W -f='${Status}' "$package" 2>/dev/null || true)" != 'install ok installed' ]]; then
    missing_packages+=("$package")
  fi
done
if (( ${#missing_packages[@]} > 0 )); then
  apt-get -o DPkg::Lock::Timeout=60 update
  apt-get -o DPkg::Lock::Timeout=60 install -y "${missing_packages[@]}"
fi

if ! id jujich-deploy >/dev/null 2>&1; then
  useradd --system --create-home --home-dir /var/lib/jujich-runner --shell /bin/bash jujich-deploy
fi
install -d -m 755 -o jujich-deploy -g jujich-deploy /var/lib/jujich-runner /var/www/jujich.dev /var/www/jujich.dev/releases
# Ubuntu's interactive clear_console logout hook breaks noninteractive shell jobs.
if [[ -f /var/lib/jujich-runner/.bash_logout ]] && grep -q 'clear_console' /var/lib/jujich-runner/.bash_logout; then
  mv /var/lib/jujich-runner/.bash_logout /var/lib/jujich-runner/.bash_logout.disabled-for-ci
  install -m 644 -o jujich-deploy -g jujich-deploy /dev/null /var/lib/jujich-runner/.bash_logout
fi
install -d -m 755 /opt/jujich

if [[ ! -x /opt/jujich/node/bin/node ]]; then
  case "$(dpkg --print-architecture)" in
    amd64) node_arch=x64;;
    arm64) node_arch=arm64;;
    *) echo 'Unsupported Node.js binary architecture' >&2; exit 1;;
  esac
  task_tmp="$(mktemp -d)"
  trap 'rm -rf "$task_tmp"' EXIT
  if [[ -n "${NODE_ARCHIVE:-}" ]]; then
    archive="$(basename "$NODE_ARCHIVE")"
    [[ "${NODE_SHA256:-}" =~ ^[a-f0-9]{64}$ ]] || { echo 'Offline archive requires its official SHA256' >&2; exit 1; }
    cp "$NODE_ARCHIVE" "$task_tmp/$archive"
    printf '%s  %s\n' "$NODE_SHA256" "$archive" > "$task_tmp/SHASUMS256.txt"
  else
    curl --fail --silent --show-error --proto '=https' --tlsv1.2 https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt -o "$task_tmp/SHASUMS256.txt"
    archive="$(awk -v arch="$node_arch" '$2 ~ "^node-v24\\.[0-9]+\\.[0-9]+-linux-" arch "\\.tar\\.xz$" {print $2}' "$task_tmp/SHASUMS256.txt")"
    [[ "$archive" =~ ^node-v24\.[0-9]+\.[0-9]+-linux-(x64|arm64)\.tar\.xz$ ]] || { echo 'Unable to select official Node 24 release' >&2; exit 1; }
    curl --fail --silent --show-error --proto '=https' --tlsv1.2 "https://nodejs.org/dist/latest-v24.x/$archive" -o "$task_tmp/$archive"
  fi
  [[ "$archive" =~ ^node-v24\.[0-9]+\.[0-9]+-linux-${node_arch}\.tar\.xz$ ]] || { echo 'Wrong Node.js archive architecture or version' >&2; exit 1; }
  (cd "$task_tmp" && grep "  $archive$" SHASUMS256.txt | sha256sum --check -)
  tar -xJf "$task_tmp/$archive" -C /opt/jujich
  ln -s "${archive%.tar.xz}" /opt/jujich/node
fi

if ! command -v gitlab-runner >/dev/null; then
  curl --fail --silent --show-error --proto '=https' https://packages.gitlab.com/runner/gitlab-runner/gpgkey -o /tmp/jujich-gitlab-runner.gpg
  gpg --dearmor --yes -o /usr/share/keyrings/jujich-gitlab-runner.gpg /tmp/jujich-gitlab-runner.gpg
  rm /tmp/jujich-gitlab-runner.gpg
  printf 'deb [signed-by=/usr/share/keyrings/jujich-gitlab-runner.gpg] https://packages.gitlab.com/runner/gitlab-runner/ubuntu/ %s main\n' "$VERSION_CODENAME" > /etc/apt/sources.list.d/jujich-gitlab-runner.list
  apt-get update
  apt-get install -y gitlab-runner
fi

nginx_file=/etc/nginx/sites-available/jujich.dev
if [[ -f "$nginx_file" ]] && ! cmp -s "$script_dir/nginx-origin.conf" "$nginx_file"; then
  cp -a "$nginx_file" "${nginx_file}.backup-$(date +%s)"
fi
install -m 644 "$script_dir/nginx-origin.conf" "$nginx_file"
ln -sfn "$nginx_file" /etc/nginx/sites-enabled/jujich.dev
nginx -t
systemctl reload nginx
install -m 644 "$script_dir/jujich-runner.service" /etc/systemd/system/jujich-runner.service
systemctl daemon-reload
printf 'Origin provisioned. Node: '
/opt/jujich/node/bin/node --version
printf 'Next: register the project runner, then enable jujich-runner.service.\n'
