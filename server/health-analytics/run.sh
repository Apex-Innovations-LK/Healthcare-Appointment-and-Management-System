#!/bin/bash

# Install Python dependencies
echo "Installing Python dependencies..."
cd python
pip install -r requirements.txt
cd ..

# Set Java options for Spark compatibility with Java 21
export JAVA_OPTS="--add-opens=java.base/java.lang=ALL-UNNAMED --add-opens=java.base/java.util=ALL-UNNAMED --add-opens=java.base/sun.nio.ch=ALL-UNNAMED -Djava.security.manager=allow"

# Run the application
echo "Starting the application..."
mvn spring-boot:run