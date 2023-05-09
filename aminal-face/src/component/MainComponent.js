import React, {useState, useEffect, useRef} from "react";
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';
import test from '../test.png'

const MainComponent = () => {

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/MOKr2fQhl/";
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    let model, webcam, labelContainer, maxPredictions, requestId;
    var prediction;

    const [count, setCount] = useState(6);

    const time = useRef(null);

    const timer = () =>{
        time.current = 6;
        const id = setInterval(() => {
            setCount(count => count -1);
            time.current = time.current - 1;
          }, 1000);
      
          return () => clearInterval(id);
    }

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
         webcam = new tmImage.Webcam(600, 600, flip); // width, height, flip
         await webcam.setup(); // request access to the webcam
         await webcam.play();
         requestId = window.requestAnimationFrame(loop);
         
         // append elements to the DOM
         document.getElementById("webcam-container").appendChild(webcam.canvas).className = "w-full h-full"
         labelContainer = document.getElementById("label-container");
         for (let i = 0; i < maxPredictions; i++) { // and class labels
             labelContainer.appendChild(document.createElement("div")).className="flex w-full h-10 bg-white";
         }
     }
 
     async function loop() {
        await console.log(time.current);
        if(time.current<=-1) {
            document.getElementById('webcam-container').remove();
            insertImage(prediction[0].className);
            content(prediction[0].className);
            return;
        }
        webcam.update(); // update the webcam frame
        await predict();
        requestId = window.requestAnimationFrame(loop);   
     }
 
     // run the webcam image through the image model
    const predict = async () =>{
         // predict can take in an image, video or canvas html element

        prediction = await model.predict(webcam.canvas);
        prediction.sort((a,b) => parseFloat(b.probability) - parseFloat(a.probability));

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
         }
     }
     function content(title){
        switch(title){
            case "사슴상": 
            document.getElementById("first-name").innerHTML = "사슴상";
            document.getElementById("content").innerHTML = "\
            선도자는 진실함과 이타주의 등 자신의 가치관을 적극적으로 설파하며, 부당하거나 잘못된 일이라고 생각이 되면 이에 반대의 목소리를 냅니다. \
            그러나 보통은 성급하게 자기 생각을 강요하기보다는 세심함과 통찰력으로 다른 사람의 공감을 이끌어내는 방법을 선택할 때가 많습니다.\
            선도자는 다른 사람의 의도와 믿음을 간파하는 데 놀라운 소질이 있으며, 가끔씩은 자신도 눈치채지 정도로 빠르게 다른 사람의 생각과 감정을 파악하곤 합니다. \
            이렇게 번뜩이는 통찰력은 남을 설득하고 다른 사람에게 의욕을 불어넣는 데 큰 도움이 됩니다.";
            document.getElementById("content-character").innerHTML = "ENFJ 연예인 : 강다니엘 공명 수호(EXO) 박소담 우기(아이들) 신민아 신세경"
            break;
            case "꼬부기상": 
            document.getElementById("first-name").innerHTML = "꼬부기상";
            document.getElementById("content").innerHTML = "\
            활동가는 친절하고 사교적인 성격으로 다른 사람과의 관계를 맺는 일과 사교 활동을 즐깁니다. \
            하지만 사교적이고 느긋해 보이는 겉모습과 달리 깊은 내면을 지니고 있으며 상상력과 창의력이 풍부하고 호기심이 많은 성격입니다.\
            활동가는 자기 성찰적인 모습을 보일 때가 있으며, 다른 일에 주의를 기울여야 할 때도 삶의 근본적인 의미와 중요성에 대해 생각하곤 합니다. \
            또한 모든 사물과 사람이 연결되어 있다고 믿으며 이러한 관계에 대한 통찰을 추구합니다.";
            document.getElementById("content-character").innerHTML = "ENFP 연예인 : 강민경 로제(BLACKPINK) 박준형(god) 비비 송민호 싸이 사나(TWICE) 유나(ITZY) 이효리 하하"
            break;
            case "고양이상": 
            document.getElementById("first-name").innerHTML = "고양이상";
            document.getElementById("content").innerHTML = "\
            통솔자(ENTJ)는 타고난 지도자라고 할 수 있습니다. 이들은 카리스마와 자신감을 지니고 있으며 자신의 권한을 이용해 사람들이 공통된 목표를 위해 함께 노력하도록 이끕니다. \
            또한 이들은 냉철한 이성을 지닌 것으로 유명하며, 자신이 원하는 것을 성취하기 위해 열정과 결단력과 날카로운 지적 능력을 활용합니다. \
            이들은 전체 인구의 3%에 불과하지만 다른 많은 성격을 압도하는 존재감을 뽐내며, 많은 비즈니스와 단체를 이끄는 역할을 할 때가 많습니다.";
            document.getElementById("content-character").innerHTML = "ENTJ 연예인 : 곽동연 서현 스윙스 문가영 여진구 윤하 이특 키 마크툽"
            break;
            case "토끼상": 
            document.getElementById("first-name").innerHTML = "토끼상";
            document.getElementById("content").innerHTML = "\
            통솔자(ENTJ)는 타고난 지도자라고 할 수 있습니다. 이들은 카리스마와 자신감을 지니고 있으며 자신의 권한을 이용해 사람들이 공통된 목표를 위해 함께 노력하도록 이끕니다. \
            또한 이들은 냉철한 이성을 지닌 것으로 유명하며, 자신이 원하는 것을 성취하기 위해 열정과 결단력과 날카로운 지적 능력을 활용합니다. \
            이들은 전체 인구의 3%에 불과하지만 다른 많은 성격을 압도하는 존재감을 뽐내며, 많은 비즈니스와 단체를 이끄는 역할을 할 때가 많습니다.";
            document.getElementById("content-character").innerHTML = "ENTJ 연예인 : 곽동연 서현 스윙스 문가영 여진구 윤하 이특 키 마크툽"
            break;
            case "사막여우상": 
            document.getElementById("first-name").innerHTML = "사막여우상";
            document.getElementById("content").innerHTML = "\
            통솔자(ENTJ)는 타고난 지도자라고 할 수 있습니다. 이들은 카리스마와 자신감을 지니고 있으며 자신의 권한을 이용해 사람들이 공통된 목표를 위해 함께 노력하도록 이끕니다. \
            또한 이들은 냉철한 이성을 지닌 것으로 유명하며, 자신이 원하는 것을 성취하기 위해 열정과 결단력과 날카로운 지적 능력을 활용합니다. \
            이들은 전체 인구의 3%에 불과하지만 다른 많은 성격을 압도하는 존재감을 뽐내며, 많은 비즈니스와 단체를 이끄는 역할을 할 때가 많습니다.";
            document.getElementById("content-character").innerHTML = "ENTJ 연예인 : 곽동연 서현 스윙스 문가영 여진구 윤하 이특 키 마크툽"
            break;
            case "강아지상": 
            document.getElementById("first-name").innerHTML = "강아지상";
            document.getElementById("content").innerHTML = "\
            통솔자(ENTJ)는 타고난 지도자라고 할 수 있습니다. 이들은 카리스마와 자신감을 지니고 있으며 자신의 권한을 이용해 사람들이 공통된 목표를 위해 함께 노력하도록 이끕니다. \
            또한 이들은 냉철한 이성을 지닌 것으로 유명하며, 자신이 원하는 것을 성취하기 위해 열정과 결단력과 날카로운 지적 능력을 활용합니다. \
            이들은 전체 인구의 3%에 불과하지만 다른 많은 성격을 압도하는 존재감을 뽐내며, 많은 비즈니스와 단체를 이끄는 역할을 할 때가 많습니다.";
            document.getElementById("content-character").innerHTML = "ENTJ 연예인 : 곽동연 서현 스윙스 문가영 여진구 윤하 이특 키 마크툽"
            break;
        }
    }
    function insertImage(title){
        switch(title){
            case "사슴상": 
            document.getElementById("image-container").innerHTML = '<img src="' + test + '"/>';
            break;
            case "꼬부기상": 
            document.getElementById("image-container").innerHTML = '<img src="' + test + '"/>';
            break;
            case "고양이상": 
            document.getElementById("image-container").innerHTML = '<img src="' + test + '"/>';
            break;
            case "토끼상": 
            document.getElementById("image-container").innerHTML = '<img src="' + test + '"/>';
            break;
            case "사막여우상": 
            document.getElementById("image-container").innerHTML = '<img src="' + test + '"/>';
            break;
            case "강아지상": 
            document.getElementById("image-container").innerHTML = '<img src="' + test + '"/>';
            break;
        }
    }
    return(
    <div className = "flex w-screen h-screen bg-white">
        <div className = "w-1/5 h-full bg-white"></div>
        <div className = "w-3/5 h-full bg-white">
            <button type="button" onClick={() => {init();}}>Start</button>
            <button type="button" onClick={() => {timer();}}>Break</button>
            <div id="webcam-container" className = "w-full relative">
            <div className = "h-full w-full absolute z-10 flex justify-center items-center">
                <div className = "text-9xl text-orange-50">{time.current}</div>
            </div>
            </div>
            <div id = "image-container"></div>
            <div id = "first-name"></div>
            <div id = "content"></div>
            <div id="label-container" className = "w-full bg-slate-50 rounded-lg flex-col"></div>
        </div>
        <div className = "w-1/5 h-full bg-white"></div>
    </div>
    )
}
export default MainComponent;

