import React from 'react';

import * as utils from '../../scripts/utils.js';
import * as benchmark from '../../scripts/benchmark.js';

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
        const stream = await navigator.mediaDevices.getUserMedia({ video: {width: 192, height: 192,facingMode: "user"}, audio: false });
        const video = document.getElementById("resultVideo");
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
        await this.props.recognizeFaces({media: this.state.video, isImage: false});
        this.props.updateTimeStats(Date.now() - ts);

        setTimeout(() => this.onPlay())
    }

    render = () => null; 
}

export default WebCam;
