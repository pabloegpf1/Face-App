import {setWasmPaths} from '@tensorflow/tfjs-backend-wasm';
import * as faceapi from '@vladmandic/face-api/dist/face-api.esm';

const MODEL_PATH = './models/'
const WASM_PATH = './wasm/'
const maxDescriptorDistance = 0.6; 
const displayWidth = 750;

export async function loadTensorFlow(backend = "webgl"){
    await setWasmPaths(WASM_PATH);
    await faceapi.tf.setBackend(backend);
    await faceapi.tf.ready();
    console.log(faceapi.tf.version)
    return faceapi.tf;
}

export async function loadFaceApi(){
    return Promise.all([
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_PATH),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_PATH),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_PATH),
    ])
    .catch((error)=> console.error("Error loading Faceapi: "+error));
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
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);
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
        width: displayWidth, 
        height: (image.height*displayWidth)/image.width
    }
}
