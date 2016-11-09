## 随机数 `math/rand`

```
package main

import (
    "fmt"
    "math/rand"
)

func main() {
    for i := 0; i < 5; i++ {
        a := rand.Int()
        fmt.Printf("%d / ", a)
    }

    fmt.Println()

    for i := 0; i < 5; i++ {
        a := rand.Intn(100)
        fmt.Printf("%d /", a)
    }

    fmt.Println()

    for i := 0; i < 5; i++ {
        a := rand.Float32()
        fmt.Printf("%2.2f / ", a)
    }
}
```