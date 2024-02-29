"use client";



import { h_get } from "@/js/fetch";
import Link from "next/link";
import { useEffect, useRef, useState, } from "react";
import {BoardItem} from "@/types/board_type_id"
import {BoardImage} from "@/types/board_type_id"
import GAME_NAME_LIST from "@/constants/game_list";
import GAME_SERVER_NAME_LIST from "@/constants/game_server_list";
import TrxMulti from "../heptagon/TrxMulti";
import ITEM_TYPE from "@/constants/item_type";
import { TrxMultiRef } from "@/types/heptagon/trx_multi_ref";
import {formatDateToNumber} from "@/js/date_function"
import { h_patch_by_token, h_postJson_by_token } from "@/js/fetch_by_token";
import { useRouter } from "next/navigation";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import {
  AiOutlineCheckCircle,
} from "react-icons/ai";


import { useSelector, useDispatch } from "react-redux";
import {RootState} from '@/redux/reducer';
import Modal from "../universal/Modal";


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

type ChildProps = {
  board_id: string;
};

type BoardProps = {
  boardInfo : BoardItem | null
}

export default function BoardDetail(props: ChildProps) {


  const [boardInfo, setBoardInfo] = useState<BoardItem | null>(null);
  const [buyCount, setBuyCount] = useState<number>(1);
  const [itemQuantityText, setItemQuantityText] = useState('');

  const [modalIsOpen, setIsOpen] = useState(true);

  const trxMultiRef = useRef<TrxMultiRef>(null);

  const dispatch = useDispatch();
  const loginState : any = useSelector((state : RootState) => state.loginReducer);
  const is_current_login = loginState.is_current_login;
  

  const [isLogin, setIsLogin] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trxId, setTrxId] = useState<string>("");

  const router = useRouter();
  

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction-board/${props.board_id}`;

    h_get(url).then((res) => {
      console.log("응답값 : ", res);
      setBoardInfo(res as BoardItem);
      setItemQuantityText(getItemQuantityText(res.transaction_board_item_type));
      console.log(itemQuantityText);
    });
  }, []);

  useEffect(() => {
    if(is_current_login === true){
      setIsLogin(true);
    } else if(is_current_login === false) {
      setIsLogin(false);
    }   
  }, [is_current_login]);


  const handleBuy = () => {
    console.log("handleBuy 호출");

    if(isLogin!==true) {
      alert("로그인을 먼저 진행해주세요!")
      return;
    } 
    

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
      transaction_board_id: boardInfo?.transaction_board_id,
      price: hep_price,
      game_id: boardInfo?.game_id.game_id,
      item_count: buyCount,
      game_server_id: boardInfo?.game_server_id.game_server_id,
      item_type: boardInfo?.transaction_board_type,
    };

    console.log("거래 등록 url..", url, data);
    h_postJson_by_token(url, data)
    .then(res => {
      console.log("구매하기 버튼 누른 뒤 api..",res);
      setTrxId(res.transaction_id);
      openModal()
    })
  }

  function openModal() {
    console.log(`모달 오픈`);
    setIsModalOpen(true);
  }


  const handleCloseModal = () => {
    console.log("handle 호출");
    setIsModalOpen(false);
    router.push(`/my/sell`);
  }

  
  return (
    <>
      <TrxMulti onCompleteTrx={onCompleteTrx} ref={trxMultiRef} />
      <Modal isOpen={isModalOpen} closeModal={handleCloseModal} trxId={trxId}>
      </Modal>

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
              <div className="mb-5 text-sm">{itemQuantityText}</div>
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
            <button
              className="px-10 py-6 text-bold text-white text-lg bg-indigo-500"
              onClick={handleBuy}
            >
              구매하기
            </button>
          )}
        </div>

        <div className="mt-10">
          <div className="text-2xl pb-2 border-b-2 border-indigo-500">
            상세 설명 및 이미지
          </div>
          <div className="mt-5">{boardInfo?.transaction_board_detail}</div>

          {boardInfo?.transaction_detail_image.length !== 0 && (
            <div className="mt-20">
              <SimpleSlider boardInfo={boardInfo} />
            </div>
          )}
        </div>

        <div className="mt-40">
          <div className="mt-7 text-2xl">판매자 정보</div>
          <div className="border-t-2 border-b border-indigo-500 text-lg">
          <div className="w-full flex items-center border-b">
            <div className="pl-5 py-4 w-2/12 bg-sky-50">계정명</div>
            <div className="pl-5 py-4 w-10/12">
              {boardInfo?.user_id.user_name}
            </div>
          </div>

          <div className="w-full flex items-center border-b">
            <div className="pl-5 py-4 w-2/12 bg-sky-50">캐릭터명</div>
            <div className="pl-5 py-4 w-10/12">
              {boardInfo?.transaction_board_character_name}
            </div>
          </div>

        </div>
        </div>
      </div>
    </>
  );
}


function SimpleSlider({ boardInfo }: BoardProps) {

  if (boardInfo?.transaction_detail_image.length === 1) {
    // 이미지가 한 개인 경우 Slider 컴포넌트 호출하지 않음
    return (
      <div className="w-full flex justify-center">
        <div key={boardInfo.transaction_detail_image[0].transaction_detail_image_id} className=" w-96">
          <img className="mx-auto" src={boardInfo.transaction_detail_image[0].transaction_detail_image} alt="Transaction Detail"></img>
        </div>
      </div>
    );
  }

  var settings = {
    customPaging: function (i: number) {

      const board_img: BoardImage | undefined = boardInfo?.transaction_detail_image[i];
      return (
        <a className="">
          <img className="" key={board_img?.transaction_detail_image_id} src={board_img?.transaction_detail_image}></img>
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb h-slick",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };


  return (
    <div className="slider-container">
      <Slider {...settings}>

        {boardInfo?.transaction_detail_image.length === 1 ?
          (<div key={boardInfo?.transaction_detail_image[0].transaction_detail_image_id} className="w-32">
            <img className="mx-auto" src={boardInfo?.transaction_detail_image[0].transaction_detail_image}></img>
          </div>)
          : (boardInfo?.transaction_detail_image.map((img: BoardImage) => {
            return (
              <div key={img.transaction_detail_image_id} className="w-32">
                <img className="mx-auto" src={img.transaction_detail_image}></img>
              </div>
            );
          }))
        }

      </Slider>
    </div>
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
