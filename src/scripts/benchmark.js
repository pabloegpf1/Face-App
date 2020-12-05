let firstFrame, frameCount, totalTime = 0;

export const getStatsFromTime = (timeInMs) => {
    if(frameCount === 0) firstFrame = timeInMs;
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
    firstFrame = 0;
    frameCount = 0;
    totalTime = 0;
} 

const updateTimeRecords = (newTime) => {
    totalTime += newTime;
    frameCount++;
}

const getAverageTime = () => Math.round(totalTime/frameCount);

const getFpsFromAverageTime = (averageTime) => Math.round(1000 / averageTime);