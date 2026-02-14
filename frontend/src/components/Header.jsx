function Header({ username, room }) {
    return (
        <header className="app-header">
            <div className="app-logo">Block Game</div>
            <div className="app-meta">
                <span className="meta-tag">{username}</span>
                <span className="meta-tag">Room {room}</span>
            </div>
        </header>
    );
}

export default Header;
