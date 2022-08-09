package database

// https://stackoverflow.com/questions/39481826/generate-6-digit-verification-code-with-golang
import (
	"crypto/rand"
	"io"
	"log"
)

func GetNumber() string {
	number := EncodeToString(6)
	log.Println("PSUDO RANDOM NUMBER: ", number)
	return number
}

func EncodeToString(max int) string {
	b := make([]byte, max)
	n, err := io.ReadAtLeast(rand.Reader, b, max)
	if n != max {
		panic(err)
	}
	for i := 0; i < len(b); i++ {
		b[i] = table[int(b[i])%len(table)]
	}
	return string(b)
}

var table = [...]byte{'1', '2', '3', '4', '5', '6', '7', '8', '9', '0'}
