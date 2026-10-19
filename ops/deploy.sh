#!/usr/bin/env bash
# Run as the dedicated, unprivileged jujich-deploy account on the web server.
set -Eeuo pipefail
umask 022

source_dir="${1:?Usage: deploy.sh BUILD_DIRECTORY RELEASE_ID}"
release_id="${2:?Release id required}"
site_root="${SITE_ROOT:-/var/www/jujich.dev}"
health_url="${HEALTHCHECK_URL:-http://127.0.0.1/.well-known/deployment.txt}"
site_host="${SITE_HOST:-jujich.dev}"

[[ "$release_id" =~ ^[a-zA-Z0-9][a-zA-Z0-9._-]{0,100}$ ]] || { echo 'Invalid release id' >&2; exit 1; }
[[ -s "$source_dir/index.html" ]] || { echo 'Build is missing index.html' >&2; exit 1; }
[[ -d "$site_root/releases" ]] || { echo 'Server has not been provisioned' >&2; exit 1; }
[[ "$(id -u)" != 0 ]] || { echo 'Deploy must not run as root' >&2; exit 1; }
[[ -z "$(find "$source_dir" -type l -print -quit)" ]] || { echo 'Build must not contain symbolic links' >&2; exit 1; }
[[ ! -e "$site_root/current" || -L "$site_root/current" ]] || { echo 'current must be a symlink' >&2; exit 1; }

# The flock also protects a manual deployment from a simultaneous CI deployment.
exec 9>"$site_root/.deploy.lock"
flock -w 120 9
release_dir="$site_root/releases/$release_id"
[[ ! -e "$release_dir" ]] || { echo 'This release already exists; use a new release id' >&2; exit 1; }
mkdir "$release_dir"
cp -a "$source_dir/." "$release_dir/"
find "$release_dir" -type d -exec chmod 755 {} +
find "$release_dir" -type f -exec chmod 644 {} +
mkdir -p "$release_dir/.well-known"
printf '%s\n' "$release_id" > "$release_dir/.well-known/deployment.txt"

# Python's os.replace performs an atomic rename on Linux and macOS.
replace_link() {
  python3 - "$site_root" "$1" "$2" <<'PY'
import os, sys
root, name, target = sys.argv[1:]
link = os.path.join(root, name)
tmp = link + '.next'
try:
    os.unlink(tmp)
except FileNotFoundError:
    pass
os.symlink(target, tmp)
os.replace(tmp, link)
PY
}

previous="$(readlink "$site_root/current" || true)"
[[ -z "$previous" || "$previous" =~ ^releases/[a-zA-Z0-9][a-zA-Z0-9._-]{0,100}$ ]] || { echo 'Unexpected current release target' >&2; exit 1; }
replace_link current "releases/$release_id"
healthy=false
for attempt in 1 2 3 4 5; do
  actual="$(curl --silent --show-error --fail --max-time 10 -H "Host: $site_host" "$health_url" || true)"
  if [[ "$actual" == "$release_id" ]]; then healthy=true; break; fi
  sleep 1
done
if [[ "$healthy" != true ]]; then
  if [[ -n "$previous" ]]; then
    replace_link current "$previous"
  else
    rm "$site_root/current"
  fi
  echo 'Deployment health check failed. Previous release restored.' >&2
  exit 1
fi
if [[ -n "$previous" ]]; then replace_link previous "$previous"; fi

# Retain the five newest releases, plus current/previous even after a rollback.
python3 - "$site_root" <<'PY'
import pathlib, re, shutil, sys
root = pathlib.Path(sys.argv[1])
protected = {(root / n).resolve() for n in ('current', 'previous') if (root / n).is_symlink()}
releases = sorted((p for p in (root / 'releases').iterdir() if p.is_dir() and not p.is_symlink() and re.fullmatch(r'[a-zA-Z0-9][a-zA-Z0-9._-]{0,100}', p.name)), key=lambda p: p.stat().st_mtime_ns, reverse=True)
for release in releases[5:]:
    if release.resolve() not in protected:
        shutil.rmtree(release)
PY
printf 'Published %s\n' "$release_id"
