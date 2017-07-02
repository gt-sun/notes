package main

import "fmt"
import "expvar"
import "net/http"

var visits = expvar.NewInt("visitss")

func main() {
	http.HandleFunc("/", handler)
	http.ListenAndServe(":8000", nil)
}

func handler(w http.ResponseWriter, r *http.Request) {
	visits.Add(1)
	fmt.Fprintf(w, "Hi there, i love %s", r.URL.Path[1:])
}

// 查看http://127.0.0.1:8000/debug/vars
