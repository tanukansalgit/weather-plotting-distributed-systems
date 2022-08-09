# weather-plotting
# CoDist

Tanu Kansal

Chinmay Kunte

Aditya Arun Rudrawar

Parnal Ghundare Patil

## Tech Stack

RabbitMQ, Docker, Kunernetes, CI/CD

- Front-End: ReactJS
- API gateway – Java Spring Boot
- Registry – NodeJS, Database: MongoDB
- Data Ingestion and Plotting - Python
- Logging and History service – GoLang, Database: PostgreSQL
- Merra-data-ingestion - Python
- Merra-plotting - Python, Anaconda

## Prerequisites
- Make sure no other application running on ports: 8000, 8080, 5000, 3333, 27017, 5432, 1776, 6050, 5672, 5000

- Start application in browser using: http://localhost:1776


## Docker Installation Procedure (Run with Docker)

- Install Docker and Docker-compose

# Pull docker images from account: tanukansaldocker123 ( Multiple images created for multiple processor configurations )

-For MAC : arm64
-For WINDOWS/LINUX: amd64

- docker pull tanukansaldocker123/codist-gateway:arm64 || docker pull tanukansaldocker123/codist-gateway:amd64
- docker pull tanukansaldocker123/codist-registry:arm64 || docker pull tanukansaldocker123/codist-registry:amd64
- docker pull tanukansaldocker123/codist-plotting:arm64 || docker pull tanukansaldocker123/codist-plotting:amd64
- docker pull tanukansaldocker123/codist-history:arm64 || docker pull tanukansaldocker123/codist-history:amd64
- docker pull tanukansaldocker123/codist-postgres:arm64 || docker pull tanukansaldocker123/codist-postgres:amd64
- docker pull tanukansaldocker123/codist-frontend:arm64 || docker pull tanukansaldocker123/codist-frontend:amd64
- docker pull mongo:5.0.5-focal

- Create local folders for Mongo and Postgres volumes, and add to .yml file accordinly.

# Run yml file
- docker-compose  -f stackMac.yml up -d || docker-compose  -f stackWindows.yml up -d

## Napkin Diagram

![Blank diagram (7)](https://user-images.githubusercontent.com/94020074/162101246-86c66b52-1336-424c-afdd-266e8ed6eb9c.png)


## Microservice Architecture

![Blank diagram (6)](https://user-images.githubusercontent.com/94020074/162101259-531aeda2-6400-42e8-89c0-86c138e24b40.png)


Please refer Wiki Page for detailed information related to all our project phases

https://github.com/airavata-courses/CoDist/wiki/Project-Phase-I

## Microservices Installation Procedure (Not needed if Docker installation procedure is done)

- [Frontend - ReactJS](https://github.com/airavata-courses/CoDist/tree/basic_ui)
- [API Gateway - Java Spring Boot](https://github.com/airavata-courses/CoDist/tree/dev-api-gateway)
- [Plotting Microservice - Python Flask](https://github.com/airavata-courses/CoDist/tree/dev-plotting)
- [History Microservice - Golang](https://github.com/airavata-courses/CoDist/tree/dev-history-service)
- [Registry Microservice - NodeJS](https://github.com/airavata-courses/CoDist/tree/dev-registry)
- [MERRA data plotting Microservice - Python](https://github.com/airavata-courses/CoDist/tree/dockerChangesMerraPlotting)
- [MERRA data ingestion-Python](https://github.com/airavata-courses/CoDist/tree/dev-merra-data-ingestion)


