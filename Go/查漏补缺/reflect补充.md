
详细内容可参考《Go 学习笔记》

## 字段标签

可实现简单元数据编程，比如标记 ORM Model 属性

```go
package main

import (
    "fmt"
    "reflect"
)

type User struct {
    Name string `field:"username" type:"int"`
}

func main() {
    var u User

    t := reflect.TypeOf(u)
    f, _ := t.FieldByName("Name")

    fmt.Println(f.Tag)
    fmt.Println(f.Tag.Get("field"))
}

/*
field:"username" type:"int"
username
*/
```