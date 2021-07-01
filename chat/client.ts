import * as SocketIO from 'socket.io'

const redis = require("redis").createClient(6379, "redis");

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 8000;


// ADD REDIS
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/index.html');
});

function set_user_list (urs) {
    let list:Array<string> = []
    for (let x in urs) {
        if (!list.includes(urs[x])) {
            list.push(urs[x])
        }
    }
    return list
}

const users = {}

io.on('connection', (socket) => {
  // console.log('a user connected');
  socket.on('users', msg => {
    io.emit('users', msg);
  })
  socket.on('chat message', msg => {
    redis.lpush("messages", [JSON.stringify(msg)], function(err, res){
        if(err) console.log(err);
        return;
    });
    io.emit('chat message', msg);
  })
  socket.on('login', user => {
    users[socket.id] = user
    io.emit('users', set_user_list (users))
    console.log(`user ${user} login`)

    // get 50 messages
    redis.lrange("messages", 0, 50, function(err, items) {
        if(err) {
            console.log(err);
            return false;
        }
        let messageList:Array<JSON> = []
        items.forEach(function(item:string){
            let itemGood:JSON = JSON.parse(item);
            messageList.push(itemGood);
        })
        io.to(socket.id).emit("loadMessage", messageList);
        return;
    })

  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
    delete users[socket.id]
    io.emit('users', set_user_list (users))
  })
})

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
})



/*
interface Message{
    roomId: string,
    message: string
}
// SERVER
io.on('connection', sock=>{

    sock.on('connect', ()=> {
        const roomId = 'some room'
    
        //Подписываемся на сообщения из любых комнат
        sock.on('message', (data:Message)=> 
                console.log(`Message ${data.message} from ${data.roomId}`))
    
        //Присоеденяемся к одной
        sock.emit('join', roomId)
    
        //И пишем в нее
        sock.emit('message', <Message>{roomId: roomId, message: 'Halo!'})
    })
})
*/





////////////////// PART 1

//region shard indexing
//import * as xxhash from 'xxhash'

/*
//region connect to redis
import { RedisClient, ClientOpts, Multi } from 'redis'

//Что-то типа фабрики клиентов
function getRedis(opts: ClientOpts): RedisClient{
    const c = new RedisClient(opts)
    c.on('error', err=> console.error(err))
    return c;
}
*/




