#!/bin/sh

echo "Waiting for MySQL to be ready..."

sleep 3

echo "MySQL is ready! Starting Django server..."
exec "$@"
