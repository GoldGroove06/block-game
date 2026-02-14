import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { io } from "socket.io-client";

const TOTAL_BLOCKS = 100;

function App() {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const [clickedItems, setClickedItems] = useState({});
  const socketRef = useRef(null);

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

    const socketInstance = io("http://localhost:3000");
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

  // ─── Leaderboard ───
  const leaderboard = useMemo(() => {
    const counts = {};
    Object.values(clickedItems).forEach((item) => {
      if (item?.claimed && item?.owner) {
        counts[item.owner] = (counts[item.owner] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [clickedItems]);

  const totalClaimed = Object.values(clickedItems).filter(
    (item) => item?.claimed
  ).length;

  // ─── Modal ───
  if (!joined) {
    return (
      <div className="modal-overlay" id="join-modal">
        <div className="modal-card">
          <h1 className="modal-title">Block Game</h1>
          <p className="modal-subtitle">
            Claim blocks in real-time with others.
          </p>

          {error && (
            <div className="error-message" id="error-message" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleJoin}>
            <div className="field-group">
              <label className="field-label" htmlFor="username-input">
                Username
              </label>
              <input
                id="username-input"
                className="field-input"
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={connecting}
                autoFocus
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="room-input">
                Room ID
              </label>
              <input
                id="room-input"
                className="field-input"
                type="text"
                placeholder="Enter room code"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                disabled={connecting}
              />
            </div>

            <button
              id="join-button"
              className="btn-primary"
              type="submit"
              disabled={connecting}
            >
              {connecting ? "Connecting…" : "Join Room"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Game Board ───
  return (
    <div>
      <header className="app-header">
        <div className="app-logo">Block Game</div>
        <div className="app-meta">
          <span className="meta-tag">{username}</span>
          <span className="meta-tag">Room {room}</span>
        </div>
      </header>

      <div className="game-layout">
        {/* Grid */}
        <div className="block-grid-container">
          <div className="block-grid">
            {[...Array(TOTAL_BLOCKS)].map((_, i) => {
              const item = clickedItems[i];
              const isClaimed = item?.claimed;

              return (
                <button
                  key={i}
                  id={`block-${i}`}
                  className={`block-cell${isClaimed ? " claimed" : ""}`}
                  onClick={(e) => handleBlockClick(e, i)}
                  style={{ animationDelay: `${i * 12}ms` }}
                >
                  <span className="block-number">{i}</span>
                  {isClaimed && (
                    <span className="block-owner" title={item.owner}>
                      {item.owner}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <aside className="leaderboard" id="leaderboard">
          <div className="leaderboard-header">
            <h2 className="leaderboard-title">Leaderboard</h2>
            <span className="leaderboard-count">
              {totalClaimed} / {TOTAL_BLOCKS}
            </span>
          </div>

          {leaderboard.length === 0 ? (
            <p className="leaderboard-empty">No blocks claimed yet</p>
          ) : (
            <ul className="leaderboard-list">
              {leaderboard.map((entry, idx) => (
                <li
                  key={entry.name}
                  className={`leaderboard-row${entry.name === username ? " is-you" : ""
                    }`}
                >
                  <div className="leaderboard-rank">{idx + 1}</div>
                  <div className="leaderboard-name">
                    {entry.name}
                    {entry.name === username && (
                      <span className="you-badge">You</span>
                    )}
                  </div>
                  <div className="leaderboard-score">{entry.count}</div>
                  <div className="leaderboard-bar-track">
                    <div
                      className="leaderboard-bar-fill"
                      style={{
                        width: `${(entry.count / TOTAL_BLOCKS) * 100}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}

export default App;
