"use client";
import { h_get } from "@/js/fetch";
import Image from "next/image";
import { useEffect, useState } from "react";
import {BoardItem} from "@/types/board_type"
import { useSelector, useDispatch } from "react-redux";
import {RootState} from '@/redux/reducer';
import { CiSettings } from "react-icons/ci";
import Link from "next/link";

const TradeType = {
  Trading: 1,
  trade_complete: 2,
};

type BoardItemInfo = {
  totalCount : number;
  boardList : BoardItem[];
}

export default function Main() {

  const dispatch = useDispatch();
  const loginState : any = useSelector((state : RootState) => state.loginReducer);
  const is_current_login = loginState.is_current_login;
  const user_name = loginState.user_name;
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUserName] = useState(user_name);

  const [sellCount, setSellCount] = useState<number>(0);
  const [buyCount, setBuyCount] = useState<number>(0);

  useEffect(() => {
    if(is_current_login === true){
      setIsLogin(true);
    } else if(is_current_login === false) {
      setIsLogin(false);
    }   
  }, [is_current_login]);

  useEffect(() => {
    setUserName(user_name);

    console.log(`user_name`, user_name);  
    
    if(is_current_login === true && user_name !== null) {
      const url_seller = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction/seller/${user_name}`;
      h_get(url_seller).then((res) => {
        console.log("seller 응답 : ", res);
        setSellCount(res.length);
      });

      const url_buyer = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction/buyer/${user_name}`;
      h_get(url_buyer).then((res) => {
        console.log("buyer 응답 : ", res);
        setBuyCount(res.length);
      });

    }
  }, [user_name]);

  

  const [boardInfo, setBoardInfo] = useState<BoardItemInfo | undefined>();
  

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/transaction-board/all`;
    const queryUrl = `?page=1&limit=4&filter=2&transaction_completed=0`;
    h_get(url+queryUrl)
    .then(res => {
      const mappedData:BoardItemInfo = {
        totalCount : res.count,
        boardList : res.board
      }
      console.log("mapped 데이터 ", mappedData);
      setBoardInfo(mappedData);
    });
  
  }, []);
 


  return (
    <>
      <div className="w-full">
        <div className="h-container flex flex-col">
          <div className="flex">
            <div className="w-4/6 pr-4">
              <img src="/item_main.jpg" className=" rounded-lg">
              </img>
            </div>

            <div className="ml-5 w-2/6 flex flex-col">
              <div className="flex flex-col items-center basic_shadow1 basic_shadow2 p-4 rounded-md">
                {
                  is_current_login === true ? 
                  (<div className="mt-3 flex flex-col">
                    <div className="self-end"><Link href="/my/sell"><button><CiSettings size={25} /></button></Link></div>                    
                    <div className="text-xl font-bold">{userName} 님, </div>
                    <div className="mt-2 text-xl">오늘은 어떤 게임을 찾으세요? </div>
                    <div className=" px-2 pb-4 pt-6 flex justify-between">
                      <div className="flex flex-col items-center">
                        <div>{sellCount}</div>
                        <div>판매진행 중</div>
                      </div>
                      <div className="border-r border-slate-400"></div>
                      <div className="flex flex-col items-center">
                        <div>{buyCount}</div>
                        <div>구매진행 중</div>
                      </div>

                    </div>
                  </div>) 
                  :(<>
                    <div className="text-xl font-bold">블록체인 기반 아이템 안전거래 플랫폼</div>
                    <div className="mt-2 text-xl font-bold">아이템 오아시스</div>
                    <button className="mt-10 bg-indigo-400 text-white p-4 rounded-lg font-bold">아이템 오아시스 로그인</button>
                  </>)
                }
                
              </div>
            </div>
            
          </div>

          <div className="mt-20 flex flex-col">
            <div className="font-bold text-2xl">거래가이드</div>
            <div className="mt-7 flex">
              
              <div className="relative">
                <img className="" src="/거래가이드/거래방법.png"></img>
                <div className=" absolute top-0 left-0 pt-3 pl-5 text-2xl font-bold text-indigo-400">
                  <div>거래 방법</div>
                  <div>안내</div>
                </div>
              </div>

              <div className="ml-10 relative">
                <img className="" src="/거래가이드/안전보호.png"></img>
                <div className=" absolute top-0 left-0 pt-3 pl-5 text-2xl font-bold text-lime-400">
                  <div>안전거래</div>
                  <div>시스템</div>
                </div>
              </div>

              <div className="ml-10 relative">
                <img className="" src="/거래가이드/주의사항.png"></img>
                <div className=" absolute top-0 left-0 pt-3 pl-5 text-2xl font-bold text-red-400">
                  <div>거래</div>
                  <div>주의사항!</div>
                </div>
              </div>
            
            </div>
          </div>

          <div className="mt-20">
            <div className="font-bold text-2xl">최근 거래글</div>
            
            <div className="mt-7 basic_shadow1 basic_shadow2 rounded-lg w-full p-5">
              <div className="text-xl underline underline-offset-8">실시간 최저가 물품이에요!</div>
                <div className="mt-5 flex flex-col items-center">              
                  {
                      boardInfo?.boardList.map(item => {
                        return (
                          <div key={item.transaction_board_id} className="mt-4 w-full flex items-center">
                            <div className="border-2 px-7 py-2 text-lg rounded-md text-bold recent_color">
                              {
                                item.transaction_board_item_type === 0 ? "게임머니" :
                                item.transaction_board_item_type === 1 ? "아이템" :
                                item.transaction_board_item_type === 2 ? "계정" :
                                item.transaction_board_item_type === 3 ? "기타" : "타입오류"
                              }
                            </div>
                            <div className="pl-10 flex-1">{item.transaction_board_title}</div>
                            <div className="flex flex-col items-end">
                              <div className="text-sm">{`${item.game_id.game_name} > ${item.game_server_id.game_server_name}`}</div>
                              <div className="mt-1 text-indigo-400 text-bold">거래가격 {item.transaction_board_item_price} HEP</div>
                            </div>
                          </div>
                        )
                      })
                    }
                </div>
            </div>

        </div>
      </div>
      </div>
    </>
  );
}
