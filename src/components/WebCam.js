import React from 'react';

import * as utils from '../scripts/utils.js';
import * as benchmark from '../scripts/benchmark.js';
import * as constants from '../constants.js';

class WebCam extends React.Component {

    constructor() {
        super();
        this.state = {
            video: false
        };
    }

    componentDidMount = () => {
        this.startWebcam();
    }

    startWebcam = async () => {
        const constraints = { 
            video: {
                "height": { "exact":300 },
                "width": { "exact":300 },
                "mediaSource": "camera"
            }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = document.getElementById(constants.VIDEO_ID);
        if(!video) return;
        video.onloadeddata = this.onPlay;
        video.srcObject = stream;
        benchmark.clearStats();
        this.setState({video})
    }

    componentWillUnmount = () => {
        utils.clearResultsContainer();
        this.setState = (state,callback)=>{
            return;
        };
    }

    onPlay = async () => {
        if (this.state.video.paused || this.state.video.ended) {
            return setTimeout(() => this.onPlay())
        }
        const canvas = document.createElement('canvas');
        canvas.width = this.state.video.videoWidth;
        canvas.height = this.state.video.videoHeight;
        canvas.getContext('2d').drawImage(this.state.video, 0, 0);
        const base64Image = canvas.toDataURL('image/png');
        await this.props.recognizeFaces(base64Image);
        setTimeout(() => this.onPlay(), 100)
    }

    render = () => null; 
}

export default WebCam;
