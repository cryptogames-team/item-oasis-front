"use client";

import { IoStorefrontOutline, IoTicketOutline  } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { LiaCoinsSolid } from "react-icons/lia";
import { PiSwordLight } from "react-icons/pi";
import { BiCoinStack, BiCoin  } from "react-icons/bi";

import { VscAccount } from "react-icons/vsc";
import { useState } from "react";
import {h_postForm_by_token} from "@/js/fetch_by_token"


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

export default function RegistComponent() {

  const [boardType, setBoardType] = useState(0); // 게시글 종류 (0: 팝니다, 1 : 삽니다)
  const [gameName, setGameName] = useState(''); // 게임 이름
  const [gameServer, setGameServer] = useState(''); // 게임 서버
  const [itemType, setItemType] = useState<number>(1); // 게임 아이템 종류 (1 : 게임머니, 2 : 아이템, 3 : 계정, 4 : 기타)
  const [amount, setAmount] = useState<number>(0); // 판매할 개수

  const [saleType, setSaleType] = useState<number>(0); // 판매 방식 (0 : 한꺼번에, 1 : 나눠서 파느냐)  
  const [price, setPrice] = useState<number>(0); // 판매 가격
  const [minAmount, setMinAmount] = useState<number>(0); // 판매할 최소 수량

  
  const [title, setTitle] = useState<string>(''); // 글 제목
  const [detail, setDetail] = useState<string>(''); // 글 내용
  const [characterName, setCharacterName] = useState<string>(''); // 캐릭터 이름


  // 글 제목 관련 핸들러
  const handleTitle = (e : React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleTitle 호출", e.target.value);
    setTitle(e.target.value)      
  }

  // 글 내용 관련 핸들러
  const handleDetail = (e : React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleDetail 호출", e.target.value);
    setDetail(e.target.value)      
  }

  // 글 내용 관련 핸들러
  const handleCharacterName = (e : React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleCharacterName 호출", e.target.value);
    setCharacterName(e.target.value)      
  }

  // 물품 등록시 발생하는 이벤트
  const handleEnroll = () => {
    console.log("handleEnroll 호출");
    const url = "http://221.148.25.234:1207/transaction";
    const formData = new FormData();

    console.log("formData : ", {
      title: title,
      gameName: gameName,
      gameServer: gameServer,
      itemType: itemType,
      amount : amount,
      boardType : boardType,
      saleType : saleType,
      minAmount : minAmount,
      price : price,
      detail : detail,
      characterName : characterName
    });
    
    formData.append("transaction_board_title", title);
    formData.append("transaction_board_game", gameName);
    formData.append("transaction_board_server", gameServer);
    formData.append("transaction_board_item_type", itemType.toString());
    formData.append("transaction_board_amount", amount.toString());
    formData.append("transaction_board_type", boardType.toString());
    formData.append("transaction_board_sale_type", saleType.toString());
    formData.append("transaction_board_min_amount", minAmount.toString());
    formData.append("transaction_board_item_price", price.toString());
    formData.append("transaction_board_detail", detail.toString());
    formData.append("transaction_board_character_name", characterName.toString());
    formData.append("transaction_board_date", "");
    // formData.append("file", "");

    // formData.append("transaction_board_title", "test2");
    // formData.append("transaction_board_game", "1");
    // formData.append("transaction_board_server", "1");
    // formData.append("transaction_board_item_type", "0");
    // formData.append("transaction_board_amount", "0");
    // formData.append("transaction_board_type", "1");
    // formData.append("transaction_board_sale_type", "1");
    // formData.append("transaction_board_min_amount", "1");
    // formData.append("transaction_board_item_price", "1");
    // formData.append("transaction_board_detail", "1");
    // formData.append("transaction_board_character_name", "1");
    // formData.append("transaction_board_date", "1");


    // h_postForm_by_token(url, formData)
    // .then(res => console.log("게시글 등록 데이터", res));
      
  }


  const renderComponent = () => {
    switch(itemType) {
        case 0:
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
        case 1:
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
        case 2:
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
        case 3:
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
        default :
            return <></>
    }
  }



  return (
    <>
        <div className="bg-indigo-400 w-full py-1">
            <div className="h-container flex">
                <div className="font-bold text-white text-lg">
                    물품 등록
                </div>
            </div>
        </div>
        <div className="mt-5 w-full flex flex-col items-center">
            
            <div className="h-container">
            <div className="grid grid-cols-12 justify-items-center gap-5">
                <div className="col-span-4 flex items-center place-self-start text-lg">
                어떤 물품을<br></br>등록하시겠어요?
                </div>
                <div className="col-span-8 place-self-stretch flex justify-between" >
                <button className={`flex items-center ${boardType === 0 ? "" :""}`} onClick={() => setBoardType(0)}>
                    <IoStorefrontOutline size={70} className={`${boardType === 0 ? "text-indigo-500" :"text-slate-700"}`} />
                    <div className={`ml-7 text-2xl ${boardType === 0 ? "text-indigo-500" :"text-slate-700"}`}>
                    팔고 싶어요
                    </div>
                </button>
                <button className="flex items-center text-2xl" onClick={() => setBoardType(1)}>
                    <AiOutlineShoppingCart className={`${boardType === 1 ? "text-indigo-500" :"text-slate-700"}`} size={70} />
                    <div className={`ml-7 text-2xl ${boardType === 1 ? "text-indigo-500" :"text-slate-700"}`}>
                    사고 싶어요
                    </div>
                </button>
                </div>

                <div className="col-span-4 flex items-center place-self-stretch text-lg">
                게임명과 서버명을<br></br>입력해주세요.
                </div>
                <div className="col-span-8 place-self-stretch flex justify-between">
                <div className="h-10 py-7 border-b-2  border-indigo-400 flex items-center flex-1">
                    <div className="flex-1">
                    <input className="w-full p-2 focus:outline-none" type="text" placeholder="게임명과 서버명을 입력해주세요."></input>
                    </div>
                    <IoIosSearch className="ml-2 text-indigo-400 mr-3" size={35} />
                </div>
                </div>


                <div className="col-span-4 flex items-center place-self-stretch text-lg">
                물품 종류를<br></br>선택해주세요.
                </div>
                <div className="col-span-8 place-self-stretch flex justify-between items-center">
                <button 
                    className={`w-32 h-32 rounded-full p-7 border-2 flex flex-col items-center ${itemType === 1 ? "text-indigo-500 border-indigo-500" :"text-slate-700"}`}
                    onClick={() => setItemType(1)}
                >
                    <LiaCoinsSolid size={40}/>
                    <div className="mt-2">게임머니</div>
                </button>
                <button 
                    className={`w-32 h-32 rounded-full p-7 border-2 flex flex-col items-center ${itemType === 2 ? "text-indigo-500 border-indigo-500" :"text-slate-700"}`}
                    onClick={() => setItemType(2)}>
                    <PiSwordLight  size={40} />
                    <div className="mt-2">아이템</div>
                </button>
                <button 
                    className={`w-32 h-32 rounded-full p-7 border-2 flex flex-col items-center ${itemType === 3 ? "text-indigo-500 border-indigo-500" :"text-slate-700"}`}
                    onClick={() => setItemType(3)}>
                    <VscAccount  size={40} />
                    <div className="mt-2">계정</div>
                </button>
                <button 
                    className={`w-32 h-32 rounded-full p-7 border-2 flex flex-col items-center ${itemType === 4 ? "text-indigo-500 border-indigo-500" :"text-slate-700"}`}
                    onClick={() => setItemType(4)}>
                    <IoTicketOutline size={40} />
                    <div className="mt-2">기타</div>
                </button>
                </div>     

                {
                renderComponent()
                }


                <div className="col-span-4 flex items-center place-self-stretch text-lg">
                제목을 입력해주세요
                </div>    
                <div className="col-span-8 place-self-stretch flex justify-between items-center">
                <input
                    type="text"
                    placeholder="제목을 입력해주세요"
                    className="p-3 flex-1 border-2"
                    onChange={handleTitle}
                ></input>
                </div>     
                <div className="col-span-4 flex items-center place-self-stretch text-lg">
                설명과 이미지를 입력해주세요
                </div>    
                <div className="col-span-8 place-self-stretch flex justify-between items-center">
                <input
                    type="text"
                    placeholder="상세 설명을 입력해주세요"
                    className="p-3 flex-1 border-2"
                    onChange={handleDetail}
                ></input>
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
                <button className="p-6 text-bold text-white text-lg bg-indigo-500" onClick={handleEnroll}>물품 등록하기</button>
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
          value={amount === 0 ? '' : amount}
          onChange={handleAmount}
        ></input>
        <div className="mt-2 flex text-slate-400">
          <button 
            className="border-2 px-5 py-2 hover:text-black active:text-black" 
            onClick={() => setAmount(prev =>  prev+10000)}>+1만
          </button>
          <button 
            className="border-2 ml-2 px-5 py-2 hover:text-black active:text-black" 
            onClick={() => setAmount(prev =>  prev+100000)}>+10만
          </button>
          <button 
            className="border-2 ml-2 px-5 py-2 hover:text-black active:text-black" 
            onClick={() => setAmount(prev =>  prev+1000000)}>+100만
          </button>
          <button 
            className="border-2 ml-2 px-5 py-2 hover:text-black active:text-black" 
            onClick={() => setAmount(prev =>  prev+10000000)}>+1000만
          </button>
          <button 
            className="border-2 ml-2 px-5 py-2 hover:text-black active:text-black" 
            onClick={() => setAmount(prev =>  prev+100000000)}>+1억
          </button>
          <button 
            className="border-2 ml-2 px-5 py-2 hover:text-black active:text-black" 
            onClick={() => setAmount(prev =>  prev+1000000000)}>+10억
          </button>
          <button 
            className="border-2 ml-2 px-5 py-2 hover:text-black active:text-black" 
            onClick={() => setAmount(0)}>초기화
          </button>
        </div>

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
              value={minAmount === 0 ? '' : minAmount}
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
          value={price === 0 ? '' : price}
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