//list 是一个双向链表。该结构具有链表的所有功能。

package main

import (
	"container/list"
	"fmt"
)

func main() {
	l := list.New()
	for i := 0; i < 5; i++ {
		l.PushBack(i) //l --> 01234
	}

	fmt.Println("直接打印l：", l)

	for e := l.Front(); e != nil; e = e.Next() {
		fmt.Println("遍历l", e.Value)
	}

	//打印首部元素
	fmt.Println(l.Front().Value) //0
	//打印尾部元素
	fmt.Println(l.Back().Value) //4
	//在首部元素之后插入值
	l.InsertAfter(5, l.Front())
	for e := l.Front(); e != nil; e = e.Next() {
		fmt.Print(e.Value)
	} //051234

	fmt.Println()

	//首部2个位置元素互换
	l.MoveAfter(l.Front(), l.Front().Next())
	for e := l.Front(); e != nil; e = e.Next() {
		fmt.Print(e.Value)
	} //501234

	fmt.Println()

	//将尾部元素移到首部
	l.MoveToFront(l.Back())
	for e := l.Front(); e != nil; e = e.Next() {
		fmt.Print(e.Value)
	} //450123

	fmt.Println()

	//将l放到m的后面
	m := list.New()
	for e := 20; e < 22; e++ {
		m.PushBack(e)
	}
	m.PushBackList(l)
	for e := m.Front(); e != nil; e = e.Next() {
		fmt.Print(e.Value)
	} //2021450123

}
