import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Recognizer from './components/Recognizer'
import Navbar from './components/NavBar';
import {loadTensorFlow, loadFaceApi} from './scripts/faceApi';

const BACKEND = new URLSearchParams(window.location.search).get('backend') || 'webgl';

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            tensorflowReady: false,
            faceApiReady: false
        };
    }

    componentDidMount(){
        loadTensorFlow(BACKEND)
        .then((tf) => this.setState({tensorflowReady: true, tfBackend: tf.getBackend()}))
        .then(() => loadFaceApi())
        .then(() => this.setState({faceApiReady: true}))
        .catch((error) => console.error("Error loading TensorFlow"+error));
    }

    render() {
        if(!this.state.tensorflowReady){
            return (<p>Loading TensorFlow...</p>)
        }
        if(!this.state.faceApiReady){
            return (<p>Loading FaceApi...</p>)
        }
        else{
            return (
                <div className="App">
                    <Navbar tfBackend={this.state.tfBackend}/>
                    <Recognizer />
                </div>
            );
        } 
    }
}

export default App;
