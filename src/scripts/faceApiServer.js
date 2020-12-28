import socketIOClient from "socket.io-client";
import * as constants from '../constants';
import * as utils from './utils';

let socket = socketIOClient(constants.SERVER_URL);

export const sendImageToServer = async (base64image) => {
    return socket.emit("sendImage", base64image, data => {
        console.log(data)
        if(!data.base64){
            console.log("No detections!");
            return false;
        } 
        const canvas = document.createElement('canvas');
        let image = new Image();
        image.src = data.base64;
        canvas.getContext('2d').drawImage(image, 0, 0);
        image = utils.resizeMedia(image);
        utils.showResultsInContainer({media: image, canvas: canvas});
        return true;
    });
}

socket.on("getLabeledDescriptors", () => {
    const loadedDescriptors = utils.getItemFromLocalStorage(constants.FACE_DESCRIPTORS_KEY);
    socket.emit("sendDescriptors", JSON.stringify(loadedDescriptors));
});