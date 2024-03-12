"use client";

import { useEffect, useState,Dispatch, SetStateAction } from "react";
import MyPageHeader from "./MyPageHeader";
import { h_get } from "@/js/fetch";
import Link from "next/link";
import { h_deleteForm_by_token, h_delete_by_token, h_patch_by_token } from "@/js/fetch_by_token";
import { url } from "inspector";
import RegistComponent from "../item/BoardRegist";
import ITEM_TYPE from "@/constants/item_type";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

import { BsBox2 } from "react-icons/bs";
import { FaRegHandshake } from "react-icons/fa";
import { GrDocumentVerified } from "react-icons/gr";
import { LuPackageOpen } from "react-icons/lu";

import Modal from "../universal/Modal";



const SellBuyType = {
  Sell_Regist: 0,
  Sell_Continue: 1,
  Sell_Complete: 2,  
  Buy_Regist: 3,
  Buy_Continue: 4,
  Buy_Complete: 5,
}




interface SellBuyType {
  Sell_Regist: number;
  Sell_Continue: number;
  Sell_Complete: number;
  Buy_Regist: number;
  Buy_Continue: number;
  Buy_Complete: number;
}

interface BoardItem {
  transaction_board_amount: number;
  transaction_board_date: string;
  transaction_board_item_type: number;
  transaction_board_id: number;
  transaction_board_item_price: number;
  transaction_board_min_amount: number;
  transaction_board_sale_type: number;
  transaction_board_title: string;
  game_id: {
    game_id : number;
    game_name : string;
  };
  game_server_id: {
    game_server_id : number;
    game_server_name : string;
  };
  user_id: {
    user_id: number;
    user_name: string;
    profile_image: string;
  };
}

interface BoardIngItem {
  transaction_id: number;
  seller: string;
  buyer: string;
  buy_confirmation: number;
  sell_confirmation: number;
  transaction_completed: number;
  is_fraud: number;
  transaction_board_id: number;
  price: string;
  date: string;
  game_id: {
    game_id : number;
    game_name : string;
  };
  game_server: {
    game_server_id : number;
    game_server_name : string;
  };
  item_type: number;
  item_count: number;
  board_title : string;
  transaction_board_character_name : string
}


type BoardRegistProp = {
  boardRegistList : BoardItem[];
  handleCheckBoxChange : (board_id : number) => void;
}

type BoardIngProp = {
  sellBuyType : number;
  boardIngList : BoardIngItem[];
}

type BoardIngProp2 = {
  sellBuyType : number;
  setSellBuyType : (sellBuyType : number) => void;
  boardIngList : BoardIngItem[];
}

type BoardPageProp = {
  totalCount : number;
  currentPage : number;
  setCurrentPage : (page : number) => void;
}

interface BoardHeaderProp {
  sellBuyType : number;
  setSellBuyType : Dispatch<SetStateAction<number>>;
}

export default function MySellList() {
  
  const [sellBuyType, setSellBuyType] = useState<number>(SellBuyType.Sell_Regist);

  const [boardRegistList, setBoardRegistList] = useState<BoardItem[]>([]);
  const [boardIngList, setBoardIngList] = useState<BoardIngItem[]>([]);
  const [selectBoard, setSelectBoard] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(1); //  현재 페이지 
  const [totalCount, setTotalCount] = useState<number>(1);

  useEffect(() => {
    boardView();    
  }, [sellBuyType, currentPage]);

 

  function boardView() {

    // 판매등록만 한 상품이면 (거래게시글만 올렸으면 url은 transaction-board/all으로 가져온다 )
    // 거래가 진행되었으면 (결제대기, 판매진행, 판매완료) url은 transaction-board/all로 가져온다.

    // 거래가 등록만 되었을때, 그리고 진행되지 않았을때를 구분해서 데이터를 정리해준다. (regist)  
    if(sellBuyType === SellBuyType.Sell_Regist || sellBuyType === SellBuyType.Buy_Regist) {
      board_regist();
    } else {
      board_ing();
    }
  
  }

  function board_regist() {
    setBoardRegistList([]);
    setBoardIngList([]);

    const url_regist = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction-board/all`;
    
    let queryUrl = `?limit=10
    &filter=1
    &transaction_board_type=${sellBuyType === SellBuyType.Sell_Regist ? 0 : 1} 
    &user_id=${localStorage.getItem("user_id")}
    &page=${currentPage}`;

    console.log("생성된 url_regist ", url_regist);

    h_get(url_regist + queryUrl).then((res) => {
      
      console.log("h_get 응답 : ", res.board);
      setBoardRegistList(res.board);
      setTotalCount(res.count);
    });
  }

  function board_ing() {
    setBoardRegistList([]);
    setBoardIngList([]);

    // const url_ing = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction/seller/hwang`;
    let url_ing = null;

    switch (sellBuyType) {
      case SellBuyType.Sell_Regist:
      case SellBuyType.Sell_Continue:
      case SellBuyType.Sell_Complete:
        url_ing = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction/seller/${localStorage.getItem("user_name")}`;
        break;

      case SellBuyType.Buy_Regist:      
      case SellBuyType.Buy_Continue:
      case SellBuyType.Buy_Complete:
        url_ing = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction/buyer/${localStorage.getItem("user_name")}`;
        break;
    
      default:
        console.log(`url 값이 없습니다..!`);
        return;
    }
    
    
    
    // let queryUrl = `?transaction_board_id=${}`;

    console.log(`url_ing ...`, url_ing);

    h_get(url_ing).then(async (res) => {
      console.log("board_ing 응답 : ", res, res.length);

      let filterRes = res;

      if(sellBuyType === SellBuyType.Sell_Continue || sellBuyType === SellBuyType.Buy_Continue) {
        console.log(`구매진행 또는 판매진행`);
        filterRes = [];
        filterRes = res.filter((item : any) => item.transaction_completed !== 1);        
      }

      if(sellBuyType === SellBuyType.Sell_Complete || sellBuyType === SellBuyType.Buy_Complete) {
        console.log(`구매완료 또는 판매완료`);
        filterRes = [];
        filterRes = res.filter((item : any) => item.transaction_completed === 1);        
      }

      

      if(filterRes.length === 0) {
        return;
      }

          
      const newDataPromise = filterRes.map(async (item : any) => {
        console.log("아이템의 게시글 id : ", item.transaction_board_id);
        const url_regist = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction-board/${item.transaction_board_id}`;

        // 비동기로 게시글 정보 가져오기
        const res2 = await h_get(url_regist);
        console.log("게시글 정보 : ", res2, res2.transaction_board_title);

        // 아이템에 board_title 추가 후 반환
        return { ...item, board_title: res2.transaction_board_title, game_id : res2.game_id, game_server : res2.game_server_id, transaction_board_character_name : res2.transaction_board_character_name};
      });

      const newData = await Promise.all(newDataPromise);
      console.log("새로만든 변수 ", newData);

      setBoardIngList(newData);
      setTotalCount(res.length);
    });
        
  }

  const renderComponentBasedOnSellType = (sellBuyType : any) => {
    switch (sellBuyType) {
      case SellBuyType.Sell_Regist:
      case SellBuyType.Buy_Regist:
        return <BoardContent_regist boardRegistList={boardRegistList} handleCheckBoxChange={handleCheckBoxChange}/>;

      case SellBuyType.Sell_Continue:
      case SellBuyType.Buy_Continue:
        return <BoardContent_Ing sellBuyType={sellBuyType} setSellBuyType={setSellBuyType} boardIngList={boardIngList}/>;

      case SellBuyType.Sell_Complete:
      case SellBuyType.Buy_Complete:      
        return <BoardContent_Completed sellBuyType={sellBuyType} boardIngList={boardIngList}/>;
        
      default:
        return ;
    }
  };

  const handleRemoveBoard = () => {
    console.log("handleRemoveBoard 호출");


    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction-board/${selectBoard}`;
    h_delete_by_token(url)
    .then(res => {
        console.log("게시글 삭제", res);
        boardView();
        alert("게시글이 삭제되었습니다.");
    })
  }

  const handleCheckBoxChange = (board_id : number) => {
    console.log("handleCheckBoxChange 호출");
    setSelectBoard(board_id);
    
  }

  return (
    <>
      <div className="h-container min-h-screen">
        <div className="text-xl font-bold mt-5">마이페이지</div>
        <div className="grid grid-cols-12 pt-5 gap-10">
          <div className="col-span-3">
            <div className="flex flex-col">
              <div className="border-t-4 border-purple-500"></div>
              <div className="border">
                <div className="p-3 border-b">나의 판매물품</div>
                <div className="py-3 px-5 bg-gray-100 text-sm">
                  <ul>
                    <li className="pb-1"><button onClick={() => setSellBuyType(SellBuyType.Sell_Regist)}>판매 등록한 물품</button></li>
                    <li className="pb-1"><button onClick={() => setSellBuyType(SellBuyType.Sell_Continue)}>판매진행 중 물품</button></li>
                    <li className="pb-1"><button onClick={() => setSellBuyType(SellBuyType.Sell_Complete)}>판매완료 된 물품</button></li>
                  </ul>
                </div>
                <div className="p-3 border-b">나의 구매물품</div>
                <div className="py-3 px-5 bg-gray-100 text-sm">
                  <ul>
                    <li className="pb-1"><button onClick={() => setSellBuyType(SellBuyType.Buy_Regist)}>구매 등록한 물품</button></li>
                    <li className="pb-1"><button onClick={() => setSellBuyType(SellBuyType.Buy_Continue)}>구매진행 중 물품</button></li>
                    <li className="pb-1"><button onClick={() => setSellBuyType(SellBuyType.Buy_Complete)}>구매완료 된 물품</button></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-9">
            <BoardHeader sellBuyType={sellBuyType} setSellBuyType={setSellBuyType} /> 
            

            {
              renderComponentBasedOnSellType(sellBuyType)
            }

            {
              (boardRegistList.length !== 0 || boardIngList.length !== 0) 
              && (<BoardPage totalCount={totalCount} currentPage={currentPage} setCurrentPage={setCurrentPage}/>)
            }

            {
              (sellBuyType === SellBuyType.Sell_Regist || sellBuyType === SellBuyType.Buy_Regist) && 
              (
                <div className="flex mt-5">
                  <button className="border border-gray-500 p-1 px-3">
                    전체선택
                  </button>
                  <button className="ml-2 border border-gray-500 py-1 px-3" onClick={handleRemoveBoard}>
                    삭제
                  </button>
                </div>
              )
            }

            <BoardFooter sellBuyType={sellBuyType} setSellBuyType={setSellBuyType} />
            
          </div>
        </div>
      </div>
    </>
  );
}

function BoardHeader({sellBuyType, setSellBuyType} : BoardHeaderProp) {

  const renderComponentHeaderOnSellType = (sellBuyType : any) => {
    switch (sellBuyType) {
      case SellBuyType.Sell_Regist:
      case SellBuyType.Sell_Continue:
      case SellBuyType.Sell_Complete:
        return <BoardHeaderSell sellBuyType={sellBuyType} setSellBuyType={setSellBuyType} />;

      case SellBuyType.Buy_Regist:      
      case SellBuyType.Buy_Continue:
      case SellBuyType.Buy_Complete:      
      return <BoardHeaderBuy sellBuyType={sellBuyType} setSellBuyType={setSellBuyType} />;

      default:
        return ;
    }
  };

  return (
    <div className="">
      {renderComponentHeaderOnSellType(sellBuyType)}
    </div>
  );
}

function BoardHeaderSell({sellBuyType, setSellBuyType} : BoardHeaderProp) {
  return (
    <>
      <div className="border flex items-center p-2">
        <div className="">나의 판매 물품</div>
        <div className="mx-2">|</div>
        <div className="text-xl font-bold">
          {
            sellBuyType === SellBuyType.Sell_Regist ? "판매 등록 물품" : 
            sellBuyType === SellBuyType.Sell_Continue ? "판매 진행 물품" : 
            sellBuyType === SellBuyType.Sell_Complete ? "판매 완료 물품" : "" 
          }
        </div>
      </div>
      
      <div className="my-10">
        <div className="py-3 text-lg font-bold">• 나의 거래 진행 상태</div>
        <div className=" bg-slate-50 py-3 px-5 flex border rounded-lg justify-around">
          
          <div className={`${sellBuyType === SellBuyType.Sell_Regist ? "text-blue-600" : "text-slate-400"} mx-5 flex items-center`}>
            <div className="text-2xl mr-10">판매등록</div>
            <MdOutlineKeyboardArrowRight size={30} />
          </div>

          <div className={`${sellBuyType === SellBuyType.Sell_Continue ? "text-blue-600" : "text-slate-400"} mx-5 flex items-center`}>
            <div className="text-2xl mr-10">물품 전달 중</div>
            <MdOutlineKeyboardArrowRight size={30} />
          </div>

          <div className={`${sellBuyType === SellBuyType.Sell_Complete ? "text-blue-600" : "text-slate-400"} mx-5 flex items-center`}>
            <div className="text-2xl mr-10">판매 완료</div>
          </div>
        </div>
      </div>
      
      
      

      <div className="flex">
        <button
          className={`py-1 px-3 border-black
                ${
                  sellBuyType === SellBuyType.Sell_Regist
                    ? "text-black border-x border-t"
                    : "text-gray-400 border-b"
                }`}
          onClick={() => setSellBuyType(SellBuyType.Sell_Regist)}
        >
          판매등록 한 물품
        </button>
        <button
          className={`py-1 px-3 border-black
                ${
                  sellBuyType === SellBuyType.Sell_Continue
                    ? "text-black border-x border-t"
                    : "text-gray-400 border-b"
                }`}
          onClick={() => setSellBuyType(SellBuyType.Sell_Continue)}
        >
          판매진행 중 물품
        </button>
        <button
          className={`py-1 px-3 border-black
                ${
                  sellBuyType === SellBuyType.Sell_Complete
                    ? "text-black border-x border-t"
                    : "text-gray-400 border-b"
                }`}
          onClick={() => setSellBuyType(SellBuyType.Sell_Complete)}
        >
          판매완료 된 물품
        </button>
        <button className="flex-1 border-b border-black"></button>
        {/* <div className="flex-1 border-b-2 border-black"></div> */}
      </div>
    </>
  );
  
}

function BoardHeaderBuy({sellBuyType, setSellBuyType} : BoardHeaderProp) {
  return (
    <>
      <div className="border flex items-center p-2">
        <div className="">나의 구매 물품</div>
        <div className="mx-2">|</div>
        <div className="text-xl font-bold">
          {
            sellBuyType === SellBuyType.Buy_Regist ? "구매 등록 물품" : 
            sellBuyType === SellBuyType.Buy_Continue ? "구매 진행 물품" : 
            sellBuyType === SellBuyType.Buy_Complete ? "구매 완료 물품" : "" 
          }
        </div>
      </div>

      <div className="mt-4">
        <div className="py-3 text-lg font-bold">• 나의 거래 진행 상태</div>
        <div className="bg-slate-50 py-3 px-5 flex border rounded-lg justify-around">
          
          <div className={`${sellBuyType === SellBuyType.Buy_Regist ? "text-blue-600" : "text-slate-400"} mx-5 flex items-center`}>
            <div className="text-2xl mr-10">구매등록</div>
            <MdOutlineKeyboardArrowRight size={30} />
          </div>

          <div className={`${sellBuyType === SellBuyType.Buy_Continue ? "text-blue-600" : "text-slate-400"} mx-5 flex items-center`}>
            <div className="text-2xl mr-10">구매 물품 받기 및 구매 확정</div>
            <MdOutlineKeyboardArrowRight size={30} />
          </div>

          <div className={`${sellBuyType === SellBuyType.Buy_Complete ? "text-blue-600" : "text-slate-400"} mx-5 flex items-center`}>
            <div className="text-2xl mr-10">구매 완료</div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex">
        <button
          className={`py-1 px-3 border-black
                ${
                  sellBuyType === SellBuyType.Buy_Regist
                    ? "text-black border-x border-t"
                    : "text-gray-400 border-b"
                }`}
          onClick={() => setSellBuyType(SellBuyType.Buy_Regist)}
        >
          구매등록 한 물품
        </button>
        <button
          className={`py-1 px-3 border-black
                ${
                  sellBuyType === SellBuyType.Buy_Continue
                    ? "text-black border-x border-t"
                    : "text-gray-400 border-b"
                }`}
          onClick={() => setSellBuyType(SellBuyType.Buy_Continue)}
        >
          구매진행 중 물품
        </button>
        <button
          className={`py-1 px-3 border-black
                ${
                  sellBuyType === SellBuyType.Buy_Complete
                    ? "text-black border-x border-t"
                    : "text-gray-400 border-b"
                }`}
          onClick={() => setSellBuyType(SellBuyType.Buy_Complete)}
        >
          구매완료 된 물품
        </button>
        <button className="flex-1 border-b border-black"></button>
        {/* <div className="flex-1 border-b-2 border-black"></div> */}
      </div>
    </>
  );
  
}

function BoardFooter ({sellBuyType, setSellBuyType} : BoardHeaderProp){

  const renderComponentHeaderOnSellType = (sellBuyType : any) => {
    switch (sellBuyType) {
      case SellBuyType.Sell_Regist:
      case SellBuyType.Sell_Continue:
      case SellBuyType.Sell_Complete:
        return <BoardFooterSell sellBuyType={sellBuyType} setSellBuyType={setSellBuyType} />;

      case SellBuyType.Buy_Regist:      
      case SellBuyType.Buy_Continue:
      case SellBuyType.Buy_Complete:      
      return <BoardFooterBuy sellBuyType={sellBuyType} setSellBuyType={setSellBuyType} />;

      default:
        return ;
    }
  };

  return (
    <>
      {renderComponentHeaderOnSellType(sellBuyType)}
    </>
  );
}

function BoardFooterSell({sellBuyType, setSellBuyType} : BoardHeaderProp) {

  return (
    <>
      <div className="mt-10 py-3 text-lg font-bold">• 판매 진행 순서 안내</div>
      
      <div className="grid grid-cols-4 border-2">
        <div className="px-3 py-6 border-r-2">
          <div className="mb-2 py-2 border-b-2">
            <div className="flex justify-center mb-3">
              <BsBox2 size={50} />
            </div>
            <div className="mt-5 flex justify-center items-center gap-3">
              <div className="flex justify-center items-center bg-indigo-400 text-white font-bold rounded-full p-2 h-6 w-6 text-xs text-center">
                1
              </div>
              <span className="text-indigo-500 font-bold">판매물품 등록</span>              
            </div>
          </div>
          <div>
            팝니다 게시판에 판매물품이 등록된 상태입니다.
          </div>
        </div>

        <div className="px-3 py-6 border-r-2">
          <div className="mb-2 py-2 border-b-2">
            <div className="flex justify-center mb-3">
              <FaRegHandshake size={50} />
            </div>
            <div className="mt-5 flex justify-center items-center gap-3">
              <div className="flex justify-center items-center bg-indigo-400 text-white font-bold rounded-full p-2 h-6 w-6 text-xs text-center">
                2
              </div>
              <span className="text-indigo-500 font-bold">판매 진행 중</span>              
            </div>
          </div>
          <div>
            구매자가 결제를 완료한 단계로 구매자의 정보 확인과 채팅이 가능합니다. 게임상에서 물품거래를 진행해주세요
          </div>
        </div>

        <div className="px-3 py-6 border-r-2">
          <div className="mb-2 py-2 border-b-2">
            <div className="flex justify-center mb-3">
              <GrDocumentVerified size={50} />
            </div>
            <div className="mt-5 flex justify-center items-center gap-3">
              <div className="flex justify-center items-center bg-indigo-400 text-white font-bold rounded-full p-2 h-6 w-6 text-xs text-center">
                3
              </div>
              <span className="text-indigo-500 font-bold">판매확정</span>              
            </div>
          </div>
          <div>
            구매자에게 물품을 전달하고 판매확정 버튼을 클릭하세요.
          </div>
        </div>

        <div className="px-3 py-6">
          <div className="mb-2 py-2 border-b-2">
            <div className="flex justify-center mb-3">
              <LuPackageOpen size={50} />
            </div>
            <div className="mt-5 flex justify-center items-center gap-3">
              <div className="flex justify-center items-center bg-indigo-400 text-white font-bold rounded-full p-2 h-6 w-6 text-xs text-center">
                4
              </div>
              <span className="text-indigo-500 font-bold">구매완료</span>              
            </div>
          </div>
          <div>
            구매자가 구매확정을 완료하면 거래가 종료됩니다.
          </div>
        </div>

        
      </div>

      
    </>
  )
}

function BoardFooterBuy({sellBuyType, setSellBuyType} : BoardHeaderProp) {

  return (
    <>
      <div className="mt-10 py-3 text-lg font-bold">• 구매 진행 순서 안내</div>
      
      <div className="grid grid-cols-4 border-2">
        <div className="px-3 py-6 border-r-2">
          <div className="mb-2 py-2 border-b-2">
            <div className="flex justify-center mb-3">
              <BsBox2 size={50} />
            </div>
            <div className="mt-5 flex justify-center items-center gap-3">
              <div className="flex justify-center items-center bg-indigo-400 text-white font-bold rounded-full p-2 h-6 w-6 text-xs text-center">
                1
              </div>
              <span className="text-indigo-500 font-bold">구매물품 등록</span>              
            </div>
          </div>
          <div>
            삽니다 게시판에 구매물품이 등록된 상태입니다.
          </div>
        </div>

        <div className="px-3 py-6 border-r-2">
          <div className="mb-2 py-2 border-b-2">
            <div className="flex justify-center mb-3">
              <FaRegHandshake size={50} />
            </div>
            <div className="mt-5 flex justify-center items-center gap-3">
              <div className="flex justify-center items-center bg-indigo-400 text-white font-bold rounded-full p-2 h-6 w-6 text-xs text-center">
                2
              </div>
              <span className="text-indigo-500 font-bold">구매 진행 중</span>              
            </div>
          </div>
          <div>
            판매자의 정보 확인과 채팅이 가능합니다. 게임상에서 물품거래를 진행해주세요
          </div>
        </div>

        <div className="px-3 py-6 border-r-2">
          <div className="mb-2 py-2 border-b-2">
            <div className="flex justify-center mb-3">
              <GrDocumentVerified size={50} />
            </div>
            <div className="mt-5 flex justify-center items-center gap-3">
              <div className="flex justify-center items-center bg-indigo-400 text-white font-bold rounded-full p-2 h-6 w-6 text-xs text-center">
                3
              </div>
              <span className="text-indigo-500 font-bold">구매확정</span>              
            </div>
          </div>
          <div>
            판매자에게 물품을 전달받은 후 구매확정 버튼을 클릭합니다.
          </div>
        </div>

        <div className="px-3 py-6">
          <div className="mb-2 py-2 border-b-2">
            <div className="flex justify-center mb-3">
              <LuPackageOpen size={50} />
            </div>
            <div className="mt-5 flex justify-center items-center gap-3">
              <div className="flex justify-center items-center bg-indigo-400 text-white font-bold rounded-full p-2 h-6 w-6 text-xs text-center">
                4
              </div>
              <span className="text-indigo-500 font-bold">구매완료</span>              
            </div>
          </div>
          <div>
            구매자가 구매확정을 완료하면 거래가 종료됩니다.
          </div>
        </div>

        
      </div>

      
    </>
  )
}

function BoardContent_regist({
  boardRegistList,
  handleCheckBoxChange,
}: BoardRegistProp) {

  const getItemTypeString = (item_type : number) => {
    switch (item_type) {
      case ITEM_TYPE.GameMoney:
        return "게임머니";
      case ITEM_TYPE.Item:
        return "아이템";
      case ITEM_TYPE.Account:
        return "계정";
      case ITEM_TYPE.Other:
        return "기타";
      default:
        break;
    }
  }

  return (
    <>
      <div>
        <div className="flex items-center border-y-2 py-2 bg-gray-50 mt-8 text-sm font-bold text-gray-500">
          <div className="w-1/12 text-center">선택</div>
          <div className="w-1/12 text-center">물품번호</div>
          <div className="w-1/12 text-center">종류</div>
          <div className="w-5/12 text-center">물품제목</div>
          <div className="w-1/12 text-center">수량</div>
          <div className="w-1/12 text-center">가격</div>
          <div className="w-1/12 text-center">등록일시</div>
          <div className="w-1/12 text-center">상태</div>
        </div>
        {boardRegistList.map((item: BoardItem) => {
          const date = new Date(item.transaction_board_date);
          const month = date.getMonth() + 1; // 월 (1 ~ 12)
          const day = date.getDate(); // 일 (1 ~ 31)
          return (
            <div
              key={item.transaction_board_id}
              className="flex items-center py-4 border-b-2 text-sm"
            >
              <div className="w-1/12 text-center">
                <input
                  type="checkbox"
                  onChange={() =>
                    handleCheckBoxChange(item.transaction_board_id)
                  }
                ></input>
              </div>
              <div className="w-1/12 text-center">
                {item.transaction_board_id}
              </div>
              <div className="w-1/12 text-center">{getItemTypeString(item.transaction_board_item_type)}</div>
              <div className="w-5/12 text-center">
                <Link
                  href={`/item/board/boardDetail/${item.transaction_board_id}`}
                >
                  {item.transaction_board_title}
                </Link>
                <div className=" text-blue-500">{item.game_id.game_name} - {item.game_server_id.game_server_name}</div>
              </div>

              <div className="w-1/12 text-center">
                {item.transaction_board_amount} 
              </div>
              <div className="w-1/12 text-center">
                {item.transaction_board_item_price}{" "}
                <span className="text-sm">HEP</span>
              </div>
              <div className="w-1/12 text-center">{month + "/" + day}</div>
              <div className="w-1/12 text-center">
              <Link href={`/item/board/boardDetail/${item.transaction_board_id}`}>
                <button className="border shadow-sm border-gray-400 p-1 px-2">
                  수정
                </button>
              </Link>
                
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function BoardContent_Ing({boardIngList, sellBuyType, setSellBuyType}:BoardIngProp2) {

  const [trxId, setTrxId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getItemTypeString = (item_type : number) => {
    switch (item_type) {
      case ITEM_TYPE.GameMoney:
        return "게임머니";
      case ITEM_TYPE.Item:
        return "아이템";
      case ITEM_TYPE.Account:
        return "계정";
      case ITEM_TYPE.Other:
        return "기타";
      default:
        break;
    }
  }

  const handleConfirmSell = (trx_id : number) => {
    console.log("handleConfirmSell 호출", trx_id);

    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction/sell/${trx_id}`;
    h_patch_by_token(url)
    .then(res => {
      console.log(`판매 확정 로그`, res);
      setTrxId(res.transaction_id)
      setIsModalOpen(true);
      setSellBuyType(SellBuyType.Sell_Continue);
    })
    .catch(res => {
      console.log(`판매 확정 로그`, res);
      alert("판매 확정 오류");
    })  
  }

  const handleConfirmBuy = (trx_id : number) => {
    console.log("handleConfirmSell 호출");

    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction/buy/${trx_id}`;
    h_patch_by_token(url)
    .then(res => {
      console.log(`구매확정 로그`, res);
      setSellBuyType(SellBuyType.Buy_Complete);
      setTrxId(res.transaction_id)
      setIsModalOpen(false);
      
    })
    .catch(res => {
      console.log(`구매확정 로그`, res);
      alert("구매확정 오류");
    })  
  }

  const handleCloseModal = () => {
    console.log("handleCloseModal 호출");
    setIsModalOpen(false);
  }


  return (
    <>
    <Modal isOpen={isModalOpen} closeModal={handleCloseModal} trxId={"ac4baa961ed8ba5bd5443b1196650a36f673f3282128378f07db504b9ef210fe"}>
    </Modal>
    <div>
      <div>
          <div className="flex items-center border-y-2 py-2 bg-gray-50 mt-8 text-sm font-bold text-gray-500 gap-4">
            <div className="w-1/12 text-center">거래번호</div>
            <div className="w-2/12 text-center">종류</div>
            <div className="w-6/12 text-center">물품제목</div>
            <div className="w-1/12 text-center">가격</div>
            <div className="w-2/12 text-center">거래진행</div>
            <div className="w-1/12 text-center">취소</div>
          </div>
          {boardIngList.map((item: BoardIngItem) => {
            
            const dateString = item.date.toString();
            const year = parseInt(dateString.slice(0, 4), 10);
            const month = parseInt(dateString.slice(4, 6), 10);
            const day = parseInt(dateString.slice(6, 8), 10);
            const hour = parseInt(dateString.slice(8, 10), 10);
            const minute = parseInt(dateString.slice(10, 12), 10);

            // Date 객체 생성
            const date = new Date(year, month - 1, day, hour, minute);

            // 날짜를 형식에 맞게 표시
            const formattedDate = date.toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
            });

            let result_price = item.price.replace(/\.\d+/g, ''); 
            return (
              <div
                key={item.transaction_id}
                className="flex items-center border-b-2 text-sm gap-4"
              >
                <div className="w-1/12 text-center">{item.transaction_id}</div>
                <div className="py-2 border-l-2 w-11/12">
                  <div className="py-2 w-full border-b flex items-center gap-4">
                    <div className="w-2/12 text-center">
                      {getItemTypeString(item.item_type)}
                    </div>
                    <div className="w-6/12 text-center">
                      <Link
                        href={`/item/board/boardDetail/${item.transaction_board_id}`}
                      >
                        {item.board_title}
                      </Link>
                      <div className=" text-blue-500">
                        {item.game_id.game_name} -{" "}
                        {item.game_server.game_server_name}
                      </div>
                    </div>

                    <div className="w-1/12 text-center">{result_price}</div>
                    <div className="w-2/12 flex justify-center">
                      {sellBuyType === SellBuyType.Sell_Continue && item.sell_confirmation != 1 ? (
                        <button
                          className=" text-white bg-lime-400 px-3 py-1 rounded-md shadow-sm"
                          onClick={() => handleConfirmSell(item.transaction_id)}
                        >
                          판매확정
                        </button>
                      ) : sellBuyType === SellBuyType.Buy_Continue ? (
                        <button
                          className=" text-white bg-lime-400 px-3 py-1 rounded-md shadow-sm"
                          onClick={() => handleConfirmBuy(item.transaction_id)}
                        >
                          구매확정
                        </button>
                      ) : null}
                    </div>
                    

                    <div className="w-1/12 text-center flex flex-col">
                      <button className="border shadow-sm">취소</button>
                      {/* <button className="border mt-1 borde shadow-sm">
                        신고
                      </button> */}
                    </div>
                  </div>
                  <div className="mt-2 py-2 w-full flex items-center gap-4">
                    <div className="w-10/12 text-center ml-5">
                      <div className="flex ml-3 gap-4">
                        <div className=" text-white bg-red-400 px-3 py-1 rounded-md">
                          {
                            sellBuyType === SellBuyType.Sell_Continue ? "구매자" :
                            sellBuyType === SellBuyType.Buy_Continue ? "판매자" : "sell type 오류"
                          }
                        </div>
                        <div>
                          {
                            sellBuyType === SellBuyType.Sell_Continue ? item.buyer :
                            sellBuyType === SellBuyType.Buy_Continue ? item.seller : "sell type 오류"
                          }
                        </div>
                      </div>
                      <div className="mt-2 flex ml-3 gap-4">
                        <div className=" text-white bg-green-400 px-3 py-1 rounded-md">계정명</div>
                        <div>{item.transaction_board_character_name}</div>
                      </div>
                      
                      
                    </div>
                    <div className="w-2/12 text-right">
                      <button className="text-white bg-indigo-400 px-3 py-1 rounded-md">거래톡</button>                      
                    </div>                    
                  </div>
                </div>
                

                {/* <div className="w-2/12 text-center">{formattedDate}</div> */}
              </div>
            );
          })}
      </div>
    </div>
      
    </>
  );  
  
}

function BoardContent_Completed({boardIngList, sellBuyType}:BoardIngProp) {

  const getItemTypeString = (item_type : number) => {
    switch (item_type) {
      case ITEM_TYPE.GameMoney:
        return "게임머니";
      case ITEM_TYPE.Item:
        return "아이템";
      case ITEM_TYPE.Account:
        return "계정";
      case ITEM_TYPE.Other:
        return "기타";
      default:
        break;
    }
  }

  const handleConfirmSell = (trx_id : number) => {
    console.log("handleConfirmSell 호출");

    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction/sell/${trx_id}`;
    h_patch_by_token(url)
    .then(res => {
      console.log(`판매 확정 로그`, res);
      alert("판매 확정되었습니다!");
    })
    .catch(res => {
      console.log(`판매 확정 로그`, res);
      alert("판매 확정 오류");
    })  
  }

  const handleConfirmBuy = (trx_id : number) => {
    console.log("handleConfirmSell 호출");

    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction/buy/${trx_id}`;
    h_patch_by_token(url)
    .then(res => {
      console.log(`구매확정 로그`, res);
      alert("구매확정되었습니다!");
    })
    .catch(res => {
      console.log(`구매확정 로그`, res);
      alert("구매확정 오류");
    })  
  }


  return (
    <>
    <div>
      <div>
          <div className="flex items-center border-y-2 py-2 bg-gray-50 mt-8 text-sm font-bold text-gray-500 gap-4">
            <div className="w-1/12 text-center">거래번호</div>
            <div className="w-1/12 text-center">종류</div>
            <div className="w-5/12 text-center">물품제목</div>
            <div className="w-1/12 text-center">수량</div>
            <div className="w-2/12 text-center">가격</div>
            <div className="w-1/12 text-center">완료일시</div>
          </div>
          {boardIngList.map((item: BoardIngItem) => {
            
            const dateString = item.date.toString();
            const year = parseInt(dateString.slice(0, 4), 10);
            const month = parseInt(dateString.slice(4, 6), 10);
            const day = parseInt(dateString.slice(6, 8), 10);
            const hour = parseInt(dateString.slice(8, 10), 10);
            const minute = parseInt(dateString.slice(10, 12), 10);

            // Date 객체 생성
            const date = new Date(year, month - 1, day, hour, minute);

            // 날짜를 형식에 맞게 표시
            const formattedDate = date.toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
            });

            let result_price = item.price.replace(/\.\d+/g, ''); 
            return (
              <div
                key={item.transaction_id}
                className="flex items-center py-4 border-b-2 text-sm gap-4"
              >
                <div className="w-1/12 text-center">{item.transaction_id}</div>
                <div className="w-1/12 text-center">
                  {getItemTypeString(item.item_type)}
                </div>
                <div className="w-5/12 text-center">
                  <Link
                    href={`/item/board/boardDetail/${item.transaction_board_id}`}
                  >
                    {item.board_title}
                  </Link>
                  <div className=" text-blue-500">
                    {item.game_id.game_name} - {item.game_server.game_server_name}
                  </div>
                </div>
                <div className="w-1/12 text-center">{item.item_count}</div>
                <div className="w-2/12 text-center">{result_price}</div>
                <div className="w-1/12 text-center">{formattedDate}</div>
                
                {/* <div className="w-2/12 text-center">{formattedDate}</div> */}
              </div>
            );
          })}
      </div>
    </div>
      
    </>
  );  
  
}


function BoardPage({totalCount, currentPage, setCurrentPage}:BoardPageProp) {

  const dataPerPage = 10; // 한 페이지에 보여줄 데이터 수
  const pageNumbersDisplayed = 10; // 한 번에 보여줄 페이지 버튼 수

  // 전체 페이지 수 계산
  const totalPage = Math.ceil((totalCount ?? 0) / dataPerPage);

  // 현재 페이지 기준으로 페이지 버튼의 시작과 끝 번호 계산
  const pageGroup = Math.ceil(currentPage / pageNumbersDisplayed);
  const startPage = (pageGroup - 1) * pageNumbersDisplayed + 1;
  let endPage = startPage + pageNumbersDisplayed - 1;
  endPage = endPage > totalPage ? totalPage : endPage; // 총 페이지 수를 초과하지 않도록 조정


   // 페이지 번호 리스트 생성
   const pages = [];
   for (let i = startPage; i <= endPage; i++) {
     pages.push(i);
   }
   console.log("페이지 변수 정보 ", ((totalCount ?? 0) / dataPerPage), totalPage, startPage, endPage)
 
   // 페이지 전환 함수
   const handleClick = (page : number) => {
      console.log("페이지 이동", page);
     setCurrentPage(page);
   };

   const handlePreviousPage = () => {
     console.log("handlePreviousPage 호출");
     let previous_page = currentPage - pageNumbersDisplayed;
     previous_page = previous_page < 1 ? 1 : previous_page;
     console.log("이전 페이지",previous_page);
     setCurrentPage(previous_page);
   }

   const handleNextPage = () => {
    console.log("handleNextPage 호출");
    let next_page = currentPage + pageNumbersDisplayed;
    next_page = next_page > totalPage ? totalPage : next_page;
     console.log("다음 페이지",currentPage, currentPage + pageNumbersDisplayed, next_page, endPage, totalPage);
     setCurrentPage(next_page);
  
  }
  

  return (
    <>
      <div className="my-7 flex justify-center">
        <button className="mr-4 border-2 py-2 px-3" onClick={handlePreviousPage}>{"◀"}</button>
        {pages.map((page) => (
          <button key={page} onClick={() => handleClick(page)} className={` font-bold border-2 py-2 px-4 ${currentPage === page ? "bg-black text-white" : ""}`}>
            {page}
          </button>
        ))}
        <button className="ml-4 border-2 py-2 px-3" onClick={handleNextPage}>{"▶"}</button>

      </div>
    </>
  )
  
}
