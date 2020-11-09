import React from 'react';
import { Row, Col } from 'react-bootstrap';
import RecognizeForm from './RecognizeForm';
import RegisterForm from './RegisterForm';
import WebCam from './WebCam';

import * as faceApi from '../scripts/faceApi.js';
import * as utils from '../scripts/utils.js';

class Recognizer extends React.Component {

    constructor() {
        super();
        this.state = {
            labeledDescriptors: [],
            activateWebcam: false
        };
    }

    registerSubject = async (label, images) => {
        await faceApi.getLabeledDescriptors(label, images);
    }

    recognizeFaces = async (media) => {
        let canvas = await faceApi.createCanvasFromHtmlMedia(media)
        utils.showResultsInContainer(media, canvas);
    }

    changeWebcamState = (activateWebcam) => this.setState({activateWebcam});

    render() {
        return (
            <div>
                <Row>
                    <Col>
                        <h2>Register</h2>
                        <RegisterForm 
                            registerSubject={this.registerSubject}
                        />
                    </Col>
                    <Col>
                        <h2>Recognize</h2>
                        <RecognizeForm 
                            recognizeFaces={this.recognizeFaces}
                            changeWebcamState={this.changeWebcamState}
                        />
                    </Col>
                </Row>
                <Row>
                    {this.state.activateWebcam &&
                        <WebCam recognizeFaces={this.recognizeFaces}/>
                    }
                </Row>
                <div id="resultsContainer"></div>
            </div>
        )

    }
}

export default Recognizer;
