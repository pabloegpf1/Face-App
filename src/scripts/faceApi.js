import * as tf from '@tensorflow/tfjs';
import {setWasmPaths} from '@tensorflow/tfjs-backend-wasm';
import * as faceapi from '@vladmandic/face-api/dist/face-api.nobundle.js';

import * as constants from '../constants';

export async function loadTensorFlow(backend = "webgl"){
    await setWasmPaths(constants.WASM_PATH);
    await tf.setBackend(backend);
    await tf.ready();
    console.log(tf)
    return tf;
}

export async function loadFaceApi(){
    return Promise.all([
        faceapi.nets.faceLandmark68Net.loadFromUri(constants.MODEL_PATH),
        faceapi.nets.ssdMobilenetv1.loadFromUri(constants.MODEL_PATH),
        faceapi.nets.faceRecognitionNet.loadFromUri(constants.MODEL_PATH),
    ])
    .catch((error)=> console.error(constants.FACEAPI_ERROR_TEXT+error));
}

export async function getLabeledDescriptors(label, images) {
    let descriptorsForSubject = [];
    for(let i = 0; i<images.length; i++){
        await faceapi.awaitMediaLoaded(images[i]);
        let detection = await getDetectionForImage(images[i]);
        descriptorsForSubject.push(detection.descriptor);
    }
    return new faceapi.LabeledFaceDescriptors(label, descriptorsForSubject);
}

export async function getDetectionForImage(image) {
    return await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();
}

export async function getAllDetectionsForImage(image) {
    let detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
    const displaySize = getDisplaySize(image);
    return faceapi.resizeResults(detections, displaySize);
}

export async function detectSubjectsInImage(detections, labeledFaceDescriptors) {
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, constants.MAX_DESCRIPTOR_DISTANCE);
    return detections.map(detection =>
        faceMatcher.findBestMatch(detection.descriptor)
    );
}

export async function createCanvasFromHtmlImage(image){
    await faceapi.awaitMediaLoaded(image);
    const displaySize = getDisplaySize(image);
    image.width = displaySize.width;
    image.height = displaySize.height;
    const canvas = await faceapi.createCanvasFromMedia(image);
    faceapi.matchDimensions(canvas, displaySize);
    return canvas;
}

export async function createCanvasFromHtmlVideo(video, detection){
    const canvas = await faceapi.createCanvasFromMedia(video);
    const dims = faceapi.matchDimensions(canvas, video, true);
    const resizedResult = faceapi.resizeResults(detection, dims);
    drawDetectionsInCanvas(canvas, resizedResult);
    return canvas;
}

export function drawDetectionsInCanvas(canvas, detections){
    faceapi.draw.drawDetections(canvas, detections);
    faceapi.draw.drawFaceLandmarks(canvas, detections);
}

export async function drawLabeledDetectionsInCanvas(descriptions, detections, canvas) {
    detections.forEach((detection, i) => {
        const box = descriptions[i].detection.box;
        const text = detection.toString();
        const drawBox = new faceapi.draw.DrawBox(box, { label: text });
        drawBox.draw(canvas);
    })
}

export function getDisplaySize(image) {
    return { 
        width: constants.CANVAS_DISPLAY_WIDTH, 
        height: (image.height*constants.CANVAS_DISPLAY_WIDTH)/image.width
    }
}