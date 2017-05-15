// 效果: hello world -> world hello
//思路：先对整个字符串反转，再split 对每个单词反转

package main

import (
	"fmt"
	"strings"
)

func main() {
	var s = "hello world this is awesome"
	result := reverse(s)
	resultSlice := strings.Split(result, " ")
	var finalString []string
	for _, v := range resultSlice {
		aloneOne := reverse(v)
		finalString = append(finalString, aloneOne)

	}
	fmt.Print(strings.Join(finalString, " "))
}

func reverse(str string) string {
	var tmp = []rune(str)
	for i, j := 0, len(tmp)-1; i < j; i, j = i+1, j-1 {
		tmp[i], tmp[j] = tmp[j], tmp[i]
	}
	return string(tmp)
}
