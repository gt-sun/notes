package main

import (
	"flag"
	"fmt"
	"os"
)

type Cmd struct {
	versionFlag bool
	help        bool
	class       string
	cpOption    string
	args        []string
}

func parseCmd() *Cmd {
	cmd := &Cmd{}

	flag.Usage = printUsage
	flag.BoolVar(&cmd.versionFlag, "version", false, "print the version")
	flag.BoolVar(&cmd.help, "help", false, "print the help message")
	flag.BoolVar(&cmd.help, "?", false, "print the help message")
	flag.StringVar(&cmd.cpOption, "cp", "", "classpath")
	flag.StringVar(&cmd.cpOption, "classpath", "", "classpath")
	flag.Parse()

	args := flag.Args()
	if len(args) > 0 {
		cmd.class = args[0]
		cmd.args = args[1:]
	}

	return cmd
}

func printUsage() {
	fmt.Printf("Usage: %s [-options] class [args...]\n", os.Args[0])
}

func startJVM(cmd *Cmd) {
	fmt.Printf("classpath:%s class:%s args:%v\n", cmd.cpOption, cmd.class, cmd.args)
}

func main() {
	cmd := parseCmd()
	if cmd.versionFlag {
		fmt.Println("version:1.0")
	} else if cmd.help || cmd.class == "" {
		printUsage()
	} else {
		startJVM(cmd)
	}
}

/*
C:\Users\sun\Desktop\tmp>02.exe -version
version:1.0

C:\Users\sun\Desktop\tmp>02.exe -help
Usage: 02.exe [-options] class [args...]

C:\Users\sun\Desktop\tmp>02.exe foo/bar Myapp ar1 ar2
classpath: class:foo/bar args:[Myapp ar1 ar2]

*/
