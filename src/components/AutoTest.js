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
        this.updateImageCount();
        utils.showAutoTestResults();
    }

    updateImageCount() {
        this.setState({ timeCount: utils.getCurrentAutoResultsFromLocalStorage().length });
    }

    downloadNewImage = async () => {
        if (!this.state.running) return;
        if (this.state.imageCount >= DATASET_SIZE) return;

        const imageUrl = await this.getNextImageURL();
        const base64Image = await utils.getBase64ImageFromUrl(imageUrl)

        await this.props.generateLandmarks(base64Image);
        await this.downloadNewImage();
    }

    startStopTest = async () => {
        this.updateImageCount();
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

    getNextImageURL = () => {
        utils.showAutoTestResults();
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
                <div className="autotest-buttons">
                    <Button
                        variant={this.state.buttonVariant}
                        onClick={this.startStopTest}
                    >
                        {this.state.buttonLabel}
                    </Button>{' '}
                    <Button
                        variant="info"
                        onClick={utils.clearAutoTestResults}
                        disabled={this.state.running}
                    >
                        CLEAR RESULTS
                    </Button>{' '}
                </div>
                <ProgressBar className="progressBar"
                    now={this.state.progress}
                    label={`${this.state.progress}%`}
                />
            </div>
        )
    }
}

export default AnalyzeImage;