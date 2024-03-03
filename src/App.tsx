import './styles/App.css';

import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

import { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

import {
  load as cocoSSDLoad,
  type ObjectDetection,
} from '@tensorflow-models/coco-ssd';

import { drawRect } from './utils/drawRect';

let detectInterval: NodeJS.Timer;

const App = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function runCoco() {
    const net = await cocoSSDLoad();
    detectInterval = setInterval(() => {
      runObjectDetection(net);
    }, 10);
  }

  function showMyVideo() {
    if (
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const myVideoWidth = webcamRef.current.video.videoWidth;
      const myVideoHeight = webcamRef.current.video.videoHeight;
      webcamRef.current.video.width = myVideoWidth;
      webcamRef.current.video.height = myVideoHeight;
    }
  }

  async function runObjectDetection(net: ObjectDetection) {
    if (
      canvasRef.current &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;
      const detectedObjects = await net.detect(
        webcamRef.current.video,
        undefined,
        0.5,
      );
      console.log(detectedObjects);
      const context = canvasRef.current.getContext('2d');

      if (context) {
        drawRect(detectedObjects, context);
      }
    }
  }

  useEffect(() => {
    showMyVideo();
    runCoco();

    return () => clearInterval(detectInterval);
  }, []);

  return (
    <div className="wrapper">
      <div className="container">
        <Webcam ref={webcamRef} className="my-video" muted />
        <canvas ref={canvasRef} className="object-detection" />
      </div>
    </div>
  );
};

export default App;
