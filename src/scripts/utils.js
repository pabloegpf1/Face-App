import * as constants from '../constants';

export const getItemFromLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

export const setItemInLocalStorage = (key, value) => {
    console.log(JSON.stringify(value))
    localStorage.setItem(key, JSON.stringify(value));
}

export async function saveLabeledDescriptorsInLocalStorage(labeledFaceDescriptors) {
    return localStorage.setItem(constants.FACE_DESCRIPTORS_KEY, JSON.stringify(labeledFaceDescriptors))
}

export const showResultsInContainer = async ({ image, canvas }) => {
    const resultContainter = document.getElementById(constants.RESULT_CONTAINER_ID);
    const resultCanvas = document.getElementById(constants.CANVAS_ID);
    const resultImage = document.getElementById(constants.IMAGE_ID);
    if (canvas) {
        canvas.id = constants.CANVAS_ID;
        resultContainter.replaceChild(canvas, resultCanvas);
    }
    if (image) {
        image.id = resultImage.id;
        resultContainter.replaceChild(image, resultImage);
    }
}

export const clearResultsContainer = () => {
    clearImageContents();
    clearVideoContents();
    clearCanvasContents();
}

export const createImageFromBase64 = async (base64Image) => {
    const image = new Image();
    image.src = base64Image;
    image.width = base64Image.width || 300;
    image.height = base64Image.height || 300;
    return image;
}

const clearImageContents = () => {
    const resultImage = document.getElementById(constants.IMAGE_ID);
    if (resultImage) resultImage.src = "//:0";
}

const clearCanvasContents = () => {
    const resultCanvas = document.getElementById(constants.CANVAS_ID);
    if (resultCanvas) {
        const canvasContext = resultCanvas.getContext('2d');
        canvasContext.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    }
}

const clearVideoContents = () => {
    const resultVideo = document.getElementById(constants.VIDEO_ID);
    if (resultVideo) resultVideo.srcObject = null;
}