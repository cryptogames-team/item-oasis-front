"use client";
import { useEffect, useState } from "react";
import { connectSocket } from "@/redux/action/socketActions";
import { useDispatch, useSelector } from 'react-redux';
import {RootState} from '@/redux/reducer';

import io from 'socket.io-client';
import { TbMessageDots } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { SocketChatItem } from "@/types/socket/server_chat";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';import MessengerList from "./MessengerList";
;


export default function Talk() {
  const dispatch = useDispatch();
  const socketState : any = useSelector((state : RootState) => state.socketReducer);
  const notice = socketState.notice;
  const loginState : any = useSelector((state : RootState) => state.loginReducer);
  const is_current_login = loginState.is_current_login;

  const pathName = usePathname();

  const [noticeRead, setNoticeRead] = useState(true);

  const [active, setActive] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleClickChat = () => {
    console.log("handleClickChat 호출");
    if(is_current_login) {
      setActive(true); setNoticeRead(true);
    } else {
      alert("로그인 후 이용하실 수 있습니다.")
    }
    
  
  }

  useEffect(() => {
    if(is_current_login === true){
      setIsLogin(true);
    } else if(is_current_login === false) {
      setIsLogin(false);
    }   
  }, [is_current_login]);
  


  useEffect(() => {
    console.log("Talk useEffect 호출");
    console.log(`소켓 연결..`);

    const socket = io(`${process.env.NEXT_PUBLIC_BASE_URL_2}`);
    socket.on("connect", () => {
      console.log("소켓 연결@@@@@@@", socket.id); // x8WIv7-mJelg7on_ALbx

      socket.emit("set_user_id", localStorage.getItem("user_id"));
    });

    socket.on("roomChatMessage", (data : SocketChatItem) => {
      console.log("roomChatMessage 호출", data);
        dispatch({
          type: 'RECEIVE_MSG',
          payload: data,
        });      
    });

    socket.on("joinRoom", (data : string[]) => {
      console.log("joinRoom 호출", data);
      
      if(data.length === 2) {
        dispatch({
          type: 'RECEIVE_JOIN_ROOM',
          payload: true,
        });
      }
            
    });

    socket.on("exitRoom", (data : SocketChatItem) => {
      console.log("exitRoom 호출", data);
      dispatch({
        type: 'RECEIVE_JOIN_ROOM',
        payload: false,
      });
    });

    socket.on("chatMessage", (data : SocketChatItem) => {
      console.log("알림 채팅 호출", data);
        dispatch({
          type: 'RECEIVE_NOTICE',
          payload: {...data, isLoad : false},
        })      
    
    });

    console.log("원래 소켓 : ",socket);
    dispatch({
      type: 'CONNECT_SOCKET',
      payload: socket,
    });

  
  }, []);

  useEffect(() => {
    console.log(`! useEffect notice 호출...`, notice);

    // 알림이 오면 "N 버튼을 띄어줌."
    if(notice !== null) {
      setNoticeRead(false);
    }
    
  
  }, [notice]);

  useEffect(() => {
    console.log(`현재 페이지`, pathName);

    // messenger 페이지에 도착하면 알림이 읽음 처리되도록 
    if(pathName === "/messenger") {
      setNoticeRead(true);
    }
  
  }, [pathName]);

  return (
    <>
      {pathName !== "/messenger" && <Link href={"/messenger"}></Link>}
      {active === false ? (
        <button
          className="shadow-md fixed rounded-full bg-indigo-400 bottom-10 right-[10px] h-20 w-20 text-white"
          onClick={handleClickChat}
        >
          <div className="flex flex-col items-center justify-center relative">
            {noticeRead === false && (
              <div className="absolute -top-4 right-0 rounded-full w-6 h-6 bg-red-400 font-bold text-center">
                {" "}
                N
              </div>
            )}
            <TbMessageDots size={45} />
          </div>
        </button>
      ) : (
        <button
          className="shadow-md fixed rounded-full bg-indigo-400 bottom-10 right-[10px] h-20 w-20"
        >
          <div className="flex flex-col items-center justify-center relativ z-10">
            <MessengerList />
            <IoClose size={45} className="text-white font-bold" onClick={() => setActive(false)}/>
          </div>
        </button>
      )}
    </>
  );
  
}
