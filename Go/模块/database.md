
[TOC]

## 参考链接

- 使用 go 测试 MySQL 并发
http://studygolang.com/topics/1975


## sql 子包

该包提供了一些类型（概括性的），每个类型可能包括一个或多个概念。

- DB
sql.DB 类型代表了一个数据库。这点和很多其他语言不同，它并不代表一个到数据库的具体连接，而是一个能操作的数据库对象，具体的连接在内部通过连接池来管理，对外不暴露。这点是很多人容易误解的：每一次数据库操作，都产生一个 sql.DB 实例，操作完 
Close。

- Results
定义了三种结果类型：sql.Rows、sql.Row 和 sql.Result，分别用于获取多个多行结果、一行结果和修改数据库影响的行数（或其返回 last insert id）。

- Statements
sql.Stmt 代表一个语句，如：DDL、DML 等。
Transactions
sql.Tx 代表带有特定属性的一个事务。


### sql.DB 的使用

由于 DB 并非一个实际的到数据库的连接，而且可以被多个 goroutine 并发使用，因此，程序中只需要拥有一个全局的实例即可。所以，经常见到的示例代码：

```
db, err := sql.Open("mysql", "root:@tcp(localhost:3306)/test?charset=utf8")
if err != nil {
    panic(err)
}
defer db.Close()
```

实际中，`defer db.Close()`可以不调用，官方文档关于 DB.Close 的说明也提到了：Close 用于关闭数据库，释放任何打开的资源。一般不会关闭 DB，因为 DB 句柄通常被多个 goroutine 共享，并长期活跃。当然，如果你确定 DB 只会被使用一次，之后不会使用了，应该调用 Close。

所以，实际的 Go 程序，应该在一个 go 文件中的 init 函数中调用 sql.Open 初始化全局的 sql.DB 对象，供程序中所有需要进行数据库操作的地方使用。

前面说过，sql.DB 并不是实际的数据库连接，因此，sql.Open 函数并没有进行数据库连接，只有在驱动未注册时才会返回 `err != nil`。

例如：`db, err := sql.Open("mysql", "root:@tcp23(localhost233:3306)/test?charset=utf8")`。虽然这里的 dsn 是错误的，但依然 `err == nil`，只有在实际操作数据库（查询、更新等）或调用 Ping 时才会报错。

相关方法的处理说明（假设 sql.DB 的对象是 db）：

`db.Ping()` 会将连接立马返回给连接池。
`db.Exec()` 会将连接立马返回给连接池，但是它返回的 Result 对象会引用该连接，所以，之后可能会再次被使用。
`db.Query()` 会传递连接给 sql.Rows 对象，直到完全遍历了所有的行或 Rows 的 Close 方法被调用了，连接才会返回给连接池。
`db.QueryRow()` 会传递连接给 sql.Row 对象，当该对象的 Scan 方法被调用时，连接会返回给连接池。
`db.Begin()` 会传递连接给 sql.Tx 对象，当该对象的 Commit 或 Rollback 方法被调用时，该链接会返回给连接池。
`db.Prepare` 返回一个 Stmt。Stmt 对象可以执行 Exec,Query,QueryRow 等操作。

从上面的解释可以知道，大部分时候，我们不需要关心连接不释放问题，它们会自动返回给连接池，只有 Query 方法有点特殊，后面讲解如何处理。

注意：如果某个连接有问题（broken connection)，database/sql 内部会进行最多 10 次的重试，从连接池中获取或新开一个连接来服务，因此，你的代码中不需要重试的逻辑。

示例：

需先执行 `go get github.com/go-sql-driver/mysql`

```go
import (
    "database/sql"
    "time"

    _ "github.com/go-sql-driver/mysql"
)

func main() {
    db, _ := sql.Open("mysql", "root:123.com@tcp(192.168.8.211:3306)/mysql?charset=utf8")
    db.Ping()
    time.Sleep(5 * time.Second) //程序结束后，与mysql的连接会自动断开
}
```

*控制连接池*

`db.SetMaxOpenConns(n int)` 设置连接池中最多保存打开多少个数据库连接。注意，它包括在使用的和空闲的。如果某个方法调用需要一个连接，但连接池中没有空闲的可用，且打开的连接数达到了该方法设置的最大值，该方法调用将堵塞。默认限制是 0，表示最大打开数没有限制。

`db.SetMaxIdleConns(n int)` 设置连接池中能够保持的最大空闲连接的数量。默认值是 2
上面的两个设置，可以用程序实际测试。比如通过下面的代码，可以验证 `MaxIdleConns` 是 2：

```go
db, _ := sql.Open("mysql", "root:@tcp(localhost:3306)/test?charset=utf8")

// 去掉注释，可以看看相应的空闲连接是不是变化了
// db.SetMaxIdleConns(3)

for i := 0; i < 10; i++ {
    go func() {
        db.Ping()
    }()
}

time.Sleep(20 * time.Second)
```

通过 show processlist 命令，可以看到有两个是 Sleep 的连接。

*实战*

- Exec

功能：执行不返回行（row）的查询，比如 INSERT，UPDATE，DELETE

```go
package main

import (
    "database/sql"

    _ "github.com/go-sql-driver/mysql"
)

func main() {
    db, _ := sql.Open("mysql", "root:123.com@tcp(192.168.8.211:3306)/test?charset=utf8")

    db.Exec("INSERT INTO user(name,age,email) VALUES(?,?,?)", "Leo", 20, "Leo@q.com")

}
```

- Query

```go
rows, err := db.Query("SELECT name from user")
    if err != nil {
        panic(err)
    }
    for rows.Next() {
        var name string
        if err := rows.Scan(&name); err != nil {
            log.Fatal(err)
        }
        fmt.Println(name)
    }

    //遍历后 检查err
    err = rows.Err()
    if err != nil {
        log.Fatal(err)
}
```

*高效率批量执行SQL*

```go
    //Begin函数内部会去获取连接
    tx,_ := db.Begin()
    for i := 1301;i<=1400;i++{
        //每次循环用的都是tx内部的连接，没有新建连接，效率高
        tx.Exec("INSERT INTO user(uid,username,age) values(?,?,?)",i,"user"+strconv.Itoa(i),i-1000)
    }
    //最后释放tx内部的连接
    tx.Commit()
```

- 操作列名和数据

```go
package main

import (
    "database/sql"
    "fmt"

    _ "github.com/go-sql-driver/mysql"
)

func main() {
    db, err := sql.Open("mysql", "root:123.com@tcp(192.168.8.211:3306)/test?charset=utf8")
    if err != nil {
        panic(err.Error())
    }

    // defer db.Close()

    rows, _ := db.Query("SELECT * from squareNum")
    columns, err := rows.Columns()
    if err != nil {
        panic(err.Error())
    }

    //values：一行的所有值，长度==列数
    values := make([]sql.RawBytes, len(columns))

    scanArgs := make([]interface{}, len(values))
    for i := range values {
        scanArgs[i] = &values[i]
    }

    for rows.Next() {
        err = rows.Scan(scanArgs...) //把每行的内容添加到scanArgs，也添加到了values
        if err != nil {
            panic(err.Error())
        }

        var value string
        for i, col := range values {
            if col == nil {
                value = "NULL"
            } else {
                value = string(col)
            }
            fmt.Println(columns[i], ": ", value)
        }
        fmt.Println("-----------------------------------")
    }
    if err = rows.Err(); err != nil {
        panic(err.Error())
    }
}

```

## 官方实例

In this example we prepare two statements - one for inserting tuples (rows) and one to query.

```go
package main

import (
    "database/sql"
    "fmt"
    _ "github.com/go-sql-driver/mysql"
)

func main() {
    db, err := sql.Open("mysql", "user:password@/database")
    if err != nil {
        panic(err.Error())  // Just for example purpose. You should use proper error handling instead of panic
    }
    defer db.Close()

    // Prepare statement for inserting data
    stmtIns, err := db.Prepare("INSERT INTO squareNum VALUES( ?, ? )") // ? = placeholder
    if err != nil {
        panic(err.Error()) // proper error handling instead of panic in your app
    }
    defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

    // Prepare statement for reading data
    stmtOut, err := db.Prepare("SELECT squareNumber FROM squarenum WHERE number = ?")
    if err != nil {
        panic(err.Error()) // proper error handling instead of panic in your app
    }
    defer stmtOut.Close()

    // Insert square numbers for 0-24 in the database
    for i := 0; i < 25; i++ {
        _, err = stmtIns.Exec(i, (i * i)) // Insert tuples (i, i^2)
        if err != nil {
            panic(err.Error()) // proper error handling instead of panic in your app
        }
    }

    var squareNum int // we "scan" the result in here

    // Query the square-number of 13
    err = stmtOut.QueryRow(13).Scan(&squareNum) // WHERE number = 13
    if err != nil {
        panic(err.Error()) // proper error handling instead of panic in your app
    }
    fmt.Printf("The square number of 13 is: %d", squareNum)

    // Query another number.. 1 maybe?
    err = stmtOut.QueryRow(1).Scan(&squareNum) // WHERE number = 1
    if err != nil {
        panic(err.Error()) // proper error handling instead of panic in your app
    }
    fmt.Printf("The square number of 1 is: %d", squareNum)
}
```