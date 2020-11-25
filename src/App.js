import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegisterFace from './components/RegisterFace';
import AnalyzeImage from './components/AnalyzeImage';
import WebCam from './components/WebCam';

import Navbar from './components/NavBar';
import Results from './components/Results';

import {loadTensorFlow, loadFaceApi} from './scripts/faceApi';
import * as benchmark from './scripts/benchmark.js';
import * as faceApi from './scripts/faceApi.js';
import * as utils from './scripts/utils.js';
import * as constants from './constants.js';

const BACKEND = new URLSearchParams(window.location.search).get('backend') || 'webgl';

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            tensorflowReady: false,
            faceApiReady: false,
            currentTool: constants.WEBCAM_TOOL_KEY
        };
    }

    componentDidMount(){
        loadTensorFlow(BACKEND)
        .then((tf) => this.setState({tensorflowReady: true, tfBackend: tf.getBackend()}))
        .then(() => loadFaceApi())
        .then(() => this.setState({faceApiReady: true}))
        .catch((error) => console.error(constants.FACE_API_ERROR_TEXT, error));
    }

    updateTimeStats = (newTime) => {
        const stats = benchmark.getStatsFromTime(newTime);
        this.setState({stats});
    }

    registerSubject = async (label, images) => {
        await faceApi.getLabeledDescriptors(label, images);
    }

    recognizeFaces = async ({media, isImage}) => {
        let canvas = await faceApi.createCanvasFromHtmlMedia({media, isImage});
        utils.showResultsInContainer({media, canvas, isImage});
    }

    changeCurrentTool = (currentTool) => {
        utils.clearResultsContainer();
        this.setState({currentTool});
    } 

    getCurrentTool = () => {
        switch (this.state.currentTool) {
            case constants.WEBCAM_TOOL_KEY:
                return (
                    <WebCam 
                        recognizeFaces={this.recognizeFaces}
                        updateTimeStats={this.updateTimeStats}
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
        if(!this.state.tensorflowReady){
            return (<p>Loading TensorFlow...</p>)
        }
        if(!this.state.faceApiReady){
            return (<p>Loading FaceApi...</p>)
        }
        else{
            return (
                <div className="App">
                    <Navbar 
                        changeCurrentTool={this.changeCurrentTool}
                        tfBackend={this.state.tfBackend} 
                        stats={this.state.stats}
                    />
                    <div className="center">
                        {this.getCurrentTool()}
                    </div>
                    <Results/>
                </div>
            );
        } 
    }
}

export default App;
