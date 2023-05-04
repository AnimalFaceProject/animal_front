import React, {useState, useEffect, useRef} from "react";
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

const MainComponent = () => {

    {/**
    useEffect(() => {
        init();
      }, []);
 */}
     // the link to your model provided by Teachable Machine export panel
     const URL = "https://teachablemachine.withgoogle.com/models/MOKr2fQhl/";
     const modelURL = URL + 'model.json';
     const metadataURL = URL + 'metadata.json';

     let model, webcam, labelContainer, maxPredictions;

     // Load the image model and setup the webcam
     async function init() {
         // load the model and metadata
         // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
         // or files from your local hard drive
         // Note: the pose library adds "tmImage" object to your window (window.tmImage)
         model = await tmImage.load(modelURL, metadataURL);
         maxPredictions = model.getTotalClasses();

         // Convenience function to setup a webcam
         const flip = true; // whether to flip the webcam
         webcam = new tmImage.Webcam(800, 800, flip); // width, height, flip
         await webcam.setup(); // request access to the webcam
         await webcam.play();
         window.requestAnimationFrame(loop);

         // append elements to the DOM
         document.getElementById("webcam-container").appendChild(webcam.canvas);
         labelContainer = document.getElementById("label-container");
         for (let i = 0; i < maxPredictions; i++) { // and class labels
             labelContainer.appendChild(document.createElement("div")).className="bg-orange-100 flex w-full";
         }
     }
 
     async function loop() {
         webcam.update(); // update the webcam frame
         await predict();
         //return
         window.requestAnimationFrame(loop);
     }
 
     // run the webcam image through the image model
     async function predict() {
         // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);
         for (let i = 0; i < 6; i++) {
            var barWidth = prediction[i].probability.toFixed(2)*100 + "%";
            var labelTitle = prediction[i].className;
            var animalName = "<div className=''>" + labelTitle + "</div>"
            var animmalBar = "<div class='w-full bg-gray-200 rounded-full'><div class='bg-blue-600 h-full text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
            var animmalBar2 = "<div class='w-full bg-gray-200 rounded-full'><div class='bg-blue-600 h-full text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
            labelContainer.childNodes[i].innerHTML = animalName + animmalBar;
         }
     }
     
    return(
    <div className = "flex w-full h-full bg-white">
        <div className = "w-1/5 h-full bg-black"></div>
        <div className = "w-3/5 h-full bg-white">
            <button type="button" onClick={init}>Start</button>
            <div id="webcam-container" className = "w-full"></div>
            <div id="label-container" className = "w-full bg-slate-50 rounded-lg flex-col"></div>
        </div>
        <div className = "w-1/5 h-full bg-slate-500"></div>
    </div>
    )
}
export default MainComponent;

