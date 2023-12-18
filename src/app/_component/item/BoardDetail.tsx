"use client";

import { h_get } from "@/js/fetch";
import { useEffect, useState } from "react";

type ChildProps = {
  board_id: string;
};

interface BoardItem {
  transaction_board_amount: number;
  transaction_board_date: string;
  transaction_board_id: number;
  transaction_board_item_price: number;
  transaction_board_min_amount: number;
  transaction_board_sale_type: number;
  transaction_board_title: string;
  transaction_board_detail: string;
  transaction_board_game: string;
  transaction_board_server: string;  
  user_id: {
    user_id: number;
    user_name: string;
    profile_image: string;
  };
}

export default function BoardDetail(props: ChildProps) {

  const [boardInfo, setBoardInfo] = useState<BoardItem | null>(null);
  const [buyCount, setBuyCount] = useState<number>(1);

  useEffect(() => {
    const url = `http://221.148.25.234:1207/transaction/transactionBoard/${props.board_id}`;

    h_get(url).then((res) => {
      console.log("응답값 : ", res);
      setBoardInfo(res as BoardItem);
    });
  }, []);

  return (
    <>
      <div className="py-2 bg-indigo-400">
        <div className="h-container text-white text-lg">
          팝니다 {">"} 메이플스토리 {">"} 전체 서버
        </div>
      </div>

      <div className="mt-10 h-container flex flex-col">
        <div className="ml-5">
          <span>등록일 : </span>
          <span>
            {boardInfo ? boardInfo.transaction_board_date : "날짜 정보 없음"}
          </span>
          <div className="mt-4 text-2xl text-bold">
            {boardInfo?.transaction_board_title}
          </div>
        </div>

        <div className="mt-7 border-t-2 border-b border-indigo-400 text-lg">
          <div className="w-full flex items-center border-b">
            <div className="pl-5 py-4 w-2/12 bg-sky-50">게임명</div>
            <div className="pl-5 py-4 w-10/12">메이플스토리 {">"} 스카니아</div>
          </div>

          <div className="w-full flex items-center border-b">
            <div className="pl-5 py-4 w-2/12 bg-sky-50">거래가격</div>
            <div className="pl-5 py-4 w-10/12">
              {`1개 당 ${boardInfo?.transaction_board_item_price} HEP, 총 ${boardInfo?.transaction_board_amount} 개`}
            </div>
          </div>

          <div className="w-full flex items-stretch border-b">
            <div className="pl-5 py-4 w-2/12 bg-sky-50 flex items-center">
              아이템 수량
            </div>
            <div className="pl-5 py-4 w-10/12">
              <div className="mb-5 text-sm">
                내가 구매할 아이템 수량을 입력해주세요!
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  className="p-2 border-2 text-right"
                  value={buyCount}
                  onChange={(e) => setBuyCount(parseInt(e.target.value, 10))}
                ></input>
                <div className="ml-3">개</div>
              </div>
            </div>
          </div>

          <div className="w-full flex items-stretch border-b">
            <div className="pl-5 py-4 w-2/12 bg-sky-50 flex items-center">
              결제 금액
            </div>
            <div className="pl-5 py-4 w-10/12">
                {boardInfo ? buyCount * boardInfo.transaction_board_item_price : "가격정보없음"} HEP

            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
            <button className="px-10 py-6 text-bold text-white text-lg bg-indigo-500">구매하기</button>
        </div>

        <div className="mt-10">
            <div className="text-2xl pb-2 border-b-2 border-indigo-500">상세 정보</div>
            <div className="mt-5">
                {
                   boardInfo?.transaction_board_detail
                }
            </div>
        </div>


        <div className="mt-40">
            <div className="text-2xl pb-2 border-b-2 border-indigo-500">판매자 정보</div>
            <div className="mt-5">
                {
                   boardInfo?.transaction_board_detail
                }
            </div>
        </div>

        


      </div>
    </>
  );
}
