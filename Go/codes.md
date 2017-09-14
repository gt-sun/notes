


### string 转换其他

- float

```
        strconv.ParseFloat()
```

- int

```
str := "123"
i, _ := strconv.Atoi(str)
fmt.Println(i)
```

- bool 

```
        strconv.ParseBool()
```


### int 转换其他

- string

```
str1 := strconv.Itoa(i)  
```

- float

```
        float(i)
```

- bool 

```
        bool(i)
```

### float 转换其他

- string

```
        // 通过Itoa方法转换  
        str1 := strconv.Itof(f)  
        // 通过Sprintf方法转换  
        str2 := fmt.Sprintf("%f", f)  
        // 通过FormatInt转换
        str3 = strconv.FormatFloat()
```

- int

```
        int(i)
```

- bool 

```
        bool(i)
```

### bool 转换其他

- string

```
        // 通过Sprintf方法转换  
        str2 := fmt.Sprintf("%d", b)  
        // 通过FormatInt转换
        str3 = strconv.FormatBool()
```

- int

```
        int(i)
```

- float 

```
        float(i)
```

### 单独说下byte

- byte转换string

```
    string(byte)
```

- byte转换int、bool、float

使用encoding/binary包做转换

- int、bool、float转换byte

使用encoding/binary包做转换

### interface转为string

```go
var a interface{} = 12

func main() {
    b := a.(int)
    print(b) //12
}
```

```go
func interface2string(inter interface{}) string {
    tempStr := ""
    switch inter.(type) {
    case string:
        tempStr = inter.(string)
        break
    case float64:
        tempStr = strconv.FormatFloat(inter.(float64), 'f', -1, 64)
        break
    case int64:
        tempStr = strconv.FormatInt(inter.(int64), 10)
        break
    case int:
        tempStr = strconv.Itoa(inter.(int))
        break
    }
    return tempStr
}
```