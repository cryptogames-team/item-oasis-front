"use client";
import { useEffect, useState } from "react";
import { connectSocket } from "@/redux/action/socketActions";
import { useDispatch, useSelector } from 'react-redux';
import {RootState} from '@/redux/reducer';

import io from 'socket.io-client';
import { TbMessageDots } from "react-icons/tb";
import { SocketChatItem } from "@/types/socket/server_chat";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';;


export default function Talk() {
  const dispatch = useDispatch();
  const socketState : any = useSelector((state : RootState) => state.socketReducer);
  const notice = socketState.notice;
  const pathName = usePathname();

  const [noticeRead, setNoticeRead] = useState(true);

  const [active, setActive] = useState(false);
  


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
          payload: data,
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
      {pathName !== "/messenger" && (
        <Link href={"/messenger"}>
          <button className="shadow-md fixed rounded-full bg-indigo-400 bottom-10 right-40 h-24 w-24 text-white">
            <div className="flex flex-col items-center justify-center relative">
              {noticeRead === false && (
                <div className="absolute -top-4 right-0 rounded-full w-6 h-6 bg-red-400 font-bold text-center">
                  {" "}
                  N
                </div>
              )}
              <TbMessageDots size={45} />
              <div className="mt-1 font-bold">거래톡</div>
            </div>
          </button>
        </Link>
      )}
    </>
  );
  
}