#!/bin/sh
# Runs before nginx starts (official image: every script in /docker-entrypoint.d/).
# Creates a self-signed certificate on first start only. It lives in the
# "certs" volume, so it survives restarts and rebuilds and is never in the image.
set -eu

CERT_DIR=/etc/nginx/certs

if [ -f "$CERT_DIR/cert.pem" ] && [ -f "$CERT_DIR/key.pem" ]; then
    echo "$0: using the existing certificate"
    exit 0
fi

echo "$0: generating a self-signed certificate for localhost"
mkdir -p "$CERT_DIR"
openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
    -subj "/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:::1" \
    -keyout "$CERT_DIR/key.pem" -out "$CERT_DIR/cert.pem" 2>/dev/null
chmod 600 "$CERT_DIR/key.pem"