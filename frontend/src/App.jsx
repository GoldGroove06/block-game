import { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";

import JoinModal from "./components/JoinModal";
import Header from "./components/Header";
import BlockGrid from "./components/BlockGrid";
import Leaderboard from "./components/Leaderboard";

function App() {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const [clickedItems, setClickedItems] = useState({});
  const socketRef = useRef(null);

  // ─── Socket event handlers ───

  const handleRes = useCallback((data) => {
    setClickedItems((prev) => ({
      ...prev,
      [data.itemNo]: { owner: data.username, claimed: true },
    }));
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    setError("");

    const trimmedUser = username.trim();
    const trimmedRoom = room.trim();

    if (!trimmedUser || !trimmedRoom) {
      setError("Both fields are required.");
      return;
    }

    setConnecting(true);

    const socketInstance = io(import.meta.env.VITE_SERVER_URL);
    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.emit("joinroom", {
      room: trimmedRoom,
      username: trimmedUser,
    });

    socketInstance.on("state", (data) => {
      setClickedItems(data.claimedBlocks);
      setJoined(true);
      setConnecting(false);
    });

    socketInstance.on("error", (data) => {
      if (data.error === "userExists") {
        setError("That username is already taken in this room.");
      } else {
        setError(data.error || "Something went wrong.");
      }
      setConnecting(false);
      socketInstance.disconnect();
      socketRef.current = null;
      setSocket(null);
    });

    socketInstance.on("click", (data) => {
      handleRes(data);
    });

    socketInstance.on("connect_error", () => {
      setError("Cannot reach the server. Is it running?");
      setConnecting(false);
    });
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleBlockClick = (e, itemNo) => {
    e.preventDefault();
    if (!socket || clickedItems[itemNo]?.claimed) return;
    socket.emit("click", { itemNo, username });
  };

  // ─── Render ───

  if (!joined) {
    return (
      <JoinModal
        username={username}
        setUsername={setUsername}
        room={room}
        setRoom={setRoom}
        connecting={connecting}
        error={error}
        onJoin={handleJoin}
      />
    );
  }

  return (
    <div>
      <Header username={username} room={room} />

      <div className="game-layout">
        <BlockGrid clickedItems={clickedItems} onBlockClick={handleBlockClick} />
        <Leaderboard clickedItems={clickedItems} username={username} />
      </div>
    </div>
  );
}

export default App;
