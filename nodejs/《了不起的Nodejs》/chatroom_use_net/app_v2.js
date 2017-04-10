

// 使用一个函数来处理conn.write(...)

var net = require('net')
var count = 1
var users = {}

var server = net.createServer(function(conn){
    conn.setEncoding('utf8')
    console.log('have a new conn')
    conn.write('Welcome to the server')
    conn.write('You are the No.' + count)
    conn.write('\r\nEnter your name: ')
    count++

    var nickname
    conn.on('data',(data)=>{
        data = data.replace('\r\n', '')
        if (!nickname){
            if (users[data]){
                conn.write('\r\nnickname already in use\r\n')
                return
            }else{
                nickname = data
                users[nickname] = conn

                // for (var i in users){
                //     users[i].write('\r\n' + nickname + ' joined the room\r\n')
                // }
                print('\r\n' + nickname + ' joined the room\r\n')
            }
        }else{
            // for(var i in users){
            //     if (i != nickname){
            //         users[i].write('\r\n' + nickname + ' said: ' + data + '\r\n')
            //     }
            // }
            print('\r\n' + nickname + ' said: ' + data + '\r\n',true)
        }
    })

    conn.on('close', () => {
        count--
        delete users[nickname]
        // for(var i in users){
        //     if (i !== nickname){
        //         users[i].write('\r\n' + nickname + ' left room!\r\n')
        //     }
        // }
        print('\r\n' + nickname + ' left room!\r\n')
    })

    //这个函数太巧妙了 ^_^
    function print(msg,exceptMyself){
        for (var i in users){
            if(!exceptMyself ||i != nickname ){
                users[i].write(msg)
            }
        }
    }
})

server.listen(3000,function(){
    console.log('Starting at ::3000')
})
