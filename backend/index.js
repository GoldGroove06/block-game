import express from 'express'
import { createServer } from 'node:http';
import { Server } from 'socket.io'

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

io.on('connection', (socket) => {
    socket.on('joinroom', (room) => {
        socket.join(room)
        socket.on('click', (data) => {
            console.log(data)
            io.sockets.in(room).emit('click', data)
        })

    })

})

server.listen(3000, () => {
    console.log('Example app listening on port 3000!')
}
)