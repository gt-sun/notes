package main

// 从Mysql中导出数据到CSV文件。
//Author: sunlorr@gmail.com
//Date: 2016-12-7

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

var (
	tables = []string{"squareNum", "user"}
	count  = len(tables)
	ch     = make(chan bool, count)
)

func main() {
	db, err := sql.Open("mysql", "root:123.com@tcp(192.168.8.211:3306)/test?charset=utf8")
	// defer db.Close()
	if err != nil {
		panic(err.Error())
	}

	for _, table := range tables {
		go querySQL(db, table, ch)
	}

	for i := 0; i < count; i++ {
		<-ch
	}
	fmt.Println("Done!")
}

func querySQL(db *sql.DB, table string, ch chan bool) {
	fmt.Println("开始处理：", table)
	rows, _ := db.Query(fmt.Sprintf("SELECT * from %s", table))

	columns, err := rows.Columns()
	if err != nil {
		panic(err.Error())
	}

	//values：一行的所有值，长度==列数
	values := make([]sql.RawBytes, len(columns))
	// print(len(values))

	scanArgs := make([]interface{}, len(values))
	for i := range values {
		scanArgs[i] = &values[i]
	}

	totalValues := [][]string{}
	for rows.Next() {
		var s []string
		err = rows.Scan(scanArgs...) //把每行的内容添加到scanArgs，也添加到了values
		if err != nil {
			panic(err.Error())
		}

		for _, v := range values {
			s = append(s, string(v))
			// print(len(s))
		}
		totalValues = append(totalValues, s)
	}

	if err = rows.Err(); err != nil {
		panic(err.Error())
	}
	writeToCSV(table+".csv", columns, totalValues)
	ch <- true
}

func writeToCSV(file string, columns []string, totalValues [][]string) {
	// fmt.Println(columns)
	f, err := os.Create(file)
	if err != nil {
		panic(err)
	}
	f.WriteString("\xEF\xBB\xBF")
	defer f.Close()
	w := csv.NewWriter(f)
	for a, i := range totalValues {
		if a == 0 {
			w.Write(columns)
			w.Write(i)
		} else {
			// fmt.Println(i)
			w.Write(i)
		}
	}
	w.Flush()
	fmt.Println("处理完毕：", file)
}
