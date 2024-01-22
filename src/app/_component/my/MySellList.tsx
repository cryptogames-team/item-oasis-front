"use client";

import { useEffect, useState } from "react";
import MyPageHeader from "./MyPageHeader";
import { h_get } from "@/js/fetch";
import Link from "next/link";
import { h_deleteForm_by_token, h_delete_by_token } from "@/js/fetch_by_token";

const SellType = {
  Regist: 0,
  Waiting: 1,
  Continue: 2,
  Complete: 3,
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

export default function MySellList() {
  const [sellType, setSellType] = useState(SellType.Regist);
  const [boardList, setBoardList] = useState([]);
  const [selectBoard, setSelectBoard] = useState<number>(0);

  useEffect(() => {
    boardView();    
  }, [sellType]);

  function boardView() {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction-board/all`;

    let queryUrl = `?limit=10
        &filter=1
        &page=1
        &transaction_board_type=0
        &transaction_completed=${sellType}
        &user_id=${localStorage.getItem("user_id")}`;
    console.log("생성된 url ", url + queryUrl);

    h_get(url + queryUrl).then((res) => {
      console.log("h_get 응답 : ", res.board);
      setBoardList(res.board);
    });

  }

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
      <div className="h-container">
        <div className="text-xl font-bold mt-5">마이페이지</div>
        <div className="grid grid-cols-12 pt-5 gap-10">
          <MyPageHeader />
          <div className="col-span-9">
            <div className="border flex items-center p-2">
              <div className="text-xs">나의 판매 물품</div>
              <div className="mx-2">|</div>
              <div className="font-bold">판매 등록 물품</div>
            </div>

            <div className="mt-5 flex">
              <button
                className={`py-1 px-3 border-black
                ${
                  sellType === SellType.Regist
                    ? "text-black border-x border-t"
                    : "text-gray-400 border-b"
                }`}
                onClick={() => setSellType(SellType.Regist)}
              >
                판매등록 한 물품
              </button>
              <button
                className={`py-1 px-3 border-black
                ${
                  sellType === SellType.Waiting
                  ? "text-black border-x border-t"
                  : "text-gray-400 border-b"
                }`}
                onClick={() => setSellType(SellType.Waiting)}
              >
                결제대기 중 물품
              </button>
              <button
                className={`py-1 px-3 border-black
                ${
                  sellType === SellType.Continue
                  ? "text-black border-x border-t"
                  : "text-gray-400 border-b"
                }`}
                onClick={() => setSellType(SellType.Continue)}
              >
                판매진행 중 물품
              </button>
              <button
                className={`py-1 px-3 border-black
                ${
                  sellType === SellType.Complete
                  ? "text-black border-x border-t"
                  : "text-gray-400 border-b"
                }`}
                onClick={() => setSellType(SellType.Complete)}
              >
                판매완료 된 물품
              </button>
              {/* <div className="flex-1 border-b-2 border-black"></div> */}
            </div>

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

              {boardList.map((item: BoardItem) => {
                const date = new Date(item.transaction_board_date);
                const month = date.getMonth() + 1; // 월 (1 ~ 12)
                const day = date.getDate(); // 일 (1 ~ 31)
                return (
                  <div
                    key={item.transaction_board_id}
                    className="flex items-center py-4 border-b-2 text-sm"
                  >
                    <div className="w-1/12 text-center">
                      <input type="checkbox" onChange={()=>handleCheckBoxChange(item.transaction_board_id)}></input>
                    </div>
                    <div className="w-1/12 text-center">
                      {item.transaction_board_id}
                    </div>
                    <div className="w-1/12 text-center">종류</div>
                    <Link
                      className="w-5/12 text-center"
                      href={`/item/board/boardDetail/${item.transaction_board_id}`}
                    >
                      {item.transaction_board_title}
                    </Link>
                    <div className="w-1/12 text-center">
                      {item.transaction_board_amount}
                    </div>
                    <div className="w-1/12 text-center">
                      {item.transaction_board_item_price}{" "}
                      <span className="text-sm">HEP</span>
                    </div>
                    <div className="w-1/12 text-center">
                      {month + "/" + day}
                    </div>
                    <div className="w-1/12 text-center">
                      <button className="border rounded-xl border-gray-400 p-1 px-2">
                        수정
                      </button>
                    </div>
                  </div>
                );
              })}


            </div>

           

            <div className="flex mt-8">
              <button className="border border-gray-500 p-1 px-3">
                전체선택
              </button>
              <button className="ml-2 border border-gray-500 py-1 px-3" onClick={handleRemoveBoard}>
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
