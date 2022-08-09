package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"project/database"
	"project/ioFormatting"
	"project/validations"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func postLogs(c *gin.Context) {
	var newLog ioFormatting.InputLog
	var responseLog ioFormatting.LogIdentifierResponseFormat
	var responseIdentifier ioFormatting.LogIdentifierResponse
	code := http.StatusOK

	if err := c.BindJSON(&newLog); err != nil {
		log.Println("Error in Post Request, Error is:", err)
		c.IndentedJSON(http.StatusBadRequest, newLog)
		return
	}
	if !validations.IsInutLogValid(newLog) {
		code = http.StatusNotAcceptable
		responseLog.Status = "NOT OK"
		responseLog.IsError = "False"
		responseIdentifier.LogIdentifier = ""
		responseLog.Message = "Invalid Parameters Passed into JSON Object."
	} else {

		returnIdentity := database.InsertIntoQuery(newLog)

		if strings.HasPrefix(returnIdentity, "ERROR") {
			code = http.StatusInternalServerError
			responseLog.Status = "NOT OK"
			responseLog.IsError = "True"
			responseIdentifier.LogIdentifier = ""
			responseLog.Message = returnIdentity
		} else {
			code = http.StatusAccepted
			responseLog.Status = "OK"
			responseLog.IsError = "False"
			responseIdentifier.LogIdentifier = returnIdentity
			responseLog.Message = "Inserted Properly!"

		}
	}
	responseLog.Response = responseIdentifier
	// c.BindJSON(&responseLog)
	c.IndentedJSON(code, responseLog)
	return
}

func getLogsById(c *gin.Context) {
	code := http.StatusOK
	var responseLog ioFormatting.UserHistoryResponseFormat

	requestedUserId := c.Param("userId")

	fmt.Printf("%v %T", requestedUserId, requestedUserId)
	returnlogs, message := database.GetUserHistory(requestedUserId)
	if strings.HasPrefix(message, "ERROR") {
		code = http.StatusInternalServerError
		responseLog.Status = "NOT OK"
		responseLog.IsError = "True"
		responseLog.Response = returnlogs
		responseLog.Message = message
	} else {
		code = http.StatusOK
		responseLog.Status = "OK"
		responseLog.IsError = "False"
		responseLog.Response = returnlogs
		responseLog.Message = message
	}

	c.IndentedJSON(code, responseLog)
}

func ping(c *gin.Context) {
	code := http.StatusOK
	c.IndentedJSON(code, "Pong")
}
func main() {
	router := gin.Default()

	// router.GET("history-session/api/v1/user-history/", getLogs)
	router.GET("history-service/api/v1/user-history/:userId", getLogsById)

	router.POST("history-service/api/v1/logs", postLogs)
	// router.POST("history-session/api/v1/logs/:logId)

	router.GET("history-service/api/v1/ping", ping)

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Some error occured while loading ENV file. Err: %s", err)
	}

	database.StarterCode()

	HOST := os.Getenv("API_HOST")

	PORT := os.Getenv("API_PORT")

	hostport := HOST + ":" + PORT
	router.Run(hostport)
}
