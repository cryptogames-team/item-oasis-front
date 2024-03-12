"use client";

import { ReadTradeTrx } from "@/js/heptagon/api_trx_read";
import { ChatItem } from "@/types/chat";
import { ChatList } from "@/types/chatList";
import { SocketChatItem } from "@/types/socket/server_chat";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { MdInput } from "react-icons/md";
import { io } from "socket.io-client";
import {extractTimeFromDateString} from "@/js/extractTimeFromDateString"
import { h_get_by_token, h_postFormImage_by_token, h_postForm_by_token } from "@/js/fetch_by_token";
import { ChatMessage } from "@/types/chat_message";
import { useSelector } from "react-redux";
import {RootState} from '@/redux/reducer';
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { setTimeout } from "timers";



const TradeType = {
  Trading: 0,
  trade_complete: 1,
};

const TradingType = {
  All: 0,
  Sell: 1,
  Buy: 2,
};

type PropsTrading = {
  tradeState: number;
  setTradeState : (tradeState : number) => void;
  tradingState : number;
  setTradingState : (tradingState : number) => void;
  chatList : ChatList[];
  setChatList : React.Dispatch<React.SetStateAction<ChatList[]>>;
  setSelectChat : React.Dispatch<React.SetStateAction<ChatList | undefined>>;
}

interface PropsChatMessage {
  chatMessage : ChatMessage;
}


interface ChatListItemProps {
  chatList: ChatList;
  setChatList : React.Dispatch<React.SetStateAction<ChatList[]>>;
  setSelectChat : React.Dispatch<React.SetStateAction<ChatList | undefined>>;
}


export default function MessengerComponent() {
  // const socket = io(`${process.env.NEXT_PUBLIC_BASE_URL_2}`);  
  const socketState : any = useSelector((state : RootState) => state.socketReducer);
  const socket = socketState.socket;
  const msg = socketState.msg;
  const notice = socketState.notice;
  const is_join = socketState.is_join;

  const [tradeState, setTradeState] = useState(TradeType.Trading); // 거래중(0), 거래완료(1)를 나타내는 변수
  const [tradingState, setTradingState] = useState(TradingType.All); // 전체(0), 판매중 (1), 구매중(2)를 나타내는 타입
  const [chatList, setChatList] = useState<ChatList[]>([]); // 채팅방 리스트
  const [selectChat, setSelectChat] = useState<ChatList | undefined>(); // 선택되어진 채팅방

  const [chatMessage, setChatMessage] = useState<SocketChatItem[]>([]); // 소켓을 통해 받은 메시지를 저장하는 배열
  const [chatInput, setChatInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    
    const url_ing = `${process.env.NEXT_PUBLIC_BASE_URL_1}/chat/chat_title/${tradeState}/${tradingState}`; 
    console.log("url_ing : ", url_ing);
    
    h_get_by_token(url_ing)
    .then((res : any) => {
      console.log("채팅방 목록 불러오는 api", res);
      setChatList(res);      
    });

        
  }, [tradeState, tradingState]);

  useEffect(() => {

    console.log("메세지 확인", msg);
    if(msg !== null) {
      setChatMessage(prev => {
        return [msg ,...prev];
      });        
    }


    setChatList((prev : any) => {
      const updatedList = [...prev];
      const index = updatedList.findIndex(item => item.chat.chat_room === msg.chat_room);

      if (index !== -1) {
        const updatedItem = { ...updatedList[index], chat: msg};
        updatedList.splice(index, 1); // 기존 위치에서 제거
        updatedList.unshift(updatedItem); // 배열의 맨 앞에 추가
      }

      return updatedList;
    })
  
  }, [msg]);

  useEffect(() => {
    console.log(`! useEffect notice 호출...`, notice);
    setChatList((prev : any) => {
      const updatedList = [...prev];
      const index = updatedList.findIndex(item => item.chat.chat_room === notice.chat_room);

      if (index !== -1) {
        const updatedItem = { ...updatedList[index], chat: notice, unread_count: updatedList[index].unread_count + 1 };
        updatedList.splice(index, 1); // 기존 위치에서 제거
        updatedList.unshift(updatedItem); // 배열의 맨 앞에 추가
      }

      return updatedList;
    })
  
  }, [notice]);

  useEffect(() => {
    console.log(`! 읽음처리 로직`, is_join);
    if(is_join){
      console.log(`읽음처리 로직 - true`);
      setChatMessage((prev : any) => {
        return prev.map((item : SocketChatItem) => {
          return {...item, is_read : true}
        })
      })      
    }
  
  }, [is_join]);

  // 포커싱을 맨 아래쪽으로.
  useEffect(() => {
    console.log(`포커싱 호출`);
    
    if(chatContainerRef.current) {
      
      console.log(`포커싱 호출, 조건문`);
      chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight;
      setTimeout(() => {
        chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight;        
      }, 500)
    }
  
  }, [chatMessage]);

  useEffect(() => {
    
    handleJoinRoom(selectChat);

    return () => {
      console.log(`# useEffect 언마운트. 채팅방에서 나가는 로직`);
      chatRoomExit(selectChat);
    }
  
  }, [selectChat]);

  

  // 기존에 선택된 방이 있다면 나가고, 선택된 방에 입장한다.
  const handleJoinRoom = (selectChat : ChatList | undefined) => {
    console.log("! handleJoinRoom 호출", selectChat);

    // 기존 방 갱신 및 방 나가기
    // setSelectChat((prev : any) => {
    //   chatRoomExit(prev); // 방 퇴장
    //   return selectChat; // 기존 방 갱신
    // });    
    

    // 방 입장하기
    if(socket !== null && selectChat?.transaction_id.toString()) {
      console.log("# 방입장.. 방 번호 : ", selectChat?.transaction_id.toString());
      console.log("# socket_id", socket.id);
      socket.emit("join", selectChat?.transaction_id.toString()); // 방 입장
    }

    // 선택된 채팅방이 없으면 나간다.
    if(selectChat === undefined) {
      return;
    }

    // 선택된 채팅방의 데이터 가져오기
    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/chat/chat_room/${selectChat?.transaction_id}`; 
    console.log("$ 채팅방 url : ", url);
    
    h_get_by_token(url)
    .then(res => {
      
      const serverChatFormmat = res.map((item :ChatMessage) => {
        return {...item, user_id : item.user_id.user_id}
      })

      console.log("$ 채팅 내역", res);
      // console.log("$ 서버 챗 포맷.. ",serverChatFormmat);
      setChatMessage(serverChatFormmat);
    });
  }

  function chatRoomExit(selectChat:ChatList | undefined) {
    console.log(`! 방 퇴장 함수`, selectChat);

    // 채팅 메시지 초기화
    setChatMessage([]);

    if(socket !== null && selectChat !== undefined){
      console.log(`# 방퇴장`);
      socket.emit("exit", selectChat?.transaction_id.toString());
    }   
  }


  const handleMessage = () => {
    console.log("handleMessage 호출", chatInput);
    const chatMsg = {
        chatDTO :{
        chat_type : 0,
        user_id : localStorage.getItem("user_id"),
        chat_room : selectChat?.transaction_id.toString(),
        chat_content : chatInput
      },
      recieverId : selectChat?.user.user_id
    }

    console.log("chatMsg : ",chatMsg);
    setChatInput("");

    
    socket && socket.emit("chatMessage", chatMsg);  
    
  }

  const handleChangeChatInput = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("handleChangeChatInput 호출", e.target.value);
    setChatInput(e.target.value);  
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // 엔터 키가 눌렸을 때 추가적인 로직 수행
      console.log("Enter 키가 눌렸습니다.");
      if(chatInput !== "") {
        handleMessage();
      }
    }
  };

  const handleClickImage = () => {
    console.log("! handleClickImage 호출");
    const fileInput = document.getElementById("fileInput");
    fileInput?.click();
  
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("! handleImage 호출", e.target.files);

    if(e.target.files) {
      const file = e.target.files[0];

      const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/chat/chat_image`;
      const formData = new FormData();
      formData.append("file", file);

      
      h_postFormImage_by_token(url, formData)
      .then(res => {
        console.log(`이미지 url`, res);

        const chatMsg = {
          chatDTO :{
          chat_type : 1,
          user_id : localStorage.getItem("user_id"),
          chat_room : selectChat?.transaction_id.toString(),
          chat_content : res
        },
        recieverId : selectChat?.user.user_id
      }
  
      console.log("chatMsg : ",chatMsg);
  
      socket && socket.emit("chatMessage", chatMsg);
      });

    }
  
  }

  

  return (
    <>
      <div className="w-screen h-screen">
        <div className="py-10 h-full flex justify-center">
          <div className="h-container2 flex border-2">
            <ChatList
              tradeState={tradeState}
              setTradeState={setTradeState}
              tradingState={tradingState}
              setTradingState={setTradingState}
              chatList={chatList}
              setChatList={setChatList}
              setSelectChat={setSelectChat}
            />

            {selectChat === undefined ? (
              <div className="bg-slate-200 w-4/6 flex flex-col items-center justify-center">
                <IoChatboxEllipsesOutline size={80} className="text-indigo-400" />
                <div className="mt-5 text-lg">선택한 대화 내역이 없습니다.</div>
              </div>
            ) : (
              <div className="w-4/6 h-full border-l-2 bg-slate-200 flex flex-col">
                <div className="flex p-3 border-b border-slate-300">
                  <div className="flex-1 flex flex-col">
                    <div className="font-bold">
                      {selectChat?.user.user_name}님과 오아시스톡
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      {`${selectChat?.game.game_name} > ${
                        selectChat?.game_server.game_server_name
                      } > ${"게임머니"}`}
                    </div>
                    <div className="mt-2 text-xs text-slate-500">{`${
                      selectChat?.item_count
                    } (단위) | ${
                      selectChat?.price
                    } | ${"캐릭터명 : nova"}`}</div>
                  </div>
                  <div className="text-xs">
                    <button className="border border-red-400 text-red-500 py-1 px-2 bg-white">
                      신고
                    </button>
                    <button className="ml-1 border border-slate-500 text-slate-500 py-1 px-2 bg-white">
                      물품 상세보기
                    </button>
                  </div>
                </div>

                <div
                  className="flex-1 p-4 text-sm overflow-y-auto max-h-full"
                  ref={chatContainerRef}
                >
                  <div className="border-slate-300">
                    <div className="mt-3 flex flex-col items-center">
                      <div className="w-4/6 py-5 px-5 flex flex-col items-center rounded-2xl bg-white">
                        <div className="mt-1">
                          <span className="text-indigo-500 font-bold">
                            결제가 완료
                          </span>{" "}
                          되었습니다
                        </div>
                        <div className="mt-1">물품을 전달 받으신 후에</div>
                        <div className="mt-1">구매확정을 해주세요.</div>
                        <div className="mt-3 flex w-full">
                          <button className="flex-1 border border-slate-500 text-slate-500 font-bold py-1 px-2">
                            거래취소
                          </button>
                          <button className="ml-2 flex-1 border border-slate-500 text-slate-500 font-bold py-1 px-2">
                            구매확정
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col">
                      {[...chatMessage].reverse().map((item) => {
                        if (item.chat_type === 2) {
                          return;
                        }

                        const currentTime = extractTimeFromDateString(
                          item.chat_date
                        );

                        return (
                          <div
                            key={item.chat_id}
                            className={`mt-3 flex items-end ${
                              item.user_id.toString() ===
                              localStorage.getItem("user_id")
                                ? "self-end"
                                : ""
                            }`}
                          >
                            {item.user_id.toString() ===
                              localStorage.getItem("user_id") && (
                              <div className="text-xs flex flex-col items-end">
                                {item.is_read === 0 && (
                                  <div
                                    className={`w-2 h-2 mb-1 bg-red-400 rounded-full`}
                                  ></div>
                                )}
                                <div>{currentTime}</div>
                              </div>
                            )}

                            <div
                              className={`ml-1 p-4 rounded-l-2xl rounded-b-2xl ${
                                item.user_id.toString() ===
                                localStorage.getItem("user_id")
                                  ? "bg-purple-300"
                                  : "bg-white"
                              }`}
                            >
                              {item.chat_type === 0 ? (item.chat_content) :
                               item.chat_type === 1 ? (<img className="w-28" src={`${item.chat_content}`}></img>) : (<div>알수없는 태그</div>)
                              }
                            </div>
                            {item.user_id.toString() !==
                              localStorage.getItem("user_id") && (
                              <div className="ml-1 text-xs flex flex-col">
                                {item.is_read === 0 && (
                                  <div
                                    className={`w-2 h-2 mb-1 bg-red-400 rounded-full`}
                                  ></div>
                                )}
                                <div>{currentTime}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white text-sm text-slate-400 flex">
                  <input
                    id="fileInput"
                    type="file"
                    onChange={handleImage}
                    className="hidden"
                  ></input>
                  <button onClick={handleClickImage}>
                    <CiImageOn size={30} />
                  </button>

                  <input
                    className="flex-1 ml-3 focus:outline-none focus:text-black "
                    type="text"
                    placeholder="메시지를 입력하세요"
                    value={chatInput}
                    onChange={handleChangeChatInput}
                    onKeyDown={handleKeyDown}
                  ></input>
                  <button onClick={handleMessage}>
                    <MdInput size={30} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


function ChatList({tradeState, setTradeState, tradingState, setTradingState, chatList, setChatList, setSelectChat} : PropsTrading) {
  
  return (
    <>
      <div className="w-2/6 flex flex-col bg-white">
        <div className="flex bg-slate-100">
          <button
            className={`py-4 px-1 flex-1 font-bold ${
              tradeState === TradeType.Trading
                ? "bg-white"
                : "bg-slate-100 text-slate-400 border-b border-r border-slate-400"
            }`}
            onClick={() => setTradeState(TradeType.Trading)}
          >
            거래 중
          </button>
          <button
            className={`py-4 flex-1 font-bold ${
              tradeState === TradeType.trade_complete
                ? "bg-white"
                : "bg-slate-100 text-slate-400 border-b border-l border-slate-400"
            }`}
            onClick={() => setTradeState(TradeType.trade_complete)}
          >
            거래완료
          </button>
        </div>

        <div
          className={`my-5 text flex justify-center ${
            tradeState === TradeType.Trading ? "" : "hidden"
          }`}
        >
          <button
            className={`border py-1 px-3 mx-1 ${
              tradingState === TradingType.All
                ? "text-indigo-700 border-indigo-700"
                : "text-slate-400"
            }`}
            onClick={() => setTradingState(TradingType.All)}
          >
            전체
          </button>
          <button
            className={`border py-1 px-3 mr-1 ${
              tradingState === TradingType.Sell
                ? "text-indigo-700 border-indigo-700"
                : "text-slate-400"
            }`}
            onClick={() => setTradingState(TradingType.Sell)}
          >
            판매중
          </button>
          <button
            className={`border py-1 px-3 mr-1 ${
              tradingState === TradingType.Buy
                ? "text-indigo-700 border-indigo-700"
                : "text-slate-400"
            }`}
            onClick={() => setTradingState(TradingType.Buy)}
          >
            구매중
          </button>
        </div>

        {
          chatList.map(item => {
            return(
              <ChatListItem key={item.transaction_id} chatList={item} setChatList={setChatList} setSelectChat={setSelectChat} />
            )
          })
        
        }

        {/* <div className="mt-1 text-xs">
          <div className={`flex bg-slate-50 p-3`}>
            <div className="py-2 px-2 flex flex-col items-center">
              <img src="/tier/bronze.png" className="w-10"></img>
              <div className="mt-2 text-orange-400">구매중</div>
            </div>
            <div className="py-2 px-2 flex-1 flex flex-col">
              <div className="flex justify-between">
                <div className="font-bold">test1</div>
                <div className="">01월 02일</div>
              </div>
              <div className="mt-1">메이플스토리</div>
              <div className="mt-1">2억 | 2,000 Hep</div>
              <div className="mt-1 font-bold">안녕하세요</div>
            </div>
          </div>
        </div> */}

      </div>
    </>
  );
  
}

function ChatListItem({chatList, setChatList, setSelectChat}: ChatListItemProps) {

  const socketState : any = useSelector((state : RootState) => state.socketReducer);
  const socket = socketState.socket;

  const dateTimeString = chatList.chat.chat_date.toString();
  const [datePart, timePart] = dateTimeString.split(' '); // 공백을 기준으로 문자열 분리
  const [hour, minute] = timePart.split(':'); // 시간 부분을 ":"을 기준으로 분리
  const formattedTime = `${hour}:${minute}`; // 시간과 분을 합쳐서 원하는 형식으로 표시

  const handleItemClick = () => {
    console.log("! handleItemClick 호출");
    setSelectChat((prev : any) => {
      if(socket !== null && prev !== undefined){
        console.log(`# 방퇴장`, prev?.transaction_id.toString());
        socket.emit("exit", prev?.transaction_id.toString());
      }   
      return chatList; // 기존 방 갱신
    });   

    // 읽음 처리
    setChatList((prev : ChatList[]) => {
      return prev.map((item : ChatList) => {
        if(item === chatList){
          return {...item , unread_count : 0}
        }
        return item;
      })
    })
    // setSelectChat(chatList);      
  }

  
  return (
    <>
      <div
        key={chatList.transaction_id}
        className="mt-1 text-xs"
        onClick={handleItemClick}
      >
        <div className={`flex bg-slate-50 p-3`}>
          <div className="py-2 px-2 flex flex-col items-center">
            <img src="/tier/bronze.png" className="w-10"></img>
            <div className="mt-2 text-orange-400">{}</div>
          </div>
          <div className="py-2 px-2 flex-1 flex flex-col">
            <div className="flex justify-between">
              <div className="font-bold">
                {chatList.seller !== localStorage.getItem("user_name")
                  ? chatList.seller
                  : chatList.buyer}
              </div>
              <div className="">{formattedTime}</div>
            </div>
            <div className="mt-2">{chatList.game.game_name}</div>
            <div className="mt-2">{`${chatList.item_count} | ${chatList.price}`}</div>
            <div className="mt-2 flex items-center justify-between">
              <div className="font-bold">
                {chatList.chat.chat_type === 0
                  ? chatList.chat.chat_content
                  : chatList.chat.chat_type === 1
                  ? "이미지를 전송했습니다."
                  : chatList.chat.chat_type === 2
                  ? "결제가 완료되었습니다."
                  : "알수없는 태그입니다."}
              </div>
              {chatList.unread_count !== 0 && (
                <div className=" bg-red-400 w-5 h-5 rounded-full font-bold flex items-center justify-center text-white">
                  {chatList.unread_count}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


