#!/bin/sh
set -e

echo "==> Menjalankan Migrasi Database SQLite Produksi..."
npx prisma migrate deploy

echo "==> Database Siap! Memulai Aplikasi Next.js..."
exec npm run start