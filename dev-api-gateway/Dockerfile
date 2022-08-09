FROM maven:latest as maven

COPY . /usr/src/app
WORKDIR /usr/src/app

# Compile and package the application to an executable JAR
RUN mvn package 

# For Java 17.0.1, 
# FROM adoptopenjdk/openjdk11:alpine-jre
# FROM openjdk:8-jdk-alpine
FROM openjdk:17.0.1
ARG JAR_FILE=api-gateway-0.0.1-SNAPSHOT.jar

COPY . /app/

WORKDIR /app

# Copy the spring-boot-api-tutorial.jar from the maven stage to the /opt/app directory of the current stage.
COPY  target/${JAR_FILE} /app/

ENTRYPOINT ["java","-jar","api-gateway-0.0.1-SNAPSHOT.jar"]