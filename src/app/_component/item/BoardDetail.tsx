"use client";

import { h_get } from "@/js/fetch";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {BoardItem} from "@/types/board_type_id"
import GAME_NAME_LIST from "@/constants/game_list";
import GAME_SERVER_NAME_LIST from "@/constants/game_server_list";
import TrxMulti from "../heptagon/TrxMulti";
import ITEM_TYPE from "@/constants/item_type";
import { TrxMultiRef } from "@/types/heptagon/trx_multi_ref";
import {formatDateToNumber} from "@/js/date_function"
import { h_patch_by_token, h_postJson_by_token } from "@/js/fetch_by_token";

type ChildProps = {
  board_id: string;
};


export default function BoardDetail(props: ChildProps) {


  const [boardInfo, setBoardInfo] = useState<BoardItem | null>(null);
  const [buyCount, setBuyCount] = useState<number>(1);
  const [itemQuantityText, setItemQuantityText] = useState('');

  const trxMultiRef = useRef<TrxMultiRef>(null);
  

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction-board/${props.board_id}`;

    h_get(url).then((res) => {
      console.log("응답값 : ", res);
      setBoardInfo(res as BoardItem);
      setItemQuantityText(getItemQuantityText(res.transaction_board_item_type));
      console.log(itemQuantityText);
    });
  }, []);

  const handleBuy = () => {
    console.log("handleBuy 호출");
    

    if (trxMultiRef.current) {

      const price = buyCount * (boardInfo?.transaction_board_item_price || 0);
      const formattedPrice = price.toFixed(4) + ' HEP';

      if(price === 0) {
        alert("가격이 0 입니다...")
        return;
      }
      
      const trx_data = [
        {
          action_account: "eosio.token",
          action_name: "transfer",
          data: {
            from: localStorage.getItem("user_name"),
            to: "eosio.item",
            quantity: formattedPrice,
            memo: `${localStorage.getItem("user_name")}가 item.oasis에게 토큰 전송`,
          },
        },
      ];      

      const trxReqData = {
        user_data: localStorage.getItem("user_name"),
        trx_data: trx_data,
      };

      console.log("trxReaData : ", trxReqData);

      trxMultiRef?.current?.handleStartTrx(trxReqData);
    }
  
  }

  function onCompleteTrx(status : string, trx_id : string) {
    console.log("콜백 호출 성공.. onCompleteTrx", status, trx_id);

    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction`;
    const hep_price = boardInfo?.transaction_board_item_price.toFixed(4) + ' HEP';
      
    const data = {
      seller: boardInfo?.user_id.user_name.toString(),
      buyer: localStorage.getItem("user_name"),
      transaction_board_id: boardInfo?.transaction_board_id,
      price: hep_price,
      game_id: boardInfo?.game_id.game_id,
      item_count: buyCount,
      game_server: boardInfo?.game_server_id.game_server_id,
      item_type: boardInfo?.transaction_board_type,
    };

    console.log("거래 등록 url..", url, data);
    h_postJson_by_token(url, data)
    .then(res => {
      console.log("구매하기 버튼 누른 뒤 api..",res);
    })
  }

  
  return (
    <>
      <TrxMulti onCompleteTrx={onCompleteTrx} ref={trxMultiRef}/>

      <div className="py-2 bg-indigo-400">
        <div className="h-container text-white text-lg">
          {boardInfo?.transaction_board_type === 0 ? "팝니다" : "삽니다"}
          {` > ${
            GAME_NAME_LIST.find(
              (item) => item.game_id === boardInfo?.game_id.game_id
            )?.game_name
          }`}
          {` > ${
            GAME_SERVER_NAME_LIST.find(
              (item) =>
                item.game_server_id === boardInfo?.game_server_id.game_server_id
            )?.game_server_name
          }`}
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
            <div className="pl-5 py-4 w-10/12">
              {`${
                GAME_NAME_LIST.find(
                  (item) => item.game_id === boardInfo?.game_id.game_id
                )?.game_name
              }`}
              {` > ${
                GAME_SERVER_NAME_LIST.find(
                  (item) =>
                    item.game_server_id ===
                    boardInfo?.game_server_id.game_server_id
                )?.game_server_name
              }`}
            </div>
          </div>

          <div className="w-full flex items-center border-b">
            <div className="pl-5 py-4 w-2/12 bg-sky-50">거래가격</div>
            <div className="pl-5 py-4 w-10/12">
              {`1개 당 ${boardInfo?.transaction_board_item_price} HEP, 총 ${boardInfo?.transaction_board_amount} 개`}
            </div>
          </div>

          <div className="w-full flex items-stretch border-b">
            <div className="pl-5 py-4 w-2/12 bg-sky-50 flex items-center">
              거래 수량
            </div>
            <div className="pl-5 py-4 w-10/12">
              <div className="mb-5 text-sm">
                {itemQuantityText}                
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
              {boardInfo
                ? buyCount * boardInfo.transaction_board_item_price
                : "가격정보없음"}{" "}
              HEP
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          {boardInfo?.user_id.user_name ===
          localStorage.getItem("user_name") ? (
            <>
              <button className="px-10 py-6 text-bold text-lg border-2 border-indigo-500 text-indigo-500">
                삭제하기
              </button>
              <Link href={`/item/edit/${boardInfo.transaction_board_id}`}>
                <button className="ml-4 px-10 py-6 text-bold text-white text-lg bg-indigo-500">
                  수정하기
                </button>
              </Link>
            </>
          ) : (
            <button className="px-10 py-6 text-bold text-white text-lg bg-indigo-500" onClick={handleBuy}>
              구매하기
            </button>
          )}
        </div>

        <div className="mt-10">
          <div className="text-2xl pb-2 border-b-2 border-indigo-500">
            상세 정보
          </div>
          <div className="mt-5">{boardInfo?.transaction_board_detail}</div>

          <div className="mt-10">
            {boardInfo?.transaction_detail_image.length === 0 ? "" : (
              
              boardInfo?.transaction_detail_image.map((item:any) => {
                return (
                  <img key={item.transaction_detail_image_id} src={item.transaction_detail_image}></img>
                )
              })
            ) 
            }
          </div>
        </div>

        <div className="mt-40">
          <div className="text-2xl pb-2 border-b-2 border-indigo-500">
            판매자 정보
          </div>
          <div className="mt-5">{boardInfo?.transaction_board_detail}</div>
        </div>
      </div>

    </>
  );
}

const getItemQuantityText = (itemType : number) => {
  console.log("getItemQuantityText 호출")
  switch (itemType) {
    case ITEM_TYPE.GameMoney:
      return "내가 구매할 게임 머니의 수량을 입력해주세요!";
    case ITEM_TYPE.Item:
      return "내가 구매할 아이템 수량을 입력해주세요!";
    case ITEM_TYPE.Account:
      return "내가 구매할 계정의 수량을 입력해주세요!";
    case ITEM_TYPE.Other:
      return "내가 구매할 기타 아이템의 수량을 입력해주세요!";
    default:
      return "내가 구매할 아이템 수량을 입력해주세요!";
  }
};
