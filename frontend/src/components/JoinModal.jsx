function JoinModal({
    username,
    setUsername,
    room,
    setRoom,
    connecting,
    error,
    onJoin,
}) {
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

                <form onSubmit={onJoin}>
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

export default JoinModal;
