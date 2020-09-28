import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as tf from '@tensorflow/tfjs';
import {setWasmPath} from '@tensorflow/tfjs-backend-wasm';
import * as faceapi from 'face-api.js';
import Recognizer from './components/Recognizer'

const MODEL_URL = './assets/models/'
const WASM_URL = '/assets/tfjs-backend-wasm.wasm'

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tensorflowReady: false,
            faceApiReady: false
        };
    }

    componentDidMount(){
        this.loadTensorFlow()
        .then(this.loadFaceApi());
    }

    loadTensorFlow(){
        return Promise.all([
            setWasmPath(WASM_URL),
            tf.setBackend('webgl'),
            tf.ready()
        ])
        .then(()=>this.setState({tensorflowReady: true}))
        .catch((error)=> console.error("Error loading TensorFlow"+error));
    }

    loadFaceApi(){
        return Promise.all([
            faceapi.loadSsdMobilenetv1Model(MODEL_URL),
            faceapi.loadFaceLandmarkModel(MODEL_URL),
            faceapi.loadFaceRecognitionModel(MODEL_URL)
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
                    <Recognizer />
                </div>
            );
        } 
    }
}

export default App;
