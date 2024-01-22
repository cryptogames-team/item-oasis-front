"use client";

import { IoStorefrontOutline, IoTicketOutline  } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { LiaCoinsSolid } from "react-icons/lia";
import { PiSwordLight } from "react-icons/pi";
import { BiCoinStack, BiCoin  } from "react-icons/bi";
import { FaUpload } from "react-icons/fa";
import { GrTrash } from "react-icons/gr";
import { GrUploadOption } from "react-icons/gr";

import { VscAccount } from "react-icons/vsc";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {h_postForm_by_token, h_putForm_by_token} from "@/js/fetch_by_token"
import {displayCurrentDateTime} from "@/js/date_function"
import { h_get, h_postJson } from "@/js/fetch";
import { GameName, GameServerName } from "@/types/game_info";
import { useRouter } from "next/navigation";


type PropsAmount = {
    amount: number;
    setAmount: React.Dispatch<React.SetStateAction<number>>;
    minAmount : number;
    setMinAmount : (minAmount: number) => void;
    price : number;
    setPrice : (price : number) => void;
    saleType : number;
    setSaleType : (saleType : number) => void;
  };

type PropsAccount = {
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  minAmount: number;
  setMinAmount: (minAmount: number) => void;
  price: number;
  setPrice: (price: number) => void;
};

interface ImageManage {
  file: File;
  preview: string;
}

const buttonGameNameStyles = {
  normal: "pl-4 pr-6 py-2 hover:bg-indigo-50 hover:text-indigo-600", // 기본 스타일
  selected: "pl-4 pr-6 py-2 bg-indigo-200 text-indigo-600", // 선택된 항목 스타일
};

const buttonGameServerNameStyles = {
  normal: "w-1/2 py-2 px-4 hover:bg-indigo-50 hover:text-indigo-600", // 기본 스타일
  selected: "w-1/2 py-2 px-4 bg-indigo-200 text-indigo-600", // 선택된 항목 스타일
};


const ItemType = {
  GameMoney: 1,
  Item: 2,
  Account: 3,
  Other: 4
};

type ChildProps = {
  board_id: string;
};

export default function EditComponent(props: ChildProps) {

  const [boardType, setBoardType] = useState(0); // 게시글 종류 (0: 팝니다, 1 : 삽니다)
  const [gameName, setGameName] = useState<number>(0); // 게임 이름
  const [gameServer, setGameServer] = useState<number>(0); // 게임 서버
  const [itemType, setItemType] = useState<number>(ItemType.GameMoney); // 게임 아이템 종류 (1 : 게임머니, 2 : 아이템, 3 : 계정, 4 : 기타)
  const [amount, setAmount] = useState<number>(0); // 판매할 개수

  const [saleType, setSaleType] = useState<number>(0); // 판매 방식 (0 : 한꺼번에, 1 : 나눠서 파느냐)
  const [price, setPrice] = useState<number>(0); // 판매 가격
  const [minAmount, setMinAmount] = useState<number>(0); // 판매할 최소 수량

  const [title, setTitle] = useState<string>(""); // 글 제목
  const [detail, setDetail] = useState<string>(""); // 글 내용
  const [characterName, setCharacterName] = useState<string>(""); // 캐릭터 이름

  const [boardImg, setBoardImg] = useState<ImageManage[]>([]); // 이미지 관리 state

  const [gameSearch, setGameSearch] = useState(""); // 게임 검색어
  const [isSearchFocus, setIsSearchFocus] = useState<boolean>(false); // 게임 검색창 활성화 여부
  const [elaGameResult, setElaGameResult] = useState<GameName[]>([]);
  const [elaGameServerResult, setElaGameServerResult] = useState<
    GameServerName[]
  >([]);

  const [selectGame, setSelectGame] = useState<GameName>();
  const [selectGameServerName, setSelectGameServerName] =
    useState<GameServerName>();

  const searchInput = useRef<HTMLInputElement>(null); // 검색어 입력창
  const searchWrapp = useRef<HTMLDivElement>(null); // 검색어 결과창

  const [isDataLoaded, setIsDataLoaded] = useState(false); // 데이터 로딩 완료 상태를 추적하는 상태 추가

  const router = useRouter();

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction-board/${props.board_id}`;

    h_get(url).then((res) => {
      console.log("정보 응답값 : ", res);
      setBoardType(res.transaction_board_type);
      setItemType(res.transaction_board_item_type);
      setAmount(res.transaction_board_amount);
      setSaleType(res.transaction_board_sale_type);
      setPrice(res.transaction_board_item_price);
      setMinAmount(res.transaction_board_min_amount);
      setTitle(res.transaction_board_title);
      setDetail(res.transaction_board_detail);
      setCharacterName(res.transaction_board_character_name);
      setGameName(res.game_id.game_id);
      setGameServer(res.game_server_id.game_server_id);
      setGameSearch(`${res.game_id.game_name} > ${res.game_server_id.game_server_name}`)

      console.log("제목, 내용 : ", res.transaction_board_title,  res.transaction_board_detail)


      const images = res.transaction_detail_image.map( (item : any) => {
        return {
          file : null,
          preview : item.transaction_detail_image
        }
      })
      setBoardImg(images);
      setIsDataLoaded(true); // 데이터 로딩이 완료되었음을 표시
    });
    
  
  }, []);

  // 아이템 종류가 바뀔 시 마다, 데이터를 초기화한다.
  useEffect(() => {
    if (!isDataLoaded) {
      setSaleType(0);
      setPrice(0);
      setMinAmount(0);
      setTitle("");
      setDetail("");
      setBoardImg([]);
      console.log("변화...")
    }
  }, [itemType, boardType]);

  useEffect(() => {
    document.addEventListener("click", handleClickWrap);

    return () => {
      document.removeEventListener("click", handleClickWrap);
    };
  }, []);

  // 게임 검색어가 바뀔때마다 엘라스틱 서버로부터 받은 게임서버의 정보를 초기화해준다.
  useEffect(() => {
    setElaGameServerResult([]);
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
    console.log("handleGameSearch 호출", e.target.value);
    setGameSearch(e.target.value);

    const url = `${process.env.NEXT_PUBLIC_BASE_URL_2}/game_ac/_search`;
    const data = {
      query: {
        match: {
          name_ngram: e.target.value,
        },
      },
    };
    h_postJson(url, data).then((res) => {
      let arrayItem = Array();
      res.hits.hits.map((item: any) => {
        arrayItem.push({
          id: item._id,
          name: item._source.name,
        });
      });

      console.log("검색 값 및 최종 배열 : ", arrayItem);
      setElaGameResult(arrayItem);
    });
  };

  // 글 제목 관련 핸들러
  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleTitle 호출", e.target.value);
    setTitle(e.target.value);
  };

  // 글 내용 관련 핸들러
  const handleDetail = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleDetail 호출", e.target.value);
    setDetail(e.target.value);
  };

  // 글 내용 관련 핸들러
  const handleCharacterName = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleCharacterName 호출", e.target.value);
    setCharacterName(e.target.value);
  };

  // 이미지 관련 핸들러
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleImage 호출", e.target.files);

    if (e.target.files) {
      const inputArray = Array();

      for (let index = 0; index < e.target.files.length; index++) {
        // 최대 입력할 수 있는 데이터는 3개
        if (boardImg.length + index < 3) {
          // console.log("이미지 개수 : ", images.length);

          const file = e.target.files[index]; // 이미지 전송을 위한 파일 데이터
          const preview = URL.createObjectURL(file); // 미리보기를 위한 파일 데이터

          inputArray.push({
            file: file,
            preview: preview,
          });
        } else {
          alert("이미지 최대 입력개수는 3개입니다!");
          break;
        }
      }

      setBoardImg((prev) => prev.concat(inputArray));

      // 메모리 누수를 방지하기 위해, 이전 URL들을 해제합니다.
      Array.from(e.target.files).forEach((file) =>
        URL.revokeObjectURL(URL.createObjectURL(file))
      );
    }
  };

  const handleImageUpload = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput?.click();
  };

  // 이미지 미리보기를 제거하는 함수
  const removeImagePreview = (
    e: React.MouseEvent<HTMLButtonElement>,
    imageData: ImageManage
  ) => {
    e.stopPropagation();
    setBoardImg(boardImg.filter((item) => item !== imageData));
    URL.revokeObjectURL(imageData.preview);
  };

  // 물품 등록시 발생하는 이벤트
  const handleEnroll = () => {
    console.log("handleEnroll 호출");
    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction-board/${props.board_id}`;
    const formData = new FormData();

    console.log("formData : ", {
      title: title,
      gameName: "test",
      gameServer: "testServer",
      itemType: itemType.toString(),
      amount: amount.toString(),
      boardType: boardType.toString(),
      saleType: saleType.toString(),
      minAmount: minAmount.toString(),
      price: price.toString(),
      detail: detail.toString(),
      characterName: characterName.toString(),
    });

    formData.append("transaction_board_title", title);
    formData.append("game_id", gameName?.toString());
    formData.append("game_server_id", gameServer?.toString());
    formData.append("transaction_board_type", boardType.toString());
    formData.append("transaction_board_item_type", itemType.toString());
    formData.append("transaction_board_amount", amount.toString());
    formData.append("transaction_board_sale_type", saleType.toString());
    formData.append("transaction_board_min_amount", minAmount.toString());
    formData.append("transaction_board_item_price", price.toString());
    formData.append("transaction_board_detail", detail.toString());
    formData.append(
      "transaction_board_character_name",
      characterName.toString()
    );
    formData.append("transaction_board_date", displayCurrentDateTime());
    formData.append("transaction_completed", "0");

    if (boardImg.length !== 0) {
      boardImg.map((item) => {
        formData.append("file", item.file);
      });
    }

    h_putForm_by_token(url, formData).then((res) => {
      console.log("게시글 수정 데이터", res);
      router.replace(`/item/board/boardDetail/${props.board_id}`);
    });
  };

  const handleClickGame = (gameName: GameName) => {
    console.log("handleClickGame 호출");
    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/game/game-server/${gameName.id}`;

    setSelectGame(gameName); // 선택한 게임 저장
    setGameName(gameName.id);

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
    setGameServer(item.game_server_id);
    setSelectGameServerName(item);
    setGameSearch(`${item.gameInfo.name} > ${item.game_server_name}`);
    setIsSearchFocus(false);
  };

  const renderComponent = () => {
    switch (itemType) {
      case ItemType.GameMoney:
        return (
          <TabGameMoney
            amount={amount}
            setAmount={setAmount}
            minAmount={minAmount}
            setMinAmount={setMinAmount}
            price={price}
            setPrice={setPrice}
            saleType={saleType}
            setSaleType={setSaleType}
          />
        );
      case ItemType.Item:
        return (
          <TabGameItem
            amount={amount}
            setAmount={setAmount}
            minAmount={minAmount}
            setMinAmount={setMinAmount}
            price={price}
            setPrice={setPrice}
            saleType={saleType}
            setSaleType={setSaleType}
          />
        );
      case ItemType.Account:
        return (
          <TabGameAccount
            amount={amount}
            setAmount={setAmount}
            minAmount={minAmount}
            setMinAmount={setMinAmount}
            price={price}
            setPrice={setPrice}
          />
        );
      case ItemType.Other:
        return (
          <TabGameOther
            amount={amount}
            setAmount={setAmount}
            minAmount={minAmount}
            setMinAmount={setMinAmount}
            price={price}
            setPrice={setPrice}
            saleType={saleType}
            setSaleType={setSaleType}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <div className="bg-indigo-400 w-full py-1">
        <div className="h-container flex">
          <div className="font-bold text-white text-lg">물품 등록</div>
        </div>
      </div>
      <div className="mt-5 w-full flex flex-col items-center">
        <div className="h-container">
          <div className="grid grid-cols-12 justify-items-center gap-5">
            <div className="col-span-4 flex items-center place-self-start text-lg">
              어떤 물품을<br></br>등록하시겠어요?
            </div>
            <div className="col-span-8 place-self-stretch flex justify-between">
              <button
                className={`flex items-center ${boardType === 0 ? "" : ""}`}
                onClick={() => setBoardType(0)}
              >
                <IoStorefrontOutline
                  size={70}
                  className={`${
                    boardType === 0 ? "text-indigo-500" : "text-slate-700"
                  }`}
                />
                <div
                  className={`ml-7 text-2xl ${
                    boardType === 0 ? "text-indigo-500" : "text-slate-700"
                  }`}
                >
                  팔고 싶어요
                </div>
              </button>
              <button
                className="flex items-center text-2xl"
                onClick={() => setBoardType(1)}
              >
                <AiOutlineShoppingCart
                  className={`${
                    boardType === 1 ? "text-indigo-500" : "text-slate-700"
                  }`}
                  size={70}
                />
                <div
                  className={`ml-7 text-2xl ${
                    boardType === 1 ? "text-indigo-500" : "text-slate-700"
                  }`}
                >
                  사고 싶어요
                </div>
              </button>
            </div>

            <div className="col-span-4 flex items-center place-self-stretch text-lg">
              게임명과 서버명을<br></br>입력해주세요.
            </div>
            <div className="col-span-8 place-self-stretch flex justify-between w-full">
              <div className="relative w-full">
                <div
                  id="search_input"
                  className="h-10 py-7 border-b-2  border-indigo-400 flex items-center flex-1"
                >
                  <div className="flex-1">
                    <input
                      className="w-full p-2 focus:outline-none"
                      type="text"
                      placeholder="게임명과 서버명을 입력해주세요."
                      onChange={handleGameSearch}
                      onFocus={() => setIsSearchFocus(true)}
                      value={gameSearch}
                      ref={searchInput}
                    ></input>
                  </div>
                  <IoIosSearch
                    className="ml-2 text-indigo-400 mr-3"
                    size={35}
                  />
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
                      <div className="pt-4 pl-4 text-sm">
                        검색결과가 없습니다.
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col h-64 overflow-auto">
                          <div className="pt-3"></div>
                          {elaGameResult.map((item: GameName) => {
                            const isGameSelected =
                              selectGame && selectGame.id === item.id;
                            return (
                              <button
                                key={`${item.id}_${item.name}`}
                                className={`${
                                  isGameSelected
                                    ? buttonGameNameStyles.selected
                                    : buttonGameNameStyles.normal
                                }
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
                            const isGameServerSelected =
                              selectGameServerName &&
                              selectGameServerName.game_server_name ===
                                item.game_server_name;
                            return (
                              <button
                                key={`${item.game_server_id}_${item.game_server_name}`}
                                className={`${
                                  isGameServerSelected
                                    ? buttonGameServerNameStyles.selected
                                    : buttonGameServerNameStyles.normal
                                }`}
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
            </div>

            <div className="col-span-4 flex items-center place-self-stretch text-lg">
              물품 종류를<br></br>선택해주세요.
            </div>
            <div className="col-span-8 place-self-stretch flex justify-between items-center">
              <button
                className={`w-32 h-32 rounded-full p-7 border-2 flex flex-col items-center ${
                  itemType === ItemType.GameMoney
                    ? "text-indigo-500 border-indigo-500"
                    : "text-slate-700"
                }`}
                onClick={() => setItemType(ItemType.GameMoney)}
              >
                <LiaCoinsSolid size={40} />
                <div className="mt-2">게임머니</div>
              </button>
              <button
                className={`w-32 h-32 rounded-full p-7 border-2 flex flex-col items-center ${
                  itemType === ItemType.Item
                    ? "text-indigo-500 border-indigo-500"
                    : "text-slate-700"
                }`}
                onClick={() => setItemType(ItemType.Item)}
              >
                <PiSwordLight size={40} />
                <div className="mt-2">아이템</div>
              </button>
              <button
                className={`w-32 h-32 rounded-full p-7 border-2 flex flex-col items-center ${
                  itemType === ItemType.Account
                    ? "text-indigo-500 border-indigo-500"
                    : "text-slate-700"
                }`}
                onClick={() => setItemType(ItemType.Account)}
              >
                <VscAccount size={40} />
                <div className="mt-2">계정</div>
              </button>
              <button
                className={`w-32 h-32 rounded-full p-7 border-2 flex flex-col items-center ${
                  itemType === ItemType.Other
                    ? "text-indigo-500 border-indigo-500"
                    : "text-slate-700"
                }`}
                onClick={() => setItemType(ItemType.Other)}
              >
                <IoTicketOutline size={40} />
                <div className="mt-2">기타</div>
              </button>
            </div>

            {renderComponent()}

            <div className="col-span-4 flex items-center place-self-stretch text-lg">
              제목을 입력해주세요
            </div>
            <div className="col-span-8 place-self-stretch flex justify-between items-center">
              <input
                type="text"
                placeholder="제목을 입력해주세요"
                className="p-3 flex-1 border-2"
                onChange={handleTitle}
                value={title}
              ></input>
            </div>
            <div className="col-span-4 flex items-center place-self-stretch text-lg">
              설명과 이미지를 입력해주세요
            </div>
            <div className="col-span-8 place-self-stretch flex flex-col justify-between items-center">
              <input
                type="text"
                placeholder="상세 설명을 입력해주세요"
                className="p-3 w-full border-2"
                onChange={handleDetail}
                value={detail}
              ></input>

              <input
                id="fileInput"
                type="file"
                multiple
                onChange={handleImage}
                className="hidden"
              ></input>
              <div
                className="w-full upload-container flex flex-col"
                onClick={handleImageUpload}
              >
                <div className="w-full mt-5 py-12 border-4 border-dashed flex flex-col items-center">
                  <GrUploadOption size={27} className="text-slate-500" />
                  <div className="mt-5 text-slate-400 text-sm">
                    여기에 이미지 파일을 끌어오세요. 또는 클릭하여 업로드 하세요
                  </div>
                  <div className="text-slate-400 text-sm">(최대 3장 첨부)</div>
                  <div></div>
                </div>
              </div>
              {boardImg.length > 0 && (
                <div className="mt-4 w-full flex image-preview-container">
                  {boardImg.map((item, index) => (
                    <div
                      key={index}
                      className={`image-preview flex flex-col ${
                        index === 0 ? "" : "ml-2"
                      }`}
                    >
                      <img
                        src={item.preview}
                        alt={`preview ${index}`}
                        className="w-28 h-20"
                      />
                      <button
                        className={`mt-1 flex justify-center items-center border-2 text-sm`}
                        onClick={(e) => removeImagePreview(e, item)}
                      >
                        <GrTrash />
                        <div className="ml-2">삭제</div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="col-span-4 flex items-center place-self-stretch text-lg">
              캐릭터명을 추가해주세요
            </div>
            <div className="col-span-8 place-self-stretch flex justify-between items-center">
              <input
                type="text"
                placeholder="캐릭터 이름을 입력해주세요"
                className="p-3 flex-1 border-2"
                value={characterName}
                onChange={handleCharacterName}
              ></input>
            </div>
          </div>

          <div className="my-10 flex justify-center">
            <button
              className="p-6 text-bold text-white text-lg bg-indigo-500"
              onClick={handleEnroll}
            >
              물품 수정하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function TabGameMoney({
  amount,
  setAmount,
  minAmount,
  setMinAmount,
  price,
  setPrice,
  saleType,
  setSaleType,
}: PropsAmount) {
  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle 호출");
    setAmount(parseInt(e.target.value, 10));
  };

  const handleMinAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle 호출");
    setMinAmount(parseInt(e.target.value, 10));
  };

  return (
    <>
      <div className="col-span-4 flex items-center place-self-stretch text-lg">
        보유 수량을<br></br>입력해주세요.
      </div>
      <div className="col-span-8 place-self-stretch flex flex-col">
        <input
          type="number"
          placeholder="판매할 게임 머니는 얼마인가요?"
          className="p-3 border-2 self-stretch"
          value={amount === 0 ? "" : amount}
          onChange={handleAmount}
        ></input>
        <div className="mt-2 flex text-slate-400">
          <button
            className="border-2 px-5 py-2 hover:text-black active:text-black"
            onClick={() => setAmount((prev) => prev + 10000)}
          >
            +1만
          </button>
          <button
            className="border-2 ml-2 px-5 py-2 hover:text-black active:text-black"
            onClick={() => setAmount((prev) => prev + 100000)}
          >
            +10만
          </button>
          <button
            className="border-2 ml-2 px-5 py-2 hover:text-black active:text-black"
            onClick={() => setAmount((prev) => prev + 1000000)}
          >
            +100만
          </button>
          <button
            className="border-2 ml-2 px-5 py-2 hover:text-black active:text-black"
            onClick={() => setAmount((prev) => prev + 10000000)}
          >
            +1000만
          </button>
          <button
            className="border-2 ml-2 px-5 py-2 hover:text-black active:text-black"
            onClick={() => setAmount((prev) => prev + 100000000)}
          >
            +1억
          </button>
          <button
            className="border-2 ml-2 px-5 py-2 hover:text-black active:text-black"
            onClick={() => setAmount((prev) => prev + 1000000000)}
          >
            +10억
          </button>
          <button
            className="border-2 ml-2 px-5 py-2 hover:text-black active:text-black"
            onClick={() => setAmount(0)}
          >
            초기화
          </button>
        </div>
      </div>

      <div className="col-span-4 flex items-center place-self-stretch text-lg">
        판매 방법을<br></br>입력해주세요.
      </div>
      <div className="col-span-8 place-self-stretch flex justify-between items-center">
        <button
          className={`px-2 py-4 flex-1 flex justify-center items-center border-2 ${
            saleType === 0
              ? "border-indigo-500 text-indigo-500"
              : "text-slate-500"
          }`}
          onClick={() => setSaleType(0)}
        >
          <BiCoinStack className="" size={25} />
          <div className="ml-2">한꺼번에 팔래요</div>
        </button>
        <button
          className={`px-2 py-4 flex-1 flex justify-center items-center border-2 ${
            saleType === 1
              ? "border-indigo-500 text-indigo-500"
              : "text-slate-500"
          }`}
          onClick={() => setSaleType(1)}
        >
          <BiCoin className="" size={25} />
          <BiCoin className="ml-1" size={25} />
          <BiCoin className="ml-1" size={25} />
          <div className="ml-2">나눠서 팔래요</div>
        </button>
      </div>

      {saleType === 0 ? (
        <></>
      ) : (
        <>
          <div className="col-span-4 flex items-center place-self-stretch text-lg">
            최소 수량을<br></br>입력해주세요.
          </div>
          <div className="col-span-8 place-self-stretch flex justify-between items-center">
            <input
              type="number"
              placeholder="구매자가 최소한 구매해야 하는 수량"
              className="p-3 flex-1 border-2"
              value={minAmount === 0 ? "" : minAmount}
              onChange={handleMinAmount}
            ></input>
          </div>
        </>
      )}

      <div className="col-span-4 flex items-center place-self-stretch text-lg">
        판매 가격을<br></br>입력해주세요.
      </div>
      <div className="col-span-8 place-self-stretch flex justify-between items-center">
        <input
          type="number"
          placeholder="단위 당 판매 가격 입력"
          className="mr-3 p-3 flex-1 border-2"
          value={price === 0 ? "" : price}
          onChange={(e) => setPrice(parseInt(e.target.value, 10))}
        ></input>
        <div className="mx-2">Hep</div>
      </div>
    </>
  );
}

function TabGameItem({
  amount,
  setAmount,
  minAmount,
  setMinAmount,
  price,
  setPrice,
  saleType,
  setSaleType,
}: PropsAmount) {
  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle 호출");
    setAmount(parseInt(e.target.value, 10));
  };

  const handleMinAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle 호출");
    setMinAmount(parseInt(e.target.value, 10));
  };

  return (
    <>
      <div className="col-span-4 flex items-center place-self-stretch text-lg">
        보유 수량을<br></br>입력해주세요.
      </div>
      <div className="col-span-8 place-self-stretch flex justify-between items-center">
        <input
          type="number"
          placeholder="판매할 아이템은 몇개인가요?"
          className="p-3 flex-1 border-2"
          value={amount === 0 ? "" : amount}
          onChange={handleAmount}
        ></input>
      </div>

      <div className="col-span-4 flex items-center place-self-stretch text-lg">
        판매 방법을<br></br>입력해주세요.
      </div>
      <div className="col-span-8 place-self-stretch flex justify-between items-center">
        <button
          className={`p-2 flex-1 flex justify-center items-center border-2 ${
            saleType === 0
              ? "border-indigo-500 text-indigo-500"
              : "text-slate-500"
          }`}
          onClick={() => setSaleType(0)}
        >
          <BiCoinStack className="" size={25} />
          <div className="ml-2">한꺼번에 팔래요</div>
        </button>
        <button
          className={`p-2 flex-1 flex justify-center items-center border-2 ${
            saleType === 1
              ? "border-indigo-500 text-indigo-500"
              : "text-slate-500"
          }`}
          onClick={() => setSaleType(1)}
        >
          <BiCoin className="" size={25} />
          <BiCoin className="ml-1" size={25} />
          <BiCoin className="ml-1" size={25} />
          <div className="ml-2">나눠서 팔래요</div>
        </button>
      </div>

      {saleType === 0 ? (
        <></>
      ) : (
        <>
          <div className="col-span-4 flex items-center place-self-stretch text-lg">
            최소 수량을<br></br>입력해주세요.
          </div>
          <div className="col-span-8 place-self-stretch flex justify-between items-center">
            <input
              type="number"
              placeholder="구매자가 최소한 구매해야 하는 수량"
              className="p-3 flex-1 border-2"
              value={minAmount === 0 ? "" : minAmount}
              onChange={handleMinAmount}
            ></input>
          </div>
        </>
      )}

      <div className="col-span-4 flex items-center place-self-stretch text-lg">
        판매 가격을<br></br>입력해주세요.
      </div>
      <div className="col-span-8 place-self-stretch flex justify-between items-center">
        <input
          type="number"
          placeholder="개 당 판매 가격 입력"
          className="mr-3 p-3 flex-1 border-2"
          value={price === 0 ? "" : price}
          onChange={(e) => setPrice(parseInt(e.target.value, 10))}
        ></input>
        <div className="mx-2">Hep</div>
      </div>
    </>
  );
}

function TabGameAccount({
  amount,
  setAmount,
  minAmount,
  setMinAmount,
  price,
  setPrice,
}: PropsAccount) {
  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle 호출");
    setAmount(parseInt(e.target.value, 10));
  };

  const handleMinAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle 호출");
    setMinAmount(parseInt(e.target.value, 10));
  };

  return (
    <>
      <div className="col-span-4 flex items-center place-self-stretch text-lg">
        판매 가격을<br></br>입력해주세요.
      </div>
      <div className="col-span-8 place-self-stretch flex justify-between items-center">
        <input
          type="number"
          placeholder="계정의 판매 가격을 입력해주세요"
          className="mr-3 p-3 flex-1 border-2"
          value={price === 0 ? "" : price}
          onChange={(e) => setPrice(parseInt(e.target.value, 10))}
        ></input>
        <div className="mx-2">Hep</div>
      </div>
    </>
  );
}

function TabGameOther({
  amount,
  setAmount,
  minAmount,
  setMinAmount,
  price,
  setPrice,
  saleType,
  setSaleType,
}: PropsAmount) {
  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle 호출");
    setAmount(parseInt(e.target.value, 10));
  };

  const handleMinAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle 호출");
    setMinAmount(parseInt(e.target.value, 10));
  };

  return (
    <>
      <div className="col-span-4 flex items-center place-self-stretch text-lg">
        보유 수량을<br></br>입력해주세요.
      </div>
      <div className="col-span-8 place-self-stretch flex justify-between items-center">
        <input
          type="number"
          placeholder="판매할 기타 물품은 몇개인가요?"
          className="p-3 flex-1 border-2"
          value={amount === 0 ? "" : amount}
          onChange={handleAmount}
        ></input>
      </div>

      <div className="col-span-4 flex items-center place-self-stretch text-lg">
        판매 방법을<br></br>입력해주세요.
      </div>
      <div className="col-span-8 place-self-stretch flex justify-between items-center">
        <button
          className={`p-2 flex-1 flex justify-center items-center border-2 ${
            saleType === 0
              ? "border-indigo-500 text-indigo-500"
              : "text-slate-500"
          }`}
          onClick={() => setSaleType(0)}
        >
          <BiCoinStack className="" size={25} />
          <div className="ml-2">한꺼번에 팔래요</div>
        </button>
        <button
          className={`p-2 flex-1 flex justify-center items-center border-2 ${
            saleType === 1
              ? "border-indigo-500 text-indigo-500"
              : "text-slate-500"
          }`}
          onClick={() => setSaleType(1)}
        >
          <BiCoin className="" size={25} />
          <BiCoin className="ml-1" size={25} />
          <BiCoin className="ml-1" size={25} />
          <div className="ml-2">나눠서 팔래요</div>
        </button>
      </div>

      {saleType === 0 ? (
        <></>
      ) : (
        <>
          <div className="col-span-4 flex items-center place-self-stretch text-lg">
            최소 수량을<br></br>입력해주세요.
          </div>
          <div className="col-span-8 place-self-stretch flex justify-between items-center">
            <input
              type="number"
              placeholder="구매자가 최소한 구매해야 하는 수량"
              className="p-3 flex-1 border-2"
              value={minAmount === 0 ? "" : minAmount}
              onChange={handleMinAmount}
            ></input>
          </div>
        </>
      )}

      <div className="col-span-4 flex items-center place-self-stretch text-lg">
        판매 가격을<br></br>입력해주세요.
      </div>
      <div className="col-span-8 place-self-stretch flex justify-between items-center">
        <input
          type="number"
          placeholder="개 당 판매 가격 입력"
          className="mr-3 p-3 flex-1 border-2"
          value={price === 0 ? "" : price}
          onChange={(e) => setPrice(parseInt(e.target.value, 10))}
        ></input>
        <div className="mx-2">Hep</div>
      </div>
    </>
  );
}