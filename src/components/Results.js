import React from 'react';

import * as constants from '../constants';

function Results(props) {
    return (
        <div id={constants.RESULT_CONTAINER_ID}>
            <img id={constants.IMAGE_ID} alt="resultImage" hidden></img>
            <video id={constants.VIDEO_ID} autoPlay muted playsInline hidden></video>
            <canvas id={constants.CANVAS_ID} hidden></canvas>
        </div>
    )
}

export default Results;