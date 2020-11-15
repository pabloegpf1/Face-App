import React from 'react';
import { Form, Button, Col, Spinner } from 'react-bootstrap';

import * as constants from '../../constants';

class RegisterSubjectForm extends React.Component {

    constructor() {
        super();
        this.state = {
            showSpinner: false,
            buttonText: constants.REGISTER_BUTTON_TEXT,
        };
    }

    handleSubjectLabelUpdate = (event) => {
        this.setState({subjectLabel: event.target.value})
    }

    handleSubjectImagesUpdate = (event) => {
        let imageUrls = [];
        [...event.target.files].forEach(imageFile => {
            const imageUrl = URL.createObjectURL(imageFile);
            imageUrls.push(imageUrl);
        });
        this.setState({subjectImages: imageUrls})
    }

    handleRegisterSubjectSubmit = async (event) => {
        event.preventDefault();
        this.setState({showSpinner: true, buttonText:constants.REGISTERING_BUTTON_TEXT});
        let images = [];
        this.state.subjectImages.forEach(imageUrl => {
            const image = document.createElement('img');
            image.src = imageUrl;
            images.push(image);
        });
        await this.props.registerSubject(this.state.subjectLabel, images);
        this.setState({showSpinner: false, buttonText:constants.REGISTER_BUTTON_TEXT});
    }

    render() {
        return (
            <Form id="registerSubjectForm" onSubmit={this.handleRegisterSubjectSubmit}>
                <Form.Row>
                    <Col>
                        <Form.Control 
                            type="text" 
                            placeholder="Name" 
                            onChange={this.handleSubjectLabelUpdate}
                        />
                    </Col>
                    <Col>
                        <Form.File 
                            id="subjectImages" 
                            label="Images of subject" 
                            onChange={this.handleSubjectImagesUpdate}
                            custom
                            multiple
                        />
                    </Col>
                    <Col>
                        <Button id="subjectImagesSubmit" type="submit">
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

export default RegisterSubjectForm;