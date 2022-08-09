FROM golang:1.17.6-buster
RUN go get  github.com/gin-gonic/gin
RUN go get github.com/lib/pq
COPY . /app/
WORKDIR /app
# WORKDIR $APP_HOME
EXPOSE 8085
CMD  go run .