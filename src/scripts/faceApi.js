const faceapi = require('face-api.js');

const maxDescriptorDistance = 0.6; 
const displayWidth = 750;

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
        console.log(detection, descriptions[i])
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
