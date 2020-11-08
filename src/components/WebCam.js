import React from 'react';

import * as faceApi from '../scripts/faceApi.js';
import * as utils from '../scripts/utils.js';
import * as constants from '../constants';

class WebCam extends React.Component {

    constructor() {
        super();
        this.state = {
            forwardTimes: [],
        };
    }

    componentDidMount = () => {
        const video = document.getElementById(constants.VIDEO_ID);
        this.setState({video})
        this.initWebCam(video);
    }

    initWebCam = async (video) => {
        utils.showResultsInContainer(video);
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
    }

    componentWillUnmount = () => {
        this.setState = (state,callback)=>{
            return;
        };
    }

    onPlay = async () => {
        
        if(!this.state.video) return;
        if (this.state.video.paused || this.state.video.ended)
            return setTimeout(() => this.onPlay())

        const ts = Date.now()
        const detection = await faceApi.getDetectionForImage(this.state.video);
        this.updateTimeStats(Date.now() - ts)

        if (detection) {
            const canvas = await faceApi.createCanvasFromHtmlVideo(this.state.video, detection);
            utils.showResultsInContainer(this.state.video, canvas);
        }

        setTimeout(() => this.onPlay())
    }

    updateTimeStats(timeInMs) {
        const forwardTimes = [timeInMs].concat(this.state.forwardTimes).slice(0, 30);
        const avgTime = Math.round(forwardTimes.reduce((total, t) => total + t) / forwardTimes.length);
        const fps = Math.round(1000 / avgTime);
        this.setState({
            forwardTimes,
            avgTime,
            fps
        });
    }

    render() {
        return (
            <div>
                <video 
                    onLoadedMetadata={this.onPlay} 
                    id={constants.VIDEO_ID }
                    autoPlay muted playsInline
                ></video>
                <p>{`TIME: ${this.state.avgTime} ms`}</p>
                <p>{`FPS: ${this.state.fps} ms`}</p>
            </div>
        )
    }
}

export default WebCam;