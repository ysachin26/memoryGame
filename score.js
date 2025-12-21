
// score calculation logic will be calculated from here.
export function calculateScore(mode, moveCount, matchCount, minutes, seconds) {
    const totalSeconds = minutes * 60 + seconds;

    let maxMatches;
    let timeWeight, moveWeight, baseScore;

    switch (mode.toLowerCase()) {
        case "easy":
            maxMatches = 6;
            baseScore = 300;
            timeWeight = 1;
            moveWeight = 1.2;
            break;
        case "medium":
            maxMatches = 9;
            baseScore = 600;
            timeWeight = 1.5;
            moveWeight = 1.5;
            break;
        case "hard":
            maxMatches = 12;
            baseScore = 900;
            timeWeight = 2;
            moveWeight = 1.8;
            break;
        default:
            maxMatches = 6;
            baseScore = 300;
            timeWeight = 1;
            moveWeight = 1.2;
    }

    const minMoves = maxMatches * 2;

    const movePenalty = Math.max(0, (moveCount - minMoves) * moveWeight);
    const timePenalty = totalSeconds * timeWeight;

    const rawScore = baseScore - movePenalty - timePenalty;

    const finalScore = Math.max(0, Math.round(rawScore)); // Never negative
    return finalScore;
}


//score will be saved in local storage
export function saveScore(mode, bestScore) {
    let savedScore = JSON.parse(localStorage.getItem("bestScore")) || {};
    savedScore[mode] = bestScore;
    localStorage.setItem("bestScore", JSON.stringify(savedScore));
}

//fetch the best score from the local storage.
export function fetchScore() {
    let savedScore = JSON.parse(localStorage.getItem("bestScore")) || {};
    return savedScore;
}





