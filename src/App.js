import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegisterFace from './components/RegisterFace';
import AnalyzeImage from './components/AnalyzeImage';
import AutoTest from './components/AutoTest';
import WebCam from './components/WebCam';

import Navbar from './components/NavBar';
import Results from './components/Results';

import * as benchmark from './scripts/benchmark.js';
import * as faceApi from './scripts/faceApiWrapper.js';
import * as utils from './scripts/utils.js';
import * as constants from './constants.js';

const BACKEND = utils.getSelectedBackend();

let faceApiServer;

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            tensorflowReady: false,
            faceApiReady: false,
            currentTool: constants.WEBCAM_TOOL_KEY
        };
    }

    componentDidMount() {
        if (BACKEND === constants.SERVER_BACKEND) {
            faceApiServer = require('./scripts/faceApiServer.js');
        } else {
            this.loadFaceApi();
        }
    }

    loadFaceApi = () => {
        faceApi.loadTensorFlow(BACKEND)
            .then((tf) => this.setState({ tensorflowReady: true, tfBackend: tf.getBackend() }))
            .then(() => faceApi.loadFaceApi())
            .then(() => this.setState({ faceApiReady: true }))
            .catch((error) => console.error(constants.FACE_API_ERROR_TEXT, error));
    }

    updateTimeStats = (newTime) => {
        const stats = benchmark.getStatsFromTime(newTime);
        this.setState({ stats });
    }

    registerSubject = async (label, images) => {
        await faceApi.getLabeledDescriptors(label, images);
    }

    recognizeFaces = async (base64image) => {
        const ts = Date.now();
        let successfulDetection = false;
        if (BACKEND === constants.SERVER_BACKEND) {
            successfulDetection = await faceApiServer.recognize(base64image, this.updateTimeStats);
        } else {
            successfulDetection = await faceApi.recognize(base64image);
        }
        if (successfulDetection) {
            this.updateTimeStats(Date.now() - ts);
        }
    }

    generateLandmarks = async (base64image) => {
        const { result, time } = await faceApi.generateLandmarks(base64image);
        if (result) utils.storeAutoTestResult(time);
    }

    changeCurrentTool = (currentTool) => {
        utils.clearResultsContainer();
        this.setState({ currentTool, stats: null });
    }

    getStatsText = () => {
        if (!this.state.stats) return;
        return `First Frame: ${this.state.stats.firstFrame} ms` +
            ` | Average Time: ${this.state.stats.averageTime} ms` +
            ` | New Time: ${this.state.stats.newTime} ms` +
            ` | ${this.state.stats.fps} fps`
    }

    getCurrentTool = () => {
        switch (this.state.currentTool) {
            case constants.AUTOTEST_TOOL_KEY:
                return (
                    <AutoTest
                        generateLandmarks={this.generateLandmarks}
                        changeWebcamState={this.changeWebcamState}
                    />
                )
            case constants.WEBCAM_TOOL_KEY:
                return (
                    <WebCam
                        recognizeFaces={this.recognizeFaces}
                    />
                )
            case constants.REGISTER_FACE_TOOL_KEY:
                return (
                    <RegisterFace
                        registerSubject={this.registerSubject}
                    />
                )
            case constants.ANALYZE_IMAGE_TOOL_KEY:
                return (
                    <AnalyzeImage
                        recognizeFaces={this.recognizeFaces}
                        changeWebcamState={this.changeWebcamState}
                    />
                )
            default:
                break;
        }
    }

    render() {
        if (!this.state.tensorflowReady && BACKEND !== constants.SERVER_BACKEND) {
            return (<p>Loading TensorFlow...</p>)
        }
        if (!this.state.faceApiReady && BACKEND !== constants.SERVER_BACKEND) {
            return (<p>Loading FaceApi...</p>)
        }
        else {
            return (
                <div className="App">
                    <Navbar
                        changeCurrentTool={this.changeCurrentTool}
                        tfBackend={this.state.tfBackend || BACKEND}
                    />
                    <div className="center">
                        {this.getCurrentTool()}
                    </div>
                    <Results />
                    <p className="stats">
                        {this.getStatsText()}
                    </p>
                </div>
            );
        }
    }
}

export default App;
