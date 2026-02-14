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
await connectMongo()
io.on('connection', (socket) => {
    socket.on('joinroom', async (roomData) => {
        let claimedBlocksDict = {}
        let userExists = await Users.findOne({ username: roomData.username })

        if (userExists) {
            socket.emit("error", { error: "userExists" })
            return
        }

        userExists = await Users.create({
            username: roomData.username
        })

        let roomExists = await Room.findOne({ roomId: roomData.room })

        if (!roomExists) {
            roomExists = await Room.create({
                roomId: roomData.room,
                users: []
            })
        }

        socket.join(roomData.room)
        roomExists.users.push(userExists._id)
        await roomExists.save()

        console.log("room joined by", roomData.username)
        const users = await Users.find({
            _id: { $in: roomExists.users }
        })

        for (const user of users) {
            if (user.claimedBlocks?.size > 0) {
                user.claimedBlocks.forEach((value, key) => {
                    claimedBlocksDict[Number(key)] = {
                        owner: user.username,
                        claimed: value
                    }
                })
            }
        }

        io.in(roomData.room).emit('state', { claimedBlocks: claimedBlocksDict })

        socket.on('click', async (data) => {
            await Users.updateOne(
                { _id: userExists._id },
                {
                    $set: {
                        [`claimedBlocks.${data.itemNo}`]: true
                    }
                }
            )

            io.in(roomData.room).emit('click', data)
        })

        socket.on('disconnect', async () => {
            console.log("user disconnected")
            await Users.deleteOne({ _id: userExists._id })
            await Room.updateOne(
                { _id: roomExists._id },
                { $pull: { users: userExists._id } }
            )
        })
    })
})

server.listen(3000, () => {
    console.log('Example app listening on port 3000!')
}
)