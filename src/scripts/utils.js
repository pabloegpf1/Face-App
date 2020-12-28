import * as constants from '../constants';

export const getItemFromLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

export async function saveLabeledDescriptorsInLocalStorage(labeledFaceDescriptors) {
    return localStorage.setItem(constants.FACE_DESCRIPTORS_KEY, JSON.stringify(labeledFaceDescriptors))
}

export const showResultsInContainer = ({media, canvas}) => {
    const resultContainter = document.getElementById(constants.RESULT_CONTAINER_ID);
    const resultCanvas = document.getElementById(constants.CANVAS_ID);
    const resultMedia = document.getElementById(constants.IMAGE_ID);
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

export const sendDescriptorsToServer = (descriptors) => {
    const formData = new FormData();
    formData.append("descriptors", JSON.stringify(descriptors));

    return fetch(constants.SERVER_URL + constants.SEND_DESCRIPTORS_PATH, {
        method: "POST",
        mode: 'no-cors',
        body: formData
    });
}

export const resizeMedia = (media) => {
    media.width = media.width || 300;
    media.height = media.height || 300;
    return media;
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