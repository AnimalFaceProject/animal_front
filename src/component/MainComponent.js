import React, {useState, useEffect, useRef} from "react";
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';
import test from '../test.png'
import man from '../logo.svg'
import Switch from "react-switch";
// 파이어베이서 파일에서 import 해온 db
import {db} from './firebase'
// db에 접근해서 데이터를 꺼내게 도와줄 친구들
import { collection, getDocs, addDoc, updateDoc, doc, getDoc } from "@firebase/firestore";
import RingLoader from "react-spinners/RingLoader";
import "../MainComponent.css"

const MainComponent = () => {
    
    // the link to your model provided by Teachable Machine export panel
    const girlURL = "https://teachablemachine.withgoogle.com/models/BZxTIBZB0/";
    const modelGirlURL = girlURL + 'model.json';
    const metadataGirlURL = girlURL + 'metadata.json';

    const manURL = "https://teachablemachine.withgoogle.com/models/WXwNwq3F0/";
    const modelManURL = manURL + 'model.json';
    const metadataManURL = manURL + 'metadata.json';

    let model, webcam, labelContainer, maxPredictions, requestId;
    var prediction;

    const [count, setCount] = useState(5);
    const [participant, setParticipant] = useState(0);
    const [man, setMan] = useState(0);
    const [girl, setGirl] = useState(0);
    const [manOrGirl, setManOrGirl] = useState(true);
    // 이따가 users 추가하고 삭제하는거 진행을 도와줄 state
    const [data, setData] = useState([]);

    const userDoc = doc(db, "total", "N9jk5i05AKTQPwQL5qnO");
    // db의 users 컬렉션을 가져옴
    const usersCollectionRef = collection(db, "total");

    {/*토글버튼관련*/}
    const [state, setChecked] = useState(true);
    const onOffChange = () =>{
        if(state === false) {
            setChecked(true);
            setManOrGirl(true);
        }
        else {
            setChecked(false);
            setManOrGirl(false);
        }
    }

    const getUsers = async () => {
        // getDocs로 컬렉션안에 데이터 가져오기
         //const user = await getDocs(usersCollectionRef);
         //user.docs.map((doc)=>({ ...doc.data(), id: doc.id}))
         //await setData(user.docs.map((doc)=>({ ...doc.data(), id: doc.id})));

         const docSnap = await getDoc(userDoc);

         await setData(docSnap.data())
         setGirl(docSnap.data().girl);
         setMan(docSnap.data().man);
         setParticipant(docSnap.data().participant);
       }

    const updateMan = async() =>{
        // 내가 업데이트 하고자 하는 key를 어떻게 업데이트할지 준비,, 중요한점이 db에는 문자열로 저장되어있다. 그래서 createUsers()함수안에서 age를 생성할때 숫자열로 형변환 해줘야한다
        const userNumber = {participant: participant + 1};
        const manNumber = {man: man + 1};
        const girlNumber = {girl: girl + 1};

        // updateDoc()을 이용해서 업데이트
        await updateDoc(userDoc, userNumber);

        if(state === false) {
            await updateDoc(userDoc, manNumber);
        }
        else if(state === true){
            await updateDoc(userDoc, girlNumber);
        }
      }
    

    const time = useRef(null);

    const timer = async () =>{
        updateMan();
        time.current = 5;
        setParticipant(participant + 1);
        const id = setInterval(() => {
            setCount(count => count -1);
            time.current = time.current - 1;
          }, 1000);
      
          return () => clearInterval(id);
    }

    useEffect(()=>{
        // 비동기로 데이터 받을준비
      getUsers();
    }, [])


     // Load the image model and setup the webcam
     async function init() {
        document.getElementById('loader').className = "visible w-full flex flex-col items-center text-4xl text-white";
         // load the model and metadata
         // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
         // or files from your local hard drive
         // Note: the pose library adds "tmImage" object to your window (window.tmImage)
         if(manOrGirl === true) {
            model = await tmImage.load(modelGirlURL, metadataGirlURL);
        }
        else if(manOrGirl === false){
            model = await tmImage.load(modelManURL, metadataManURL);
        }
         maxPredictions = model.getTotalClasses();

         // Convenience function to setup a webcam
         const flip = true; // whether to flip the webcam
         webcam = new tmImage.Webcam(600, 600, flip); // width, height, flip
         await webcam.setup(); // request access to the webcam
         await webcam.play();
         document.getElementById('loader').remove();
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
            prediction.sort((a,b) => parseFloat(b.probability) - parseFloat(a.probability));
            document.getElementById('webcam-container').remove();
            if(manOrGirl === true) {
                insertGirlImage(prediction[0].className);
                girlContent(prediction[0].className);
            }
            else if(manOrGirl === false) {
                insertManImage(prediction[0].className);
                manContent(prediction[0].className);
            }
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

         for (let i = 0; i < 6; i++) {
            if(manOrGirl === true){
                var barWidth = prediction[i].probability.toFixed(2)*100 + "%";
                var labelTitle = prediction[i].className;
                var animalName = "<div class='w-20 h-full text-3xl'>" + labelTitle + "</div>"
                var animmalBar1 = "<div class='w-full h-full animalbar1 bg-[#ffe1f0] rounded-lg'><div class='bg-[#ff64ac] h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
                var animmalBar2 = "<div class='w-full h-full animalbar2 bg-[#faf7dd] rounded-lg'><div class='bg-[#fff170] h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
                var animmalBar3 = "<div class='w-full h-full animalbar3 bg-[#ddefe4] rounded-lg'><div class='bg-[#7efdaf] h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
                var animmalBar4 = "<div class='w-full h-full animalbar4 bg-[#ceeaf8] rounded-lg'><div class='bg-[#68cdff] h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
                var animmalBar5 = "<div class='w-full h-full animalbar5 bg-[#ebd8f7] rounded-lg'><div class='bg-[#cb71ff] h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
                var animmalBar6 = "<div class='w-full h-full animalbar6 bg-[#ffe0c0] rounded-lg'><div class='bg-[#fca951] h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
            }
            else if(manOrGirl === false){
                var barWidth = prediction[i].probability.toFixed(2)*100 + "%";
                var labelTitle = prediction[i].className;
                var animalName = "<div class='w-20 h-full text-3xl'>" + labelTitle + "</div>"
                var animmalBar1 = "<div class='w-full h-full animalbar1 bg-[#ffe1f0] rounded-lg'><div class='bg-[#ff64ac] h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
                var animmalBar2 = "<div class='w-full h-full animalbar2 bg-[#faf7dd] rounded-lg'><div class='bg-[#fff170] h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
                var animmalBar3 = "<div class='w-full h-full animalbar3 bg-[#ddefe4] rounded-lg'><div class='bg-[#7efdaf] h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
                var animmalBar4 = "<div class='w-full h-full animalbar4 bg-[#ceeaf8] rounded-lg'><div class='bg-[#68cdff] h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
                var animmalBar5 = "<div class='w-full h-full animalbar5 bg-[#ebd8f7] rounded-lg'><div class='bg-[#cb71ff] h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
                var animmalBar6 = "<div class='w-full h-full animalbar6 bg-[#ffe0c0] rounded-lg'><div class='bg-[#fca951] h-full text-md font-medium text-black p-0.5 leading-none rounded-lg flex justify-center items-center' style='width: " + barWidth + "'><span class='d-block percent-text'>" + barWidth + "</span></div></div>"
            }
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
     function girlContent(title){
        switch(title){
            case "사슴상": 
            document.getElementById("first-name").innerHTML = "사슴상";
            document.getElementById("content").innerHTML = "\
            청순한 매력으로 보호본능을 자극하는 이목구비를 가진 사슴상 비주얼이에요. \
            전체적으로 맑고 영롱한 분위기로 온순하면서 우아한 이미지와 세련된 이목구비는 사슴상의 대표적인 특징이에요."
            document.getElementById("content-character").innerHTML = "사슴상 연예인 : 김채원(르세라핌) 아린(오마이걸) 미연(아이들) 비니(오마이걸)"
            break;
            case "꼬부기상": 
            document.getElementById("first-name").innerHTML = "꼬부기상";
            document.getElementById("content").innerHTML = "\
            눈이 크고 특히 이 눈웃음이 매우 매력적인 꼬부기상입니다. \
            특히 웃을 때 반달모양 눈과 예쁜 입매가 주변 사람을 행복하게 만들어요.";
            document.getElementById("content-character").innerHTML = "꼬부기상 연예인 : 하연수 레드벨벳 예리 마마무 솔라 브브걸 유정"
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
            발랄하고 귀여운 당신은 주변 사람들에게 기쁨을 주는 행복바이러스다! 호기심이 많아 활발하며 귀엽고 순수한 외모로 연인의 보호본능을 자극한다. \
            존재 자체가 상큼하고 깜찍한 당신은 특별한 애교 없이도 연인에게 너무나도 사랑스럽다!";
            document.getElementById("content-character").innerHTML = "토끼상 연예인 : 수지, 나연(트와이스), 예린(여자친구), 한승연(카라), 문채원"
            break;
            case "여우상": 
            document.getElementById("first-name").innerHTML = "여우상";
            document.getElementById("content").innerHTML = "\
            사람을 홀리는 매력을 가진 당신은 선뜻 다가가기 힘든 섹시한 매력을 가졌다. 우아한 외모에 더해 뛰어난 센스의 성격을 가진 당신은 어딜가도 주목받는 주인공이다!\
            사교적인 성격을 가져 연인에게도 적극적으로 애정표현을 하지만 밀당의 고수인 당신은 연인의 혼을 쏙 빼놓는 매력쟁이다.";
            document.getElementById("content-character").innerHTML = "여우상 연예인: 경리(나인뮤지스), 예지(있지), 한혜진(모델), 헤이즈, 지연(티아라)"
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
    function manContent(title){
        switch(title){
            case "강아지상": 
            document.getElementById("first-name").innerHTML = "강아지상";
            document.getElementById("content").innerHTML = "\
            다정다감하고 귀여운 당신은 모든 사람들에게 즐거움을 주는 호감형이다! 친절하고 활발한 성격으로 어디에서도 인기폭발이며 애교와 웃음이 많아 연인에게 특히나 사랑스러워요.\
            당신은 애인바라기로 애인의 관심이 부족하면 시무룩해지고 외로움을 타는 모습이 마치 강아지와 똑 닮았어요!"
            document.getElementById("content-character").innerHTML = "강아지상 연예인 : 박보검 송중기 백현 강다니엘"
            break;
            case "고양이상": 
            document.getElementById("first-name").innerHTML = "고양이상";
            document.getElementById("content").innerHTML = "\
            무뚝뚝한 당신의 첫인상은 차가워 보이지만 묘한 매력을 풍겨 언제나 인기가 넘친다. 자존심이 세계 1등과 맞먹지만 관심 받는 것을 좋아하고 연인에게는 은근히 애교쟁이다. \
            시크한 츤데레로 연인에게 끊임없이 설렘을 안겨주는 당신은 고양이와 닮았다!";
            document.getElementById("content-character").innerHTML = "고양이상 연예인 : 강동원 시우민(엑소) 이종석 이준기 황민현(워너원)"
            break;
            case "곰상": 
            document.getElementById("first-name").innerHTML = "곰상";
            document.getElementById("content").innerHTML = "\
            첫 인상은 무서워 보이지만 알고 보면 귀여운 매력의 당신! 꼼꼼하고 섬세한 성격으로 연인을 헌신적으로 챙겨주는 당신은 연인에게 듬직한 존재! \
            포근한 매력에 듬직함까지 갖춘 최고의 남자다!";
            document.getElementById("content-character").innerHTML = "곰상 연예인 : 안재홍 조진웅 조세호 마동석"
            break;
            case "토끼상": 
            document.getElementById("first-name").innerHTML = "토끼상";
            document.getElementById("content").innerHTML = "\
            천진난만하고 귀여운 당신은 주변 사람들에게 기쁨을 주는 행복바이러스에요! 호기심이 많아 활발하며 귀엽고 순수한 외모로 연인의 보호본능을 자극한다. \
            존재 자체가 상큼한 당신은 특별한 애교 없이도 연인에게 너무나도 사랑스러운 특징을 갖고있어요!";  
            document.getElementById("content-character").innerHTML = "토끼상 : bst정국 수호(엑소) 바비 박지훈(워너원)"
            break;
            case "공룡상": 
            document.getElementById("first-name").innerHTML = "공룡상";
            document.getElementById("content").innerHTML = "\
            무심한 성격에 첫인상은 나쁜 남자 같지만, 알고 보면 따뜻함이 묻어나는 당신! \
            시크한 매력에 선뜻 다가가지 못하지만 한번 다가가면 헤어나올 수 없는 터프한 매력을 가진 카리스마 있는 남자다.";
            document.getElementById("content-character").innerHTML = "공룡상 연예인 : 공유 김우빈 육성재 윤두준 이민기"
            break;
            case "여우상": 
            document.getElementById("first-name").innerHTML = "여우상";
            document.getElementById("content").innerHTML = "\
            샤프한 윤곽에 깔끔한 콧날을 가진 여우상 비주얼이에요.\
            사람을 홀리는 매력을 가진 여우상은 선뜻 다가가기 힘든 섹시한 매력을 가졌어요";
            document.getElementById("content-character").innerHTML = "bts뷔 지드래곤 인피니트 성규 호시(세븐틴) b1a4진영"
            break;
        }
    }
    function insertGirlImage(title){
        switch(title){
            case "사슴상": 
            document.getElementById("image-container").innerHTML = '<img class="rounded-full" src="' + test + '"/>';
            break;
            case "꼬부기상": 
            document.getElementById("image-container").innerHTML = '<img class="rounded-full" src="' + test + '"/>';
            break;
            case "고양이상": 
            document.getElementById("image-container").innerHTML = '<img class="rounded-full" src="' + test + '"/>';
            break;
            case "토끼상": 
            document.getElementById("image-container").innerHTML = '<img class="rounded-full" src="' + test + '"/>';
            break;
            case "사막여우상": 
            document.getElementById("image-container").innerHTML = '<img class="rounded-full" src="' + test + '"/>';
            break;
            case "강아지상": 
            document.getElementById("image-container").innerHTML = '<img class="rounded-full"src="' + test + '"/>';
            break;
        }
    }
    function insertManImage(title){
        switch(title){
            case "강아지상": 
            document.getElementById("image-container").innerHTML = '<img class="rounded-full" src="' + man + '"/>';
            break;
            case "고양이상": 
            document.getElementById("image-container").innerHTML = '<img class="rounded-full" src="' + man + '"/>';
            break;
            case "곰상": 
            document.getElementById("image-container").innerHTML = '<img class="rounded-full" src="' + man + '"/>';
            break;
            case "토끼상": 
            document.getElementById("image-container").innerHTML = '<img class="rounded-full" src="' + man + '"/>';
            break;
            case "공룡상": 
            document.getElementById("image-container").innerHTML = '<img class="rounded-full" src="' + man + '"/>';
            break;
            case "여우상": 
            document.getElementById("image-container").innerHTML = '<img class="rounded-full"src="' + man + '"/>';
            break;
        }
    }
    return(
        <div className="main-frist-container">
            
            <div className="outer-form">
                <div className = "first-form">
                    <div className = "main-title">
                        Ai animal Test
                    </div>
                    <div className = "w-full flex justify-center">
                        <div className="label-container">
                            <label htmlFor="material-switch" className="change-gender">
                                    <Switch
                                        className="react-switch"
                                        id="small-radius-switch"
                                        checked={state}
                                        onChange={onOffChange}
                                        handleDiameter={28}
                                        offColor="#869df6"
                                        onColor="#f6868a"
                                        offHandleColor="#ffffff"
                                        onHandleColor="#ffffff"
                                        height={40}
                                        width={100}
                                        borderRadius={6}
                                        activeBoxShadow="0px 0px 1px 2px #f7ffe6"
                                        uncheckedIcon={
                                            <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "40px",
                                                fontSize: 20,
                                                color: "black",
                                                paddingRight: 2,
                                            }}
                                            >
                                            남자
                                            </div>
                                        }
                                        checkedIcon={
                                            <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "100%",
                                                fontSize: 22,
                                                color: "white",
                                                paddingRight: 2,
                                            }}
                                            >
                                            여자
                                            </div>
                                        }
                                        uncheckedHandleIcon={
                                            <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "100%",
                                                fontSize: 20,
                                            }}
                                            >
                                            👨
                                            </div>
                                        }
                                        checkedHandleIcon={
                                            <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "100%",
                                                color: "red",
                                                fontSize: 18,
                                            }}
                                            >
                                            👩
                                            </div>
                                        }
                                        
                                    />
                            </label>
                        </div>
                    </div>
                    <div className = "main-buttons-container">
                        {/* <div className = "text-4xl">
                            남자 참가자 수 : {man}
                        </div> */}
                  
                        <button className = "main-button"  onClick={() => {init();}}>시작</button>
                        <div className="main-button-space"></div>
                        <button className = "main-button"  onClick={() => {timer();}}>판별</button>
                 
                        {/* <div className = "text-4xl">
                            여자 참가자 수 : {girl}
                        </div> */}
                    </div>
                    {/* <div className = "w-full flex justify-center main-current-participant">현재 참가자 수 : {participant}
                    </div> */}
                   
                </div>

                <div id = "loader" className = "invisible w-full justify-center">
                    Ai가 분석을 위해 준비중입니다.
                    <RingLoader color="#36d7b7" className = "w-full justify-center"/>
                </div>
            
                
                    {/* 가운데 메인*/}
                <div className = "main-content">
                    <div id="webcam-container" className = "w-full relative">
                        <div className = "h-full w-full absolute z-10 flex justify-center items-center">
                            <div className = "text-9xl text-orange-50">
                                {time.current}
                            </div>
                        </div>
                    </div>
                    <div id = "image-container" className = "rounded-3xl">

                    </div>
                    <div id = "first-name" className = "flex justify-center w-full items-center font-bold text-7xl text-black mt-4 underline decoration-sky-500 decoration-wavy ... mb-4">

                    </div>
                    <div id = "content-character" className = "text-3xl text-black mb-4">

                    </div>
                    <div id = "content" className = "w-full mb-4 text-4xl">

                    </div>
                    <div id="label-container" className = "w-full bg-slate-50 rounded-lg flex-col">

                    </div>
                </div>
            </div>
        </div>
    )
}
export default MainComponent;

