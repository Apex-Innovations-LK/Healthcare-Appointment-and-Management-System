#!/bin/sh
# export everything from .env
set -a
. /app/.env
set +a

# launch Spring Boot
exec java -jar app.jar
