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
        let descriptors = await faceApi.getLabeledDescriptors(label, images);
        let newLabeledDescriptors = this.state.labeledDescriptors;
        newLabeledDescriptors.push(descriptors);
        this.setState({
            labeledDescriptors: newLabeledDescriptors
        });
    }

    recognizeFaces = async (image) => {
        let canvas = await faceApi.createCanvasFromHtmlImage(image)
        const detections = await faceApi.getAllDetectionsForImage(image);
        if(this.state.labeledDescriptors.length > 0) {
            const labeledDetections = await faceApi.detectSubjectsInImage(detections, this.state.labeledDescriptors);
            await faceApi.drawLabeledDetectionsInCanvas(detections, labeledDetections, canvas);
        }else{
            await faceApi.drawDetectionsInCanvas(canvas, detections);
        }
        utils.showResultsInContainer(image, canvas);
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
                        <WebCam />
                    }
                </Row>
                <div id="resultsContainer"></div>
            </div>
        )

    }
}

export default Recognizer;
