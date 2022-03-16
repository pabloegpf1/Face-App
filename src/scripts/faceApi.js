import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm';

import * as faceapi from '@vladmandic/face-api/dist/face-api.esm.js';
import * as utils from './utils';
import * as constants from '../constants';

const faceDetectorOptions = { inputSize: constants.FACE_DETECTOR_INPUT_SIZE };
const useTinyModel = true;
let labeledFaceDescriptors = [];

export async function loadTensorFlow(backend = constants.WEBGL_BACKEND) {
    await setWasmPaths(constants.WASM_PATH);
    await faceapi.tf.setBackend(backend);
    await faceapi.tf.ready();
    return faceapi.tf;
}

export async function loadFaceApi() {
    await loadLabeledDescriptorsFromLocalStorage();
    return Promise.all([
        faceapi.loadTinyFaceDetectorModel(constants.MODEL_PATH),
        faceapi.loadFaceLandmarkTinyModel(constants.MODEL_PATH),
        faceapi.loadFaceRecognitionModel(constants.MODEL_PATH),
    ])
        .catch((error) => console.error(constants.FACEAPI_ERROR_TEXT, error));
}

export async function recognize(image) {
    image = await utils.createImageFromBase64(image);
    await faceapi.awaitMediaLoaded(image);
    const canvas = await faceapi.createCanvasFromMedia(image);
    const dimensions = await faceapi.matchDimensions(canvas, image);
    const detections = await getAllDetectionsForImage(image);
    if (detections.length === 0) return false;
    const resizedDetections = await faceapi.resizeResults(detections, dimensions);
    if (labeledFaceDescriptors.length > 0) {
        await drawLabeledDetectionsInCanvas(resizedDetections, canvas);
    } else {
        await drawDetectionsInCanvas(resizedDetections, canvas);
    }
    utils.showResultsInContainer({ canvas });
    return true;
}

export async function generateLandmarks(image) {
    image = await utils.createImageFromBase64(image);
    await faceapi.awaitMediaLoaded(image);
    const detections = await getAllDetectionsForImage(image);
    if (detections.length === 0) return false;
    return true;
}

export async function getLabeledDescriptors(label, images) {
    let descriptorsForSubject = [];
    for (let i = 0; i < images.length; i++) {
        await faceapi.awaitMediaLoaded(images[i]);
        const detection = await getDetectionForImage(images[i]);
        descriptorsForSubject.push(detection.descriptor);
    }
    const newDescriptors = await new faceapi.LabeledFaceDescriptors(label, descriptorsForSubject);
    labeledFaceDescriptors.push(newDescriptors);
    utils.saveLabeledDescriptorsInLocalStorage(labeledFaceDescriptors);
}

export async function getAllDetectionsForImage(image) {
    return await faceapi
        .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions(faceDetectorOptions))
        .withFaceLandmarks(useTinyModel)
        .withFaceDescriptors();
}

async function getDetectionForImage(image) {
    return await faceapi
        .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions(faceDetectorOptions))
        .withFaceLandmarks(useTinyModel)
        .withFaceDescriptor();
}

async function loadLabeledDescriptorsFromLocalStorage() {
    const loadedDescriptors = await utils.getItemFromLocalStorage(constants.FACE_DESCRIPTORS_KEY);
    if (!loadedDescriptors) return;
    loadedDescriptors.map(async (subject) => {
        const newSubject = new faceapi.LabeledFaceDescriptors(
            subject.label,
            await subject.descriptors.map((descriptor) => Float32Array.from(descriptor))
        );
        labeledFaceDescriptors.push(newSubject);
    });
}

async function detectSubjectsInImage(detections) {
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, constants.MAX_DESCRIPTOR_DISTANCE);
    return detections.map(detection =>
        faceMatcher.findBestMatch(detection.descriptor)
    );
}

function drawDetectionsInCanvas(detections, canvas) {
    faceapi.draw.drawDetections(canvas, detections);
    faceapi.draw.drawFaceLandmarks(canvas, detections);
}

async function drawLabeledDetectionsInCanvas(detections, canvas) {
    const labeledDetections = await detectSubjectsInImage(detections);
    labeledDetections.forEach((detection, i) => {
        const box = detections[i].detection.box;
        const text = detection.toString();
        const drawBox = new faceapi.draw.DrawBox(box, { label: text });
        drawBox.draw(canvas);
    })
}
