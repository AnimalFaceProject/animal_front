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
             labelContainer.appendChild(document.createElement("div")).className="flex w-full h-10 bg-white";
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
            var animalName = "<div class='w-40 h-full'>" + labelTitle + "</div>"
            var animmalBar1 = "<div class='w-full h-full bg-[#f0bcd4] rounded-lg'><div class='bg-[#FF99C8] h-full text-md font-medium text-black text-center p-0.5 leading-none rounded-lg' style='width: " + barWidth + " '><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
            var animmalBar2 = "<div class='w-full h-full bg-[#faf7dd] rounded-lg'><div class='bg-[#FCF6BD] h-full text-md font-medium text-black text-center p-0.5 leading-none rounded-lg' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
            var animmalBar3 = "<div class='w-full h-full bg-[#ddefe4] rounded-lg'><div class='bg-[#aef4c9] h-full text-md font-medium text-black text-center p-0.5 leading-none rounded-lg' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
            var animmalBar4 = "<div class='w-full h-full bg-[#ceeaf8] rounded-lg'><div class='bg-[#A9DEF9] h-full text-md font-medium text-black text-center p-0.5 leading-none rounded-lg' style='width : " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
            var animmalBar5 = "<div class='w-full h-full bg-[#ebd8f7] rounded-lg'><div class='bg-[#E4C1F9] h-full text-md font-medium text-black text-center p-0.5 leading-none rounded-lg' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
            var animmalBar6 = "<div class='w-full h-full bg-sky-600 rounded-lg'><div class='bg-blue-600 h-full text-md font-medium text-black text-center p-0.5 leading-none rounded-lg' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
            switch(i){
                case 0:
                    labelContainer.childNodes[i].innerHTML = animalName + animmalBar1;
                    break;
                case 1:
                    labelContainer.childNodes[i].innerHTML = animalName + animmalBar2;
                    break;
                case 2:
                    labelContainer.childNodes[i].innerHTML = animalName + animmalBar3;
                    break;
                case 3:
                    labelContainer.childNodes[i].innerHTML = animalName + animmalBar4;
                    break;
                case 4:
                    labelContainer.childNodes[i].innerHTML = animalName + animmalBar5;
                    break;
                case 5:
                    labelContainer.childNodes[i].innerHTML = animalName + animmalBar6;
                    break;
                default :
                    console.log(i);
                    break;
            }
            //labelContainer.childNodes[i].innerHTML = animalName + animmalBar;
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

