import React from 'react';
import { Row, Col } from 'react-bootstrap';
import RecognizeForm from './RecognizeForm';
import RegisterForm from './RegisterForm';
import WebCam from './WebCam';

import * as faceApi from '../../scripts/faceApi.js';
import * as utils from '../../scripts/utils.js';

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

    recognizeFaces = async ({media, isImage}) => {
        let canvas = await faceApi.createCanvasFromHtmlMedia({media, isImage});
        utils.showResultsInContainer({media, canvas, isImage});
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
                {this.state.activateWebcam &&
                    <WebCam 
                        recognizeFaces={this.recognizeFaces}
                        updateTimeStats={this.props.updateTimeStats}
                    />
                }
            </div>
        )

    }
}

export default Recognizer;
