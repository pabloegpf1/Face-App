const MODEL_URL = '/public/models'

Promise.all([
    faceapi.loadSsdMobilenetv1Model(MODEL_URL),
    faceapi.loadFaceLandmarkModel(MODEL_URL),
    faceapi.loadFaceExpressionModel(MODEL_URL),
    faceapi.loadAgeGenderModel(MODEL_URL)
  ]).then(start)

async function start(){
    const visualizationDiv = document.getElementById('visualization');
    imageForm.addEventListener('change', async () => {
        console.log("Processing image...");
        visualizationDiv.innerHTML = "";
        const image = await faceapi.bufferToImage(imageForm.files[0]);
        const canvas = faceapi.createCanvasFromMedia(image);

        //Full face descriptions: Array of vounding box + score of each detected face
        let fullFaceDescriptions = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceExpressions().withAgeAndGender();
        console.log(fullFaceDescriptions)

        //Draw detections and landmarks
        faceapi.draw.drawDetections(canvas, fullFaceDescriptions);
        faceapi.draw.drawFaceLandmarks(canvas, fullFaceDescriptions);
        faceapi.draw.drawFaceExpressions(canvas, fullFaceDescriptions);

        visualizationDiv.append(canvas);
    })
}
  