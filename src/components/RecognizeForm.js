import React from 'react';
import { Form, Button, Col, Spinner } from 'react-bootstrap';

import * as constants from '../constants';

class ProcessImageForm extends React.Component {

    constructor() {
        super();
        this.state = {
            showSpinner: false,
            showWebcam: false,
            processImageButtonText: constants.PROCESS_IMAGE_BUTTON_TEXT,
            webcamButtonText: constants.WEBCAM_ON_BUTTON_TEXT,
            webcamButtonVariant: constants.BUTTON_SUCCESS_VARIANT,
        };
    }

    handleProcessImageSubmit = async (event) => {
        event.preventDefault();
        this.setState({showSpinner:true, buttonText: constants.PROCESSING_IMAGE_BUTTON_TEXT});
        const image = document.createElement('img');
        image.src = this.state.imageUrl;
        await this.props.recognizeFaces(image);
        this.setState({
            showSpinner:false, 
            buttonText:constants.PROCESS_IMAGE_BUTTON_TEXT
        });
    }

    handleImageUpdate = async (event) => {
        event.preventDefault();
        this.setState({
            imageUrl: URL.createObjectURL(event.target.files[0])
        })
    }

    changeWebcamState = () => {
        const newWebcamState = !this.state.showWebcam
        this.props.changeWebcamState(newWebcamState);
        this.setState({
            showWebcam: newWebcamState,
            webcamButtonText: newWebcamState ? constants.WEBCAM_OFF_BUTTON_TEXT : constants.WEBCAM_ON_BUTTON_TEXT,
            webcamButtonVariant: newWebcamState ? constants.BUTTON_DANGER_VARIANT : constants.BUTTON_SUCCESS_VARIANT
        })
    }

    render() {
        return (
            <Form id="processImageForm" onSubmit={this.handleProcessImageSubmit}>
                <Form.Row>
                    <Col>
                        <Form.File 
                            type="file" 
                            id="processImage" 
                            label="Image to process"
                            onChange={this.handleImageUpdate}
                            custom
                        />
                    </Col>
                    <Col>
                        <Button id="processImageSubmit" type="submit">
                            {this.state.processImageButtonText+" "}
                            <Spinner
                                animation="border"
                                size="sm"
                                hidden={!this.state.showSpinner}
                            />
                        </Button>
                        &nbsp;
                        <Button onClick={this.changeWebcamState} variant={this.state.webcamButtonVariant}>
                            {this.state.webcamButtonText+" "}
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
        )
    }
}

export default ProcessImageForm;