import React from 'react';
import { Navbar, ButtonGroup, Button } from 'react-bootstrap';

import * as constants from '../constants';

function NavbarComponent(props) {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Face App</Navbar.Brand>
            {props.stats &&
                <Navbar.Text>
                    {"First frame: " + props.stats.firstFrame}
                    {" | Average Time: " + props.stats.averageTime + " ms"}
                    {" | " + props.stats.fps + " fps"}
                </Navbar.Text>
            }
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
                </ButtonGroup>
            </Navbar.Collapse>
        </Navbar>)
}

function backendUrl(backend){
    return window.location.origin + constants.BASE_URL + backend;
}

export default NavbarComponent;