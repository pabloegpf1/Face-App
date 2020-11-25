import * as constants from '../constants';

export const showResultsInContainer = ({media, isImage, canvas}) => {
    const resultContainter = document.getElementById(constants.RESULT_CONTAINER_ID);
    const resultCanvas = document.getElementById(constants.CANVAS_ID);
    const resultMedia = getResultMediaElement(isImage);
    canvas.id = constants.CANVAS_ID;
    media.id = resultMedia.id;
    resultContainter.replaceChild(media, resultMedia);
    resultContainter.replaceChild(canvas, resultCanvas);
}

export const clearResultsContainer = () => {
    clearImageContents();
    clearVideoContents();
    clearCanvasContents();
}

const getResultMediaElement = (isImage) => {
    const mediaId = isImage ? constants.IMAGE_ID : constants.VIDEO_ID;
    const resultElement = document.getElementById(mediaId);
    return resultElement;
}

const clearImageContents = () => {
    const resultImage = document.getElementById(constants.IMAGE_ID);
    if(resultImage) resultImage.src = "//:0";
}

const clearCanvasContents = () => {
    const resultCanvas = document.getElementById(constants.CANVAS_ID);
    if(resultCanvas) {
        const canvasContext = resultCanvas.getContext('2d');
        canvasContext.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    }
}

const clearVideoContents = () => {
    const resultVideo = document.getElementById(constants.VIDEO_ID);
    if(resultVideo) resultVideo.srcObject = null;
}