import React, {useState} from "react";
import TopComponent from "./TopCompoennt";
import MainComponent from "./MainComponent";

const MainPage = () => {
    return(
    <div className = "w-full h-full bg-black">
        <TopComponent/>
        <MainComponent/>
    </div>
    )
}
export default MainPage;