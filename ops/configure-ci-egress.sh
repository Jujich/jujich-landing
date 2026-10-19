#!/usr/bin/env bash
# Requires explicit approval: persistent direct internet access for CI only.
# This origin uses sing-box transparent routing. Exempt only the CI account
# using sing-box's existing bypass mark; never alter its own rules or config.
set -Eeuo pipefail
[[ "$(id -u)" == 0 ]] || { echo 'Root required for the account-scoped network rule' >&2; exit 1; }
runner_uid="$(id -u jujich-deploy)"
sing_box_rules="$(nft list table inet sing-box)"
grep -q 'meta mark 0x00002024' <<< "$sing_box_rules" || {
  echo 'Expected sing-box bypass mark is absent; refusing to guess network rules' >&2
  exit 1
}
install -d -m 755 /etc/jujich-runner
cat > /etc/jujich-runner/egress.nft <<NFT
flush table inet jujich_ci
table inet jujich_ci {
    chain output {
        type route hook output priority -152; policy accept;
        meta skuid $runner_uid meta mark set 0x00002024 ct mark set 0x00002024 comment "jujich-deploy only: direct CI egress"
    }
}
NFT
cat > /etc/systemd/system/jujich-ci-egress.service <<'SERVICE'
[Unit]
Description=Direct network access for the isolated jujich CI account
After=network-online.target sing-box.service
Before=jujich-runner.service
Wants=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStartPre=/bin/sh -c '/usr/sbin/nft list table inet jujich_ci >/dev/null 2>&1 || /usr/sbin/nft add table inet jujich_ci'
ExecStart=/usr/sbin/nft -f /etc/jujich-runner/egress.nft
ExecStop=/usr/sbin/nft delete table inet jujich_ci

[Install]
WantedBy=multi-user.target
SERVICE
install -d -m 755 /etc/systemd/system/jujich-runner.service.d
cat > /etc/systemd/system/jujich-runner.service.d/10-egress.conf <<'SERVICE'
[Unit]
Requires=jujich-ci-egress.service
After=jujich-ci-egress.service
SERVICE
systemctl daemon-reload
systemctl enable --now jujich-ci-egress.service
systemctl restart jujich-ci-egress.service
systemctl restart jujich-runner.service
runuser -u jujich-deploy -- curl --head --silent --show-error --fail --max-time 15 https://gitlab.pixels-it.ru/
runuser -u jujich-deploy -- curl --head --silent --show-error --fail --max-time 15 https://registry.npmjs.org/
