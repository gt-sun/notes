

## 概览

*执行系统命令*

```js
const spawn = require('child_process').spawn;
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

For convenience, the `child_process` module provides a handful of synchronous and asynchronous alternatives to `child_process.spawn()` and `child_process.spawnSync()`. Note that each of these alternatives are implemented on top of `child_process.spawn()` or `child_process.spawnSync()`.

- `child_process.exec()`: spawns a shell and runs a command within that shell, passing the stdout and stderr to a callback function when complete.
- `child_process.execFile()`: similar to `child_process.exec()` except that it spawns the command directly without first spawning a shell.
- `child_process.fork()`: spawns a new Node.js process and invokes a specified module with an IPC communication channel established that allows sending messages between parent and child.
- `child_process.execSync()`: a synchronous version of `child_process.exec()` that will block the Node.js event loop.
- `child_process.execFileSync()`: a synchronous version of `child_process.execFile()` that will block the Node.js event loop.

## 详细

### `child_process.exec(command[, options][, callback])`


```js
var exec = require('child_process').exec

exec('cat /etc/passwd |wc -l', (error, stdout, stderr) => {
  if (error) {
    console.log(error.stack)
    return
  }
  console.log(`stdout: ${stdout}`)
  console.log(`stderr: ${stderr}`)
})

/*
stdout: 29

stderr:
*/
```

### `child_process.spawn(command[, args][, options])`

run `ps ax | grep ssh`

```js
var spawn = require('child_process').spawn
var ps = spawn('ps', ['ax'])
var grep = spawn('grep', ['ssh'])

ps.stdout.on('data', (data) => {
  grep.stdin.write(data)
})

ps.stderr.on('data', (data) => {
  console.log(`ps stderr: ${data}`)
})

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`)
  }
  grep.stdin.end()
})

grep.stdout.on('data', (data) => {
  console.log(`grep stdout ${data}`)
})

grep.stderr.on('data', (data) => {
  console.log(`grep stderr ${data}`)
})

grep.on('close', (code) => {
  console.log(`grep process closed with code ${code}`)
})

/*
# node spawn.js 
grep stdout   729 ?        Ss     0:15 /usr/sbin/sshd
16499 ?        Ss     0:00 sshd: root@pts/2
19600 ?        Ss     0:00 sshd: root@pts/3,pts/0
47706 ?        Ss     0:00 sshd: root@pts/4
47752 ?        Ss     0:00 sshd: root@pts/5

grep process closed with code 0
*/
```