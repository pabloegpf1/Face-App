import React from 'react';

import * as constants from '../constants';

function Results(props) {
    return (
        <div id={constants.RESULT_CONTAINER_ID}>
            <img id={constants.IMAGE_ID} alt=""></img>
            <video id={constants.VIDEO_ID} autoPlay playsInline muted></video>
            <canvas id={constants.CANVAS_ID}></canvas>
        </div>
    )
}

export default Results;