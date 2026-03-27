#!/bin/sh
set -eu

include_file="/etc/nginx/conf.d/api-proxy.inc"
proxy_pass="${NGINX_API_PROXY_PASS:-}"

if [ -n "$proxy_pass" ]; then
  cat > "$include_file" <<EOF
location /api/ {
  proxy_pass ${proxy_pass};
  proxy_http_version 1.1;
  proxy_set_header Host \$host;
  proxy_set_header X-Real-IP \$remote_addr;
  proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto \$scheme;
  proxy_read_timeout 60s;
}
EOF
else
  cat > "$include_file" <<'EOF'
# API proxy is disabled for this container.
EOF
fi
