"use client";
import { h_get } from "@/js/fetch";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import Link from "next/link";

type PropsFilter = {
  boardType: number;
  setBoardType : (boardType: number) => void;
  itemType : number;
  setItemType : (itemType: number) => void;
};

interface BoardItem {
  transaction_board_amount: number;
  transaction_board_date: string;
  transaction_board_id: number;
  transaction_board_item_price: number;
  transaction_board_min_amount: number;
  transaction_board_sale_type: number;
  transaction_board_title: string;
  user_id: {
    user_id: number;
    user_name: string;
    profile_image: string;
  };
}

export default function BoardList() {

  const [boardList, setBoardList] = useState([]);

  const [boardType, setBoardType] = useState(0); // 리스트 (0 : 팝니다, 1 : 삽니다)
  const [itemType, setItemType] = useState(0); // 물품 유형 (0 : 전체, 1 : 게임머니, 2 : 아이템, 3 : 계정, 4 : 기타)

  useEffect(() => {
    const url = 
    "http://221.148.25.234:1207/transaction/";
    let queryUrl = 
      `?transaction_board_game=1
        &transaction_board_server=1
        &transaction_board_type=${boardType}
        &transaction_board_item_type=${itemType}
        &limit=10
        &filter=3
        &page=1`;

    h_get(url+queryUrl)
    .then(res => {
      console.log("h_get 응답 : ", res.board);
      setBoardList(res.board)
    });  
  
  }, [boardType, itemType]);
  

  return (
    <>
      <div className="py-2 bg-indigo-400">
        <div className="h-container text-white text-lg">
          팝니다 {">"} 메이플스토리 {">"} 전체 서버
        </div>
      </div>
      <BoardSearchFilter
        boardType={boardType}
        setBoardType={setBoardType}
        itemType={itemType}
        setItemType={setItemType}
      />

      <div className="mt-10 h-container">
        <div className="border-y-2 border-gray-400 ">
          <div className="flex items-center font-bold bg-gray-200 text-sm py-4">
            <div className="w-1/12 text-center">서버</div>
            <div className="w-1/12 text-center">등급</div>
            <div className="w-5/12 text-center">물품 제목</div>
            <div className="w-2/12 text-center">판매 수량 / 분류</div>
            <div className="w-1/12 text-center">단위 가격</div>
            <div className="w-1/12 text-center">거래 가격</div>
            <div className="w-1/12 text-center">등록일</div>
          </div>
          {boardList.map((item : BoardItem) => {
            const date = new Date(item.transaction_board_date);
            const month = date.getMonth() + 1;  // 월 (1 ~ 12)
            const day = date.getDate();         // 일 (1 ~ 31)
            return (
                <Link key={item.transaction_board_id} href={`/item/board/boardDetail/${item.transaction_board_id}`}>
                  <div className="flex items-center py-4 border-b-2 hover:bg-sky-50">
                    <div className="w-1/12 text-center">서버</div>
                    <div className="w-1/12 text-center">등급</div>
                    <div className="w-5/12 text-center">{item.transaction_board_title}</div>
                    <div className="w-2/12 text-center">{item.transaction_board_amount}</div>
                    <div className="w-1/12 text-center">단위 가격</div>
                    <div className="w-1/12 text-center">{item.transaction_board_item_price} <span className="text-sm">HEP</span></div>
                    <div className="w-1/12 text-center">{month+"/"+day}</div>
                  </div>
                </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

function BoardSearchFilter({boardType, setBoardType, itemType, setItemType} : PropsFilter) {
  return (
    <>
      <div className="mt-10 h-container">
        <div className="border-t-2 border-b border-indigo-400 font-bold">
          <div className="flex items-center border-b">
            <div className="py-4 pl-5 w-2/12 bg-sky-50">리스트</div>
            <div className="ml-10 flex">
              <button
                className={`flex items-center p-2 rounded-full ${
                  boardType === 0 ? "bg-indigo-400 text-white" : ""
                }`}
                onClick={() => setBoardType(0)}
              >
                <div className="mr-2">팝니다</div> <FaCheck />
              </button>
              <button
                className={`ml-5 flex items-center p-2 rounded-full ${
                  boardType === 1 ? "bg-indigo-400 text-white" : ""
                }`}
                onClick={() => setBoardType(1)}
              >
                <div className="mr-2">삽니다</div> <FaCheck />
              </button>
            </div>
          </div>

          <div className="flex items-center border-b">
            <div className="py-4 pl-5 w-2/12 bg-sky-50">물품유형</div>
            <div className="ml-10 flex">
              <button
                className={`flex items-center p-2 rounded-full ${
                  itemType === 0 ? "bg-indigo-400 text-white" : ""
                }`}
                onClick={() => setItemType(0)}
              >
                <div className="mr-2">전체</div> <FaCheck />
              </button>
              <button
                className={`ml-5 flex items-center p-2 rounded-full ${
                  itemType === 1 ? "bg-indigo-400 text-white" : ""
                }`}
                onClick={() => setItemType(1)}
              >
                <div className="mr-2">게임머니</div> <FaCheck />
              </button>
              <button
                className={`ml-5 flex items-center p-2 rounded-full ${
                  itemType === 2 ? "bg-indigo-400 text-white" : ""
                }`}
                onClick={() => setItemType(2)}
              >
                <div className="mr-2">아이템</div> <FaCheck />
              </button>
              <button
                className={`ml-5 flex items-center p-2 rounded-full ${
                  itemType === 3 ? "bg-indigo-400 text-white" : ""
                }`}
                onClick={() => setItemType(3)}
              >
                <div className="mr-2">계정</div> <FaCheck />
              </button>
              <button
                className={`ml-5 flex items-center p-2 rounded-full ${
                  itemType === 4 ? "bg-indigo-400 text-white" : ""
                }`}
                onClick={() => setItemType(4)}
              >
                <div className="mr-2">기타</div> <FaCheck />
              </button>
            </div>
          </div>

          <div className="flex items-center border-b">
            <div className="py-4 pl-5 w-2/12 bg-sky-50">물품명</div>
            <div className="ml-10 flex items-center">
              <input type="text" className="focus:outline-1 border p-2"></input>
              <button className="ml-5 border-2 px-3 py-2 flex">
                <IoIosSearch className="text-indigo-400 mr-1" size={23} />
                <div>검색</div>
              </button>
              <div className="ml-5 font-normal text-sm">
                원하는 아이템을 자유롭게 검색해보세요.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
