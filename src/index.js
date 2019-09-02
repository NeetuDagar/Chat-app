const path=require('path');
const http=require('http')
const express=require('express')
const socketio=require('socket.io')


const app=express()
const server=http.createServer(app);
const io=socketio(server);

const Filter = require('bad-words')
const { generateMessage,generateLocationMessage}=require('./utils/messages')
const {addUser,removeUser,getUser,getsUsersInRoom}=require('./utils/users')
const DirectryPath=path.join(__dirname, '../public')

app.use(express.static(DirectryPath));


// let count=0

// server (emit)=>client(receive) =countupdated
//  client (emit)=> server (receive)=increment

io.on('connection',(socket)=>{
    console.log('web socket is connected')




// user join a room 
socket.on("join",(options,callback)=>{
     const{error,user}=addUser({id:socket.id,...options})
     
      if(error){
       return callback(error)
     }
    
    
    socket.join(user.room)
    socket.emit('message',generateMessage('Admin','welcome!'))
//  socket.emit('message','welcome!')
    socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined!`))
    io.to(user.room).emit('roomData',{
        room:user.room,
        users:getsUsersInRoom(user.room)
    })
    callback()  
})


//     //server emit
//       socket.emit('countUpdated',count);
       //  server receive
//        socket.on('increment',()=>{
//         count ++;
//         socket.emit('countUpdated',count)
//         // uppdate the count for specific connection
//         // socket.emit('countUpdated',count)
//         // io.emit update the count for every single connection server receive
//          io.emit('countUpdated',count)
//     })

 



// send message
     socket.on('sendMessage',(message,cb)=>{
     const user=getUser(socket.id)
     const filter = new Filter();
      if(filter.isProfane(message)){
         return cb('Profanity is not allowed')
        }
         io.to(user.room).emit('message',generateMessage(user.username,message)) 
        cb()
     })
     
    //  send location coordinates and client acknowledment to server by callback function
         socket.on('sendLocation',(coords,callback)=>{
         const user=getUser(socket.id)

          io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?=${coords.latitude},${coords.longitude}`))

            callback()
         
        })

// send user is leave message 
      socket.on('disconnect',()=>{
          const user=removeUser(socket.id)
          if(user){             
           io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left`))
           io.to(user.room).emit('roomData',{
               room:user.room,
               users:getsUsersInRoom(user.room)
           })
        }
      })
})
 



server.listen(3000)
console.log("server is listening on 3000")