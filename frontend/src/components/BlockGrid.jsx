const TOTAL_BLOCKS = 100;

function BlockGrid({ clickedItems, onBlockClick }) {
    return (
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
                            onClick={(e) => onBlockClick(e, i)}
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
    );
}

export { TOTAL_BLOCKS };
export default BlockGrid;
