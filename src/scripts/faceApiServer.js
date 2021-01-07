import socketIOClient from "socket.io-client";
import * as constants from '../constants';
import * as utils from './utils';

let waitingForFrame = false;

let socket = socketIOClient(
    process.env.NODE_ENV === "production" ?
    constants.SERVER_URL : constants.SERVER_URL_DEV
);

socket.on('connect', function() {
    const loadedDescriptors = utils.getItemFromLocalStorage(constants.FACE_DESCRIPTORS_KEY);
    socket.emit("sendDescriptors", JSON.stringify(loadedDescriptors));
})

export const recognize = (base64image, updateTimeStats) => {
    if(waitingForFrame) return;
    waitingForFrame = true;
    const initialTime = Math.round(performance.now());
    socket.emit("recognize", {base64image, initialTime}, async (response) => {
        waitingForFrame = false;
        if(response.success) {
            const canvas = document.createElement('canvas');
            const image = await utils.createImageFromBase64(response.base64canvas);
            canvas.getContext('2d').drawImage(image, 0, 0);
            utils.showResultsInContainer({canvas, image});
            updateTimeStats(Math.round(performance.now()) - response.initialTime);
            return(true);
        }
        return(false);
    })
}