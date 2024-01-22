"use client";

import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import { CgMenuRound } from "react-icons/cg";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { h_get, h_postJson } from "@/js/fetch";
import { useRouter } from "next/navigation";
import { GameName, GameServerName } from "@/types/game_info";


const buttonGameNameStyles = {
  normal: "pl-4 pr-6 py-2 hover:bg-indigo-50 hover:text-indigo-600", // 기본 스타일
  selected: "pl-4 pr-6 py-2 bg-indigo-200 text-indigo-600", // 선택된 항목 스타일
};

const buttonGameServerNameStyles = {
  normal: "w-1/2 py-2 px-4 hover:bg-indigo-50 hover:text-indigo-600", // 기본 스타일
  selected: "w-1/2 py-2 px-4 bg-indigo-200 text-indigo-600", // 선택된 항목 스타일
};

export default function Search() {
  const [gameSearch, setGameSearch] = useState(""); // 게임 검색어
  const [isSearchFocus, setIsSearchFocus] = useState<boolean>(false); // 게임 검색창 활성화 여부
  const [elaGameResult, setElaGameResult] = useState<GameName[]>([]);
  const [elaGameServerResult, setElaGameServerResult] = useState<
    GameServerName[]
  >([]);

  const [selectGame, setSelectGame] = useState<GameName>();
  const [selectGameServerName, setSelectGameServerName] = useState<GameServerName>();
  
  const searchInput = useRef<HTMLInputElement>(null); // 검색어 입력창
  const searchWrapp = useRef<HTMLDivElement>(null); // 검색어 결과창

  const router = useRouter();

  useEffect(() => {
    document.addEventListener("click", handleClickWrap);

    return () => {
      document.removeEventListener("click", handleClickWrap);
    };
  }, []);

  // 게임 검색어가 바뀔때마다 엘라스틱 서버로부터 받은 게임서버의 정보를 초기화해준다.
  useEffect(() => {
    setElaGameServerResult([])
  }, [gameSearch]);

  const handleClickWrap = (e: MouseEvent) => {
    if (e.target instanceof Node) {
      if (
        document.activeElement !== searchInput.current &&
        !searchWrapp.current?.contains(e.target)
      ) {
        console.log("밖에서 호출");
        setIsSearchFocus(false);
      }
    }
  };

  const handleGameSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleGameSearch 호출 1", e.target.value);
    console.log("handleGameSearch 호출 2", e.target);

    if(e.target.value === "") {
      return;
    }


    setGameSearch(e.target.value)

    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/search/${e.target.value}`;
    h_get(url).then((res) => {
      let arrayItem = Array();
      res.map((item: any) => {
        arrayItem.push({
          id: item._id,
          name: item._source.name,
        });
      });

      console.log("검색 값 및 최종 배열 : ", arrayItem);
      setElaGameResult(arrayItem);
      
    });
  };

  const handleClickGame = (gameName: GameName) => {
    console.log("handleClickGame 호출 ababa");
    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/game/game-server/${gameName.id}`;

    setSelectGame(gameName); // 선택한 게임 저장

    h_get(url).then((res) => {
      console.log("게임 서버", res);

      let arrayItem = Array();
      res.map((item: any) => {
        const gameServerItem: GameServerName = {
          gameInfo: gameName,
          game_server_id: item.game_server_id,
          game_server_name: item.game_server_name,
        };

        arrayItem.push(gameServerItem);
      });
      setElaGameServerResult(arrayItem);
    });
  };

  const handleClickGameServer = (item: GameServerName) => {
    console.log("handleClickGameServer 호출", item);

    setSelectGameServerName(item); // 게임서버 저장

    router.push(`/item/board?transaction_board_game=${item.gameInfo.id}&transaction_board_server=${item.game_server_id}`);
  };

  return (
    <>
      <div className="w-full border-b-2">
        <div className="h-container mt-5 flex items-center">
          <Image
            src="/아이템오아시스로고.png"
            width={80}
            height={80}
            alt="로고"
          ></Image>
          <Link href="/">
            <button className="ml-2 text-2xl">아이템 오아시스</button>
          </Link>

          <div className="ml-5 relative flex-1">
            <div
              className={`h-10 px-4 py-5 border-2 rounded-t-lg border-indigo-400 flex items-center flex-1 ${
                isSearchFocus === false ? "rounded-b-lg" : ""
              }`}
            >
              <div className="flex-1"></div>
              <input
                className="w-full focus:outline-none"
                type="text"
                onChange={handleGameSearch}
                onFocus={() => setIsSearchFocus(true)}
                value={gameSearch}
                ref={searchInput}
              ></input>
              <IoIosSearch className="text-indigo-400 mr-3" size={23} />
            </div>
            <div
              id="search_result"
              className={`${
                isSearchFocus === true ? "" : "hidden"
              } bg-white absolute w-full h-64 border-b-2 border-x-2 border-indigo-400 rounded-b-lg`}
              ref={searchWrapp}
            >
              <div className="flex border-l-2">
                {elaGameResult.length === 0 ? (
                  <div className="pt-4 pl-4 text-sm">검색결과가 없습니다.</div>
                ) : (
                  <>
                    <div className="flex flex-col h-64 overflow-auto">
                      <div className="pt-3"></div>
                      {elaGameResult.map((item: GameName) => {
                        const isGameSelected = selectGame && selectGame.id === item.id;
                        return (
                          <button
                            key={`${item.id}_${item.name}`}
                            className={`${isGameSelected ? buttonGameNameStyles.selected : buttonGameNameStyles.normal}
                            `}
                            onClick={() => handleClickGame(item)}
                          >
                            {item.name}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex-1 w-full h-64 overflow-auto border-l-2">
                      <div className="pt-3"></div>
                      {elaGameServerResult.map((item: GameServerName) => {
                        const isGameServerSelected = selectGameServerName && selectGameServerName.game_server_name === item.game_server_name;
                        return (
                          <button
                            key={`${item.game_server_id}_${item.game_server_name}`}
                            className={`${isGameServerSelected ? buttonGameServerNameStyles.selected : buttonGameServerNameStyles.normal}`}
                            onClick={() => handleClickGameServer(item)}
                          >
                            {item.game_server_name}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="ml-10 flex text-white font-bold">
            <Link href="/item/regist">
              <button className="py-3 px-5 rounded-xl bg-indigo-400">
                판매 등록
              </button>
            </Link>

            <button className="mx-3 py-3 px-5 rounded-xl bg-indigo-400">
              구매 등록
            </button>
          </div>
        </div>

        <div className="mt-8 mb-5 h-container flex items-center">
          <Link
            href="/item/board/?transaction_board_game=1&transaction_board_server=1"
            className="text-lg text-bold text-indigo-600 flex items-center"
          >
            <CgMenuRound size={30} />
            <div className="ml-2">추천 게임</div>
          </Link>
          <Link 
            href="/item/board/?transaction_board_game=1&transaction_board_server=1"
            className="ml-10 text-lg text-bold">
            자유 게시판
          </Link>
          <Link href="/my/sell" className="ml-10 text-lg text-bold">
            마이 페이지
          </Link>
          <Link href="/messenger" className="ml-10 text-lg text-bold">
            채팅 테스트 링크
          </Link>
        </div>
      </div>
    </>
  );
}
