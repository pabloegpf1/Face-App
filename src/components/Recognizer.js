import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Navbar from './NavBar';
import ProcessImageForm from './ProcessImageForm';
import RegisterSubjectForm from './RegisterSubjectForm';

import * as faceApi from '../scripts/faceApi.js';

class Recognizer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            labeledDescriptors: []
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
        this.showResultsInContainer(image, canvas);
    }

    showResultsInContainer(image, canvas){
        const containerDiv = document.getElementById('resultsContainer');
        containerDiv.innerHTML = "";
        containerDiv.append(image);
        containerDiv.append(canvas);
    }

    render() {
        return (
            <div>
                <Navbar />
                <Row>
                    <Col>
                        <h2>Register subject</h2>
                        <RegisterSubjectForm 
                            registerSubject={this.registerSubject}
                        />
                    </Col>
                    <Col>
                        <h2>Identify people</h2>
                        <ProcessImageForm 
                            recognizeFaces={this.recognizeFaces}
                        />
                    </Col>
                </Row>
                <div id="resultsContainer"></div>
            </div>
        )

    }
}

export default Recognizer;
