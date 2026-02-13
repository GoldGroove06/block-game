import express from 'express'
import { createServer } from 'node:http';
import { Server } from 'socket.io'
import connectMongo from './lib/connectMongo.js';
import { Room } from './models/room.js';
import { Users } from './models/users.js';

const app = express()
const server = createServer(app)
const io = new Server(server,{
    cors: {
    origin: "*"
  }
})


app.get('/', (req, res) => {
    res.send('Hello World!')
})

io.on('connection', async (socket) => {
    await connectMongo()
    socket.on('joinroom', async (roomData) => {
        let userExists
        userExists = await Users.findOne({username: roomData.username})
        console.log(userExists)
        if (userExists) {socket.emit("error", {error: "userExists"})}
        if (!userExists){
            userExists = await Users.create({
            username: roomData.username
        })
        
        const roomExists = await Room.findOne({room: roomData.room})
        if (!roomExists){

        
        await Room.create({
            roomId: roomData.room,
            Users
        })
    }
        socket.join(roomData.room)
        console.log("room joined", roomData.username)
        socket.on('click', (data) => {
            console.log(data)
            userExists.
            io.sockets.in(roomData.room).emit('click', data)
        })
    }

    })

})

server.listen(3000, () => {
    console.log('Example app listening on port 3000!')
}
)