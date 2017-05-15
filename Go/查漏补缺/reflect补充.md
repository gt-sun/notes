
详细内容可参考《Go 学习笔记》



## 值是否可修改

关键词：`CanSet()`,`Interface()`,`Elem()`

```go
func main() {
    var s = "Tim"
    v := reflect.ValueOf(s)
    fmt.Println("v:", v)
    fmt.Println("v can settable?", v.CanSet())

    x := reflect.ValueOf(&s)
    fmt.Println("x can settable?", x.CanSet())

    y := reflect.ValueOf(&s)
    w := y.Elem()
    fmt.Println("w can settable?", w.CanSet())
    w.SetString("Sun")
    fmt.Println(w.Interface())
    fmt.Println(s)
}

// v: Tim
// v can settable? false
// x can settable? false
// w can settable? true
// Sun
// Sun
```

## Type() 和 Kind() 的区别

```go
// Type() 和 Kind() 的区别
func main() {
    var s = "Tim"
    v := reflect.ValueOf(s)
    fmt.Println("v.Type", v.Type())
    fmt.Println("v.kind", v.Kind())

    type myString string
    var x myString
    v = reflect.ValueOf(x)
    fmt.Println("v.Type", v.Type())
    fmt.Println("v.kind", v.Kind())
}

// v.Type string
// v.kind string
// v.Type main.myString
// v.kind string

```

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


## reflect 在 结构体中的使用

```go
type T struct {
    A int
    B string
}

func main() {
    var t = T{23, "Tim"}

    s := reflect.ValueOf(&t).Elem()
    typeOfT := s.Type()
    for i := 0; i < s.NumField(); i++ {
        f := s.Field(i)
        fmt.Printf("%d: %s %s = %v\n", i, typeOfT.Field(i).Name, f.Type(), f.Interface())
    }

    s.Field(0).SetInt(33)
    s.Field(1).SetString("Sun")
    fmt.Println("t is now:", t)

}


//0: A int = 23
//1: B string = Tim
//t is now: {33 Sun}
```

>注意：There's one more point about settability introduced in passing here: the field names of T are upper case (exported) because only exported fields of a struct are settable.