"use client"

import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import { CgMenuRound } from "react-icons/cg";

import Link from "next/link";


export default function Search() {
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
            <div className="ml-2 text-2xl">아이템 오아시스</div>
  
            <div className="ml-5 h-10 py-5 border-2 rounded-xl border-indigo-400 flex items-center flex-1">
              <div className="flex-1"></div>
              <IoIosSearch className="text-indigo-400 mr-3" size={23} />
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
            <Link href="/item/board" className="text-lg text-bold text-indigo-600 flex items-center">
                <CgMenuRound size={30}/>
                <div className="ml-2">
                    추천 게임
                </div>
            </Link>
            <Link href="/item/board" className="ml-10 text-lg text-bold">
              자유 게시판
            </Link>
            <Link href="/item/board" className="ml-10 text-lg text-bold">
              마이 페이지
            </Link>
          </div>
        </div>
      </>
    );
  }