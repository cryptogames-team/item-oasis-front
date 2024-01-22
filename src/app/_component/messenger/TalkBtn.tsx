"use client";
import { TbMessageDots } from "react-icons/tb";
export default function Talk() {

  const handleClickTalk = () => {
    console.log("handleClickTalk 호출");
    window.open("http://localhost:3000/messenger", "_black", "width=820, height=630");
  
  }

  return (
    <>
        <button className="shadow-md fixed rounded-full bg-indigo-400 bottom-10 right-40 h-28 w-28 text-white flex flex-col items-center justify-center"
        onClick={handleClickTalk}>
            <TbMessageDots size={45} />
            <div className="mt-1 font-bold">오아시스 톡</div>
        </button>
    </>
  );
  
}