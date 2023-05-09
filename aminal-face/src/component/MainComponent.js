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
    const [participant, setParticipant] = useState(0);
    const [man, setMan] = useState(0);
    const [girl, setGirl] = useState(0);
    

    const time = useRef(null);

    const timer = () =>{
        time.current = 6;
        setParticipant(participant + 1);
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
            var animalName = "<div class='w-20 h-full text-2xl'>" + labelTitle + "</div>"
            var animmalBar1 = "<div class='w-full h-full bg-[#f0bcd4] rounded-lg'><div class='bg-[#FF99C8] h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
            var animmalBar2 = "<div class='w-full h-full bg-[#faf7dd] rounded-lg'><div class='bg-[#FCF6BD] h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
            var animmalBar3 = "<div class='w-full h-full bg-[#ddefe4] rounded-lg'><div class='bg-[#aef4c9] h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
            var animmalBar4 = "<div class='w-full h-full bg-[#ceeaf8] rounded-lg'><div class='bg-[#A9DEF9] h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
            var animmalBar5 = "<div class='w-full h-full bg-[#ebd8f7] rounded-lg'><div class='bg-[#E4C1F9] h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
            var animmalBar6 = "<div class='w-full h-full bg-sky-600 rounded-lg'><div class='bg-blue-600 h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
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
            청순한 매력으로 보호본능을 자극하는 이목구비를 가진 사슴상 비주얼이에요. \
            전체적으로 맑고 영롱한 분위기로 온순하면서 우아한 이미지와 세련된 이목구비는 사슴상의 대표적인 특징이에요."
            document.getElementById("content-character").innerHTML = "ENFJ 연예인 : 강다니엘 공명 수호(EXO) 박소담 우기(아이들) 신민아 신세경"
            break;
            case "꼬부기상": 
            document.getElementById("first-name").innerHTML = "꼬부기상";
            document.getElementById("content").innerHTML = "\
            웃을때 반달 모양이 되는데 귀엽습니다 입이 좌우로 엄청 크고 웃을때 입꼬리가 부드럽게 올라갑니다.";
            document.getElementById("content-character").innerHTML = "ENFP 연예인 : 강민경 로제(BLACKPINK) 박준형(god) 비비 송민호 싸이 사나(TWICE) 유나(ITZY) 이효리 하하"
            break;
            case "고양이상": 
            document.getElementById("first-name").innerHTML = "고양이상";
            document.getElementById("content").innerHTML = "\
            시원시원한 이목구비, 특히 큰 눈과 올라간 눈꼬리를 가진 고양이상 비주얼이에요. \
            특히 갸름한 브이라인으로 시크하면서도 도도한 매력을 발산하며, 도도하고 매혹적인 인상은 고양이상의 대표적인 특징이에요.";
            document.getElementById("content-character").innerHTML = "고양이상 연예인 : 이효리 한예슬 뉴진스 해린 김희선 김민희 한채영"
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
            맑고 순수해서 한없이 지켜만 주고싶은, 보호본능을 일으키는 강아지상 비주얼이에요 .\
            동그랗고 큰 눈, 살짝 쳐진 눈 꼬리, 동그란 콧망울, 부드러운 턱 선을 지녔으며 전반적으로 앳되고 귀여운 이미지는 강아지상의 대표적인 특징이에요.";
            document.getElementById("content-character").innerHTML = "강아지상 연예인 : 박보영 한가인 김태희 구혜선 문근영 임수정 한효주"
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
        <>
        <div className = "w-full h-24 bg-orange-200 flex flex-col justify-around">
        <div className = "w-full flex justify-center">동물상 테스트</div>
            <div className = "flex w-full justify-evenly">
                <div>남자 참가자 수 : {man}</div>
                    <div className = "w-20 flex justify-around">
                        <button type="button" onClick={() => {init();}}>시작</button>
                        <button type="button" onClick={() => {timer();}}>판별</button>
                    </div>
                <div>여자 참가자 수 : {girl}</div>
            </div>
            <div className = "w-full flex justify-center">현재 참가자 수 : {participant}</div>
        </div>

        <div className = "flex w-screen h-screen bg-white">
            <div className = "w-1/5 h-full bg-white"></div>
            <div className = "w-3/5 h-full bg-white">
                <div id="webcam-container" className = "w-full relative">
                <div className = "h-full w-full absolute z-10 flex justify-center items-center">
                    <div className = "text-9xl text-orange-50">{time.current}</div>
                </div>
                </div>
                <div id = "image-container"></div>
                <div id = "first-name" className = "flex justify-center w-full items-center font-bold text-2xl"></div>
                <div id = "content" className = "w-full mb-4 text-3xl"></div>
                <div id="label-container" className = "w-full bg-slate-50 rounded-lg flex-col"></div>
            </div>
        <div className = "w-1/5 h-full bg-white"></div>
    </div>
    </>
    )
}
export default MainComponent;

