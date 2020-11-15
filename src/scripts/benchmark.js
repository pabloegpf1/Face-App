let times = [];
let firstFrame = null;

export const getStatsFromTime = (timeInMs) => {
    if(times.length === 0) firstFrame = timeInMs;
    updateTimeRecords(timeInMs);
    const averageTime = getAverageTime();
    const fps = getFpsFromAverageTime(averageTime);
    return {
        firstFrame,
        averageTime,
        fps
    };
}

export const clearStats = () => {
    times = [];
    firstFrame = null;
}

const updateTimeRecords = (newTime) => times = [newTime].concat(times).slice(0, 30);

const getAverageTime = () => Math.round(times.reduce((total, t) => total + t) / times.length);

const getFpsFromAverageTime = (averageTime) => Math.round(1000 / averageTime);