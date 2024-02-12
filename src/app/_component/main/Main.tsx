"use client";
import Image from "next/image";


const TradeType = {
  Trading: 1,
  trade_complete: 2,
};

export default function Main() {
 


  return (
    <>
      <div className="w-full">
        <div className="h-container flex flex-col">
          <div className="flex">
            <div className="w-4/6 pr-4">
              <img src="/직거래방지.jpg" className=" rounded-lg">
              </img>
            </div>

            <div className="w-2/6 flex flex-col">
              <div className="flex flex-col items-center shadow p-4 rounded-md">
                <div className="text-xl font-bold">블록체인 기반 아이템 안전거래 플랫폼</div>
                <div className="mt-2 text-xl font-bold">아이템 오아시스</div>
                <button className="mt-10 bg-indigo-400 text-white p-4 rounded-lg font-bold">아이템 오아시스 로그인</button>
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
            <div>
              
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
