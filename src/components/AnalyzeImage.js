import React from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

import * as constants from '../constants';

class AnalyzeImage extends React.Component {

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
        this.setState({
            showSpinner:true, 
            processImageButtonText: constants.PROCESSING_IMAGE_BUTTON_TEXT
        });
        const image = document.createElement('img');
        image.src = this.state.imageUrl;
        await this.props.recognizeFaces({media: image, isImage: true});
        this.setState({
            showSpinner:false, 
            processImageButtonText:constants.PROCESS_IMAGE_BUTTON_TEXT
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
            <Form id="analyzeImageForm" onSubmit={this.handleProcessImageSubmit}>
                <Form.Group>
                    <Form.File 
                        type="file" 
                        id="processImage" 
                        label="Image to process"
                        onChange={this.handleImageUpdate}
                        custom
                    />
                </Form.Group>
                <Form.Group>
                    <Button id="processImageSubmit" type="submit" disabled={this.state.showWebcam}>
                        {this.state.processImageButtonText+" "}
                        <Spinner
                            animation="border"
                            size="sm"
                            hidden={!this.state.showSpinner}
                        />
                    </Button>
                </Form.Group>
            </Form>
        )
    }
}

export default AnalyzeImage;