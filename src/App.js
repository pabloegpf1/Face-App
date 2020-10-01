import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as tf from '@tensorflow/tfjs';
import {setWasmPaths} from '@tensorflow/tfjs-backend-wasm';
import * as faceapi from 'face-api.js';
import Recognizer from './components/Recognizer'
import Navbar from './components/NavBar';


const TF_BACKEND = 'webgl'; //wasm - webgl - cpu
const MODEL_PATH = './models/'
const WASM_PATH = './wasm/'

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            tensorflowReady: false,
            faceApiReady: false
        };
    }

    componentDidMount(){
        this.loadTensorFlow()
        .then(() => this.setState({tensorflowReady: true, tfBackend: tf.getBackend()}))
        .then(() => this.loadFaceApi())
        .catch((error) => console.error("Error loading TensorFlow"+error));
    }

    async loadTensorFlow(){
        setWasmPaths(WASM_PATH);
        await tf.setBackend(TF_BACKEND)
        return tf.ready()
    }

    loadFaceApi(){
        return Promise.all([
            faceapi.loadTinyFaceDetectorModel(MODEL_PATH),
            faceapi.loadFaceLandmarkTinyModel(MODEL_PATH),
            faceapi.loadFaceRecognitionModel(MODEL_PATH)
        ])
        .then(()=>this.setState({faceApiReady: true}))
        .catch((error)=> console.error("Error loading Faceapi"+error));
    }

    render() {
        if(!this.state.tensorflowReady){
            return (<p>Loading TensorFlow (WASM)...</p>)
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
