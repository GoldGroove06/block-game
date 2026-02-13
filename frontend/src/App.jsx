import { useEffect, useState } from "react";
import { io } from "socket.io-client";
function App() {
  const [socket, setSocket] = useState(null)
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  const [clickedItems, setClickedItems] = useState({});

  const handleRes = (data) => {
    setClickedItems((prevItems) => ({
      ...prevItems,
      [data]: true,
    }));
  };

  useEffect(() => {
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance)
    socketInstance.emit("joinroom", "room1")
    socketInstance.on("click", (data) => {
      handleRes(data)
    });

  }, [])
  console.log(clickedItems)
  const handleButtonClick = (e, itemNo) => {
    e.preventDefault()

    socket.emit("click", itemNo)
  }
  return (
    <div className="p-4">
      {/* The parent container sets up the grid */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-2">
        {items.map((item) => (
          // Child elements are automatically placed in the grid
          <button
            key={item}
            onClick={(e) => handleButtonClick(e, item)}
            className={`${clickedItems[item] ? "bg-green-500" : "bg-gray-500"} p-6 rounded-lg shadow-md text-white flex items-center justify-center h-24`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
