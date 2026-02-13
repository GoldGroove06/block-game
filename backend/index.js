import express from 'express'
import { createServer } from 'node:http';
import { Server } from 'socket.io'
import connectMongo from './lib/connectMongo.js';
import { Room } from './models/room.js';
import { Users } from './models/users.js';

const app = express()
const server = createServer(app)
const io = new Server(server, {
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
        let roomExists
        let claimedBlocksDict
        userExists = await Users.findOne({ username: roomData.username })
        console.log(userExists)
        if (userExists) { socket.emit("error", { error: "userExists" }) }
        if (!userExists) {
            userExists = await Users.create({
                username: roomData.username
            })

            roomExists = await Room.findOne({ roomId: roomData.room })
            console.log(roomExists)
            if (!roomExists) {
                roomExists = await Room.create({
                    roomId: roomData.room,
                    Users
                })
            }
            socket.join(roomData.room)
            roomExists.users.push(userExists);

            await roomExists.save()

            console.log(roomExists.users)
            
            console.log("room joined by", roomData.username)
            socket.on('click', async (data) => {
                console.log(data)
                userExists.claimedBlocks.set(data.itemNo.toString(), true)
                await userExists.save()
                io.sockets.in(roomData.room).emit('click', data)
            })
        }

    })

})

server.listen(3000, () => {
    console.log('Example app listening on port 3000!')
}
)