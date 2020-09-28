import React from 'react';
import {  Form, Button, Col, Spinner } from 'react-bootstrap';

const defaultProcessImageButtonText = "Process Image";

class ProcessImageForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showSpinner: false,
            buttonText: defaultProcessImageButtonText,
        };
    }

    handleProcessImageSubmit = async (event) => {
        event.preventDefault();
        this.setState({showSpinner:true, buttonText:"Processing image..."});
        const image = document.createElement('img');
        image.src = this.state.imageUrl;
        await this.props.recognizeFaces(image);
        this.setState({showSpinner:false, buttonText:defaultProcessImageButtonText});
    }

    handleImageUpdate = async (event) => {
        event.preventDefault();
        this.setState({
            imageUrl: URL.createObjectURL(event.target.files[0])
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
                            {this.state.buttonText+" "}
                            <Spinner
                                animation="border"
                                size="sm"
                                hidden={!this.state.showSpinner}
                            />
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
        )
    }
}

export default ProcessImageForm;