#!/bin/bash

SSL_DIR="/etc/nginx/ssl"
DOMAIN="shohan.dev"

# Ensure the SSL directory exists
if [ ! -d "$SSL_DIR" ]; then
    echo "SSL directory does not exist. Creating it..."
    mkdir -p "$SSL_DIR"
fi

# Check if certificates exist; if not, generate them
if [ ! -f "$SSL_DIR/shohan.dev.crt" ] || [ ! -f "$SSL_DIR/shohan.dev.key" ]; then
    echo "Generating SSL certificates with OpenSSL..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$SSL_DIR/shohan.dev.key" \
        -out "$SSL_DIR/shohan.dev.crt" \
        -subj "/CN=$DOMAIN"
    echo "Certificates generated at $SSL_DIR"
else
    echo "SSL certificates already exist. Skipping generation."
fi

# Debug: List SSL directory contents
echo "SSL Directory contents:"
ls -l $SSL_DIR

# Start Nginx
echo "Starting Nginx..."
nginx -g "daemon off;"
