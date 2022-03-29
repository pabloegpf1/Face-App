import * as constants from '../constants';
import stats from 'stats-lite';

const BACKEND = new URLSearchParams(window.location.search).get('backend') || 'webgl';

export const getSelectedBackend = () => {
    return BACKEND;
}

export const getItemFromLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

export const setItemInLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

export async function saveLabeledDescriptorsInLocalStorage(labeledFaceDescriptors) {
    return localStorage.setItem(constants.FACE_DESCRIPTORS_KEY, JSON.stringify(labeledFaceDescriptors))
}

export const showAutoTestResultsInContainer = async (timeArray) => {
    const resultContainter = document.getElementById(constants.RESULT_CONTAINER_ID);
    resultContainter.replaceChildren(buildAutoResultTable(timeArray))
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

export const getBase64ImageFromUrl = async (imageUrl) => {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.crossOrigin = "anonymous"
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0);
    return canvas.toDataURL('image/png');
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

export const getCurrentAutoResultsFromLocalStorage = () => {
    return getItemFromLocalStorage(BACKEND + "_times") || [];
}

export const saveAutoResultsInLocalStorage = (times) => {
    setItemInLocalStorage(`${BACKEND}_times`, times);
}

export const clearAutoTestResults = async () => {
    const emptyArray = [];
    saveAutoResultsInLocalStorage(emptyArray);
    showAutoTestResults();
}

export const showAutoTestResults = () => {
    let timeArray = getCurrentAutoResultsFromLocalStorage();
    showAutoTestResultsInContainer(calculateAutoTestStats(timeArray), BACKEND)
}

export const storeAutoTestResult = (time) => {
    let timeArray = getCurrentAutoResultsFromLocalStorage();
    if (!timeArray) timeArray = [];
    timeArray.push(time);
    saveAutoResultsInLocalStorage(timeArray);
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

const calculateAutoTestStats = (timeArray) => {
    const result = {};
    result["Backend"] = BACKEND;
    result["Total images"] = timeArray.length;
    result["First image"] = `${timeArray[0]} ms`;
    timeArray.shift(); // Do not use first time
    result["Average"] = `${Math.round(stats.mean(timeArray) * 100) / 100} ms`;
    result["Stdev"] = `${Math.round(stats.stdev(timeArray) * 100) / 100} ms`;
    return result;
}

const buildAutoResultTable = (results) => {
    const table = document.createElement('table');
    table.setAttribute("border", "2");

    Object.entries(results).forEach(([key, value]) => {
        const row = document.createElement("tr");
        const title_cell = document.createElement("td");
        const value_cell = document.createElement("td");

        title_cell.appendChild(document.createTextNode(key));
        value_cell.appendChild(document.createTextNode(value));

        row.appendChild(title_cell);
        row.appendChild(value_cell);
        table.appendChild(row);
    });

    return table;
}