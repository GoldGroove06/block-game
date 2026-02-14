import { useMemo } from "react";
import { TOTAL_BLOCKS } from "./BlockGrid";

function Leaderboard({ clickedItems, username }) {
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

    return (
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
    );
}

export default Leaderboard;
