#!/bin/bash

# Load environment variables
echo "Loading environment variables..."
export $(grep -v '^#' /etc/nginx/.env | xargs)

# echo "Checking SSL directory: $SSL_DIR"
# if [ ! -d "$SSL_DIR" ]; then
#     echo "SSL directory does not exist. Creating it..."
#     mkdir -p "$SSL_DIR"
# fi

# Check if certificates exist; if not, generate them
if [ ! -f "$SSL_DIR/shohan.dev.crt" ] || [ ! -f "$SSL_DIR/shohan.dev.key" ]; then
    echo "Generating SSL certificates..."
    mkcert -install
    mkcert -cert-file $SSL_DIR/shohan.dev.crt -key-file $SSL_DIR/shohan.dev.key $DOMAIN
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
