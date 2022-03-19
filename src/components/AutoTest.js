import React from 'react';
import { ProgressBar, Button } from 'react-bootstrap';

import * as constants from '../constants';
import * as utils from '../scripts/utils';

const IMAGE_PATH = constants.IMAGE_PATH;
const IMAGE_SERVER_FORMAT = constants.IMAGE_SERVER_FORMAT;
const DATASET_SIZE = constants.DATASET_SIZE;
const BUTTON_DANGER_VARIANT = constants.BUTTON_DANGER_VARIANT;
const BUTTON_SUCCESS_VARIANT = constants.BUTTON_SUCCESS_VARIANT;
const START_TEST = constants.START_TEST;
const STOP_TEST = constants.STOP_TEST;

class AnalyzeImage extends React.Component {

    constructor() {
        super();
        this.state = {
            progress: 0,
            running: false,
            buttonVariant: BUTTON_SUCCESS_VARIANT,
            buttonLabel: START_TEST
        };
        this.startStopTest = this.startStopTest.bind(this);
    }

    componentDidMount() {
        let timeCount = utils.getItemFromLocalStorage("timeCount");
        if (!timeCount) timeCount = 0;
        this.setState({ timeCount });
    }

    downloadNewImage = async () => {
        if (!this.state.running) return;
        if (this.state.imageCount >= DATASET_SIZE) return;

        const imageUrl = await this.getNextImageURL();
        const base64Image = await this.getBase64ImageFromUrl(imageUrl)

        await this.props.generateLandmarks(base64Image);
        await this.downloadNewImage();
        return;
    }

    getBase64ImageFromUrl = async (imageUrl) => {
        const image = document.createElement("img");
        image.src = imageUrl;
        image.crossOrigin = "anonymous"
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext('2d').drawImage(image, 0, 0);
        return canvas.toDataURL('image/png');
    }

    startStopTest = async () => {
        let buttonVariant = BUTTON_DANGER_VARIANT;
        let buttonLabel = STOP_TEST;
        let running = true;
        if (this.state.running) {
            buttonVariant = BUTTON_SUCCESS_VARIANT;
            buttonLabel = START_TEST;
            running = false;
        }
        this.setState({ buttonLabel, buttonVariant, running },
            () => this.downloadNewImage())
    }

    clearResults = async () => {
        let timeCount = 0;
        let times = [];
        utils.setItemInLocalStorage("timeCount", timeCount);
        utils.setItemInLocalStorage("timeArray", times);
        this.setState({ timeCount, times });
    }

    getNextImageURL = () => {
        console.log(this.state.timeCount)
        let currentTimeCount = this.state.timeCount + 1;
        this.setState({
            timeCount: currentTimeCount,
            progress: Math.round((currentTimeCount / DATASET_SIZE) * 100)
        });
        let imageUrl = process.env.PUBLIC_URL +
            IMAGE_PATH +
            currentTimeCount +
            IMAGE_SERVER_FORMAT;
        return imageUrl;
    }

    render() {
        return (
            <div className="center">
                <Button
                    variant={this.state.buttonVariant}
                    onClick={this.startStopTest}
                >
                    {this.state.buttonLabel}
                </Button>{' '}
                <Button
                    variant="info"
                    onClick={this.clearResults}
                >
                    CLEAR RESULTS
                </Button>{' '}
                <p>Processing image {this.state.timeCount} out of {DATASET_SIZE}</p>
                <ProgressBar now={this.state.progress} label={`${this.state.progress}%`} />
            </div>
        )
    }
}

export default AnalyzeImage;