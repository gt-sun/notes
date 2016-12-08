### `IO.MultiReader`

```go
func main() {
    r1 := strings.NewReader("first reader ")
    r2 := strings.NewReader("second reader ")
    r3 := strings.NewReader("third reader\n")
    r := io.MultiReader(r1, r2, r3)

    if _, err := io.Copy(os.Stdout, r); err != nil {
        log.Fatal(err)
    }

}
```

### `IO.Copy`

见上。


### `IO/ioutil`

见 `codes.md`。

