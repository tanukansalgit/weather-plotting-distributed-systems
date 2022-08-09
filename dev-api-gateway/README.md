
## Api-Gateway
This will redirect routing requests from frontend to the respective microservices. After the microservices execute their functions, the gateway will again pass the JSON data back to the frontend through which UI changes will occur. It will basically serve as an intermediary between the frontend and the microservices executing in the backend.

## Tech Stack
The microservice uses:
 - [Java](https://www.java.com/en/)
 - [Spring Boot](https://spring.io/projects/spring-boot)

## Installation
 - Ensure latest version of Java is installed
 - Download latest version of Spring Boot
 - Install an IDE called IntelliJ IDEA
 - Clone the project files
 - Go to the pom.xml file in the root directory through the IntelliJ IDE.
 - Click on Maven which is to the extreme right and then click on build (the button is similar to a refresh button). This will load all the dependencies in your system.
 - Once the dependencies get installed, click on the green play button at the top. This will run the API Gateway microservice.
 - If you face issues, just ensure that the environment variables have been set correctly.

## Installation
URLs getting hit from the frontend:
 - `POST /login`
 - `POST /signUp`
 - `POST /plotting`
 - `POST /logging`

Connecting to different microservices:
 - `POST /registry/api/v1/security/authorize` - Registry microservice for logging in 
 - `POST /registry/api/v1/user/signUp` - Registry microservice for signing up
 - `POST /registry/api/v1/security/authorize` - Registry microservice for authorization
 - `POST /history-service/api/v1/logs` - History microservice to post logs in the database
 - `POST /history-service/api/v1/user-history/ + {UserId}` - History microservice to get logs from the database
 - `POST /getPlottedData` - Plotting microservice to make the plot




## LINKS AND REFERENCES
 1. https://spring.io/guides/gs/spring-boot/
 2. https://spring.io/guides/tutorials/rest/
 3. https://www.baeldung.com/rest-with-spring-series
