import React, { useCallback } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';

const WikiCard = ({ wikiarticle, onSaveToggle, isSaved }) => {
    const handleBookmarkClick = useCallback((e) => {
        e.stopPropagation();
        onSaveToggle(wikiarticle);
    }, [wikiarticle, onSaveToggle]);

    return (
        <div className="wiki-card">
            <h2>
                <a href={wikiarticle.url} target="_blank" rel="noopener noreferrer">
                    {wikiarticle.title}
                </a>
            </h2>
            <p>{wikiarticle.summary}</p>
            <button 
                onClick={handleBookmarkClick} 
                className={`bookmark-button ${isSaved ? "saved" : ""}`}  
                aria-label={isSaved ? "Remove bookmark" : "Save bookmark"}
            >
                <FontAwesomeIcon icon={isSaved ? faBookmarkSolid : faBookmarkRegular} />
            </button>
        </div>
    );
};

export default WikiCard;