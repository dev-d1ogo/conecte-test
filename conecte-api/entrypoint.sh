#!/bin/sh

# Fail on error
set -e

echo "🚀 Aplicando migrations..."
npx prisma migrate deploy

echo "🌱 Executando seed..."
npm run seed

echo "🟢 Iniciando aplicação..."
npm run start:prod
