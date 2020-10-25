import React from 'react';
import { Navbar, ButtonGroup, Button } from 'react-bootstrap';

function NavbarComponent(props) {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Face App</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
                <ButtonGroup size="sm" className="mb-2">
                    <Button 
                        href={backendUrl("webgl")} 
                        disabled={props.tfBackend==="webgl"}
                    >webgl</Button>
                    <Button 
                        href={backendUrl("cpu")} 
                        disabled={props.tfBackend==="cpu"}
                    >cpu</Button>
                    <Button 
                        href={backendUrl("wasm")} 
                        disabled={props.tfBackend==="wasm"}
                    >wasm</Button>
                </ButtonGroup>
            </Navbar.Collapse>
        </Navbar>)
}

function backendUrl(backend){
    console.log(backend)
    return window.location.origin + "/Face-App?backend=" + backend;
}

export default NavbarComponent;