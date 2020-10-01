import React from 'react';
import { Navbar } from 'react-bootstrap';

function NavbarComponent(props) {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Face App</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    Running on Tensorflow: {props.tfBackend}
                </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>)
}

export default NavbarComponent;