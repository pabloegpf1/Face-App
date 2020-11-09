import React from 'react';

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
        const video = document.getElementById(constants.VIDEO_ID);
        video.src = null;
        //video.remove();
        utils.cleanResultsContainer();
        this.setState = (state,callback)=>{
            return;
        };
    }

    onPlay = async () => {
        
        if(!this.state.video) return;
        if (this.state.video.paused || this.state.video.ended)
            return setTimeout(() => this.onPlay())

        const ts = Date.now();
        await this.props.recognizeFaces(this.state.video, true)
        this.updateTimeStats(Date.now() - ts);

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
                <p>{`TIME: ${this.state.avgTime || "-"} ms`}</p>
                <p>{`FPS: ${this.state.fps || "-"} fps`}</p>
            </div>
        )
    }
}

export default WebCam;
