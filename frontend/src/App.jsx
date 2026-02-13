import { useEffect, useState } from "react";
import { io } from "socket.io-client";
function App() {
  const [socket, setSocket] = useState(null)
  const [room, setRoom] = useState('')
  const [username, setUsername] = useState('')
  const [start, setStart] = useState(false)
  const [clickedItems, setClickedItems] = useState({});

  const handleRes = (data) => {
    setClickedItems((prevItems) => ({
      ...prevItems,
      [data.itemNo]: true,
    }));
  };

  useEffect(() => {
    if( room && start){

    
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance)
    console.log("started")
    socketInstance.emit("joinroom", {room, username})
    socketInstance.on("error", (data) => {
      console.log(data.error)
    })
    socketInstance.on("click", (data) => {
      handleRes(data)
    });
  }

  }, [room, start])
  console.log(clickedItems)
  const handleButtonClick = (e, itemNo) => {
    e.preventDefault()

    socket.emit("click", {itemNo, username})
  }
  return (
    <div className="p-4">
      <div>
        Enter Name: <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
        Enter Room Number: <input type="text" value={room} onChange={(e) => setRoom(e.target.value)}/>
        <button onClick={() => setStart(true)}>Start</button>
      </div>
      {/* The parent container sets up the grid */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-2">
        {[...Array(100)].map((_, key) => (
          // Child elements are automatically placed in the grid
          <button
            key={key}
            onClick={(e) => handleButtonClick(e, key)}
            className={`${clickedItems[key] ? "bg-green-500" : "bg-gray-500"} p-6 rounded-lg shadow-md text-white flex items-center justify-center h-24`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
