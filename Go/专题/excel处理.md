
[TOC]




## encoding/csv

```go
import (
    "encoding/csv"
    "os"
)

func main() {
    f, err := os.Create("haha2.xls")
    if err != nil {
        panic(err)
    }
    defer f.Close()

    f.WriteString("\xEF\xBB\xBF") // 写入UTF-8 BOM

    w := csv.NewWriter(f)
    w.Write([]string{"编号", "姓名", "年龄"})
    w.Write([]string{"1", "张三", "23"})
    w.Write([]string{"2", "李四", "24"})
    w.Write([]string{"3", "王五", "25"})
    w.Write([]string{"4", "赵六", "26"})
    w.Flush()
}
```


## 第三方包

写入：

```go
package main

import (
    "fmt"

    "github.com/tealeg/xlsx"
)

func main() {
    var file *xlsx.File
    var sheet *xlsx.Sheet
    var row *xlsx.Row
    var cell *xlsx.Cell
    var err error

    file = xlsx.NewFile()
    sheet, err = file.AddSheet("Sheet1")
    if err != nil {
        fmt.Printf(err.Error())
    }
    row = sheet.AddRow()
    cell = row.AddCell()
    cell.Value = "I am a cell!"
    cell = row.AddCell()
    cell.Value = "I am a cell2!"

    row = sheet.AddRow()
    cell = row.AddCell()
    cell.Value = "I am a cell!"
    cell = row.AddCell()
    cell.Value = "I am a cell2!"

    err = file.Save("MyXLSXFile.xlsx")
    if err != nil {
        fmt.Printf(err.Error())
    }
}
```

读取：

```go
package main

import (
    "fmt"
    "github.com/tealeg/xlsx"
)

func main() {
    excelFileName := "/home/tealeg/foo.xlsx"
    xlFile, err := xlsx.OpenFile(excelFileName)
    if err != nil {
        ...
    }
    for _, sheet := range xlFile.Sheets {
        for _, row := range sheet.Rows {
            for _, cell := range row.Cells {
                text, _ := cell.String()
                fmt.Printf("%s\n", text)
            }
        }
    }
}
```