"use client";

import { ReadTradeTrx } from "@/js/heptagon/api_trx_read";
import { ChatItem } from "@/types/chat";
import { SocketChatItem } from "@/types/socket/server_chat";
import { ChangeEvent, useEffect, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { MdInput } from "react-icons/md";
import { io } from "socket.io-client";
import {extractTimeFromDateString} from "@/js/extractTimeFromDateString"

const TradeType = {
  Trading: 1,
  trade_complete: 2,
};

const TradingType = {
  All: 1,
  Sell: 2,
  Buy: 3,
};

export default function MessengerComponent() {
  const socket = io(`${process.env.NEXT_PUBLIC_BASE_URL_2}`);  

  const [chatMessage, setChatMessage] = useState<SocketChatItem[]>([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    console.log("use effect 확인");
    socket.on("connect", () => {
      console.log("소켓 연결@@@@@@@", socket.id); // x8WIv7-mJelg7on_ALbx

      socket.emit("set_user_id", "2");
      socket.emit("join", "1");    

    });

    socket.on("roomChatMessage", handleRoomChatMessage);    
    
    return () => {
      // 컴포넌트가 unmount 되거나, socket 또는 다른 의존성이 변경될 때 호출됨
      socket.off("roomChatMessage", handleRoomChatMessage);
    };
    
  }, []);
  
  const handleRoomChatMessage = (data : SocketChatItem) => {
    console.log("handleRoomChatMessage 호출", data);
    setChatMessage(prev => {
      return [...prev, data];
    });
    setChatInput("");  
  }


  const handleJoinRoom = () => {
    console.log("handleJoinRoom 호출");
    socket.emit("join", "1");          
  }

  const handleMessage = () => {
    console.log("handleMessage 호출");
    socket.emit("chatMessage", {
      chatDTO :{
      chat_type : 0,
      user_id : 1,
      chat_room : "1",
      chat_content : chatInput,
      chat_date : "test"
    },
    recieverId : 5
  });  
    
  }

  const handleChangeChatInput = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("handle 호출");
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

  

  return (
    <>
      <div className="w-screen h-screen bg-indigo-200">
        <div className="py-10 h-full flex justify-center">
          <div className="chat_container flex">
            <ChatList />
            <div className="w-4/6 h-full bg-slate-200 flex flex-col">
              <div className="flex p-3 border-b border-slate-300">
                <div className="flex-1 flex flex-col">
                  <div className="font-bold">test1님과 오아시스톡</div>
                  <div className="mt-2 text-xs text-slate-500">{`${"메이플스토리"} > ${"노바"} > ${"게임머니"}`}</div>
                  <div className="mt-2 text-xs text-slate-500">{`${"2억 메소"} | ${"2,000원"} | ${"캐릭터명 : test1"}`}</div>
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

              <div className="flex-1 p-4 text-sm overflow-y-auto max-h-full">
                <div className="border-t border-slate-300">
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
                    {chatMessage.map((item) => {

                      const currentTime = extractTimeFromDateString(item.chat_date);                                            

                      return (
                        <div
                          key={item.chat_id}
                          className={`mt-3 flex items-end ${
                            item.user_id === localStorage.getItem("user_id")
                              ? "self-end"
                              : ""
                          }`}
                        >
                          {item.user_id === localStorage.getItem("user_id") && (
                            <div className="text-xs">{currentTime}</div>
                          )}

                          <div
                            className={`ml-1 text-sm p-3 rounded-l-2xl rounded-b-2xl ${
                              item.user_id === localStorage.getItem("user_id")
                                ? "bg-purple-300"
                                : "bg-white"
                            }`}
                          >
                            {item.chat_content}
                          </div>
                          {item.user_id !== localStorage.getItem("user_id") && (
                            <div className="ml-1 text-xs">{currentTime}</div>
                          )}
                        </div>
                      );
                    })}
                    {/* <div className="mt-3 flex items-end self-end">
                      <div className="text-xs">15:40</div>
                      <div
                        className={`ml-1 text-sm p-3 bg-purple-300 rounded-l-2xl rounded-b-2xl`}
                      >
                        안녕하세요
                      </div>
                    </div>

                    <div className="mt-3 flex items-end">
                      <div
                        className={`text-sm p-3 bg-white rounded-r-2xl rounded-b-2xl`}
                      >
                        네, 안녕하세요
                      </div>
                      <div className="ml-1 text-xs">15:40</div>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="p-3 bg-white text-sm text-slate-400 flex">
                <CiImageOn size={30} />
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
          </div>
        </div>
      </div>
    </>
  );
}

function ChatList() {
  const [tradeState, setTradeState] = useState(TradeType.Trading);
  const [tradingState, setTradingState] = useState(TradingType.All);

  const [chatListInfo, setChatListInfo] = useState<ChatItem[]>([]);

  return (
    <>
      <div className="w-2/6 mr-3 flex flex-col bg-white">
        <div className="flex bg-slate-100">
          <button
            className={`p-1 flex-1 font-bold ${
              tradeState === TradeType.Trading
                ? "bg-white"
                : "bg-slate-200 text-slate-400 border-b border-r border-slate-400"
            }`}
            onClick={() => setTradeState(TradeType.Trading)}
          >
            거래 중
          </button>
          <button
            className={`p-1 flex-1 font-bold ${
              tradeState === TradeType.trade_complete
                ? "bg-white"
                : "bg-slate-200 text-slate-400 border-b border-l border-slate-400"
            }`}
            onClick={() => setTradeState(TradeType.trade_complete)}
          >
            거래완료
          </button>
        </div>

        <div
          className={`mt-5 text-xs flex justify-center ${
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

        <div className="mt-5 text-xs">
        <div className={`flex bg-slate-100 p-3`}>
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
      </div>


      </div>
    </>
  );
}

function ChatListItem(chat: ChatItem) {
  return (
    <>
      <div className="mt-5 text-xs">
        <div className={`flex bg-slate-100 p-3`}>
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
            <div className="mt-1">{`${chat.transaction_board_item_price} | 2,000 Hep`}</div>
            <div className="mt-1 font-bold">안녕하세요</div>
          </div>
        </div>
      </div>
    </>
  );
}
