[TOC]


## Print

`Fprint/Fprintf/Fprintln` 归为一类；第一个参数接收一个 `io.Writer` 类型，会将内容输出到 `io.Writer` 中去。

`Sprint/Sprintf/Sprintln` 归为一类；格式化内容为 `string` 类型，而并不输出到某处，需要格式化字符串并返回时，可以用次组函数。

`Print/Printf/Println` 归为另一类；将内容输出到标准输出中。

其中，`Print/Printf/Println` 会调用相应的 `F` 开头一类函数。


在这三组函数中，
`S/F/Printf`函数通过指定的格式输出或格式化内容；
`S/F/Print`函数只是使用默认的格式输出或格式化内容；
`S/F/Println`函数使用默认的格式输出或格式化内容，同时会在最后加上 "换行符"。

## Scanning

- `Scan`、`Scanf` 和 `Scanln` 从 `os.Stdin` 中读取；
- `Fscan`、`Fscanf` 和 `Fscanln` 从指定的 `io.Reader` 中读取； 
- `Sscan`、`Sscanf` 和 `Sscanln` 从实参字符串中读取。

`Scanln`,`Fscanln` 和 `Sscanln` 在换行符处停止扫描，且需要条目紧随换行符之后；
`Scanf`,`Fscanf` 和 `Sscanf` 需要输入换行符来匹配格式中的换行符；其它函数则将换行符视为空格。

