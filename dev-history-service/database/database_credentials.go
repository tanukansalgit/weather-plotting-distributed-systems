package database

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func GetdbCred() (string, string, string, string, string) {

	err := godotenv.Load(".env")
	if err != nil {
		log.Println("Error while loading ENV")
	}
	POSTGRES_HOST := os.Getenv("POSTGRES_HOST")
	POSTGRES_PORT := os.Getenv("POSTGRES_PORT")

	POSTGRES_USER := os.Getenv("POSTGRES_USER")
	POSTGRES_PASSWORD := os.Getenv("POSTGRES_PASSWORD")
	POSTGRES_DBNAME := os.Getenv("POSTGRES_DBNAME")

	return POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DBNAME
}

// const (
// 	host     = POSTGRES_HOST
// 	port     = POSTGRES_PORT
// 	user     = POSTGRES_USER
// 	password = POSTGRES_PASSWORD
// 	dbname   = POSTGRES_DBNAME
// )
