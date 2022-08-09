package database

import (
	"log"
	"project/ioFormatting"
	"strings"
)

func CreateTableIfNotExistsQuery() {

	db := StartConnection()

	log.Println("TABLE")
	sqlStatement := `
		CREATE TABLE IF NOT EXISTS logs_table_url(
			id SERIAL PRIMARY KEY,
			log_identifier VARCHAR,
			log_type VARCHAR,
			log_details VARCHAR,
			user_id VARCHAR,
			url VARCHAR,
			inserted_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`
	_, err := db.Exec(sqlStatement)

	if err != nil {
		log.Println("CreateTableIfNotExistsQuery ERROR")
		panic(err)
	}
	log.Println("SUCCESSFULLY CREATED TABLE	OR ALREADY PRESENT.")

	CloseDB(db)
}

func getLogIdentifier() string {

	log.Println("getLogIdentifier") // new Line
	db := StartConnection()

	// estimatedLogIdentifier := GetNumber() // new Line

	identifierNotFound := true
	estimatedLogIdentifier := ""
	for identifierNotFound {
		estimatedLogIdentifier = GetNumber()
		sqlStatement := `
			SELECT *
			FROM logs_table_url
			WHERE log_identifier = $1`

		rows, err := db.Query(sqlStatement, estimatedLogIdentifier)
		if err != nil {
			log.Println("getLogIdentifier Error", err)
			panic(err)
		}
		defer rows.Close()

		howManyRows := 0
		for rows.Next() {
			howManyRows = howManyRows + 1
		}
		log.Println("ROWS GOT", howManyRows)

		if howManyRows == 0 {
			identifierNotFound = false
			log.Println(identifierNotFound, estimatedLogIdentifier)
		}
	}
	log.Println("Choosen Log Identifier", estimatedLogIdentifier)

	CloseDB(db)

	return estimatedLogIdentifier
}

func InsertIntoQuery(newLog ioFormatting.InputLog) string {

	var message string

	// CreateTableIfNotExistsQuery()

	isEmpty := newLog.LogIdentifier == ""
	if isEmpty {
		log.Println("REQUEST TYPE")
		newLog.LogIdentifier = getLogIdentifier()
	}

	db := StartConnection()

	log.Println("newLog Identifier After Calling log identifier", newLog.LogIdentifier)

	sqlStatement := `
		INSERT INTO logs_table_url (user_id, log_identifier, log_type, log_details, url)
		VALUES ($1, $2, $3, $4, $5)
		`

	_, err := db.Exec(sqlStatement, newLog.UserId, newLog.LogIdentifier, newLog.LogType, newLog.LogDetails, newLog.Url)
	if err != nil {
		message = "ERROR WHILE INSERT INTO QUERY EXECUTION"
		log.Println(err)
	}
	log.Println("LOG INSERTED: ", newLog.LogIdentifier)
	if strings.HasPrefix(message, "ERROR") {
		return message
	}

	CloseDB(db)
	return newLog.LogIdentifier
}

// Array of Objects.
func GetUserHistory(requestedUserId string) ([]ioFormatting.ReturnLog, string) {
	var message string = "LOGS OF THE SPECIFIED USER"
	var returnlogs []ioFormatting.ReturnLog

	db := StartConnection()

	// CreateTableIfNotExistsQuery()

	log.Println("logger in GetUserHistory")

	sqlStatement := `
		SELECT user_id, log_identifier, log_type, log_details, inserted_on, url
		FROM logs_table_url
		WHERE user_id = $1 OR user_id= $2
		ORDER BY inserted_on DESC;`

	c := '"'
	rows, err := db.Query(sqlStatement, requestedUserId, string(c)+requestedUserId+string(c))
	if err != nil {
		log.Println("GetUserHistory ", err)
		message = "ERROR WHILE GetUserHistory"
		return returnlogs, message
	}
	defer rows.Close()

	for rows.Next() {

		var returnLog ioFormatting.ReturnLog

		err = rows.Scan(&returnLog.UserId, &returnLog.LogIdentifier, &returnLog.LogType, &returnLog.LogDetails, &returnLog.InsertedOn, &returnLog.Url)
		if err != nil {
			message = "ERROR WHILE GetUserHistory WHILE SCANNING THE ROW"
			log.Println(message, err)
			return returnlogs, message
		}

		returnlogs = append(returnlogs, returnLog)
		// get any error encountered during iteration
		err = rows.Err()
		if err != nil {
			message = "ERROR WHILE GetUserHistory WHILE ITERATIONS"
			log.Println(message, err)
			return returnlogs, message
		}
	}
	CloseDB(db)
	return returnlogs, message
}
func StarterCode() {

	db := StartConnection()
	if db == nil {
		log.Panic("DB NOT INITIAZED PROPERLY")
	}
	CreateTableIfNotExistsQuery()

	log.Println("DB INITIATED PROPERLY")
	CloseDB(db)
}
