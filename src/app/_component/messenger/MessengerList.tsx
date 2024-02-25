"use client";

import { ChangeEvent, useEffect, useRef, useState, Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import {RootState} from '@/redux/reducer';
import { ChatList } from "@/types/chatList";
import { ChatMessage } from "@/types/chat_message";
import { SocketChatItem } from "@/types/socket/server_chat";
import { h_get_by_token, h_postFormImage_by_token, h_postForm_by_token } from "@/js/fetch_by_token";
import {extractTimeFromDateString} from "@/js/extractTimeFromDateString"

import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { MdInput } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import Loading from "../universal/Loding";

const TradeType = {
    Trading: 0,
    trade_complete: 1,
  };
  
const TradingType = {
    All: 0,
    Sell: 1,
    Buy: 2,
};

const ChatPageType = {
    List : 0,
    Chat : 1
}

interface ChatListProps {
    setChatPage: Dispatch<SetStateAction<number>>;
    setSelectChat: Dispatch<SetStateAction<ChatList | undefined>>;
    chatList : ChatList[];
    setChatList : Dispatch<SetStateAction<ChatList[]>>;
}

interface ChatListItemProps {
    chatList: ChatList;
    setChatPage: Dispatch<SetStateAction<number>>;
    setSelectChat: Dispatch<SetStateAction<ChatList | undefined>>;
}

interface ChatProps {
    selectChat : ChatList | undefined;
    chatMessage : SocketChatItem[];
    setChatMessage : Dispatch<SetStateAction<SocketChatItem[]>>;
    socket : any;
    setChatPage : Dispatch<SetStateAction<number>>;
}

interface ImageLoadProps {
  item : SocketChatItem;
  handleImgLoad : (loadedChat : SocketChatItem) => void;
}

export default function MessengerList() {
 const socketState : any = useSelector((state : RootState) => state.socketReducer);
  const socket = socketState.socket;
  const msg = socketState.msg;
  const notice = socketState.notice;
  const is_join = socketState.is_join;

  const [chatPage, setChatPage] = useState<number>(ChatPageType.List); // 현재 페이지에 대한 정보
  const [chatList, setChatList] = useState<ChatList[]>([]); // 채팅방 리스트
  const [selectChat, setSelectChat] = useState<ChatList | undefined>(); // 선택되어진 채팅방
  const [chatMessage, setChatMessage] = useState<SocketChatItem[]>([]); // 소켓을 통해 받은 메시지를 저장하는 배열


  useEffect(() => {

    if(selectChat) {
        console.log(`선택되어진 채팅방`, selectChat);

        if(socket !== null && selectChat?.transaction_id.toString()) {
            console.log("# 방입장.. 방 번호 : ", selectChat?.transaction_id.toString());
            console.log("# socket_id", socket.id);
            socket.emit("join", selectChat?.transaction_id.toString()); // 방 입장
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
  
  }, [selectChat]);

  useEffect(() => {

    console.log("메세지 확인", msg);
    if(msg !== null) {
      setChatMessage(prev => {
        return [{...msg, isLoad : false} ,...prev];
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


  return (
    <div className="absolute -top-[630px] right-[10px] rounded-lg w-[390px] h-[600px] chat_shadow1 chat_shadow2 flex flex-col items-start z-20 bg-white">
      {
        chatPage === ChatPageType.List ? (<ChatList setChatPage={setChatPage} setSelectChat={setSelectChat} chatList={chatList} setChatList={setChatList} />) 
        : chatPage === ChatPageType.Chat ? (<Chat selectChat={selectChat} chatMessage={chatMessage} setChatMessage={setChatMessage} socket={socket} setChatPage={setChatPage} />) : 
        (<div>페이지 랜더링 오류</div>)
      }
      
    </div>
  );
}

function ChatList({setChatPage, setSelectChat, chatList, setChatList} : ChatListProps) {
  const [tradeState, setTradeState] = useState(TradeType.Trading); // 거래중(0), 거래완료(1)를 나타내는 변수
  const [tradingState, setTradingState] = useState(TradingType.All); // 전체(0), 판매중 (1), 구매중(2)를 나타내는 타입
  

  useEffect(() => {
    const url_ing = `${process.env.NEXT_PUBLIC_BASE_URL_1}/chat/chat_title/${tradeState}/${tradingState}`;
    console.log("url_ing : ", url_ing);

    h_get_by_token(url_ing).then((res: any) => {
      console.log("채팅방 목록 불러오는 api", res);
      setChatList(res);
    });
  }, [tradeState, tradingState]);


  return (
    <>
      <div className="px-5 py-3 text-2xl font-bold w-full text-left">거래톡</div>
      <div className="px-5 mt-5 w-full">
        <div className="flex">
          <button
            className={`py-4 px-1 flex-1 font-bold border ${
              tradeState === TradeType.Trading
                ? "text-indigo-700 border-indigo-700"
                : "text-slate-400"
            }`}
            onClick={() => setTradeState(TradeType.Trading)}
          >
            거래 중
          </button>
          <button
            className={`border py-4 flex-1 font-bold ${
              tradeState === TradeType.trade_complete
                ? "text-indigo-700 border-indigo-700"
                : "text-slate-400"
            }`}
            onClick={() => setTradeState(TradeType.trade_complete)}
          >
            거래완료
          </button>
        </div>
      </div>
      <div className="w-full h-full overflow-y-auto">
        {chatList?.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center ">
            <IoChatboxEllipsesOutline size={80} className="text-indigo-400" />
            <div className="mt-5 text-lg">거래 내역이 없습니다.</div>
          </div>
        ) : (
          chatList?.map((item) => {
            return (
              <ChatListItem
                key={item.transaction_id}
                chatList={item}
                setChatPage={setChatPage}
                setSelectChat={setSelectChat}
              />
            );
          })
        )}
      </div>
      
    </>
  );
}

function ChatListItem({chatList, setChatPage, setSelectChat}: ChatListItemProps) {

    const socketState : any = useSelector((state : RootState) => state.socketReducer);
    const socket = socketState.socket;
  
    const dateTimeString = chatList.chat.chat_date.toString();
    const [datePart, timePart] = dateTimeString.split(' '); // 공백을 기준으로 문자열 분리
    const [hour, minute] = timePart.split(':'); // 시간 부분을 ":"을 기준으로 분리
    const formattedTime = `${hour}:${minute}`; // 시간과 분을 합쳐서 원하는 형식으로 표시
  
    const handleItemClick = () => {
      console.log("! handleItemClick 호출", chatList);
      setChatPage(ChatPageType.Chat);
      setSelectChat(chatList);
    }
  
    
    return (
      <>
      <div
          key={chatList.transaction_id}
          className="w-full mt-1 text-sm border-b border-slate-200"
          onClick={handleItemClick}
        >
          <div className={`flex p-3`}>
            <div className="py-2 px-2 flex flex-col items-center">
              <img src="/tier/bronze.png" className="w-10"></img>
              <div className="mt-2 text-orange-400">{}</div>
            </div>
            <div className="py-2 px-2 flex-1 flex flex-col items-start">
              <div className="w-full flex justify-between">
                <div className="font-bold">
                  {chatList.seller !== localStorage.getItem("user_name")
                    ? chatList.seller
                    : chatList.buyer}
                </div>
                <div className="">{formattedTime}</div>
              </div>
              <div className="mt-2">{`${chatList.game.game_name} > ${chatList.game_server.game_server_name}`}</div>
              <div className="mt-2">{`${chatList.price}`}</div>
              <div className="mt-2 w-full flex items-center justify-between">
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


  function Chat({selectChat, chatMessage, setChatMessage, socket, setChatPage} : ChatProps) {

    const [chatInput, setChatInput] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const handleImgLoad = (loadedChat : SocketChatItem) => {
      console.log("handleImgLoad 호출", loadedChat);

      if(chatContainerRef.current) {
        
        console.log(`포커싱 호출, 조건문`);
        chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight;
      }

      setChatMessage((prev : SocketChatItem[]) => {
        return prev.map((chat : SocketChatItem) => {
          if(chat.chat_id === loadedChat.chat_id) {
            return {...chat, isLoad : true}
          }

          return chat;
        })
      })    
    }

    useEffect(() => {
      console.log(`포커싱 호출`);
      
      if(chatContainerRef.current) {
        
        console.log(`포커싱 호출, 조건문`);
        chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight;
      }
    
    }, [chatMessage]);

    const handleBack = () => {
      console.log("handleBack 호출");
      setChatPage(ChatPageType.List);  
      
      if(socket !== null && selectChat !== undefined){
        console.log(`# 방퇴장`);
        socket.emit("exit", selectChat?.transaction_id.toString());
      }
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

    const handleMultiImage = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("! handleImage 호출", e.target.files);

      
      if (e.target.files) {
        const files = Array.from(e.target.files);

         // 최대 9개의 파일만 유지
        const filesToUpload = files.slice(0, 9);
        if(e.target.files?.length > 9) {
          alert("한번에 최대 9장만 업로드 됩니다.");        
        }


        Promise.all(
          filesToUpload.map((file) => {
            const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/chat/chat_image`;
            const formData = new FormData();
            formData.append("file", file);

            return h_postFormImage_by_token(url, formData);
          })
        )
          .then((responses) => {
            console.log("이미지 urls", responses);

            const chatMessage = {
              chatDTO: {
                chat_type: 1,
                user_id: localStorage.getItem("user_id"),
                chat_room: selectChat?.transaction_id.toString(),
                chat_content: JSON.stringify(responses),
              },
              recieverId: selectChat?.user.user_id,
            };

            console.log("새로운 chatMessages: ", chatMessage);
            socket && socket.emit("chatMessage", chatMessage);
            
          })
          .catch((error) => {
            console.error("이미지 업로드 오류:", error);
            
          });
      }
    };

    const handleClickImage = () => {
      console.log("! handleClickImage 호출");
      const fileInput = document.getElementById("fileInput");
      fileInput?.click();
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
    

    return (
      <div className="w-full h-full pt-3 border-l-2  flex flex-col">
        <div className="px-3 flex items-center text-2xl font-bold w-full text-left">
          <button onClick={handleBack}><IoIosArrowBack /></button>
          <div className="ml-3">{selectChat?.user.user_name}님과 거래톡</div>
        </div>
        <div className="flex p-3 border-b border-slate-300">
          <div className="flex-1 flex flex-col items-start">
            <div className="mt-2 text-xs text-slate-500">
              {`${selectChat?.game.game_name} > ${
                selectChat?.game_server.game_server_name
              } > ${"게임머니"}`}
            </div>
            <div className="mt-2 text-xs text-slate-500">{`${
              selectChat?.item_count
            } (단위) | ${selectChat?.price} | ${"캐릭터명 : test1"}`}</div>
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
              <div className="w-5/6 py-5 px-5 flex flex-col items-center rounded-2xl bg-slate-200">
                <div className="mt-1">
                  <span className="text-indigo-500 font-bold">결제가 완료</span>{" "}
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

                const currentTime = extractTimeFromDateString(item.chat_date);

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
                          : "bg-slate-200"
                      }`}
                    >
                      {
                      item.chat_type === 0 ? (item.chat_content) : 
                      item.chat_type === 1 ? 
                      (
                        <>
                          <img
                            id={`"loading_"${item.chat_id}`}
                            className={`w-28 ${item.isLoad === false ? "" : "hidden"} `}
                            src={`/loading.gif`}
                          >
                          </img>
                          <GridImage item={item} handleImgLoad={handleImgLoad}></GridImage>
                        
                        </>
                        
                      ) : 
                      (<div>알수없는 태그</div>)
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
        <div className="p-3 bg-white border-t-2 text-sm text-slate-400 flex">
          <input
            id="fileInput"
            type="file"
            onChange={handleMultiImage}
            className="hidden"
            multiple
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
    );
  }

  function GridImage({item, handleImgLoad} :ImageLoadProps) {


    const [gridLayout, setGridLayout] = useState<string[][]>([]);
    const [imgNum, setImgNum] = useState(0);

  useEffect(() => {
    // 이미지를 그리드 레이아웃에 배치
    const imageUrls = JSON.parse(item.chat_content);
    const numImages = imageUrls.length;
    setImgNum(numImages);

    let numRows = 0;
    let numColumns = 0;

    if (numImages === 1 || numImages === 2 || numImages === 3) {
      numRows = 1;
      numColumns = numImages;
    } else if (numImages === 4) {
      numRows = 2;
      numColumns = 2;
    } else if (numImages === 5 || numImages === 6) {
      numRows = 2;
      numColumns = 3;
    } else if (numImages === 7 || numImages === 8) {
      numRows = 3;
      numColumns = 3;
    } else if (numImages >= 9) {
      numRows = 3;
      numColumns = 3;
    }


    const gridLayoutArray = [];

    let imageIndex = 0;
    for (let i = 0; i < numRows; i++) {
      const rowArray = [];

      for (let j = 0; j < numColumns; j++) {
        if (imageIndex < numImages) {
          const imageSrc = imageUrls[imageIndex];
          rowArray.push(imageSrc);
          imageIndex++;
        }
      }

      gridLayoutArray.push(rowArray);
    }

    setGridLayout(gridLayoutArray);
  }, [item.chat_content]);

    

    return (
      // <img
      //   id={`"img_"${item.chat_id}`}
      //   className={`w-28 ${item.isLoad !== false ? "" : "hidden"} `}
      //   src={`
      //   ${
      //     JSON.parse(item.chat_content).map(((img : string) => img))
      //   }`}
      //   onLoad={() => handleImgLoad(item)}
      //   ></img>
      <div className="grid">
      {gridLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="w-28 flex">
          {row.map((imageSrc, columnIndex) => (
            <div key={columnIndex} className={`w-full flex ${imgNum > 3 ? "h-10" : "" }`}>
              <img
                src={imageSrc}
                className="w-full"
                alt={`Image ${rowIndex * 3 + columnIndex + 1}`}
                onLoad={() => handleImgLoad(item)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
    );
    
  }