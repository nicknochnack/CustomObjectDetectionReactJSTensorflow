import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";

function App() {
  // Setup webcam refs
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runCoco = async () => {
    // Load hosted model
    console.log('Loading model')
    const net = await tf.loadGraphModel('YOUR HOSTED MODEL HERE')
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Reshape image data
      const img = tf.browser.fromPixels(video)
      const resized = tf.image.resizeBilinear(img, [640,480]).cast('int32')
      
      // Execute prediction
      const obj = await net.executeAsync(resized.expandDims(0))
      
      // Extract boxes, classes and scores
      const boxes = await obj[1].array()  
      const classes = await obj[2].array()
      const scores = await obj[4].array()
      
      // Cleanup 
      img.dispose()
      resized.dispose()

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(boxes[0], classes[0], scores[0], 0.9, videoWidth, videoHeight, ctx); 
    }
  };

  useEffect(()=>{runCoco()},[]);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
