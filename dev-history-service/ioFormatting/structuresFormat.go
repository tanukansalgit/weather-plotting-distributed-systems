package ioFormatting

type InputLog struct {
	UserId        string `json:"userId"`
	LogIdentifier string `json:"logIdentifier"`
	LogType       string `json:"logType"`
	LogDetails    string `json:"logDetails"`
	Url           string `json:"url"`
	// CreatedOn     string `json:"createdOn"`
	// Message       string `json:"message"`
	// Service       string `json:"service"`
}

// {
//     "userId": "1",
//     "logType": "REQUEST",
//     "logDetails": "{\"year\":\"2015\", \"month\":\"05\", \"date\":\"13\", \"hour\":\"23\", \"minute\":\"59\", \"seconds\":\"35\"}",
// }

type ReturnLog struct {
	UserId        string `json:"userId"`
	LogIdentifier string `json:"logIdentifier"`
	LogType       string `json:"logType"`
	LogDetails    string `json:"logDetails"`
	InsertedOn    string `json:"insertedOn"`
	Url           string `json:"url"`
	// CreatedOn     string `json:"createdOn"`
	// Message       string `json:"message"`
	// Service       string `json:"service"`
}

type UserHistoryResponseFormat struct {
	Status   string      `json:"status"`
	IsError  string      `json:"isError"`
	Response []ReturnLog `json:"response"`
	Message  string      `json:"message"`
}

type LogIdentifierResponse struct {
	LogIdentifier string `json:"logIdentifier"`
}

type LogIdentifierResponseFormat struct {
	Status   string                `json:"status"`
	IsError  string                `json:"isError"`
	Response LogIdentifierResponse `json:"response"`
	Message  string                `json:"message"`
}
