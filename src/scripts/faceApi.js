import * as tf from '@tensorflow/tfjs';
import {setWasmPaths} from '@tensorflow/tfjs-backend-wasm';

import * as faceapi from '@vladmandic/face-api/dist/face-api.nobundle.js';
import * as constants from '../constants';

let labeledFaceDescriptors = [];

export async function loadTensorFlow(backend = "webgl"){
    setWasmPaths(constants.WASM_PATH);
    await tf.setBackend(backend);
    await tf.ready();
    console.log(tf)
    return tf;
}

export async function loadFaceApi(){
    return Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(constants.MODEL_PATH),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(constants.MODEL_PATH),
        faceapi.nets.faceRecognitionNet.loadFromUri(constants.MODEL_PATH),
    ])
    .catch((error)=> console.error(constants.FACEAPI_ERROR_TEXT+error));
}

export async function createCanvasFromHtmlMedia({media, isImage}){
    if(isImage){
        await faceapi.awaitMediaLoaded(media);
        media = resizeMedia(media);
    }
    const canvas = await faceapi.createCanvasFromMedia(media);
    const dimensions = await faceapi.matchDimensions(canvas, media, !isImage);
    const detections = await getAllDetectionsForImage(media);
    const resizedDetections = await faceapi.resizeResults(detections, dimensions);
    if(labeledFaceDescriptors.length > 0) 
        await drawLabeledDetectionsInCanvas(resizedDetections, canvas);
    else
        await drawDetectionsInCanvas(resizedDetections, canvas);
    return canvas;
}

export async function getLabeledDescriptors(label, images) {
    let descriptorsForSubject = [];
    for(let i = 0; i<images.length; i++){
        await faceapi.awaitMediaLoaded(images[i]);
        let detection = await getDetectionForImage(images[i]);
        descriptorsForSubject.push(detection.descriptor);
    }
    const newDescriptors = await new faceapi.LabeledFaceDescriptors(label, descriptorsForSubject);
    labeledFaceDescriptors.push(newDescriptors);
}

async function getDetectionForImage(image) {
    return await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true).withFaceDescriptor();
}

async function getAllDetectionsForImage(image) {
    return await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true).withFaceDescriptors();
}

async function detectSubjectsInImage(detections) {
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, constants.MAX_DESCRIPTOR_DISTANCE);
    return detections.map(detection =>
        faceMatcher.findBestMatch(detection.descriptor)
    );
}

function resizeMedia(media) {
    let width = constants.CANVAS_DISPLAY_WIDTH;
    let height = (media.height*constants.CANVAS_DISPLAY_WIDTH)/media.width
   
    media.width = width;
    media.height = height;
    return media;
}

function drawDetectionsInCanvas(detections, canvas){
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
