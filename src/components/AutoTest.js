import React from 'react';
import { ProgressBar, Button } from 'react-bootstrap';

import * as constants from '../constants';

const IMAGE_SERVER_URL = constants.IMAGE_SERVER_URL;
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
            imageCount: 0,
            progress: 0,
            running: false,
            buttonVariant: BUTTON_SUCCESS_VARIANT,
            buttonLabel: START_TEST
        };
        this.startStopTest = this.startStopTest.bind(this);
    }

    componentDidUpdate() {
        //if (this.state.running) this.downloadNewImage();
    }

    downloadNewImage = async () => {
        if (!this.state.running) return;
        if (this.state.imageCount > 2) return;

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
        let buttonVariant = BUTTON_SUCCESS_VARIANT;
        let buttonLabel = START_TEST;
        let running = true;
        if (this.state.running) {
            buttonVariant = BUTTON_DANGER_VARIANT;
            buttonLabel = STOP_TEST;
            running = false;
        }
        this.setState({ buttonLabel, buttonVariant, running },
            () => this.downloadNewImage())
    }

    getNextImageURL = () => {
        let currentImageCount = this.state.imageCount + 1;
        let imageKey = currentImageCount.toString().padStart(4, '0');
        this.setState({
            imageCount: currentImageCount,
            progress: Math.round((currentImageCount / DATASET_SIZE) * 100)
        });
        let imageUrl = IMAGE_SERVER_URL + imageKey + IMAGE_SERVER_FORMAT;
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
                <p>Processing image {this.state.imageCount} out of {DATASET_SIZE}</p>
                <ProgressBar now={this.state.progress} label={`${this.state.progress}%`} />
            </div>
        )
    }
}

export default AnalyzeImage;