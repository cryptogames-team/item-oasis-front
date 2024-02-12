"use client";
import {h_postJson} from "@/js/fetch"
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { h_get_by_token } from "@/js/fetch_by_token";
import { useSelector, useDispatch } from "react-redux";
import {RootState} from '@/redux/reducer';
import { jwtDecode } from "jwt-decode";

export default function Header() {

  const dispatch = useDispatch();
  const loginState : any = useSelector((state : RootState) => state.loginReducer);
  const is_current_login = loginState.is_current_login;
  

  const [isLogin, setIsLogin] = useState(false);


  const ref_wallet_login_start = useRef<HTMLButtonElement>(null); // 지갑 로그인 팝업창을 띄어줄 버튼. click이 되면 지갑에서 주입한 리스너의 콜백이 발생한다.
  const ref_wallet_login_complete = useRef<HTMLButtonElement>(null);  // 지갑의 동작이 끝난 뒤에 click 이벤트가 발생할 버튼
  const ref_user_name = useRef<HTMLInputElement>(null);
  const ref_user_key = useRef<HTMLInputElement>(null);

  const handleLogin = () => {
    console.log("handleLogin 호출");
    if(ref_wallet_login_start.current !== null && ref_wallet_login_complete.current !== null ) {
      ref_wallet_login_complete.current.addEventListener("click", handleLoginComplete);
      ref_wallet_login_start.current.click();    
    }
  }

  const handleLogout = () => {
    console.log("handleLogout 호출");
    localStorage.setItem("access_token", "");
    const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/user`;
    h_get_by_token(url)
    .then(res => {
      setIsLogin(true);
    }
    )
    .catch(err => {
      setIsLogin(false);
    })
  }

  const handleLoginComplete = () => {
    console.log("handleLoginComplete 호출");
    if (ref_user_name.current && ref_user_key.current) {
      const nameValue = ref_user_name.current.value; // 계정 이름
      const keyValue = ref_user_key.current.value; // 공개 키

      const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/user`;
      h_postJson(url, {user_name : nameValue})
      .then(res => {
          localStorage.setItem("access_token", res.accessToken);
          localStorage.setItem("refresh_token", res.refreshToken);
          localStorage.setItem("user_name", res.user.user_name);
          localStorage.setItem("user_id", res.user.user_id);
          console.log("로그인 데이터", res.accessToken);
          setIsLogin(true);
        }
      );
    }
  }

  // useEffect(() => {

  //   // 1. 로컬 스토리지에 있는 access_token을 가져와서 해당 access_token이 유효한지 확인한다.
  //   // 2. 유효하지 않다면 refresh_token을 통해 access_token을 발급해준다. 만약 refresh_token도 유효하지 않다면 로그아웃 상태로 유지해준다.

  //   // access_token 또는 refresh_token 이 없다면 당연히 로그아웃 상태
  //   const access_token = localStorage.getItem("access_token");
  //   const refresh_token = localStorage.getItem("refresh_token");
  //   if(!access_token || !refresh_token){
  //     return;       
  //   }

  //   // access_token이 유효한지 확인. 
  //   // 유효하면 로그인 처리, 유효하지 않다면 refresh_token을 통해 재발급
  //   // if(){

  //   // }

  //   const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/user/refreshToken`;
  //   h_postJson(url, {refToken : refresh_token})
  //     .then((res : any) => {
  //         localStorage.setItem("access_token", res.accessToken);
  //         const decodedToken : any = jwtDecode(res.accessToken);
  //         const user_name : string = decodedToken.user_name;
  //         console.log(`decodedToken, user_name : `, decodedToken, user_name);

  //         const url = `${process.env.NEXT_PUBLIC_BASE_URL_1}/user`;
  //         h_postJson(url, {user_name : user_name})
  //         .then(res => {
  //             // localStorage.setItem("access_token", res.accessToken);
  //             // localStorage.setItem("user_name", res.user.user_name);
  //             // localStorage.setItem("user_id", res.user.user_id);
  //             console.log("로그인 데이터", res.accessToken);
  //           }
  //         )
  //       }
  //     );



  //   // refresh token이 유효하지 않다면 로그인 처리 x


  //   //
     
  // }, []);

  // useEffect(() => {

  //   // 로그인 처리
  //   console.log(`! is_current_login을 통한 로그인 처리`, is_current_login);
  //   if(is_current_login) {
  //     setIsLogin(true);
  //   } else {
  //     setIsLogin(false);
  //   }
  
  // }, [is_current_login]);



  return (
    <>
      <button id="login" className="hidden" ref={ref_wallet_login_start}></button>
      <button id="login_complete" className="hidden" ref={ref_wallet_login_complete}></button>
      <input type="hidden" id="UserName" value="undefined" ref={ref_user_name}></input>
      <input type="hidden" id="UserKey" value="undefined" ref={ref_user_key}></input>

      <div className="w-full bg-slate-100 flex flex-col items-center">
        <div className="h-container flex flex-col">
          <div className="w-full flex justify-between py-2 text-sm">
            <Link href="/" className="flex">
              {/* <Image
                src="/아이템오아시스로고.png"
                width={40}
                height={40}
                alt="로고"
              ></Image> */}
              <button className="ml-3 justify-self-start text-xl">
                아이템 오아시스
              </button>
            </Link>
            <div className="flex">
              {
                isLogin ? 
                <>
                  <button onClick={handleLogout}>로그아웃</button>
                </> 
                : 
                <>
                  <button onClick={handleLogin}>로그인</button>
                </>
              }
              
              <button className="ml-2">고객센터</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
}