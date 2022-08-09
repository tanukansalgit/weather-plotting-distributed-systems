package validations

import (
	"log"
	"project/ioFormatting"
)

func IsInutLogValid(newLog ioFormatting.InputLog) bool {
	if newLog.UserId == "" {
		log.Println("No User ID Provided", newLog)
		return false
	}

	// REQEUST, RESPONSE, ERROR
	if newLog.LogType == "" {
		log.Println("No User ID Provided", newLog)
		return false
	}

	return true
}
