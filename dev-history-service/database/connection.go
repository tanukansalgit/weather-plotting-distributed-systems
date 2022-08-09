package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

// Returns a String for connection
func getConnectionString() string {
	fmt.Println("getConnectionString")
	host, port, user, password, dbname := GetdbCred()
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	return psqlInfo
}

// Returns a DB Object.
func StartConnection() *sql.DB {
	fmt.Println("StartConnection Called")

	log.Println("-------------------Connection Created")
	connectionString := getConnectionString()
	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		panic(err)
	}
	err = db.Ping()
	if err != nil {
		panic(err)
	}
	// defer db.Close()

	fmt.Println("Successfully connected!")

	// Maximum Idle Connections
	// db.SetMaxIdleConns(5)
	// Maximum Open Connections
	// db.SetMaxOpenConns(3000)
	// Idle Connection Timeout
	// db.SetConnMaxIdleTime(1 * time.Second)
	// Connection Lifetime
	// db.SetConnMaxLifetime(30 * time.Second)
	// db.SetConnMaxLifetime(2 * time.Second)
	return db
}

func CloseDB(db *sql.DB) error {

	log.Println("-------------------Connection Closed")
	return db.Close()
}
