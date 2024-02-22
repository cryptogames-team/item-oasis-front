"use client";
import { h_get } from "@/js/fetch";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import GAME_NAME from "@/constants/game_list";
import GAME_NAME_LIST from "@/constants/game_list";
import GAME_SERVER_NAME_LIST from "@/constants/game_server_list";
import RATING from "@/constants/rating";
import {BoardItem} from "@/types/board_type"
import Talk from "../messenger/TalkBtn";

type ChangeHandler = (type: number) => void;

type PropsFilter = {
  boardType: number;
  onChangeBoardType : ChangeHandler;
  itemType : number;
  onChangeItemType : ChangeHandler;
};



type BoardItemInfo = {
  totalCount : number;
  boardList : BoardItem[];
}

type BoardItemProp = {
  boardInfo : BoardItemInfo | undefined;
  currentPage : number;
  setCurrentPage : (page : number) => void;
}



const limit = 10;

export default function BoardList() {

  const [boardList, setBoardList] = useState<BoardItem[]>([]);

  const [boardInfo, setBoardInfo] = useState<BoardItemInfo | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1); //  현재 페이지 

  const [boardType, setBoardType] = useState(0); // 리스트 (0 : 팝니다, 1 : 삽니다)
  const [itemType, setItemType] = useState(4); // 물품 유형 (0 : 전체, 1 : 게임머니, 2 : 아이템, 3 : 계정, 4 : 기타)
  const [transaction_board, setTransaction_board] = useState<number>(1);
  const [transaction_board_server, setTransaction_board_server] = useState<number>(1);

  const params = useSearchParams();

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction-board/all`;
    // console.log("params 정보", Number(params.get("transaction_board_game") ?? 1))
    // console.log("params 정보2", Number(params.get("transaction_board_server") ?? 1))
    
    const queryUrl = `?game_id=${Number(
      params.get("transaction_board_game") ?? 1
    )}&game_server_id=${Number(
      params.get("transaction_board_server") ?? 1
    )}&transaction_board_type=${boardType}${
      itemType === 4 ? "" : `&transaction_board_item_type=${itemType}`
    }&limit=${limit}&filter=0&page=${currentPage}`;
    console.log("생성된 url ababa", url + queryUrl);

    h_get(url+queryUrl)
    .then(res => {
      // console.log("h_get 응답 : ", res.board);
      // setBoardList(res.board)

      const mappedData:BoardItemInfo = {
        totalCount : res.count,
        boardList : res.board
      }
      console.log("mapped 데이터 ", mappedData);
      setBoardInfo(mappedData);
    });  
  
  }, [boardType, itemType, currentPage]);

  const handleChangeBoardType = (board_type : number) => {
    console.log("handleChangeBoardType 호출");
    setBoardType(board_type);
    setCurrentPage(1);
  }

  const handleChangeItemType = (item_type : number) => {
    console.log("handleChangeItemType 호출");
    setItemType(item_type);
    setCurrentPage(1);
  }
  

  return (
    <>
      <div className="py-2 bg-indigo-400">
        <div className="h-container text-white text-lg">
          {boardType === 0 ? "팝니다" : "삽니다"} 
          {` > ${GAME_NAME_LIST.find(item => item.game_id === Number(params.get("transaction_board_game") ?? 1))?.game_name}`} 
          {` > ${GAME_SERVER_NAME_LIST.find(item => item.game_server_id === Number(params.get("transaction_board_server") ?? 1))?.game_server_name}`} 
        </div>
      </div>
      
      <BoardSearchFilter
        boardType={boardType}
        onChangeBoardType={handleChangeBoardType}
        itemType={itemType}
        onChangeItemType={handleChangeItemType}
      />
      <BoardListContent boardInfo={boardInfo} currentPage={currentPage} setCurrentPage={setCurrentPage} />

    </>
  );
}

function BoardSearchFilter({boardType, onChangeBoardType, itemType, onChangeItemType} : PropsFilter) {


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
                onClick={() => onChangeBoardType(0)}
              >
                <div className="mr-2">팝니다</div> <FaCheck />
              </button>
              <button
                className={`ml-5 flex items-center p-2 rounded-full ${
                  boardType === 1 ? "bg-indigo-400 text-white" : ""
                }`}
                onClick={() => onChangeBoardType(1)}
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
                  itemType === 4 ? "bg-indigo-400 text-white" : ""
                }`}
                onClick={() => onChangeItemType(4)}
              >
                <div className="mr-2">전체</div> <FaCheck />
              </button>
              <button
                className={`ml-5 flex items-center p-2 rounded-full ${
                  itemType === 0 ? "bg-indigo-400 text-white" : ""
                }`}
                onClick={() => onChangeItemType(0)}
              >
                <div className="mr-2">게임머니</div> <FaCheck />
              </button>
              <button
                className={`ml-5 flex items-center p-2 rounded-full ${
                  itemType === 1 ? "bg-indigo-400 text-white" : ""
                }`}
                onClick={() => onChangeItemType(1)}
              >
                <div className="mr-2">아이템</div> <FaCheck />
              </button>
              <button
                className={`ml-5 flex items-center p-2 rounded-full ${
                  itemType === 2 ? "bg-indigo-400 text-white" : ""
                }`}
                onClick={() => onChangeItemType(2)}
              >
                <div className="mr-2">계정</div> <FaCheck />
              </button>
              <button
                className={`ml-5 flex items-center p-2 rounded-full ${
                  itemType === 3 ? "bg-indigo-400 text-white" : ""
                }`}
                onClick={() => onChangeItemType(3)}
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


function BoardListContent({ boardInfo, currentPage, setCurrentPage }: BoardItemProp) {

  const dataPerPage = 10; // 한 페이지에 보여줄 데이터 수
  const pageNumbersDisplayed = 10; // 한 번에 보여줄 페이지 버튼 수

  // 전체 페이지 수 계산
  const totalPage = Math.ceil((boardInfo?.totalCount ?? 0) / dataPerPage);

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
   console.log("페이지 변수 정보 ", ((boardInfo?.totalCount ?? 0) / dataPerPage), totalPage, startPage, endPage)
 
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
    

    <div className="mt-10 h-container">
      <div className="border-y-2 border-gray-400 ">
        <div className="flex items-center font-bold bg-gray-200 text-sm py-4">
          <div className="w-1/12 text-center">서버</div>
          <div className="w-1/12 text-center">등급</div>
          <div className="w-5/12 text-center">물품 제목</div>
          <div className="w-2/12 text-center">판매 수량 / 분류</div>
          <div className="w-2/12 text-center">단위 가격 (HEP)</div>
          <div className="w-1/12 text-center">등록일</div>
        </div>
        {boardInfo?.boardList?.map((item: BoardItem) => {
          const date = new Date(item.transaction_board_date);
          const month = date.getMonth() + 1; // 월 (1 ~ 12)
          const day = date.getDate(); // 일 (1 ~ 31)
          return (
            <Link
              key={item.transaction_board_id}
              href={`/item/board/boardDetail/${item.transaction_board_id}`}
            >
              <div className="flex items-center py-4 border-b-2 hover:bg-sky-50">
                <div className="w-1/12 text-center">{item.game_server_id.game_server_name}</div>
                <div className="w-1/12 text-center">{RATING.find(rating => rating.id === item.user_id.user_rating)?.name}</div>
                <div className="w-5/12 text-center">
                  {item.transaction_board_title}
                </div>
                <div className="w-2/12 text-center">
                  {item.transaction_board_amount}
                </div>
                <div className="w-2/12 text-center">{item.transaction_board_item_price}</div>
                <div className="w-1/12 text-center">{month + "/" + day}</div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="my-10 flex justify-center">
        <button className="mr-4 border-2 py-2 px-3" onClick={handlePreviousPage}>{"◀"}</button>
        {pages.map((page) => (
          <button key={page} onClick={() => handleClick(page)} className={` font-bold border-2 py-2 px-4 ${currentPage === page ? "bg-black text-white" : ""}`}>
            {page}
          </button>
        ))}
        <button className="ml-4 border-2 py-2 px-3" onClick={handleNextPage}>{"▶"}</button>

      </div>
    </div>
    
    
    </>
    

    
  );
}