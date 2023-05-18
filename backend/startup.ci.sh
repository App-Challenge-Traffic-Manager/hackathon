#!/usr/bin/env bash
set -e

ls -la
npx prisma migrate dev
npm run start:prod 
