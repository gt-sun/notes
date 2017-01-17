
参考：
http://blog.csdn.net/u014029783/article/details/53762363

用法：

```
$ go run 01.go -f 1.txt
b9d228f114d3f42e82c6a0315dd21a3a 1.txt

$ go run 01.go -d tmp
503ff3936aeaf06adffe610788c7c091 tmp\wswFileServer5\files\01.md
3cda02c0f373006cebb29438bf0b01c6 tmp\wswFileServer5\main.go
86d5206af37b6bcea4d24b54336eee6b tmp\wswFileServer5\static\js\jquery-2.1.3.min.js
1ae0e64754a542cbea996dec63c326fd tmp\wswFileServer5\static\js\bootstrap.min.js
13986017db1f0f1010ed8ff4c81a0c3a tmp\wswFileServer5\README.md
c93ebb8bb2ae3bc85ac9de96ef6bb827 tmp\wswFileServer5\files\01.go
b9d228f114d3f42e82c6a0315dd21a3a tmp\wswFileServer5\files\1.txt
2b04df3ecc1d94afddff082d139c6f15 tmp\wswFileServer5\files\Koala.jpg
c43eeae863aad788074967b8cabd2dd7 tmp\wswFileServer5\index.html
bb884d3b6b6b09481c5dc25fb4fac7e5 tmp\wswFileServer5\static\css\bootstrap.min.css

$ go run 01.go -d tmp -merge
50f235f6435a3cc6700ca68844ced4c2 tmp

```

代码：

```go
package main

import (
    "crypto/md5"
    "flag"
    "fmt"
    "io/ioutil"
    "os"
    "path/filepath"
)

//初始化变量
var directory, file *string
var merge *bool

//定义init函数，主要是flag的3个参数
func init() {
    directory = flag.String("d", "", "The directory contains all the files that need to calculate the md5 value")
    file = flag.String("f", "", "The file that need to caclulate the md5 value")
    merge = flag.Bool("merge", false, "Merging all md5 values to one (Folder type only)")
}

func main() {
    flag.Parse()

    //返回Usage
    if *directory == "" && *file == "" {
        flag.Usage()
        return
    }

    if *file != "" {
        result, err := Md5SumFile(*file)
        if err != nil {
            panic(err)
        }
        fmt.Printf("%x %s\n", result, *file) //这里是*file
    }

    if *directory != "" {
        result, err := Md5SumFolder(*directory)
        if err != nil {
            panic(err)
        }

        // 开启merge，则只计算总的MD5
        if *merge == true {
            var s string
            for _, v := range result {
                s += fmt.Sprintf("%x", v)
            }
            fmt.Printf("%x %s\n", md5.Sum([]byte(s)), *directory)
        } else {
            for k, v := range result {
                fmt.Printf("%x %s\n", v, k)
            }
        }
    }
}

func Md5SumFile(file string) (value [md5.Size]byte, err error) {
    data, err := ioutil.ReadFile(file)
    if err != nil {
        return
    }
    value = md5.Sum(data)
    return value, nil
}

func Md5SumFolder(folder string) (map[string][md5.Size]byte, error) {
    results := make(map[string][md5.Size]byte)
    filepath.Walk(folder, func(path string, info os.FileInfo, err error) error {
        if err != nil {
            return err
        }

        //判断文件属性
        if info.Mode().IsRegular() {
            result, err := Md5SumFile(path)
            if err != nil {
                return err
            }
            results[path] = result
        }
        return nil
    })
    return results, nil
}

```