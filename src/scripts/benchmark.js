let firstFrame, frameCount, totalTime = 0;

export const getStatsFromTime = (newTime) => {
    if(frameCount === 0) firstFrame = newTime;
    updateTimeRecords(newTime);
    const averageTime = getAverageTime();
    const fps = getFpsFromAverageTime(averageTime);
    return {
        newTime,
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

const getAverageTime = () => Math.round(totalTime/(frameCount
    ));

const getFpsFromAverageTime = (averageTime) => Math.round(1000 / averageTime);