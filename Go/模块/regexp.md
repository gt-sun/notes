

## Compile

用复杂的正则首先是 Compile，它会解析正则表达式是否合法，如果正确，那么就会返回一个 Regexp，然后就可以利用返回的 Regexp 在任意的字符串上面执行需要的操作。

解析正则表达式的有如下几个方法：

```
func Compile(expr string) (*Regexp, error)
func CompilePOSIX(expr string) (*Regexp, error)
func MustCompile(str string) *Regexp
func MustCompilePOSIX(str string) *Regexp
CompilePOSIX 和 Compile 的不同点在于 POSIX 必须使用 POSIX 
```

语法，它使用最左最长方式搜索，而 Compile 是采用的则只采用最左方式搜索 (例如 [a-z]{2,4} 这样一个正则表达式，应用于 "aa09aaa88aaaa" 这个文本串时，CompilePOSIX 返回了 aaaa，而 Compile 的返回的是 aa)。前缀有 Must 的函数表示，在解析正则语法的时候，如果匹配模式串不满足正确的语法则直接 panic，而不加 Must 的则只是返回错误。


## MatchString

- 判断IP地址：

```go
func IsIP(ip string) (b bool) {
    if m, _ := regexp.MatchString("^[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}$", ip); !m {
        return false
    }
    return true
}
```


## FindString

查找一次

```go
func main() {
    re := regexp.MustCompile("fo.?")
    fmt.Printf("%q\n", re.FindString("seafood"))
    fmt.Printf("%q\n", re.FindString("meat"))
    fmt.Printf("%q\n", re.FindString("aafo bbfoo"))
}
//
"foo"
""
"fo "
```

## FindAllString

`func (re *Regexp) FindAllString(s string, n int) []string`

查找所有匹配的字符串

```go
func main() {
    re := regexp.MustCompile("a.")
    fmt.Println(re.FindAllString("paranormal", -1))
    fmt.Println(re.FindAllString("paranormal", 2))
    fmt.Println(re.FindAllString("graal", -1))
    fmt.Println(re.FindAllString("none", -1))
}

//
[ar an al]
[ar an]
[aa]
[]
```

## ReplaceAllLiteralString

```go
re := regexp.MustCompile("a(x*)b")
fmt.Println(re.ReplaceAllLiteralString("-ab-axxb-", "T"))
fmt.Println(re.ReplaceAllLiteralString("-ab-axxb-", "$1"))
fmt.Println(re.ReplaceAllLiteralString("-ab-axxb-", "${1}"))

//
-T-T-
-$1-$1-
-${1}-${1}-
```

## ReplaceAllString

```go
func main() {
    re := regexp.MustCompile("a(x*)b")
    fmt.Println(re.ReplaceAllString("-ab-axxb-", "T"))
    fmt.Println(re.ReplaceAllString("-ab-axxb-", "$1"))
    fmt.Println(re.ReplaceAllString("-ab-axxb-", "$1W"))
    fmt.Println(re.ReplaceAllString("-ab-axxb-", "${1}W"))
}

//
-T-T-
--xx-
---
-W-xxW-
```

## Split

```go
    a := regexp.MustCompile("a")
    fmt.Println(a.Split("banana", -1))
    fmt.Println(a.Split("banana", 0))
    fmt.Println(a.Split("banana", 1))
    fmt.Println(a.Split("banana", 2))
    zp := regexp.MustCompile("z+")
    fmt.Println(zp.Split("pizza", -1))
    fmt.Println(zp.Split("pizza", 0))
    fmt.Println(zp.Split("pizza", 1))
    fmt.Println(zp.Split("pizza", 2))

//
[b n n ]
[]
[banana]
[b nana]
[pi a]
[]
[pizza]
[pi a]
```