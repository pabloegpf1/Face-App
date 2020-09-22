const MODEL_URL = './public/models'
const maxDescriptorDistance = 0.6
const descriptions = []
let labeledFaceDescriptors;

Promise.all([
    faceapi.loadSsdMobilenetv1Model(MODEL_URL),
    faceapi.loadFaceLandmarkModel(MODEL_URL),
    faceapi.loadFaceRecognitionModel(MODEL_URL)
  ]).then(start)

async function start() {

    processImageForm.addEventListener('submit', async () => {
        event.preventDefault();
        const containerDiv = document.getElementById('container');
        containerDiv.innerHTML = "";
        document.getElementById('processImageSubmit').innerHTML = "Processing image...";

        const image = await faceapi.bufferToImage(document.getElementById('processImage').files[0]);
        const displaySize = { 
            width: 750, 
            height: (image.height*750)/image.width
        }

        image.width = displaySize.width;
        image.height = displaySize.height;
        const canvas = faceapi.createCanvasFromMedia(image);
        faceapi.matchDimensions(canvas, displaySize)

        let fullFaceDescriptions = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
        const resizedResults = faceapi.resizeResults(fullFaceDescriptions, displaySize)
        faceapi.draw.drawDetections(canvas, resizedResults);
        faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
        
        if(labeledFaceDescriptors) detectRegisteredPeople(resizedResults, canvas);

        containerDiv.append(image);
        containerDiv.append(canvas);

        document.getElementById('processImageSubmit').innerHTML = "Submit";
    })

    registerSubjectForm.addEventListener('submit', async () => {
        event.preventDefault();
        document.getElementById('subjectImagesSubmit').innerHTML = "Registering user...";
        const label = document.getElementById('label').value;
        const imagePaths = document.getElementById('subjectImages').files;
        for(let i = 0; i<imagePaths.length; i++){
            const image = await faceapi.bufferToImage(imagePaths[i]);
            trainModelForSubject(label, image);
        }
    })

}

async function trainModelForSubject(label, image) {
    const detections = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()
    descriptions.push(detections.descriptor)
    labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors(label, descriptions);
    document.getElementById('subjectImagesSubmit').innerHTML = label + " registered correctly!";
}

async function detectRegisteredPeople(fullFaceDescriptions, canvas) {
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);
    const results = fullFaceDescriptions.map(fd => 
        faceMatcher.findBestMatch(fd.descriptor)
    );
    results.forEach((result, i) => {
        const box = fullFaceDescriptions[i].detection.box
        const text = result.toString()
        const drawBox = new faceapi.draw.DrawBox(box, { label: text })
        drawBox.draw(canvas)
    })
}

