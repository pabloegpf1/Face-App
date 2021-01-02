import React from 'react';
import { Navbar, ButtonGroup, Button, DropdownButton, Dropdown } from 'react-bootstrap';

import * as constants from '../constants';

function NavbarComponent(props) {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Face App</Navbar.Brand>
            <DropdownButton title="Tools">
                <Dropdown.Item onClick={() => props.changeCurrentTool(constants.WEBCAM_TOOL_KEY)}>
                    Webcam
                </Dropdown.Item>
                <Dropdown.Item onClick={() => props.changeCurrentTool(constants.REGISTER_FACE_TOOL_KEY)}
                    disabled = {props.tfBackend===constants.SERVER_BACKEND}
                >
                    Register face
                </Dropdown.Item>
                <Dropdown.Item onClick={() => props.changeCurrentTool(constants.ANALYZE_IMAGE_TOOL_KEY)} disabled = "true">
                    Analyze image
                </Dropdown.Item>
            </DropdownButton>
            <Navbar.Collapse className="justify-content-end">
                <ButtonGroup size="sm" className="mb-2">
                    <Button 
                        href={backendUrl(constants.WEBGL_BACKEND)} 
                        disabled={props.tfBackend===constants.WEBGL_BACKEND}
                    >webgl</Button>
                    <Button 
                        href={backendUrl(constants.CPU_BACKEND)} 
                        disabled={props.tfBackend===constants.CPU_BACKEND}
                    >cpu</Button>
                    <Button 
                        href={backendUrl(constants.WASM_BACKEND)} 
                        disabled={props.tfBackend===constants.WASM_BACKEND}
                    >wasm</Button>
                    <Button 
                        href={backendUrl(constants.SERVER_BACKEND)} 
                        disabled={props.tfBackend===constants.SERVER_BACKEND}
                    >server</Button>
                </ButtonGroup>
            </Navbar.Collapse>
        </Navbar>)
}

const backendUrl = (backend) => window.location.origin + constants.BASE_URL + backend;

export default NavbarComponent;