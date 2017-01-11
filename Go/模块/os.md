
实际上，os 依赖于 syscall。在实际编程中，我们应该总是优先使用 os 中提供的功能，而不是 syscall。



## exec 子包

**运行系统命令**

- 直接输出

```go
package main

import (
    "bytes"
    "fmt"
    "log"
    "os/exec"
    "strings"
)

func main() {
    cmd := exec.Command("tr", "a-z", "A-Z")
    cmd.Stdin = strings.NewReader("some input")
    var out bytes.Buffer
    cmd.Stdout = &out
    err := cmd.Run()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("in all caps: %q\n", out.String())
}

```

- 使用管道

```go
var buf bytes.Buffer

func main() {
    cmd := exec.Command("echo", "-n", "Hello~~")

    out, err := cmd.StdoutPipe()
    if err != nil {
        panic(err)
    }

    if err := cmd.Start(); err != nil {
        panic(err)
    }

    s := make([]byte, 512)
    n, err := out.Read(s)
    if err != nil {
        panic(err)
    }

    fmt.Println(string(s[:n]))

}
```

**实现Linux的|**

```go
package main

import (
    "bufio"
    "bytes"
    "fmt"
    "io"
    "os/exec"
)

func main() {
    cmd1 := exec.Command("ps", "aux")
    cmd2 := exec.Command("grep", "mysql")

    out1, err := cmd1.StdoutPipe()
    check(err)

    if err := cmd1.Start(); err != nil {
        panic(err)
    }

    outputBuf1 := bufio.NewReader(out1)
    stdin2, err := cmd2.StdinPipe()
    check(err)

    outputBuf1.WriteTo(stdin2)

    var outputBuf2 bytes.Buffer
    cmd2.Stdout = &outputBuf2
    if err := cmd2.Start(); err != nil {
        panic(err)
    }
    err = stdin2.Close()
    check(err)

    err = cmd2.Wait()
    check(err)

    // result := make([]byte, 1024)
    // n, _ := outputBuf2.Read(result)
    // fmt.Println(string(result[:n]))

    var resbuf bytes.Buffer
    for {
        res := make([]byte, 512)
        n, err := outputBuf2.Read(res)
        if err != nil {
            if err == io.EOF {
                break
            } else {
                panic(err)
            }
        }
        if n > 0 {
            resbuf.Write(res[:n])
        }
    }
    fmt.Println(resbuf.String())
}

func check(err error) {
    if err != nil {
        panic(err)
    }
}

```