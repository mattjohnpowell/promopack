#!/bin/sh
set -e

echo "Starting PromoPack deployment..."

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Generate Prisma Client (in case it's not already generated)
echo "Generating Prisma Client..."
npx prisma generate

echo "Starting application server..."
# Start the Next.js server
exec node server.js
