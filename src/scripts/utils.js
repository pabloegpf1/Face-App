import * as constants from '../constants';

export function showResultsInContainer(media, canvas) {
    const resultContainer = document.getElementById(constants.RESULT_CONTAINER_ID);
    cleanResultsContainer();
    if(media) resultContainer.append(media);
    if(canvas) resultContainer.append(canvas);
    media.hidden = false;
}

export function cleanResultsContainer() {
    const resultContainer = document.getElementById(constants.RESULT_CONTAINER_ID);
    resultContainer.innerHTML = "";
}