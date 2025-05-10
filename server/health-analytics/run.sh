#!/bin/bash

# Install Python dependencies
# echo "Installing Python dependencies..."
# cd python
# pip install -r requirements.txt
# cd ..

# Set JAVA_HOME to Java 17 (macOS)
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"

# Set Java options for Spark compatibility with Java 17
export JAVA_OPTS="--add-opens=java.base/java.lang=ALL-UNNAMED --add-opens=java.base/java.util=ALL-UNNAMED --add-opens=java.base/sun.nio.ch=ALL-UNNAMED"
export MAVEN_OPTS="--add-exports=java.base/sun.nio.ch=ALL-UNNAMED"

# Show the Java version being used
java -version

# Clean and compile the project without running tests
mvn clean package -DskipTests

# Run the application with required JVM arguments for Spark compatibility
echo "Starting the application..."
mvn spring-boot:run -Dspring-boot.run.jvmArguments="--add-exports=java.base/sun.nio.ch=ALL-UNNAMED"