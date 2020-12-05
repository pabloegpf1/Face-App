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
        const stream = await navigator.mediaDevices.getUserMedia({ video: {"height":{"exact":300},"mediaSource":"camera","width":{"exact":300}} });
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
        if (this.state.video.paused || this.state.video.ended)
            return setTimeout(() => this.onPlay())

        const ts = Date.now();
        if(await this.props.recognizeFaces({media: this.state.video, isImage: false})){
            this.props.updateTimeStats(Date.now() - ts);
        }
        
        setTimeout(() => this.onPlay())
    }

    render = () => null; 
}

export default WebCam;
